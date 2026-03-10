const Encounter = require('../models/Encounter');

class EncounterController {
  constructor() {
    this.encounterModel = new Encounter();
  }

  // Get all encounters
  async getEncounters(req, res) {
    try {
      const filters = req.query;
      const encounters = await this.encounterModel.getEncounters(filters);

      res.json({
        success: true,
        data: encounters
      });
    } catch (error) {
      console.error('Get encounters error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single encounter
  async getEncounter(req, res) {
    try {
      const { id } = req.params;
      const encounter = await this.encounterModel.getEncounterWithDetails(id);

      if (!encounter) {
        return res.status(404).json({
          success: false,
          message: 'Encounter not found'
        });
      }

      res.json({
        success: true,
        data: encounter
      });
    } catch (error) {
      console.error('Get encounter error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Utility function to convert various date formats to MySQL DATE format
  convertToMySQLDate(dateInput) {
    if (!dateInput) return null;

    try {
      // If it's already a valid date string in YYYY-MM-DD format, return as is
      if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
      }

      // Convert to Date object
      const date = new Date(dateInput);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }

      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Date conversion error:', error, 'Input:', dateInput);
      throw new Error(`Invalid date format: ${dateInput}`);
    }
  }

  // Create encounter
  async createEncounter(req, res) {
    try {
      // Check if an encounter already exists for this session
      const existingEncounters = await this.encounterModel.getEncounters({
        sessionId: req.body.session_id
      });

      let encounterId;
      let isUpdate = false;

      if (existingEncounters && existingEncounters.length > 0) {
        // Update existing encounter instead of creating new one
        const existingEncounter = existingEncounters[0]; // Get the most recent one
        encounterId = existingEncounter.id;

        const updateData = {
          ...req.body,
          encounter_id: existingEncounter.encounter_id, // Keep the same encounter_id
          updated_at: new Date()
        };

        // Remove fields that shouldn't be updated
        delete updateData.created_at;
        delete updateData.session_id; // Don't change session association

        await this.encounterModel.update(encounterId, updateData);
        isUpdate = true;

        console.log('Updated existing encounter:', encounterId);
      } else {
        // Generate unique encounter ID for new encounter
        const generateEncounterId = () => {
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return `ENC${year}${month}${day}${random}`;
        };

        // Process the request body and convert date
        const processedData = { ...req.body };

        // Convert encounter_date to MySQL DATE format
        if (processedData.encounter_date) {
          processedData.encounter_date = this.convertToMySQLDate(processedData.encounter_date);
        }

        const encounterData = {
          encounter_id: generateEncounterId(),
          ...processedData,
          created_at: new Date(),
          updated_at: new Date()
        };

        console.log('Creating new encounter with data:', encounterData);

        encounterId = await this.encounterModel.create(encounterData);
      }

      res.status(isUpdate ? 200 : 201).json({
        success: true,
        data: { id: encounterId },
        message: isUpdate ? 'Encounter updated successfully' : 'Encounter created successfully'
      });
    } catch (error) {
      console.error('Create encounter error:', error);

      // Check if it's a date conversion error
      if (error.message.includes('Invalid date format')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid encounter date format. Please provide a valid date.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update encounter
  async updateEncounter(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.encounterModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Encounter not found'
        });
      }

      res.json({
        success: true,
        message: 'Encounter updated successfully'
      });
    } catch (error) {
      console.error('Update encounter error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete encounter
  async deleteEncounter(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.encounterModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Encounter not found'
        });
      }

      res.json({
        success: true,
        message: 'Encounter deleted successfully'
      });
    } catch (error) {
      console.error('Delete encounter error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = EncounterController;