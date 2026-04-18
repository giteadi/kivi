const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/coners');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'coner-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.xlsx', '.xls', '.csv', '.doc', '.docx', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel, Word, CSV and PDF files are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Import database pool
const { getDb } = require('../database');

// GET /api/coners - Get all coners
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, name, description, type, file_path, file_size, 
             created_at, updated_at, created_by
      FROM coners 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const [coners] = await getDb().promise().query(query);
    res.json(coners);
  } catch (error) {
    console.error('Get coners error:', error);
    res.status(500).json({ message: 'Failed to retrieve coners' });
  }
});

// POST /api/coners/upload - Upload a new coner
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, folder_id, client_id, template_data } = req.body;
    const fileName = name || req.file.originalname;
    const ext = path.extname(req.file.originalname).toLowerCase();
    
    // Determine file type
    let fileType = 'unknown';
    if (['.xlsx', '.xls'].includes(ext)) fileType = 'excel';
    else if (ext === '.csv') fileType = 'csv';
    else if (['.doc', '.docx'].includes(ext)) fileType = 'word';
    else if (ext === '.pdf') fileType = 'pdf';

    // Use provided template_data from frontend, or parse file as fallback
    let templateData = null;
    
    // If frontend sent template_data, use it directly (for reports with HTML content)
    if (template_data) {
      try {
        templateData = typeof template_data === 'string' ? template_data : JSON.stringify(template_data);
        console.log('[DEBUG] Using template_data from frontend request');
      } catch (e) {
        console.warn('Failed to process frontend template_data:', e);
      }
    }
    try {
      const { spawn } = require('child_process');
      const pythonPath = process.env.PYTHON_PATH || 'python3';
      const parserScript = path.join(__dirname, '../scripts/parse_excel.py');
      
      const parsePromise = new Promise((resolve, reject) => {
        const python = spawn(pythonPath, [parserScript, req.file.path]);
        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
          dataString += data.toString();
        });

        python.stderr.on('data', (data) => {
          errorString += data.toString();
        });

        python.on('close', (code) => {
          if (code !== 0) {
            console.warn('Python parser warning:', errorString);
            resolve(null); // Don't fail upload if parsing fails
          } else {
            try {
              const parsed = JSON.parse(dataString);
              resolve(parsed);
            } catch (e) {
              console.warn('Failed to parse Python output:', e);
              resolve(null);
            }
          }
        });

        python.on('error', (err) => {
          console.warn('Python spawn error:', err);
          resolve(null);
        });
      });

      // Only use parsed data if we don't already have template_data from frontend
      if (!templateData) {
        const parsedData = await parsePromise;
        if (parsedData && parsedData.ok) {
          templateData = JSON.stringify({
            sheets: parsedData.sheets,
            sheetNames: parsedData.names,
            row_heights: parsedData.row_heights || {}
          });
        }
      }
    } catch (parseError) {
      console.warn('File parsing failed, continuing without template_data:', parseError);
    }

    const query = `
      INSERT INTO coners (name, type, file_path, file_size, folder_id, client_id, template_data, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await getDb().promise().query(query, [
      fileName,
      fileType,
      req.file.filename,
      req.file.size,
      folder_id || null,
      client_id || null,
      templateData,
      req.user.id
    ]);

    res.json({
      id: result.insertId,
      name: fileName,
      type: fileType,
      message: 'Coner uploaded successfully'
    });
  } catch (error) {
    console.error('Upload coner error:', error);
    // Delete uploaded file if DB insert failed
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ message: 'Failed to upload coner' });
  }
});

// GET /api/coners/:id/download - Download a coner
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM coners WHERE id = ? AND deleted_at IS NULL';
    const [coners] = await getDb().promise().query(query, [req.params.id]);
    
    if (coners.length === 0) {
      return res.status(404).json({ message: 'Coner not found' });
    }

    const coner = coners[0];
    const filePath = path.join(uploadsDir, coner.file_path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set appropriate content type
    const ext = path.extname(coner.file_path).toLowerCase();
    const contentTypes = {
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls': 'application/vnd.ms-excel',
      '.csv': 'text/csv',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.pdf': 'application/pdf'
    };
    
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    const encodedFilename = encodeURIComponent(coner.name);
    res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodedFilename}`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download coner error:', error);
    res.status(500).json({ message: 'Failed to download coner' });
  }
});

// PUT /api/coners/:id - Update coner (name, type, template_data)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, type, template_data, folder_id } = req.body;
    
    const query = `
      UPDATE coners 
      SET name = ?, type = ?, template_data = ?, folder_id = ?, updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;
    
    const templateDataStr = template_data ? JSON.stringify(template_data) : null;
    await getDb().promise().query(query, [name, type, templateDataStr, folder_id || null, req.params.id]);
    
    res.json({ message: 'Coner updated successfully' });
  } catch (error) {
    console.error('Update coner error:', error);
    res.status(500).json({ message: 'Failed to update coner' });
  }
});

// PUT /api/coners/:id/data - Update coner data (for Excel/CSV editing)
router.put('/:id/data', authenticateToken, async (req, res) => {
  try {
    const { sheetData } = req.body;
    
    // Store the edited data as JSON
    const query = `
      UPDATE coners 
      SET sheet_data = ?, updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;
    
    await getDb().promise().query(query, [JSON.stringify(sheetData), req.params.id]);
    
    res.json({ message: 'Coner data updated successfully' });
  } catch (error) {
    console.error('Update coner data error:', error);
    res.status(500).json({ message: 'Failed to update coner data' });
  }
});

