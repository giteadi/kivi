const { getDb } = require('../database');

class AssessmentPackageController {
  // Get all assessment packages
  async getPackages(req, res) {
    try {
      const { category, is_active = true } = req.query;
      console.log('[AssessmentPackageController] getPackages called with:', { category, is_active });

      let query = 'SELECT * FROM kivi_assessment_packages WHERE 1=1';
      const params = [];

      if (is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(is_active === 'true' || is_active === true ? 1 : 0);
      }

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      query += ' ORDER BY price ASC';

      console.log('[AssessmentPackageController] Executing query:', query, 'params:', params);

      const db = getDb();
      console.log('[AssessmentPackageController] Got DB connection');

      const packages = await new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
          if (err) {
            console.error('[AssessmentPackageController] DB Query Error:', err);
            reject(err);
          } else {
            console.log('[AssessmentPackageController] Query success, results count:', results ? results.length : 0);
            resolve(results);
          }
        });
      });

      // Parse JSON fields with error handling
      const formattedPackages = packages.map(pkg => {
        let includes = [];
        if (pkg.includes) {
          if (Array.isArray(pkg.includes)) {
            // Already an array (from DB)
            includes = pkg.includes;
          } else if (typeof pkg.includes === 'string') {
            try {
              includes = JSON.parse(pkg.includes);
            } catch (e) {
              // Not valid JSON, treat as comma-separated string
              includes = pkg.includes.split(',').map(s => s.trim()).filter(s => s);
            }
          }
        }
        return {
          ...pkg,
          includes: includes,
          price: parseFloat(pkg.price)
        };
      });

      res.json({
        success: true,
        data: formattedPackages,
        message: 'Assessment packages retrieved successfully'
      });
    } catch (error) {
      console.error('[AssessmentPackageController] Get packages error:', error);
      console.error('[AssessmentPackageController] Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assessment packages: ' + error.message
      });
    }
  }

  // Get single package by ID
  async getPackage(req, res) {
    try {
      const { id } = req.params;

      const db = getDb();
      const packageData = await new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM kivi_assessment_packages WHERE id = ?',
          [id],
          (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
          }
        );
      });

      if (!packageData) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      res.json({
        success: true,
        data: {
          ...packageData,
          includes: packageData.includes ? JSON.parse(packageData.includes) : [],
          price: parseFloat(packageData.price)
        },
        message: 'Package retrieved successfully'
      });
    } catch (error) {
      console.error('Get package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch package'
      });
    }
  }

  // Create new package (admin only)
  async createPackage(req, res) {
    try {
      console.log('🔍 Create package request:', req.body);

      const { name, category, price, age_range, description, includes, centre_id } = req.body;

      // Validate required fields
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Name and price are required'
        });
      }

      // Generate package ID
      const packageId = 'PKG-' + Date.now().toString(36).toUpperCase();

      const db = getDb();
      const result = await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO kivi_assessment_packages
           (package_id, name, category, price, age_range, description, includes, centre_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            packageId,
            name,
            category || 'Assessment',
            parseFloat(price),
            age_range || null,
            description || null,
            includes ? JSON.stringify(includes) : '[]',
            centre_id || null
          ],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          package_id: packageId
        },
        message: 'Assessment package created successfully'
      });
    } catch (error) {
      console.error('❌ Create package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create package'
      });
    }
  }

  // Update package (admin only)
  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const { name, category, price, age_range, description, includes, is_active, centre_id } = req.body;

      // Build update query dynamically
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
      if (age_range !== undefined) {
        updates.push('age_range = ?');
        params.push(age_range);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }
      if (includes !== undefined) {
        updates.push('includes = ?');
        params.push(JSON.stringify(includes));
      }
      if (is_active !== undefined) {
        updates.push('is_active = ?');
        params.push(is_active ? 1 : 0);
      }
      if (centre_id !== undefined) {
        updates.push('centre_id = ?');
        params.push(centre_id);
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
      const result = await new Promise((resolve, reject) => {
        db.query(
          `UPDATE kivi_assessment_packages SET ${updates.join(', ')} WHERE id = ?`,
          params,
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      res.json({
        success: true,
        message: 'Package updated successfully'
      });
    } catch (error) {
      console.error('Update package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update package'
      });
    }
  }

  // Delete package (admin only)
  async deletePackage(req, res) {
    try {
      const { id } = req.params;

      const db = getDb();
      // Check if package is assigned to any student
      const assigned = await new Promise((resolve, reject) => {
        db.query(
          'SELECT COUNT(*) as count FROM kivi_student_packages WHERE package_id = ?',
          [id],
          (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
          }
        );
      });

      if (assigned.count > 0) {
        // Soft delete - just mark as inactive
        await new Promise((resolve, reject) => {
          db.query(
            'UPDATE kivi_assessment_packages SET is_active = 0, updated_at = NOW() WHERE id = ?',
            [id],
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        });

        return res.json({
          success: true,
          message: 'Package marked as inactive (has assigned students)'
        });
      }

      // Hard delete
      const result = await new Promise((resolve, reject) => {
        db.query(
          'DELETE FROM kivi_assessment_packages WHERE id = ?',
          [id],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      res.json({
        success: true,
        message: 'Package deleted successfully'
      });
    } catch (error) {
      console.error('Delete package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete package'
      });
    }
  }

  // Assign package to student
  async assignPackageToStudent(req, res) {
    try {
      const { student_id, package_id, notes } = req.body;
      const assigned_by = req.user?.id || null;

      if (!student_id || !package_id) {
        return res.status(400).json({
          success: false,
          message: 'Student ID and Package ID are required'
        });
      }

      // Get current package price
      const packageData = await new Promise((resolve, reject) => {
        db.pool.query(
          'SELECT price FROM kivi_assessment_packages WHERE id = ? AND is_active = 1',
          [package_id],
          (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
          }
        );
      });

      if (!packageData) {
        return res.status(404).json({
          success: false,
          message: 'Package not found or inactive'
        });
      }

      const result = await new Promise((resolve, reject) => {
        db.pool.query(
          `INSERT INTO kivi_student_packages 
           (student_id, package_id, assigned_by, price_at_assignment, notes) 
           VALUES (?, ?, ?, ?, ?)`,
          [student_id, package_id, assigned_by, packageData.price, notes || null],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      res.status(201).json({
        success: true,
        data: { id: result.insertId },
        message: 'Package assigned to student successfully'
      });
    } catch (error) {
      console.error('Assign package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign package'
      });
    }
  }

  // Get student's assigned packages
  async getStudentPackages(req, res) {
    try {
      const { student_id } = req.params;

      const packages = await new Promise((resolve, reject) => {
        db.pool.query(
          `SELECT sp.*, ap.name, ap.category, ap.description, ap.includes
           FROM kivi_student_packages sp
           JOIN kivi_assessment_packages ap ON sp.package_id = ap.id
           WHERE sp.student_id = ?
           ORDER BY sp.assigned_at DESC`,
          [student_id],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      const formattedPackages = packages.map(pkg => ({
        ...pkg,
        includes: pkg.includes ? JSON.parse(pkg.includes) : [],
        price_at_assignment: parseFloat(pkg.price_at_assignment)
      }));

      res.json({
        success: true,
        data: formattedPackages,
        message: 'Student packages retrieved successfully'
      });
    } catch (error) {
      console.error('Get student packages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student packages'
      });
    }
  }

  // Update student package status
  async updateStudentPackageStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updates = ['updated_at = NOW()'];
      const params = [];

      if (status) {
        updates.push('status = ?');
        params.push(status);

        if (status === 'completed') {
          updates.push('completed_at = NOW()');
        }
      }

      if (notes !== undefined) {
        updates.push('notes = ?');
        params.push(notes);
      }

      params.push(id);

      const result = await new Promise((resolve, reject) => {
        db.pool.query(
          `UPDATE kivi_student_packages SET ${updates.join(', ')} WHERE id = ?`,
          params,
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student package not found'
        });
      }

      res.json({
        success: true,
        message: 'Package status updated successfully'
      });
    } catch (error) {
      console.error('Update student package error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update package status'
      });
    }
  }

  // Get package categories
  async getCategories(req, res) {
    try {
      const categories = await new Promise((resolve, reject) => {
        db.pool.query(
          'SELECT DISTINCT category FROM kivi_assessment_packages WHERE is_active = 1 ORDER BY category',
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      res.json({
        success: true,
        data: categories.map(c => c.category),
        message: 'Categories retrieved successfully'
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories'
      });
    }
  }
}

module.exports = AssessmentPackageController;
