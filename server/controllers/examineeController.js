const Student = require('../models/Student');
const Assessment = require('../models/Assessment');

class ExamineeController {
  constructor() {
    this.studentModel = new Student();
    this.assessmentModel = new Assessment();
  }

  // Get all examinees with their assessments
  async getExaminees(req, res) {
    try {
      const students = await this.studentModel.getStudents();
      
      // Fetch assessments for each student
      const examinees = await Promise.all(students.map(async (student) => {
        const assessments = await this.assessmentModel.getAssessmentsByStudent(student.id);
        
        return {
          id: student.id,
          firstName: student.first_name,
          middleName: '',
          lastName: student.last_name,
          examineeId: student.student_id,
          gender: student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : 'Please Select...',
          dob: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('en-GB') : '',
          email: student.email || '',
          comment: student.learning_needs || '',
          custom1: student.customField1 || '',
          custom2: student.customField2 || '',
          custom3: student.customField3 || '',
          custom4: student.customField4 || '',
          assessments: assessments.map(assessment => ({
            id: assessment.id,
            name: assessment.assessment_name,
            date: assessment.scheduled_date ? new Date(assessment.scheduled_date).toLocaleDateString('en-GB') : '',
            deliveryMethod: assessment.delivery_method || 'Manual Entry',
            examiner: assessment.examiner_name || assessment.examiner || '',
            language: assessment.language || 'English',
            gradeLevel: assessment.grade_level || '',
            reasonForReferral: assessment.reason_for_referral || '',
            medications: assessment.medications || '',
            testingSite: assessment.testing_site || '',
            scores: {
              mathRaw: assessment.math_raw || '',
              mathStd: assessment.math_std || '',
              mathCI: assessment.math_ci || '',
              mathPct: assessment.math_pct || '',
              mathCat: assessment.math_cat || '',
              mathAge: assessment.math_age || '',
              mathGSV: assessment.math_gsv || '',
              spellingRaw: assessment.spelling_raw || '',
              spellingStd: assessment.spelling_std || '',
              spellingCI: assessment.spelling_ci || '',
              spellingPct: assessment.spelling_pct || '',
              spellingCat: assessment.spelling_cat || '',
              spellingAge: assessment.spelling_age || '',
              spellingGSV: assessment.spelling_gsv || '',
              wordReadingRaw: assessment.word_reading_raw || '',
              wordReadingStd: assessment.word_reading_std || '',
              wordReadingCI: assessment.word_reading_ci || '',
              wordReadingPct: assessment.word_reading_pct || '',
              wordReadingCat: assessment.word_reading_cat || '',
              wordReadingAge: assessment.word_reading_age || '',
              wordReadingGSV: assessment.word_reading_gsv || '',
              sentenceRaw: assessment.sentence_raw || '',
              sentenceStd: assessment.sentence_std || '',
              sentenceCI: assessment.sentence_ci || '',
              sentencePct: assessment.sentence_pct || '',
              sentenceCat: assessment.sentence_cat || '',
              sentenceAge: assessment.sentence_age || '',
              sentenceGSV: assessment.sentence_gsv || '',
              compositeRaw: assessment.composite_raw || '',
              compositeStd: assessment.composite_std || '',
              compositeCI: assessment.composite_ci || '',
              compositePct: assessment.composite_pct || '',
              compositeCat: assessment.composite_cat || '',
              diff_wr_sp: assessment.diff_wr_sp || '',
              sig_wr_sp: assessment.sig_wr_sp || '',
              base_wr_sp: assessment.base_wr_sp || '',
              diff_wr_mc: assessment.diff_wr_mc || '',
              sig_wr_mc: assessment.sig_wr_mc || '',
              base_wr_mc: assessment.base_wr_mc || '',
              diff_wr_sc: assessment.diff_wr_sc || '',
              sig_wr_sc: assessment.sig_wr_sc || '',
              base_wr_sc: assessment.base_wr_sc || '',
              diff_sp_mc: assessment.diff_sp_mc || '',
              sig_sp_mc: assessment.sig_sp_mc || '',
              base_sp_mc: assessment.base_sp_mc || '',
              diff_sp_sc: assessment.diff_sp_sc || '',
              sig_sp_sc: assessment.sig_sp_sc || '',
              base_sp_sc: assessment.base_sp_sc || '',
              diff_mc_sc: assessment.diff_mc_sc || '',
              sig_mc_sc: assessment.sig_mc_sc || '',
              base_mc_sc: assessment.base_mc_sc || '',
            }
          }))
        };
      }));

      res.json({
        success: true,
        data: examinees
      });
    } catch (error) {
      console.error('Get examinees error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new examinee
  async createExaminee(req, res) {
    try {
      const {
        firstName, middleName, lastName, examineeId, gender, dob, email,
        custom1, custom2, custom3, custom4, comment
      } = req.body;

      const studentData = {
        first_name: firstName,
        last_name: lastName,
        student_id: examineeId,
        gender: gender?.toLowerCase(),
        date_of_birth: dob ? new Date(dob.split('/').reverse().join('-')) : null,
        email: email,
        customField1: custom1,
        customField2: custom2,
        customField3: custom3,
        customField4: custom4,
        learning_needs: comment
      };

      const studentId = await this.studentModel.create(studentData);

      res.status(201).json({
        success: true,
        data: { id: studentId },
        message: 'Examinee created successfully'
      });
    } catch (error) {
      console.error('Create examinee error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create assessment with scores
  async createAssessmentWithScores(req, res) {
    try {
      console.log('🔍 Request body received:', req.body);
      
      const {
        examineeId, deliveryMethod, testDate, examiner, language, gradeLevel,
        reasonForReferral, medications, testingSite, scores
      } = req.body;

      console.log('🔍 Extracted fields:', { examineeId, deliveryMethod, testDate, examiner });

      if (!examineeId) {
        return res.status(400).json({
          success: false,
          message: 'Examinee ID is required'
        });
      }

      const assessmentData = {
        student_id: examineeId,
        assessment_name: 'WRAT5-India Blue Form',
        assessment_type: 'WRAT5',
        delivery_method: deliveryMethod,
        scheduled_date: testDate ? new Date(testDate.split('/').reverse().join('-')) : new Date(),
        scheduled_time: '09:00:00',
        test_date: testDate ? new Date(testDate.split('/').reverse().join('-')) : null,
        examiner_name: examiner,
        language: language,
        grade_level: gradeLevel,
        reason_for_referral: reasonForReferral,
        medications: medications,
        testing_site: testingSite,
        status: 'Completed',
        // Score fields
        math_raw: scores?.mathRaw || '',
        math_std: scores?.mathStd || '',
        math_ci: scores?.mathCI || '',
        math_pct: scores?.mathPct || '',
        math_cat: scores?.mathCat || '',
        math_age: scores?.mathAge || '',
        math_gsv: scores?.mathGSV || '',
        spelling_raw: scores?.spellingRaw || '',
        spelling_std: scores?.spellingStd || '',
        spelling_ci: scores?.spellingCI || '',
        spelling_pct: scores?.spellingPct || '',
        spelling_cat: scores?.spellingCat || '',
        spelling_age: scores?.spellingAge || '',
        spelling_gsv: scores?.spellingGSV || '',
        word_reading_raw: scores?.wordReadingRaw || '',
        word_reading_std: scores?.wordReadingStd || '',
        word_reading_ci: scores?.wordReadingCI || '',
        word_reading_pct: scores?.wordReadingPct || '',
        word_reading_cat: scores?.wordReadingCat || '',
        word_reading_age: scores?.wordReadingAge || '',
        word_reading_gsv: scores?.wordReadingGSV || '',
        sentence_raw: scores?.sentenceRaw || '',
        sentence_std: scores?.sentenceStd || '',
        sentence_ci: scores?.sentenceCI || '',
        sentence_pct: scores?.sentencePct || '',
        sentence_cat: scores?.sentenceCat || '',
        sentence_age: scores?.sentenceAge || '',
        sentence_gsv: scores?.sentenceGSV || '',
        composite_raw: scores?.compositeRaw || '',
        composite_std: scores?.compositeStd || '',
        composite_ci: scores?.compositeCI || '',
        composite_pct: scores?.compositePct || '',
        composite_cat: scores?.compositeCat || '',
        diff_wr_sp: scores?.diff_wr_sp || '',
        sig_wr_sp: scores?.sig_wr_sp || '',
        base_wr_sp: scores?.base_wr_sp || '',
        diff_wr_mc: scores?.diff_wr_mc || '',
        sig_wr_mc: scores?.sig_wr_mc || '',
        base_wr_mc: scores?.base_wr_mc || '',
        diff_wr_sc: scores?.diff_wr_sc || '',
        sig_wr_sc: scores?.sig_wr_sc || '',
        base_wr_sc: scores?.base_wr_sc || '',
        diff_sp_mc: scores?.diff_sp_mc || '',
        sig_sp_mc: scores?.sig_sp_mc || '',
        base_sp_mc: scores?.base_sp_mc || '',
        diff_sp_sc: scores?.diff_sp_sc || '',
        sig_sp_sc: scores?.sig_sp_sc || '',
        base_sp_sc: scores?.base_sp_sc || '',
        diff_mc_sc: scores?.diff_mc_sc || '',
        sig_mc_sc: scores?.sig_mc_sc || '',
        base_mc_sc: scores?.base_mc_sc || '',
      };

      console.log('🔍 Assessment data prepared:', assessmentData);

      const assessmentId = await this.assessmentModel.create(assessmentData);
      
      console.log('✅ Assessment created with ID:', assessmentId);

      res.status(201).json({
        success: true,
        data: { id: assessmentId },
        message: 'Assessment created successfully'
      });
    } catch (error) {
      console.error('Create assessment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ExamineeController;
