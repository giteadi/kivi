const { getDb } = require('../database');

class IndividualAssessmentController {
  // Get all individual assessments
  async getAssessments(req, res) {
    try {
      const { category, is_active = true } = req.query;

      let query = 'SELECT * FROM kivi_individual_assessments WHERE 1=1';
      const params = [];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(is_active === 'true' || is_active === true ? 1 : 0);
      }

      query += ' ORDER BY name ASC';

      const db = getDb();
      db.query(query, params, (error, results) => {
        if (error) {
          console.error('Error fetching individual assessments:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch individual assessments'
          });
        }

        res.json({
          success: true,
          data: results,
          message: 'Individual assessments retrieved successfully'
        });
      });
    } catch (error) {
      console.error('Error in getAssessments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch individual assessments'
      });
    }
  }

  // Get single assessment
  async getAssessment(req, res) {
    try {
      const { id } = req.params;
      const db = getDb();

      db.query(
        'SELECT * FROM kivi_individual_assessments WHERE id = ?',
        [id],
        (error, results) => {
          if (error) {
            console.error('Error fetching assessment:', error);
            return res.status(500).json({
              success: false,
              message: 'Failed to fetch assessment'
            });
          }

          if (results.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Assessment not found'
            });
          }

          res.json({
            success: true,
            data: results[0]
          });
        }
      );
    } catch (error) {
      console.error('Error in getAssessment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assessment'
      });
    }
  }

  // Create new assessment
  async createAssessment(req, res) {
    try {
      const { assessment_id, name, category, price, description } = req.body;

      if (!assessment_id || !name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Assessment ID, name, and price are required'
        });
      }

      const db = getDb();
      db.query(
        `INSERT INTO kivi_individual_assessments 
         (assessment_id, name, category, price, description) 
         VALUES (?, ?, ?, ?, ?)`,
        [assessment_id, name, category || null, parseFloat(price), description || null],
        (error, result) => {
          if (error) {
            console.error('Error creating assessment:', error);
            if (error.code === 'ER_DUP_ENTRY') {
              return res.status(400).json({
                success: false,
                message: 'Assessment ID already exists'
              });
            }
            return res.status(500).json({
              success: false,
              message: 'Failed to create assessment'
            });
          }

          res.status(201).json({
            success: true,
            data: {
              id: result.insertId,
              assessment_id
            },
            message: 'Assessment created successfully'
          });
        }
      );
    } catch (error) {
      console.error('Error in createAssessment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create assessment'
      });
    }
  }

  // Update assessment
  async updateAssessment(req, res) {
    try {
      const { id } = req.params;
      const { name, category, price, description, is_active } = req.body;

      const updates = [];
      const params = [];

      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (category !== undefined) {
        updates.push('category = ?');
        params.push(category);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        params.push(parseFloat(price));
      }
      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }
      if (is_active !== undefined) {
        updates.push('is_active = ?');
        params.push(is_active ? 1 : 0);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updates.push('updated_at = NOW()');
      params.push(id);

      const db = getDb();
      db.query(
        `UPDATE kivi_individual_assessments SET ${updates.join(', ')} WHERE id = ?`,
        params,
        (error, result) => {
          if (error) {
            console.error('Error updating assessment:', error);
            return res.status(500).json({
              success: false,
              message: 'Failed to update assessment'
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: 'Assessment not found'
            });
          }

          res.json({
            success: true,
            message: 'Assessment updated successfully'
          });
        }
      );
    } catch (error) {
      console.error('Error in updateAssessment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update assessment'
      });
    }
  }

  // Delete assessment
  async deleteAssessment(req, res) {
    try {
      const { id } = req.params;
      const db = getDb();

      // Soft delete by setting is_active to false
      db.query(
        'UPDATE kivi_individual_assessments SET is_active = 0, updated_at = NOW() WHERE id = ?',
        [id],
        (error, result) => {
          if (error) {
            console.error('Error deleting assessment:', error);
            return res.status(500).json({
              success: false,
              message: 'Failed to delete assessment'
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: 'Assessment not found'
            });
          }

          res.json({
            success: true,
            message: 'Assessment deleted successfully'
          });
        }
      );
    } catch (error) {
      console.error('Error in deleteAssessment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete assessment'
      });
    }
  }

  // Get categories
  async getCategories(req, res) {
    try {
      const db = getDb();
      db.query(
        'SELECT DISTINCT category FROM kivi_individual_assessments WHERE is_active = 1 ORDER BY category',
        (error, results) => {
          if (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).json({
              success: false,
              message: 'Failed to fetch categories'
            });
          }

          const categories = results.map(row => row.category).filter(Boolean);
          res.json({
            success: true,
            data: categories
          });
        }
      );
    } catch (error) {
      console.error('Error in getCategories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories'
      });
    }
  }
}

module.exports = IndividualAssessmentController;
