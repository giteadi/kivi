const { getDb } = require('../database');

// Get all calendar events for a date range
exports.getEvents = async (req, res) => {
    try {
        console.log('📅 [Calendar] getEvents called');
        console.log('👤 [Calendar] req.user:', req.user);
        console.log('🔍 [Calendar] Query params:', req.query);
        
        const { startDate, endDate, centreId, eventType } = req.query;
        
        let query = `
            SELECT ce.*, 
                   u.first_name as creator_first_name, 
                   u.last_name as creator_last_name,
                   c.name as centre_name
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (startDate && endDate) {
            query += ` AND ce.event_date BETWEEN ? AND ?`;
            params.push(startDate, endDate);
        }

        if (centreId) {
            query += ` AND ce.centre_id = ?`;
            params.push(centreId);
        }

        if (eventType) {
            query += ` AND ce.event_type = ?`;
            params.push(eventType);
        }

        // If user is not admin, only show their events or events for their centre
        if (req.user && req.user.role !== 'admin') {
            query += ` AND (ce.created_by = ? OR ce.centre_id = ?)`;
            params.push(req.user.id, req.user.centre_id);
        }

        query += ` ORDER BY ce.event_date ASC, ce.event_time ASC`;

        const db = getDb();
        console.log('🗄️ [Calendar] Executing query...');
        
        // Use callback-style query
        db.query(query, params, (error, results) => {
            if (error) {
                console.error('❌ [Calendar] Error fetching calendar events:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch calendar events',
                    error: error.message
                });
            }
            
            console.log('✅ [Calendar] Found', results.length, 'events');
            res.json({
                success: true,
                data: results
            });
        });
    } catch (error) {
        console.error('❌ [Calendar] Error in getEvents:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch calendar events',
            error: error.message
        });
    }
};

// Get events for a specific date
exports.getEventsByDate = async (req, res) => {
    try {
        const { date } = req.params;
        
        let query = `
            SELECT ce.*, 
                   u.first_name as creator_first_name, 
                   u.last_name as creator_last_name,
                   c.name as centre_name
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            WHERE ce.event_date = ?
        `;
        const params = [date];

        // If user is not admin, only show their events
        if (req.user && req.user.role !== 'admin') {
            query += ` AND (ce.created_by = ? OR ce.centre_id = ?)`;
            params.push(req.user.id, req.user.centre_id);
        }

        query += ` ORDER BY ce.event_time ASC`;

        const db = getDb();
        const [events] = await db.query(query, params);

        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events by date:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events for date',
            error: error.message
        });
    }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const db = getDb();
        const [events] = await db.query(`
            SELECT ce.*, 
                   u.first_name as creator_first_name, 
                   u.last_name as creator_last_name,
                   c.name as centre_name
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            WHERE ce.id = ?
        `, [id]);

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: events[0]
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event',
            error: error.message
        });
    }
};

// Create new calendar event
exports.createEvent = async (req, res) => {
    try {
        const db = getDb();
        const {
            title,
            clientName,
            eventDate,
            eventTime,
            duration,
            eventType,
            notes,
            centreId
        } = req.body;

        // Validation
        if (!title || !eventDate) {
            return res.status(400).json({
                success: false,
                message: 'Title and event date are required'
            });
        }

        const [result] = await db.query(`
            INSERT INTO calendar_events 
            (title, client_name, event_date, event_time, duration_minutes, event_type, notes, created_by, centre_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title,
            clientName || null,
            eventDate,
            eventTime || null,
            duration || 60,
            eventType || 'assessment',
            notes || null,
            req.user ? req.user.id : null,
            centreId || (req.user ? req.user.centre_id : null)
        ]);

        // Fetch the created event
        const [events] = await db.query(`
            SELECT ce.*, 
                   u.first_name as creator_first_name, 
                   u.last_name as creator_last_name,
                   c.name as centre_name
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            WHERE ce.id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: events[0]
        });
    } catch (error) {
        console.error('Error creating calendar event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
};

// Update calendar event
exports.updateEvent = async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const {
            title,
            clientName,
            eventDate,
            eventTime,
            duration,
            eventType,
            notes,
            status,
            centreId
        } = req.body;

        // Check if event exists
        const [existingEvents] = await db.query(
            'SELECT * FROM calendar_events WHERE id = ?',
            [id]
        );

        if (existingEvents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check permission (only admin or creator can update)
        if (req.user && req.user.role !== 'admin' && existingEvents[0].created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this event'
            });
        }

        const [result] = await db.query(`
            UPDATE calendar_events 
            SET title = COALESCE(?, title),
                client_name = COALESCE(?, client_name),
                event_date = COALESCE(?, event_date),
                event_time = COALESCE(?, event_time),
                duration_minutes = COALESCE(?, duration_minutes),
                event_type = COALESCE(?, event_type),
                notes = COALESCE(?, notes),
                status = COALESCE(?, status),
                centre_id = COALESCE(?, centre_id)
            WHERE id = ?
        `, [
            title,
            clientName,
            eventDate,
            eventTime,
            duration,
            eventType,
            notes,
            status,
            centreId,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'No changes made'
            });
        }

        // Fetch updated event
        const [events] = await db.query(`
            SELECT ce.*, 
                   u.first_name as creator_first_name, 
                   u.last_name as creator_last_name,
                   c.name as centre_name
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            WHERE ce.id = ?
        `, [id]);

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: events[0]
        });
    } catch (error) {
        console.error('Error updating calendar event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: error.message
        });
    }
};

// Delete calendar event
exports.deleteEvent = async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;

        // Check if event exists
        const [existingEvents] = await db.query(
            'SELECT * FROM calendar_events WHERE id = ?',
            [id]
        );

        if (existingEvents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check permission (only admin or creator can delete)
        if (req.user && req.user.role !== 'admin' && existingEvents[0].created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this event'
            });
        }

        const [result] = await db.query('DELETE FROM calendar_events WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message
        });
    }
};

// Get events statistics
exports.getEventStats = async (req, res) => {
    try {
        const db = getDb();
        const { startDate, endDate } = req.query;

        let query = `
            SELECT 
                COUNT(*) as total_events,
                SUM(CASE WHEN event_type = 'assessment' THEN 1 ELSE 0 END) as assessments,
                SUM(CASE WHEN event_type = 'therapy' THEN 1 ELSE 0 END) as therapies,
                SUM(CASE WHEN event_type = 'evaluation' THEN 1 ELSE 0 END) as evaluations,
                SUM(CASE WHEN event_type = 'followup' THEN 1 ELSE 0 END) as followups,
                SUM(CASE WHEN event_type = 'meeting' THEN 1 ELSE 0 END) as meetings
            FROM calendar_events
            WHERE 1=1
        `;
        const params = [];

        if (startDate && endDate) {
            query += ` AND event_date BETWEEN ? AND ?`;
            params.push(startDate, endDate);
        }

        // If user is not admin, only show their events
        if (req.user && req.user.role !== 'admin') {
            query += ` AND (created_by = ? OR centre_id = ?)`;
            params.push(req.user.id, req.user.centre_id);
        }

        const [rows] = await db.query(query, params);

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching event stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event statistics',
            error: error.message
        });
    }
};
