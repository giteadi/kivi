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
  FiAlertTriangle
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '../store/slices/patientSlice';
import Sidebar from './Sidebar';

const ExamineesManagement = ({ onViewPatient, onEditPatient, onDeletePatient, onCreateNewPatient, activeItem = 'patients', setActiveItem }) => {
  const dispatch = useDispatch();
  const { patients, isLoading, error } = useSelector((state) => state.patients);

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
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [assessmentTab, setAssessmentTab] = useState('all');
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [alphaFilter, setAlphaFilter] = useState('all');
  const [favoriteAssessments, setFavoriteAssessments] = useState([]);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

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
    center: patient.centre_name || 'MindSaid Learning Centre',
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
    const matchesTab = assessmentTab === 'all' || 
      (assessmentTab === 'favorites' && favoriteAssessments.includes(assessment.id));
    return matchesSearch && matchesAlpha && matchesTab;
  });

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavoriteAssessments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
                  Kivi
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <span className="text-gray-600 font-medium">MindSaid Learning Centre</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <FiSettings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  KR
                </div>
                <span className="text-sm font-medium text-gray-700">KRITIKA JAGGI</span>
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
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium">
                        <FiMoreHorizontal className="w-4 h-4" />
                        <span>More Actions</span>
                        <FiChevronDown className="w-3 h-3" />
                      </button>
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
                    
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                      <FiDownload className="w-4 h-4" />
                    </button>
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
                        <option value="MindSaid Learning Centre">MindSaid Learning Centre</option>
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
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include Sub-Accounts</span>
                  </label>
                  
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
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
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include Sub-Accounts</span>
                  </label>

                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium sm:ml-auto">
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
                      // TODO: Implement search
                      setShowAdvancedSearch(false);
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

        {/* Assign Assessment Modal */}
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
                className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
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

                {/* Tabs */}
                <div className="flex border-b bg-gray-50">
                  <button
                    onClick={() => setAssessmentTab('all')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      assessmentTab === 'all'
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    All Assessments
                  </button>
                  <button
                    onClick={() => setAssessmentTab('favorites')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      assessmentTab === 'favorites'
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    My Favourites
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
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

                  {/* Assessment List */}
                  <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
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
                              type="radio"
                              name="assessment"
                              value={assessment.id}
                              checked={selectedAssessment === assessment.id}
                              onChange={() => setSelectedAssessment(assessment.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <div className="flex-1 cursor-pointer" onClick={() => setSelectedAssessment(assessment.id)}>
                              <div className="text-sm font-medium text-gray-800">{assessment.name}</div>
                              <div className="text-xs text-gray-500">{assessment.category}</div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(assessment.id);
                              }}
                              className="text-gray-400 hover:text-yellow-500 transition-colors p-1"
                            >
                              {favoriteAssessments.includes(assessment.id) ? (
                                <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t px-6 py-4 flex items-center justify-between rounded-b-xl">
                  <div className="text-sm text-gray-500">
                    {selectedItems.length} examinee{selectedItems.length !== 1 ? 's' : ''} selected
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowAssignAssessment(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        // TODO: Implement assign logic
                        setShowAssignAssessment(false);
                        setSelectedAssessment('');
                      }}
                      disabled={!selectedAssessment}
                      className={`px-6 py-2 rounded-lg text-sm font-medium shadow-sm ${
                        selectedAssessment
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Footer */}
      <div className="border-t bg-white mt-12">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Kivi</span>
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