// GET /api/coners/:id/data - Get coner data
router.get('/:id/data', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT sheet_data FROM coners WHERE id = ? AND deleted_at IS NULL';
    const [coners] = await getDb().promise().query(query, [req.params.id]);
    
    if (coners.length === 0) {
      return res.status(404).json({ message: 'Coner not found' });
    }

    const sheetData = coners[0].sheet_data ? JSON.parse(coners[0].sheet_data) : null;
    res.json({ sheetData });
  } catch (error) {
    console.error('Get coner data error:', error);
    res.status(500).json({ message: 'Failed to retrieve coner data' });
  }
});

// DELETE /api/coners/:id - Delete a coner (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Soft delete
    const query = 'UPDATE coners SET deleted_at = NOW() WHERE id = ?';
    await getDb().promise().query(query, [req.params.id]);
    
    res.json({ message: 'Coner deleted successfully' });
  } catch (error) {
    console.error('Delete coner error:', error);
    res.status(500).json({ message: 'Failed to delete coner' });
  }
});

// FOLDER ROUTES
// GET /api/coners/folders - Get all folders
router.get('/folders', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, name, parent_id, client_id, created_at, updated_at
      FROM coner_folders 
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;
    const [folders] = await getDb().promise().query(query);
    res.json({ success: true, data: folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch folders' });
  }
});

// POST /api/coners/folders - Create new folder
router.post('/folders', authenticateToken, async (req, res) => {
  try {
    console.log('🔵 [DEBUG] Create coner folder request:', req.body);
    console.log('🔵 [DEBUG] User from token:', req.user);
    
    const { name, parent_id, client_id } = req.body;
    
    if (!name) {
      console.log('❌ [DEBUG] Folder name missing');
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }
    
    const query = `
      INSERT INTO coner_folders (name, parent_id, client_id, created_by)
      VALUES (?, ?, ?, ?)
    `;
    console.log('🔵 [DEBUG] Executing query:', query);
    const [result] = await getDb().promise().query(query, [name, parent_id || null, client_id || null, req.user.id]);
    console.log('🔵 [DEBUG] Coner folder created with ID:', result.insertId);
    
    res.json({ 
      success: true, 
      message: 'Coner folder created successfully',
      data: { id: result.insertId, name, parent_id, client_id }
    });
  } catch (error) {
    console.error('❌ [DEBUG] Error creating coner folder:', error);
    console.error('❌ [DEBUG] Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to create coner folder: ' + error.message });
  }
});

// GET /api/coners/folder/:id - Get coners in folder
router.get('/folder/:id', authenticateToken, async (req, res) => {
  try {
    const folderId = req.params.id;
    
    // Get folder details
    const [folders] = await getDb().promise().query('SELECT id, name, parent_id FROM coner_folders WHERE id = ? AND deleted_at IS NULL', [folderId]);
    if (folders.length === 0) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    
    // Get coners in folder
    const [coners] = await getDb().promise().query(`
      SELECT id, name, description, type, file_path, file_size, created_at, updated_at, created_by
      FROM coners 
      WHERE folder_id = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
    `, [folderId]);
    
    // Get child folders
    const [childFolders] = await getDb().promise().query(`
      SELECT id, name, parent_id, created_at
      FROM coner_folders 
      WHERE parent_id = ? AND deleted_at IS NULL
      ORDER BY name ASC
    `, [folderId]);
    
    res.json({ 
      success: true, 
      data: {
        folder: folders[0],
        coners: coners,
        folders: childFolders
      }
    });
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch folder contents' });
  }
});

// PUT /api/coners/folders/:id - Update folder
router.put('/folders/:id', authenticateToken, async (req, res) => {
  try {
    const folderId = req.params.id;
    const { name, parent_id } = req.body;
    
    const query = 'UPDATE coner_folders SET name = ?, parent_id = ?, updated_at = NOW() WHERE id = ?';
    await getDb().promise().query(query, [name, parent_id || null, folderId]);
    
    res.json({ success: true, message: 'Coner folder updated successfully' });
  } catch (error) {
    console.error('Error updating coner folder:', error);
    res.status(500).json({ success: false, message: 'Failed to update coner folder' });
  }
});

// DELETE /api/coners/folders/:id - Soft delete folder
router.delete('/folders/:id', authenticateToken, async (req, res) => {
  try {
    const folderId = req.params.id;
    
    const query = 'UPDATE coner_folders SET deleted_at = NOW() WHERE id = ?';
    await getDb().promise().query(query, [folderId]);
    
    res.json({ success: true, message: 'Coner folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting coner folder:', error);
    res.status(500).json({ success: false, message: 'Failed to delete coner folder' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(400).json({ message: error.message || 'File upload error' });
});

module.exports = router;
