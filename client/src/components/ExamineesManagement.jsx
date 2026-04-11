import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiUser,
  FiFilter,
  FiMoreHorizontal,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiDownload,
  FiX,
  FiCheckSquare,
  FiSquare,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiFileText,
  FiSettings,
  FiAlertTriangle,
  FiFile,
  FiEdit,
  FiEye,
  FiMail,
  FiPrinter
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '../store/slices/patientSlice';
import Sidebar from './Sidebar';
import InvoiceScreen from './InvoiceScreen';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const ExamineesManagement = ({ onViewPatient, onEditPatient, onDeletePatient, onCreateNewPatient, activeItem = 'patients', setActiveItem }) => {
  const dispatch = useDispatch();
  const { patients, isLoading, error } = useSelector((state) => state.patients);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('examinee');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearchData, setAdvancedSearchData] = useState({
    firstName: '', firstNameOp: 'startsWith',
    middleName: '', middleNameOp: 'startsWith',
    lastName: '', lastNameOp: 'startsWith',
    email: '', emailOp: 'startsWith',
    examineeId: '', examineeIdOp: 'startsWith',
    gender: '',
    birthDate: '', birthDateOp: 'isEqualTo',
    systemId: '', systemIdOp: 'startsWith',
    assessmentId: '',
    form: '', formOp: 'isEqualTo',
    adminDate: '', adminDateOp: 'isEqualTo',
    examinerFirst: '', examinerFirstOp: 'startsWith'
  });
  const [filters, setFilters] = useState({
    status: 'all',
    center: 'all',
    gender: 'all'
  });
  const [showAssignAssessment, setShowAssignAssessment] = useState(false);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [assessmentTab, setAssessmentTab] = useState('all');
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [alphaFilter, setAlphaFilter] = useState('all');
  const [showAssessmentAdmin, setShowAssessmentAdmin] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('manual');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showMoreActionsMenu, setShowMoreActionsMenu] = useState(false);
  const [assessmentItemResponses, setAssessmentItemResponses] = useState({});
  const [isSavingAssessment, setIsSavingAssessment] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [showInvoiceConfirm, setShowInvoiceConfirm] = useState(false);
  const [showInvoiceScreen, setShowInvoiceScreen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null); // Store created package
  const [includeSubAccounts, setIncludeSubAccounts] = useState(false);
  const ASSESSMENT_PRICE = 5500;

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDownloadMenu || showMoreActionsMenu) {
        const downloadButton = event.target.closest('[data-download-button]');
        const moreActionsButton = event.target.closest('[data-more-actions-button]');
        
        if (!downloadButton && !moreActionsButton) {
          setShowDownloadMenu(false);
          setShowMoreActionsMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDownloadMenu, showMoreActionsMenu]);

  // Transform patient data
  const transformedPatients = patients.map(patient => ({
    id: patient.id,
    systemId: `SYS${patient.id.toString().padStart(6, '0')}`,
    firstName: patient.first_name || '',
    lastName: patient.last_name || '',
    examineeId: patient.student_id || `STU${patient.id}`,
    birthDate: patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : '-',
    gender: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : '-',
    center: patient.centre_name || 'Centrix Centre',
    status: patient.status === 'active' ? 'Active' : 'Inactive'
  }));

  // Filter and sort
  const filteredPatients = transformedPatients.filter(patient => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.examineeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.systemId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || patient.status === filters.status;
    const matchesCenter = filters.center === 'all' || patient.center === filters.center;
    const matchesGender = filters.gender === 'all' || patient.gender === filters.gender;
    
    return matchesSearch && matchesStatus && matchesCenter && matchesGender;
  }).sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedItems.length === paginatedPatients.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedPatients.map(p => p.id));
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <FiChevronDown className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FiArrowUp className="w-4 h-4 text-blue-600" />
      : <FiArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const tabs = [
    { id: 'examinee', label: 'Examinee', icon: FiUser },
    { id: 'group', label: 'Group Administration', icon: FiUsers },
    { id: 'report', label: 'Report', icon: FiFileText }
  ];

  // Assessment data
  const assessments = [
    { id: '16pf', name: '16PF', category: 'Personality' },
    { id: 'bai', name: 'BAI', category: 'Anxiety' },
    { id: 'basc3-bess-college', name: 'BASC-3 BESS College', category: 'Behavior' },
    { id: 'basc3-bess-parent-child', name: 'BASC-3 BESS Parent Child/Adolescent', category: 'Behavior' },
    { id: 'basc3-bess-preschool', name: 'BASC-3 BESS Parent Preschool', category: 'Behavior' },
    { id: 'basc3-bess-student', name: 'BASC-3 BESS Student', category: 'Behavior' },
    { id: 'basc3-bess-teacher-child', name: 'BASC-3 BESS Teacher Child/Adolescent', category: 'Behavior' },
    { id: 'basc3-bess-teacher-preschool', name: 'BASC-3 BESS Teacher Preschool', category: 'Behavior' },
    { id: 'basc3-flex-parent', name: 'BASC-3 Flex Monitor - Parent', category: 'Behavior' },
    { id: 'basc3-flex-self', name: 'BASC-3 Flex Monitor - Self', category: 'Behavior' },
    { id: 'basc3-flex-teacher', name: 'BASC-3 Flex Monitor - Teacher', category: 'Behavior' },
    { id: 'basc3-prq-child', name: 'BASC-3 PRQ-Child/Adolescent', category: 'Behavior' },
    { id: 'basc3-prq-preschool', name: 'BASC-3 PRQ-Preschool', category: 'Behavior' },
    { id: 'basc3-prs-adolescent', name: 'BASC-3 PRS-Adolescent', category: 'Behavior' },
    { id: 'basc3-prs-child', name: 'BASC-3 PRS-Child', category: 'Behavior' },
    { id: 'basc3-prs-preschool', name: 'BASC-3 PRS-Preschool', category: 'Behavior' },
    { id: 'basc3-sdh', name: 'BASC-3 SDH', category: 'Behavior' },
    { id: 'basc3-sos', name: 'BASC-3 SOS', category: 'Behavior' },
    { id: 'basc3-srp-adolescent', name: 'BASC-3 SRP-Adolescent', category: 'Behavior' },
    { id: 'basc3-srp-child', name: 'BASC-3 SRP-Child', category: 'Behavior' },
    { id: 'basc3-srp-college', name: 'BASC-3 SRP-College', category: 'Behavior' },
    { id: 'basc3-srp-interview', name: 'BASC-3 SRP-Interview', category: 'Behavior' },
    { id: 'basc3-trs-adolescent', name: 'BASC-3 TRS-Adolescent', category: 'Behavior' },
    { id: 'basc3-trs-child', name: 'BASC-3 TRS-Child', category: 'Behavior' },
    { id: 'basc3-trs-preschool', name: 'BASC-3 TRS-Preschool', category: 'Behavior' },
    { id: 'bayley4-cognitive', name: 'Bayley-4 Cognitive, Language, and Motor', category: 'Development' },
    { id: 'bayley4-social', name: 'Bayley-4 Social-Emotional and Adaptive Behavior', category: 'Development' },
    { id: 'bdi-ii', name: 'BDI-II', category: 'Depression' },
    { id: 'bhi2', name: 'BHI 2', category: 'Health' },
    { id: 'bhs', name: 'BHS', category: 'Hopelessness' },
    { id: 'bmat-comprehensive', name: 'BMAT Comprehensive Form', category: 'Memory' },
    { id: 'bmat-short', name: 'BMAT Short Form', category: 'Memory' },
    { id: 'bot2-complete', name: 'BOT-2 Complete Form', category: 'Motor' },
    { id: 'bot2-short', name: 'BOT-2 Short Form', category: 'Motor' },
    { id: 'bot3', name: 'BOT-3', category: 'Motor' },
    { id: 'brown-efa-parent-adolescent', name: 'Brown EF/A Scales - Parent Form - Adolescent (Ages 13-18)', category: 'Executive Function' },
    { id: 'brown-efa-parent-child', name: 'Brown EF/A Scales - Parent Form - Child (Ages 8-12)', category: 'Executive Function' },
    { id: 'brown-efa-parent-early', name: 'Brown EF/A Scales - Parent Form - Early Childhood (Ages 3-7)', category: 'Executive Function' },
    { id: 'brown-efa-self-adolescent', name: 'Brown EF/A Scales - Self-Report Form - Adolescent (Ages 13-18)', category: 'Executive Function' },
    { id: 'brown-efa-self-adult', name: 'Brown EF/A Scales - Self-Report Form - Adult (Ages 19+)', category: 'Executive Function' },
    { id: 'brown-efa-self-child', name: 'Brown EF/A Scales - Self-Report Form - Child (Ages 8-12)', category: 'Executive Function' },
    { id: 'brown-efa-teacher-child', name: 'Brown EF/A Scales - Teacher Form - Child (Ages 8-12)', category: 'Executive Function' },
    { id: 'brown-efa-teacher-early', name: 'Brown EF/A Scales - Teacher Form - Early Childhood (Ages 3-7)', category: 'Executive Function' },
    { id: 'bsi', name: 'BSI', category: 'Symptoms' },
    { id: 'bsi18', name: 'BSI 18', category: 'Symptoms' },
    { id: 'bsra4', name: 'BSRA-4', category: 'School Readiness' },
    { id: 'bss', name: 'BSS', category: 'Suicide' },
    { id: 'byi2', name: 'BYI-2', category: 'Youth' },
    { id: 'byi2-in', name: 'BYI-2 IN', category: 'Youth' },
    { id: 'cainv-enhanced', name: 'CAInv-Enhanced', category: 'Career' },
    { id: 'cainv-vocational', name: 'CAInv-Vocational', category: 'Career' },
    { id: 'celf5', name: 'CELF-5', category: 'Language' },
    { id: 'celf-preschool3', name: 'CELF Preschool-3', category: 'Language' },
    { id: 'ciss', name: 'CISS', category: 'Coping' },
    { id: 'conners4-adhd-parent', name: 'Conners 4–ADHD Index Parent', category: 'ADHD' },
    { id: 'conners4-adhd-self', name: 'Conners 4–ADHD Index Self-Report', category: 'ADHD' },
    { id: 'conners4-adhd-teacher', name: 'Conners 4–ADHD Index Teacher', category: 'ADHD' },
    { id: 'conners4-parent', name: 'Conners 4 Parent', category: 'ADHD' },
    { id: 'conners4-self', name: 'Conners 4 Self-Report', category: 'ADHD' },
    { id: 'conners4-short-self', name: 'Conners 4–Short Self-Report', category: 'ADHD' },
    { id: 'conners4-teacher', name: 'Conners 4 Teacher', category: 'ADHD' },
    { id: 'cvlt3-alternate', name: 'CVLT 3 Alternate Form', category: 'Memory' },
    { id: 'cvlt3-brief', name: 'CVLT 3 Brief Form', category: 'Memory' },
    { id: 'cvlt3-standard', name: 'CVLT 3 Standard Form', category: 'Memory' },
    { id: 'dial4', name: 'DIAL-4', category: 'Development' },
    { id: 'd-ref-adult-collateral', name: 'D-REF Adult Collateral Rating Form', category: 'ADHD' },
    { id: 'd-ref-adult-self', name: 'D-REF Adult Self Rating Form', category: 'ADHD' },
    { id: 'd-ref-parent', name: 'D-REF Parent Form', category: 'ADHD' },
    { id: 'd-ref-self', name: 'D-REF Self Form', category: 'ADHD' },
    { id: 'd-ref-teacher', name: 'D-REF Teacher Form', category: 'ADHD' },
    { id: 'ems-observer', name: 'EMS Observer Form', category: 'Medication' },
    { id: 'ems-self', name: 'EMS Self-Report Form', category: 'Medication' },
    { id: 'esi3-kindergarten', name: 'ESI-3 Kindergarten', category: 'Development' },
    { id: 'esi3-parent', name: 'ESI-3 Parent Questionnaire', category: 'Development' },
    { id: 'esi3-preschool', name: 'ESI-3 Preschool', category: 'Development' },
    { id: 'evt2-a', name: 'EVT-2 Form A', category: 'Vocabulary' },
    { id: 'evt2-b', name: 'EVT-2 Form B', category: 'Vocabulary' },
    { id: 'evt3-a', name: 'EVT-3 Form A', category: 'Vocabulary' },
    { id: 'evt3-b', name: 'EVT-3 Form B', category: 'Vocabulary' },
    { id: 'gama', name: 'GAMA', category: 'Abilities' },
    { id: 'gfta3', name: 'GFTA-3', category: 'Articulation' },
    { id: 'grs-preschool', name: 'GRS-Preschool/Kindergarten', category: 'Gifted' },
    { id: 'grs-school', name: 'GRS-School', category: 'Gifted' },
    { id: 'kabc2', name: 'KABC-II & KABC-II NU', category: 'Cognitive' },
    { id: 'kbit2', name: 'KBIT-2 Revised', category: 'Abilities' },
    { id: 'ktea3-a', name: 'KTEA-3 Form A', category: 'Academic' },
    { id: 'ktea3-b', name: 'KTEA-3 Form B', category: 'Academic' },
    { id: 'maci', name: 'MACI', category: 'Personality' },
    { id: 'maci2', name: 'MACI-II', category: 'Personality' },
    { id: 'mapi', name: 'MAPI', category: 'Personality' },
    { id: 'mbmd', name: 'MBMD', category: 'Health' },
    { id: 'mcci', name: 'MCCI', category: 'Personality' },
    { id: 'mcmi3', name: 'MCMI-III', category: 'Personality' },
    { id: 'mcmi4', name: 'MCMI-IV', category: 'Personality' },
    { id: 'mips', name: 'MIPS Revised', category: 'Personality' },
    { id: 'mmpi2', name: 'MMPI-2', category: 'Personality' },
    { id: 'mmpi2-rf', name: 'MMPI-2-RF', category: 'Personality' },
    { id: 'mmpi3', name: 'MMPI-3 English', category: 'Personality' },
    { id: 'mmpi-a', name: 'MMPI-A', category: 'Personality' },
    { id: 'mmpi-a-rf', name: 'MMPI-A-RF', category: 'Personality' },
    { id: 'm-paci', name: 'M-PACI', category: 'Personality' },
    { id: 'mpq', name: 'MPQ', category: 'Personality' },
    { id: 'p-3', name: 'P-3', category: 'Personality' },
    { id: 'pedi-cat', name: 'PEDI-CAT', category: 'Functional' },
    { id: 'ppvt4-a', name: 'PPVT-4 Form A', category: 'Vocabulary' },
    { id: 'ppvt4-b', name: 'PPVT-4 Form B', category: 'Vocabulary' },
    { id: 'ppvt5-a', name: 'PPVT-5 Form A', category: 'Vocabulary' },
    { id: 'ppvt5-b', name: 'PPVT-5 Form B', category: 'Vocabulary' },
    { id: 'qoli', name: 'QOLI', category: 'Quality of Life' },
    { id: 'ravens2-long', name: 'Raven\'s 2 Digital Long Form', category: 'Abilities' },
    { id: 'ravens2-short', name: 'Raven\'s 2 Digital Short Form', category: 'Abilities' },
    { id: 'ravens2-paper', name: 'Raven\'s 2 Paper Form', category: 'Abilities' },
    { id: 'scl90r', name: 'SCL-90-R', category: 'Symptoms' },
    { id: 'sensory-child', name: 'Sensory Profile 2 Child', category: 'Sensory' },
    { id: 'sensory-infant', name: 'Sensory Profile 2 Infant', category: 'Sensory' },
    { id: 'sensory-school', name: 'Sensory Profile 2 School Companion', category: 'Sensory' },
    { id: 'sensory-short', name: 'Sensory Profile 2 Short', category: 'Sensory' },
    { id: 'sensory-toddler', name: 'Sensory Profile 2 Toddler', category: 'Sensory' },
    { id: 'sensory-adult', name: 'Sensory Profile Adolescent/Adult', category: 'Sensory' },
    { id: 'shaywitz-adolescent', name: 'Shaywitz DyslexiaScreen Adolescent-Adult Form', category: 'Dyslexia' },
    { id: 'shaywitz-form0', name: 'Shaywitz DyslexiaScreen Form 0', category: 'Dyslexia' },
    { id: 'shaywitz-form1', name: 'Shaywitz DyslexiaScreen Form 1', category: 'Dyslexia' },
    { id: 'shaywitz-form2', name: 'Shaywitz DyslexiaScreen Form 2', category: 'Dyslexia' },
    { id: 'shaywitz-form3', name: 'Shaywitz DyslexiaScreen Form 3', category: 'Dyslexia' },
    { id: 'shaywitz-india0', name: 'Shaywitz DyslexiaScreen-India Form 0', category: 'Dyslexia' },
    { id: 'shaywitz-india1', name: 'Shaywitz DyslexiaScreen-India Form 1', category: 'Dyslexia' },
    { id: 'speed-dial4', name: 'Speed DIAL-4', category: 'Development' },
    { id: 'ssis-parent', name: 'SSIS SEL Edition Parent', category: 'Social Skills' },
    { id: 'ssis-screening', name: 'SSIS SEL Edition Screening/Progress Monitoring Scales', category: 'Social Skills' },
    { id: 'ssis-student', name: 'SSIS SEL Edition Student', category: 'Social Skills' },
    { id: 'ssis-teacher', name: 'SSIS SEL Edition Teacher', category: 'Social Skills' },
    { id: 'vineland3-comp-interview', name: 'Vineland-3 Comprehensive Interview Form', category: 'Adaptive' },
    { id: 'vineland3-comp-parent', name: 'Vineland-3 Comprehensive Parent/Caregiver Form', category: 'Adaptive' },
    { id: 'vineland3-comp-teacher', name: 'Vineland-3 Comprehensive Teacher Form', category: 'Adaptive' },
    { id: 'vineland3-domain-interview', name: 'Vineland-3 Domain-Level Interview Form', category: 'Adaptive' },
    { id: 'vineland3-domain-parent', name: 'Vineland-3 Domain-Level Parent/Caregiver Form', category: 'Adaptive' },
    { id: 'vineland3-domain-teacher', name: 'Vineland-3 Domain-Level Teacher Form', category: 'Adaptive' },
    { id: 'wais5', name: 'WAIS-5', category: 'Intelligence' },
    { id: 'wais4', name: 'WAIS-IV', category: 'Intelligence' },
    { id: 'wiat4', name: 'WIAT-4', category: 'Academic' },
    { id: 'wiat3', name: 'WIAT-III', category: 'Academic' },
    { id: 'wisc5', name: 'WISC-V', category: 'Intelligence' },
    { id: 'wisc5-uk', name: 'WISC-V UK', category: 'Intelligence' },
    { id: 'wisc5-uk-qi', name: 'WISC-V UK Q-interactive Assessments ONLY', category: 'Intelligence' },
    { id: 'wms4', name: 'WMS-IV', category: 'Memory' },
    { id: 'wppsi4', name: 'WPPSI-IV', category: 'Intelligence' },
    { id: 'wraml3-brief', name: 'WRAML3 Brief Form', category: 'Memory' },
    { id: 'wraml3-standard', name: 'WRAML3 Standard Form', category: 'Memory' },
    { id: 'wrat5-blue', name: 'WRAT5 Blue Form', category: 'Academic' },
    { id: 'wrat5-green', name: 'WRAT5 Green Form', category: 'Academic' },
    { id: 'wrat5-india-blue', name: 'WRAT5-India Blue Form', category: 'Academic' },
    { id: 'wrmt3-a', name: 'WRMT-III Form A', category: 'Reading' },
    { id: 'wrmt3-b', name: 'WRMT-III Form B', category: 'Reading' }
  ];

  // Filter assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(assessmentSearch.toLowerCase());
    const firstLetter = assessment.name.charAt(0).toUpperCase();
    const matchesAlpha = alphaFilter === 'all' || 
      (alphaFilter === 'a-b' && firstLetter >= 'A' && firstLetter <= 'B') ||
      (alphaFilter === 'c-f' && firstLetter >= 'C' && firstLetter <= 'F') ||
      (alphaFilter === 'g-k' && firstLetter >= 'G' && firstLetter <= 'K') ||
      (alphaFilter === 'l-m' && firstLetter >= 'L' && firstLetter <= 'M') ||
      (alphaFilter === 'n-q' && firstLetter >= 'N' && firstLetter <= 'Q') ||
      (alphaFilter === 'r-v' && firstLetter >= 'R' && firstLetter <= 'V') ||
      (alphaFilter === 'w-z' && firstLetter >= 'W' && firstLetter <= 'Z');
    return matchesSearch && matchesAlpha;
  });

  // Toggle assessment selection
  const toggleAssessmentSelection = (id) => {
    setSelectedAssessments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Calculate total price
  const totalPrice = selectedAssessments.length * ASSESSMENT_PRICE;

  // Create package
  const createPackage = () => {
    const packageData = {
      name: packageName || `Package ${new Date().toLocaleDateString()}`,
      assessments: selectedAssessments.map(id => assessments.find(a => a.id === id)),
      totalPrice: totalPrice,
      createdAt: new Date().toISOString()
    };
    console.log('Package created:', packageData);
    setCurrentPackage(packageData); // Save to state
    setShowAssignAssessment(false); // Close modal
    setShowAssessmentAdmin(true); // Open assessment admin
    return packageData;
  };

  // Export functions
  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
  };

  const exportToExcel = async (selectedPatients = null) => {
    try {
      console.log('🔄 Excel Export started...');
      const studentIds = selectedPatients ? selectedPatients.map(p => p.id) : null;
      const apiUrl = getApiUrl();
      console.log('📤 API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/students/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: 'excel',
          studentIds: studentIds
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const ws = XLSX.utils.json_to_sheet(result.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Examinees');
        XLSX.writeFile(wb, `${result.filename}.xlsx`);
      } else {
        alert('Failed to export data: ' + result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const exportToWord = async (selectedPatients = null) => {
    try {
      console.log('🔄 Word Export started...');
      const studentIds = selectedPatients ? selectedPatients.map(p => p.id) : null;
      const apiUrl = getApiUrl();
      console.log('📤 API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/students/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: 'word',
          studentIds: studentIds
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const tableRows = result.data.map(patient => 
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(patient['System ID'])] }),
              new TableCell({ children: [new Paragraph(patient['First Name'])] }),
              new TableCell({ children: [new Paragraph(patient['Last Name'])] }),
              new TableCell({ children: [new Paragraph(patient['Examinee ID'])] }),
              new TableCell({ children: [new Paragraph(patient['Birth Date'])] }),
              new TableCell({ children: [new Paragraph(patient['Gender'])] }),
              new TableCell({ children: [new Paragraph(patient['Center'])] }),
              new TableCell({ children: [new Paragraph(patient['Status'])] })
            ]
          })
        );

        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                text: "Examinees Report",
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 400 }
              }),
              new Paragraph({
                text: `Generated on: ${new Date().toLocaleDateString()}`,
                spacing: { after: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: "System ID", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "First Name", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Last Name", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Examinee ID", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Birth Date", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Gender", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Center", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Status", bold: true })] })
                    ]
                  }),
                  ...tableRows
                ]
              })
            ]
          }]
        });

        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.filename}.docx`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert('Failed to export data: ' + result.message);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const exportToPDF = async (selectedPatients = null) => {
    try {
      console.log('🔄 PDF Export started...');
      const studentIds = selectedPatients ? selectedPatients.map(p => p.id) : null;
      const apiUrl = getApiUrl();
      console.log('📤 API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/students/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: 'pdf',
          studentIds: studentIds
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📥 Backend response:', result);
      
      if (result.success && result.data && result.data.length > 0) {
        console.log(`✅ Generating PDF with ${result.data.length} records...`);
        
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape mode for better table fit
        
        // Add title
        pdf.setFontSize(16);
        pdf.text('Examinees Report', 14, 15);
        
        // Add date
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
        pdf.text(`Total Records: ${result.data.length}`, 14, 27);
        
        // Prepare table data
        const headers = [['System ID', 'First Name', 'Last Name', 'Examinee ID', 'Birth Date', 'Gender', 'Status']];
        const data = result.data.map(patient => [
          patient['System ID'] || '',
          patient['First Name'] || '',
          patient['Last Name'] || '',
          patient['Examinee ID'] || '',
          patient['Birth Date'] || '',
          patient['Gender'] || '',
          patient['Status'] || ''
        ]);
        
        console.log('📊 Table data prepared:', { headers, dataCount: data.length });
        
        // Use autoTable plugin for better table formatting
        pdf.autoTable({
          head: headers,
          body: data,
          startY: 35,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          styles: { fontSize: 8, cellPadding: 2 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 35 }
        });
        
        // Save the PDF
        const filename = result.filename || `examinees_${new Date().toISOString().split('T')[0]}`;
        console.log('💾 Saving PDF as:', filename);
        pdf.save(`${filename}.pdf`);
        
        console.log('✅ PDF Export completed successfully!');
      } else {
        console.error('❌ No data received from backend');
        alert('No data available to export. Please try again.');
      }
    } catch (error) {
      console.error('❌ PDF Export error:', error);
      alert('Failed to export PDF: ' + error.message);
    }
  };

  const getSelectedPatientsData = () => {
    return transformedPatients.filter(patient => selectedItems.includes(patient.id));
  };

  const handleDownload = async (format) => {
    console.log('🔘 Download clicked:', format);
    console.log('📋 Selected items:', selectedItems);
    
    const selectedData = selectedItems.length > 0 ? getSelectedPatientsData() : null;
    console.log('📊 Data to export:', selectedData);
    
    try {
      switch (format) {
        case 'excel':
          await exportToExcel(selectedData);
          break;
        case 'word':
          await exportToWord(selectedData);
          break;
        case 'pdf':
          await exportToPDF(selectedData);
          break;
      }
    } catch (error) {
      console.error('❌ Download failed:', error);
      alert('Download failed: ' + error.message);
    }
    setShowDownloadMenu(false);
  };

  const handleMoreAction = (action) => {
    console.log('🔘 More Action triggered:', action);
    
    switch (action) {
      case 'print':
        console.log('🖨️ Print action selected');
        handlePrint();
        break;
      case 'email':
        alert('Email functionality to be implemented');
        break;
      case 'viewDetails':
        if (selectedItems.length === 1) {
          onViewPatient && onViewPatient(selectedItems[0]);
        } else {
          alert('Please select exactly one examinee to view details');
        }
        break;
      case 'edit':
        if (selectedItems.length === 1) {
          onEditPatient && onEditPatient(selectedItems[0]);
        } else {
          alert('Please select exactly one examinee to edit');
        }
        break;
      case 'exportAll':
        exportToExcel(transformedPatients);
        break;
    }
    setShowMoreActionsMenu(false);
  };

  // Handle print functionality
  const handlePrint = () => {
    console.log('🖨️ Starting print process...');
    
    // Get the data to print
    const dataToPrint = selectedItems.length > 0 
      ? transformedPatients.filter(p => selectedItems.includes(p.id))
      : paginatedPatients;
    
    console.log('📊 Data to print:', dataToPrint.length, 'records');
    
    if (dataToPrint.length === 0) {
      alert('No data available to print');
      return;
    }
    
    // Create print window content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Examinees Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; margin-bottom: 10px; }
          .meta { color: #666; margin-bottom: 20px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #3182ce; color: white; padding: 10px; text-align: left; font-size: 12px; }
          td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 11px; }
          tr:nth-child(even) { background-color: #f5f5f5; }
          .footer { margin-top: 30px; font-size: 10px; color: #999; }
        </style>
      </head>
      <body>
        <h1>Examinees Report</h1>
        <div class="meta">
          Generated on: ${new Date().toLocaleDateString()}<br>
          Total Records: ${dataToPrint.length}
        </div>
        <table>
          <thead>
            <tr>
              <th>System ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Examinee ID</th>
              <th>Birth Date</th>
              <th>Gender</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${dataToPrint.map(p => `
              <tr>
                <td>${p.systemId}</td>
                <td>${p.firstName}</td>
                <td>${p.lastName}</td>
                <td>${p.examineeId}</td>
                <td>${p.birthDate}</td>
                <td>${p.gender}</td>
                <td>${p.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          Centrix Centre - Examinees Management System
        </div>
      </body>
      </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        console.log('✅ Print dialog opened');
      }, 500);
    } else {
      console.error('❌ Failed to open print window - popup might be blocked');
      alert('Please allow popups to print');
    }
  };

  // Handle item response change
  const handleItemResponseChange = (itemNum, value) => {
    setAssessmentItemResponses(prev => ({
      ...prev,
      [itemNum]: value
    }));
  };

  // Save assessment results to backend
  const handleSaveAssessment = async (closeAfterSave = false) => {
    // Get assessment ID from currentAssessment or from the first assessment in the package
    const assessmentId = currentAssessment?.id || currentPackage?.assessments?.[0]?.id;
    
    if (!assessmentId) {
      alert('No assessment selected. Please select an assessment first.');
      return;
    }

    setIsSavingAssessment(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
      
      // Prepare items data
      const items = Object.entries(assessmentItemResponses).map(([itemNum, response]) => ({
        itemNumber: parseInt(itemNum),
        response: response,
        responseText: null,
        isCorrect: null,
        score: null,
        timeTaken: null
      }));

      // Calculate completion percentage
      const totalItems = 24;
      const completedItems = items.length;
      const completionPercentage = Math.round((completedItems / totalItems) * 100);

      const response = await fetch(`${apiUrl}/assessment-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: parseInt(assessmentId) || 1,
          studentId: parseInt(selectedItems[0]) || 1,
          items: items,
          completionPercentage: completionPercentage,
          totalScore: null,
          maxScore: null
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Assessment saved successfully! ${result.data.totalItems} responses saved.`);
        if (closeAfterSave) {
          setShowAssessmentAdmin(false);
          setAssessmentItemResponses({});
        }
      } else {
        alert('Failed to save assessment: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment. Please try again.');
    } finally {
      setIsSavingAssessment(false);
    }
  };

  // Send invoice email
  const handleSendInvoice = async () => {
    if (!currentAssessment?.id) {
      alert('No assessment selected.');
      return;
    }

    const emailInput = document.querySelector('input[type="email"]');
    const email = emailInput?.value;
    
    if (!email) {
      alert('Please enter an email address for the examinee.');
      return;
    }

    setIsSendingInvoice(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
      
      const response = await fetch(`${apiUrl}/invoices/send-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: currentAssessment.id,
          studentId: selectedItems[0],
          email: email,
          firstName: currentAssessment.firstName || '',
          lastName: currentAssessment.lastName || '',
          assessmentName: currentAssessment.name || 'Educational Assessment',
          assessmentType: currentAssessment.type || 'Standard',
          price: ASSESSMENT_PRICE,
          adminDate: document.querySelector('input[type="date"]')?.value,
          examiner: document.querySelector('select')?.value || 'To be assigned'
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Invoice sent successfully to ' + email);
        setShowInvoiceConfirm(false);
      } else {
        alert('Failed to send invoice: ' + result.message);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice. Please check your email configuration.');
    } finally {
      setIsSendingInvoice(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        sidebarCollapsed={false}
        setSidebarCollapsed={() => {}}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <span className="text-gray-600 font-medium">Centrix Centre</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <FiSettings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.first_name ? user.first_name.substring(0, 2).toUpperCase() : 'AD'}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.first_name && user?.last_name ? `${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}` : 'ADMIN USER'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit overflow-x-auto max-w-full">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        <AnimatePresence mode="wait">
          {activeTab === 'examinee' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Action Bar */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onCreateNewPatient && onCreateNewPatient()}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>New Examinee</span>
                    </button>
                    
                    <button
                      disabled={selectedItems.length === 0}
                      onClick={() => onDeletePatient && onDeletePatient(selectedItems)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedItems.length > 0
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                    <div className="h-6 w-px bg-gray-200 mx-2" />

                    <button 
                      onClick={() => setShowAssignAssessment(true)}
                      disabled={selectedItems.length === 0}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                        selectedItems.length > 0
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Assign Assessment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all text-sm font-medium">
                      <FiUsers className="w-4 h-4" />
                      <span>Create Group</span>
                    </button>

                    <div className="relative">
                      <button 
                        data-more-actions-button
                        onClick={() => setShowMoreActionsMenu(!showMoreActionsMenu)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium"
                      >
                        <FiMoreHorizontal className="w-4 h-4" />
                        <span>More Actions</span>
                        <FiChevronDown className="w-3 h-3" />
                      </button>
                      
                      {showMoreActionsMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleMoreAction('viewDetails')}
                              disabled={selectedItems.length !== 1}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                selectedItems.length === 1
                                  ? 'text-gray-700 hover:bg-gray-100'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FiEye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => handleMoreAction('edit')}
                              disabled={selectedItems.length !== 1}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                selectedItems.length === 1
                                  ? 'text-gray-700 hover:bg-gray-100'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FiEdit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleMoreAction('print')}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <FiPrinter className="w-4 h-4" />
                              <span>Print</span>
                            </button>
                            <button
                              onClick={() => handleMoreAction('email')}
                              disabled={selectedItems.length === 0}
                              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                selectedItems.length > 0
                                  ? 'text-gray-700 hover:bg-gray-100'
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FiMail className="w-4 h-4" />
                              <span>Email</span>
                            </button>
                            <button
                              onClick={() => handleMoreAction('exportAll')}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <FiDownload className="w-4 h-4" />
                              <span>Export All</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showFilters ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FiFilter className="w-4 h-4" />
                      <span>Filters</span>
                    </button>
                    
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                      <FiRefreshCw className="w-4 h-4" />
                    </button>
                    
                    <div className="relative">
                      <button 
                        data-download-button
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                      
                      {showDownloadMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleDownload('excel')}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <FiFile className="w-4 h-4" />
                              <span>Excel</span>
                            </button>
                            <button
                              onClick={() => handleDownload('word')}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <FiFileText className="w-4 h-4" />
                              <span>Word</span>
                            </button>
                            <button
                              onClick={() => handleDownload('pdf')}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <FiFile className="w-4 h-4" />
                              <span>PDF</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Center</label>
                      <select
                        value={filters.center}
                        onChange={(e) => setFilters({ ...filters, center: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">All Centers</option>
                        <option value="Centrix Centre">Centrix Centre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                      <select
                        value={filters.gender}
                        onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => setFilters({ status: 'all', center: 'all', gender: 'all' })}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Search & View Options */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">View:</span>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="appearance-none px-3 py-1.5 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors pr-8 cursor-pointer"
                    >
                      <option value="all">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includeSubAccounts}
                      onChange={(e) => setIncludeSubAccounts(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include Sub-Accounts</span>
                  </label>
                  
                  <button 
                    onClick={() => setSortConfig({ key: 'lastName', direction: 'asc' })}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    <span>Reset Sort Order</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                  <div className="relative w-full sm:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search examinees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {filteredPatients.length} Records
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading examinees...</p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center text-red-500">
                    <p>Error loading examinees</p>
                    <p className="text-sm">{error}</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 w-12">
                              <button
                                onClick={toggleAllSelection}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                {selectedItems.length === paginatedPatients.length && paginatedPatients.length > 0 ? (
                                  <FiCheckSquare className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <FiSquare className="w-5 h-5" />
                                )}
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('systemId')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>System ID</span>
                                <SortIcon columnKey="systemId" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('lastName')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Last Name</span>
                                <SortIcon columnKey="lastName" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('firstName')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>First Name</span>
                                <SortIcon columnKey="firstName" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('examineeId')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Examinee ID</span>
                                <SortIcon columnKey="examineeId" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('birthDate')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Birth Date</span>
                                <SortIcon columnKey="birthDate" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('gender')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Gender</span>
                                <SortIcon columnKey="gender" />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedPatients.map((patient, index) => (
                            <motion.tr
                              key={patient.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.03 }}
                              className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${
                                selectedItems.includes(patient.id) ? 'bg-blue-50/50' : ''
                              }`}
                              onClick={() => onViewPatient && onViewPatient(patient.id)}
                            >
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => toggleSelection(patient.id)}
                                  className="text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  {selectedItems.includes(patient.id) ? (
                                    <FiCheckSquare className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <FiSquare className="w-5 h-5" />
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                {patient.systemId}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                {patient.lastName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {patient.firstName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                {patient.examineeId}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {patient.birthDate}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  patient.gender === 'Male'
                                    ? 'bg-blue-50 text-blue-700'
                                    : patient.gender === 'Female'
                                    ? 'bg-pink-50 text-pink-700'
                                    : 'bg-gray-50 text-gray-600'
                                }`}>
                                  {patient.gender}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredPatients.length === 0 && (
                      <div className="p-12 text-center">
                        <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No examinees found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Pagination */}
              {filteredPatients.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span className="text-sm text-gray-500">per page</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'group' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Group Administration</h2>
                <p className="text-sm text-gray-600">
                  Below is a list of current groups. Click on a group row to select the group. Access rosters, a list of Examinees in group, and the assessment list from the group's page.
                </p>
              </div>

              {/* Action Bar */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>New Group</span>
                  </button>
                  
                  <button
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete Group</span>
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer ml-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include Sub-Accounts</span>
                  </label>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 w-12 text-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          System ID
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Group Name
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Number of Assessments
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Number of Examinees
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Account Name
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td colSpan="6" className="px-4 py-12 text-center">
                          <div className="flex items-center justify-center gap-2 text-yellow-600 mb-4">
                            <FiAlertTriangle className="w-5 h-5" />
                            <span className="text-sm font-medium">No records were found.</span>
                          </div>
                          <p className="text-gray-400 text-sm">No records to view</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FiChevronLeft className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Page</span>
                    <span className="text-sm font-medium text-gray-700">0</span>
                    <span className="text-sm text-gray-500">of 0</span>
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select className="px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500">
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  No records to view
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Generate Report Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Report</h2>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="reportType" 
                      value="single"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Generate a report for one Examinee.</span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="reportType" 
                      value="multiple"
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      Generate a report type that includes more than one Examinee.<br />
                      <span className="text-gray-500">
                        Reports that include more than one Examinee are processed in a queue for later download. 
                        <a href="#" className="text-blue-600 hover:underline">Download processed reports here</a>.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Examinee Selection */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <p className="text-sm font-medium text-gray-800 mb-4">
                  Select an Examinee with reportable assessment records.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <button
                    onClick={() => setShowAdvancedSearch(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                  >
                    <FiSearch className="w-4 h-4" />
                    <span>Advanced Examinee Search</span>
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includeSubAccounts}
                      onChange={(e) => setIncludeSubAccounts(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include Sub-Accounts</span>
                  </label>

                  <button 
                    onClick={() => setSortConfig({ key: 'lastName', direction: 'asc' })}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium sm:ml-auto"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    <span>Reset Sort Order</span>
                  </button>

                  <span className="text-sm text-gray-500">{filteredPatients.length} Records</span>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700 w-12">
                          #
                        </th>
                        <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                          System ID
                        </th>
                        <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                          Last Name
                        </th>
                        <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                          First Name
                        </th>
                        <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                          Examinee ID
                        </th>
                        <th className="px-3 py-3 border-b border-r text-center font-semibold text-gray-700">
                          Birth Date
                        </th>
                        <th className="px-3 py-3 border-b text-center font-semibold text-gray-700">
                          Gender
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-3 py-8 text-center text-gray-500 text-sm">
                            No records to view
                          </td>
                        </tr>
                      ) : (
                        paginatedPatients.map((patient, index) => (
                          <tr 
                            key={patient.id} 
                            className="hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                          >
                            <td className="px-3 py-3 border-r text-center text-gray-700">
                              {startIndex + index + 1}
                            </td>
                            <td className="px-3 py-3 border-r text-center text-blue-600 font-medium">
                              {patient.systemId}
                            </td>
                            <td className="px-3 py-3 border-r text-center text-gray-700">
                              {patient.lastName}
                            </td>
                            <td className="px-3 py-3 border-r text-center text-gray-700">
                              {patient.firstName}
                            </td>
                            <td className="px-3 py-3 border-r text-center text-gray-700 font-mono">
                              {patient.examineeId}
                            </td>
                            <td className="px-3 py-3 border-r text-center text-gray-700">
                              {patient.birthDate}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                patient.gender === 'Male'
                                  ? 'bg-blue-50 text-blue-700'
                                  : patient.gender === 'Female'
                                  ? 'bg-pink-50 text-pink-700'
                                  : 'bg-gray-50 text-gray-600'
                              }`}>
                                {patient.gender}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiChevronLeft className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Page</span>
                    <span className="font-medium text-gray-700">{currentPage}</span>
                    <span className="text-gray-500">of {totalPages}</span>
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                    <select 
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="ml-4 px-2 py-1 border rounded text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    View {filteredPatients.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Examinee Search Modal */}
        <AnimatePresence>
          {showAdvancedSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
              onClick={() => setShowAdvancedSearch(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="bg-gray-100 border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <h2 className="text-lg font-bold text-gray-800">Search Examinee</h2>
                  <button 
                    onClick={() => setShowAdvancedSearch(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  {/* Demographic Criteria */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Demographic Criteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">First Name:</label>
                        <select 
                          value={advancedSearchData.firstNameOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, firstNameOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-24"
                        >
                          <option value="startsWith">Starts with</option>
                          <option value="contains">Contains</option>
                          <option value="equals">Equals</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.firstName}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, firstName: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Group */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Group:</label>
                        <select className="flex-1 px-3 py-1 border rounded text-sm">
                          <option>--Please Select--</option>
                        </select>
                      </div>

                      {/* Middle Name */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Middle Name:</label>
                        <select 
                          value={advancedSearchData.middleNameOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, middleNameOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-24"
                        >
                          <option value="startsWith">Starts with</option>
                          <option value="contains">Contains</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.middleName}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, middleName: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Custom Field 1 */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Custom Field 1:</label>
                        <select className="px-2 py-1 border rounded text-xs w-24">
                          <option>Starts with</option>
                        </select>
                        <input type="text" className="flex-1 px-3 py-1 border rounded text-sm" />
                      </div>

                      {/* Last Name */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Last Name:</label>
                        <select 
                          value={advancedSearchData.lastNameOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, lastNameOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-24"
                        >
                          <option value="startsWith">Starts with</option>
                          <option value="contains">Contains</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.lastName}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, lastName: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Custom Field 2 */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Custom Field 2:</label>
                        <select className="px-2 py-1 border rounded text-xs w-24">
                          <option>Starts with</option>
                        </select>
                        <input type="text" className="flex-1 px-3 py-1 border rounded text-sm" />
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Email:</label>
                        <select 
                          value={advancedSearchData.emailOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, emailOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-24"
                        >
                          <option value="startsWith">Starts with</option>
                          <option value="contains">Contains</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.email}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, email: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Custom Field 3 */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Custom Field 3:</label>
                        <select className="px-2 py-1 border rounded text-xs w-24">
                          <option>Starts with</option>
                        </select>
                        <input type="text" className="flex-1 px-3 py-1 border rounded text-sm" />
                      </div>

                      {/* Examinee ID */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Examinee ID:</label>
                        <select 
                          value={advancedSearchData.examineeIdOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, examineeIdOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-24"
                        >
                          <option value="startsWith">Starts with</option>
                          <option value="equals">Equals</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.examineeId}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, examineeId: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Custom Field 4 */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Custom Field 4:</label>
                        <select className="px-2 py-1 border rounded text-xs w-24">
                          <option>Starts with</option>
                        </select>
                        <input type="text" className="flex-1 px-3 py-1 border rounded text-sm" />
                      </div>

                      {/* Gender */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Gender:</label>
                        <select 
                          value={advancedSearchData.gender}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, gender: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        >
                          <option value="">--Please Select--</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      {/* Account Name */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Account Name:</label>
                        <select className="px-2 py-1 border rounded text-xs w-24">
                          <option>Starts with</option>
                        </select>
                        <input type="text" className="flex-1 px-3 py-1 border rounded text-sm" />
                      </div>

                      {/* Birth Date */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Birth Date:</label>
                        <select 
                          value={advancedSearchData.birthDateOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, birthDateOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-28"
                        >
                          <option value="isEqualTo">Is equal to</option>
                          <option value="before">Before</option>
                          <option value="after">After</option>
                        </select>
                        <input 
                          type="date"
                          value={advancedSearchData.birthDate}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, birthDate: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Legacy ID */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Legacy ID:</label>
                        <select className="px-2 py-1 border rounded text-xs w-24">
                          <option>Starts with</option>
                        </select>
                        <input type="text" className="flex-1 px-3 py-1 border rounded text-sm" />
                      </div>

                      {/* Created by */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Created by :</label>
                        <select className="flex-1 px-3 py-1 border rounded text-sm">
                          <option>--Please Select--</option>
                        </select>
                      </div>

                      {/* Modified by */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Modified by :</label>
                        <select className="flex-1 px-3 py-1 border rounded text-sm">
                          <option>--Please Select--</option>
                        </select>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Created Date:</label>
                        <select className="px-2 py-1 border rounded text-xs w-28">
                          <option>Is equal to</option>
                        </select>
                        <input type="date" className="px-3 py-1 border rounded text-sm w-32" />
                      </div>

                      {/* Modified Date */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">Modified Date:</label>
                        <select className="px-2 py-1 border rounded text-xs w-28">
                          <option>Is equal to</option>
                        </select>
                        <input type="date" className="px-3 py-1 border rounded text-sm w-32" />
                      </div>

                      {/* System ID */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-24">System ID:</label>
                        <select 
                          value={advancedSearchData.systemIdOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, systemIdOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-24"
                        >
                          <option value="startsWith">Starts with</option>
                          <option value="equals">Equals</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.systemId}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, systemId: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assessment Criteria */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Assessment Criteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Assessment ID */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-28">Assessment ID:</label>
                        <input 
                          type="text"
                          value={advancedSearchData.assessmentId}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, assessmentId: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Administration Date */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-28">Administration Date:</label>
                        <select 
                          value={advancedSearchData.adminDateOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, adminDateOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-28"
                        >
                          <option value="isEqualTo">Is equal to</option>
                          <option value="before">Before</option>
                          <option value="after">After</option>
                        </select>
                        <input 
                          type="date"
                          value={advancedSearchData.adminDate}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, adminDate: e.target.value})}
                          className="px-3 py-1 border rounded text-sm w-32"
                        />
                      </div>

                      {/* Form */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-28">Form:</label>
                        <select 
                          value={advancedSearchData.formOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, formOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-28"
                        >
                          <option value="isEqualTo">Is equal to</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.form}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, form: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>

                      {/* Examiner First */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 w-28">Examiner First:</label>
                        <select 
                          value={advancedSearchData.examinerFirstOp}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, examinerFirstOp: e.target.value})}
                          className="px-2 py-1 border rounded text-xs w-24"
                        >
                          <option value="startsWith">Starts with</option>
                          <option value="contains">Contains</option>
                        </select>
                        <input 
                          type="text"
                          value={advancedSearchData.examinerFirst}
                          onChange={(e) => setAdvancedSearchData({...advancedSearchData, examinerFirst: e.target.value})}
                          className="flex-1 px-3 py-1 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t px-6 py-4 flex items-center gap-3 rounded-b-xl">
                  <button 
                    onClick={() => {
                      setShowAdvancedSearch(false);
                      setCurrentPage(1);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 text-sm font-medium shadow-sm"
                  >
                    Search
                  </button>
                  <button 
                    onClick={() => setShowAdvancedSearch(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Package Modal */}
        <AnimatePresence>
          {showAssignAssessment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAssignAssessment(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <FiUser className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Assign Assessment</h2>
                  </div>
                  <button 
                    onClick={() => setShowAssignAssessment(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Package Name & Pricing Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 bg-blue-50 p-4 rounded-lg">
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Package Name</label>
                      <input
                        type="text"
                        placeholder="Enter package name..."
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Price per assessment</div>
                      <div className="text-lg font-bold text-blue-600">₹{ASSESSMENT_PRICE.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search assessments..."
                        value={assessmentSearch}
                        onChange={(e) => setAssessmentSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Alphabetical Filter */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {[
                      { key: 'a-b', label: 'A-B' },
                      { key: 'c-f', label: 'C-F' },
                      { key: 'g-k', label: 'G-K' },
                      { key: 'l-m', label: 'L-M' },
                      { key: 'n-q', label: 'N-Q' },
                      { key: 'r-v', label: 'R-V' },
                      { key: 'w-z', label: 'W-Z' },
                      { key: 'all', label: 'All' }
                    ].map(filter => (
                      <button
                        key={filter.key}
                        onClick={() => setAlphaFilter(filter.key)}
                        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                          alphaFilter === filter.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Selected Count & Total */}
                  <div className="flex items-center justify-between mb-3 bg-gray-100 p-3 rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">{selectedAssessments.length}</span>
                      <span className="text-gray-600"> assessments selected</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-600">
                      Total: ₹{totalPrice.toLocaleString()}
                    </div>
                  </div>

                  {/* Assessment List */}
                  <div className="border rounded-lg overflow-hidden max-h-[350px] overflow-y-auto">
                    {filteredAssessments.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        No assessments found
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredAssessments.map(assessment => (
                          <div
                            key={assessment.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAssessments.includes(assessment.id)}
                              onChange={() => toggleAssessmentSelection(assessment.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <div className="flex-1 cursor-pointer" onClick={() => toggleAssessmentSelection(assessment.id)}>
                              <div className="text-sm font-medium text-gray-800">{assessment.name}</div>
                              <div className="text-xs text-gray-500">{assessment.category}</div>
                            </div>
                            <div className="text-sm font-medium text-blue-600">
                              ₹{ASSESSMENT_PRICE.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t px-6 py-4 rounded-b-xl">
                  {/* Export Options */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Share as:</span>
                      <button 
                        onClick={() => {
                          const pkg = createPackage();
                          alert(`Package "${pkg.name}" exported as PDF!\n\nTotal: ₹${pkg.totalPrice.toLocaleString()}\nAssessments: ${pkg.assessments.length}`);
                        }}
                        disabled={selectedAssessments.length === 0}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                          selectedAssessments.length > 0
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        PDF
                      </button>
                      <button 
                        onClick={() => {
                          const pkg = createPackage();
                          alert(`Package "${pkg.name}" exported as Excel!\n\nTotal: ₹${pkg.totalPrice.toLocaleString()}\nAssessments: ${pkg.assessments.length}`);
                        }}
                        disabled={selectedAssessments.length === 0}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                          selectedAssessments.length > 0
                            ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Excel
                      </button>
                      <button 
                        onClick={() => {
                          const pkg = createPackage();
                          alert(`Package "${pkg.name}" exported as Word!\n\nTotal: ₹${pkg.totalPrice.toLocaleString()}\nAssessments: ${pkg.assessments.length}`);
                        }}
                        disabled={selectedAssessments.length === 0}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                          selectedAssessments.length > 0
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Word
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setShowAssignAssessment(false);
                          setSelectedAssessments([]);
                          setPackageName('');
                        }}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          const pkg = createPackage();
                          setCurrentAssessment(pkg.assessments[0]);
                          setShowAssessmentAdmin(true);
                          setShowAssignAssessment(false);
                        }}
                        disabled={selectedAssessments.length === 0}
                        className={`px-6 py-2 rounded-lg text-sm font-medium shadow-sm ${
                          selectedAssessments.length > 0
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Create Package
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assessment Administration Screen */}
        <AnimatePresence>
          {showAssessmentAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <FiUser className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Assessment Administration</h2>
                </div>
                <button 
                  onClick={() => setShowAssessmentAdmin(false)}
                  className="text-white/80 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    onClick={() => handleSaveAssessment(false)}
                    disabled={isSavingAssessment}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingAssessment ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => handleSaveAssessment(true)}
                    disabled={isSavingAssessment}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingAssessment ? 'Saving...' : 'Save and Close'}
                  </button>
                  <button 
                    onClick={() => setShowInvoiceScreen(true)}
                    disabled={isSendingInvoice}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 shadow-sm flex items-center gap-2"
                  >
                    <FiMail className="w-4 h-4" />
                    {isSendingInvoice ? 'Sending...' : 'Send Invoice'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowAssessmentAdmin(false);
                      setAssessmentItemResponses({});
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <div className="ml-auto text-emerald-600 text-sm font-medium">
                    Assessment Help
                  </div>
                </div>

                {/* Invoice Screen */}
                {showInvoiceScreen && (
                  <InvoiceScreen
                    isOpen={showInvoiceScreen}
                    onClose={() => setShowInvoiceScreen(false)}
                    assessmentData={{
                      name: currentPackage?.name || currentAssessment?.name || 'Assessment Package',
                      price: currentPackage?.totalPrice || totalPrice || ASSESSMENT_PRICE,
                      id: currentAssessment?.id,
                      count: currentPackage?.assessments?.length || selectedAssessments.length || 1,
                      assessments: currentPackage?.assessments || []
                    }}
                    examineeData={{
                      name: 'Aditya Sharma',
                      email: 'aditya@gmail.com',
                      age: '25 years 10 months',
                      gender: 'Male',
                      examineeId: 'as/msl/260331',
                      centre: 'Centrix Centre',
                      diagnosisData: {},
                      evaluationData: {},
                      historyData: {}
                    }}
                    onSendInvoice={async (invoiceData) => {
                      setIsSendingInvoice(true);
                      try {
                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
                        
                        // Use name from examineeData (hardcoded as 'Aditya Sharma')
                        const nameParts = 'Aditya Sharma'.split(' ');
                        const firstName = nameParts[0] || '';
                        const lastName = nameParts.slice(1).join(' ') || '';
                        
                        // DEBUG: Log the data being sent
                        const payload = {
                          assessmentId: currentAssessment?.id || currentPackage?.assessments?.[0]?.id,
                          studentId: selectedItems[0],
                          email: invoiceData.toEmail,
                          firstName: firstName,
                          lastName: lastName,
                          assessmentName: currentPackage?.name || (selectedAssessments.length > 1 ? `Package (${selectedAssessments.length} assessments)` : (currentAssessment?.name || 'Assessment')),
                          assessmentType: 'Standard',
                          price: invoiceData.price || currentPackage?.totalPrice || totalPrice || ASSESSMENT_PRICE,
                          adminDate: new Date().toISOString().split('T')[0],
                          examiner: 'JAGGI, KRUTIKA',
                          notes: invoiceData.notes,
                          customMessage: invoiceData.customMessage
                        };
                        
                        console.log('Sending invoice payload:', payload);
                        console.log('currentPackage:', currentPackage);
                        console.log('currentAssessment:', currentAssessment);
                        console.log('selectedItems:', selectedItems);
                        
                        const response = await fetch(`${apiUrl}/invoices/send-assessment`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(payload)
                        });
                        
                        const result = await response.json();
                        console.log('Response:', result);
                        
                        if (result.success) {
                          alert('Invoice sent successfully!');
                          setShowInvoiceScreen(false);
                        } else {
                          alert('Failed to send: ' + result.message);
                        }
                      } catch (error) {
                        console.error('Error:', error);
                        alert('Failed to send invoice');
                      } finally {
                        setIsSendingInvoice(false);
                      }
                    }}
                  />
                )}

                {/* Examinee Details */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Examinee Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">First Name: *</label>
                      <input 
                        type="text" 
                        defaultValue="Aditya"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Middle Name:</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Last Name: *</label>
                      <input 
                        type="text" 
                        defaultValue="Sharma"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Examinee ID: *</label>
                      <input 
                        type="text" 
                        defaultValue="as/msl/260331"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Gender: *</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Birth Date: *</label>
                      <input 
                        type="date" 
                        defaultValue="2000-05-23"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Age:</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                        25 years 10 months
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email:</label>
                      <input 
                        type="email" 
                        defaultValue="aditya@gmail.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Assessment Details */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Assessment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Assessment: *</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 font-medium">
                        {currentPackage?.name || currentAssessment?.name || '16PF'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Items Count:</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                        {currentPackage?.assessments?.length || 1} assessment(s)
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Status:</label>
                      <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700 font-medium">
                        Ready for Administration
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Price:</label>
                      <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 font-bold">
                        ₹{(currentPackage?.totalPrice || totalPrice || ASSESSMENT_PRICE).toLocaleString()}
                        {currentPackage?.assessments?.length > 1 && (
                          <span className="text-xs text-blue-500 block font-normal">
                            ({currentPackage.assessments.length} assessments × ₹{ASSESSMENT_PRICE.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Administration Date: *</label>
                      <input 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Age at Administration:</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                        25 years 10 months
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Examiner: *</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                        <option>JAGGI, KRUTIKA</option>
                        <option>New Examiner</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Delivery Options</h3>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="manual"
                        checked={deliveryMethod === 'manual'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300"
                      />
                      <div>
                        <div className="font-medium text-sm">Manual Entry</div>
                        <div className="text-xs text-gray-500">Enter responses manually for paper-based assessments</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="onscreen"
                        checked={deliveryMethod === 'onscreen'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">On-Screen Administration</div>
                        <div className="text-xs text-gray-500 mb-2">Administer assessment digitally on this computer</div>
                        <label className="flex items-center gap-2 ml-6">
                          <input type="checkbox" className="w-3 h-3 text-blue-600 rounded" />
                          <span className="text-xs">Launch with Test Session Lock</span>
                        </label>
                        <div className="ml-6 text-xs text-gray-500 mt-1">
                          Test Session Lock will block examinees from accessing your computer during and after testing. 
                          When finished, press <strong>Ctrl + Shift + Q</strong> to unlock. 
                          To use this feature, you must <a href="#" className="text-blue-600 underline">download and install Test Session Lock</a> (one time only).
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="delivery" 
                        value="remote"
                        checked={deliveryMethod === 'remote'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300"
                      />
                      <div>
                        <div className="font-medium text-sm">Remote On-Screen Administration</div>
                        <div className="text-xs text-gray-500">Send assessment link to examinee for remote completion</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Item Entry */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Conners</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" id="showItemText" className="w-4 h-4 text-blue-600 rounded" />
                    <label htmlFor="showItemText" className="text-sm text-gray-700 cursor-pointer">Show Item Text</label>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b text-xs font-medium text-gray-600">
                      <div className="col-span-1">#</div>
                      <div className="col-span-11">Response</div>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                      {Array.from({ length: 24 }, (_, i) => i + 1).map(itemNum => (
                        <div key={itemNum} className="grid grid-cols-12 gap-2 p-2 items-center hover:bg-gray-50">
                          <div className="col-span-1 text-sm text-gray-600 font-medium">{itemNum}.</div>
                          <div className="col-span-11">
                            <input 
                              type="text" 
                              value={assessmentItemResponses[itemNum] || ''}
                              onChange={(e) => handleItemResponseChange(itemNum, e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder=""
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 pb-6 flex-wrap">
                  <button 
                    onClick={() => handleSaveAssessment(false)}
                    disabled={isSavingAssessment}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingAssessment ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => handleSaveAssessment(true)}
                    disabled={isSavingAssessment}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingAssessment ? 'Saving...' : 'Save and Close'}
                  </button>
                  <button 
                    onClick={() => setShowInvoiceScreen(true)}
                    disabled={isSendingInvoice}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 shadow-sm flex items-center gap-2"
                  >
                    <FiMail className="w-4 h-4" />
                    {isSendingInvoice ? 'Sending...' : 'Send Invoice'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowAssessmentAdmin(false);
                      setAssessmentItemResponses({});
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Footer */}
      <div className="border-t bg-white mt-12">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">dashboard</span>
              <a href="#" className="hover:text-gray-700">About</a>
              <a href="#" className="hover:text-gray-700">Contact</a>
              <a href="#" className="hover:text-gray-700">Privacy</a>
            </div>
            <div>
              Copyright © 2025 MindSaid Learning. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default ExamineesManagement;
