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
                   c.name as centre_name,
                   ka.assessment_name,
                   ka.price as assessment_price,
                   ka.payment_status,
                   ka.invoice_sent,
                   ka.package_name,
                   ka.tools
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            LEFT JOIN kivi_assessments ka ON ce.assessment_id = ka.id
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
                   c.name as centre_name,
                   ka.assessment_name,
                   ka.price as assessment_price,
                   ka.payment_status,
                   ka.invoice_sent,
                   ka.package_name,
                   ka.tools
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            LEFT JOIN kivi_assessments ka ON ce.assessment_id = ka.id
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
        db.query(query, params, (error, events) => {
            if (error) {
                console.error('Error fetching events by date:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch events for date',
                    error: error.message
                });
            }

            res.json({
                success: true,
                data: events
            });
        });
    } catch (error) {
        console.error('Error in getEventsByDate:', error);
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
        db.query(`
            SELECT ce.*, 
                   u.first_name as creator_first_name, 
                   u.last_name as creator_last_name,
                   c.name as centre_name,
                   ka.assessment_name,
                   ka.price as assessment_price,
                   ka.payment_status,
                   ka.invoice_sent,
                   ka.package_name,
                   ka.tools
            FROM calendar_events ce
            LEFT JOIN kivi_users u ON ce.created_by = u.id
            LEFT JOIN kivi_centres c ON ce.centre_id = c.id
            LEFT JOIN kivi_assessments ka ON ce.assessment_id = ka.id
            WHERE ce.id = ?
        `, [id], (error, events) => {
            if (error) {
                console.error('Error fetching event:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch event',
                    error: error.message
                });
            }

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
        });
    } catch (error) {
        console.error('Error in getEventById:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event',
            error: error.message
        });
    }
};

// Helper function to find student by name and link to assessment
const findAndLinkAssessment = async (db, clientName, eventId) => {
    if (!clientName || !eventId) return null;
    
    return new Promise((resolve, reject) => {
        // Find student by first_name or last_name matching client_name
        db.query(`
            SELECT s.id, s.first_name, s.last_name
            FROM kivi_students s
            WHERE s.first_name LIKE ? OR s.last_name LIKE ?
            LIMIT 1
        `, [`%${clientName}%`, `%${clientName}%`], (err, students) => {
            if (err) {
                console.error('Error finding student:', err);
                return resolve(null);
            }
            
            if (students.length === 0) {
                console.log('No student found for client:', clientName);
                return resolve(null);
            }
            
            const studentId = students[0].id;
            
            // Find latest assessment for this student
            db.query(`
                SELECT id FROM kivi_assessments
                WHERE student_id = ?
                ORDER BY created_at DESC
                LIMIT 1
            `, [studentId], (err2, assessments) => {
                if (err2 || assessments.length === 0) {
                    console.log('No assessment found for student:', studentId);
                    return resolve(null);
                }
                
                const assessmentId = assessments[0].id;
                
                // Link assessment to calendar event
                db.query(`
                    UPDATE calendar_events 
                    SET assessment_id = ?
                    WHERE id = ?
                `, [assessmentId, eventId], (err3) => {
                    if (err3) {
                        console.error('Error linking assessment:', err3);
                    } else {
                        console.log('✅ Linked assessment', assessmentId, 'to event', eventId);
                    }
                    resolve(assessmentId);
                });
            });
        });
    });
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
            centreId,
            assessmentId // Allow manual assessment linking
        } = req.body;

        // Validation
        if (!title || !eventDate) {
            return res.status(400).json({
                success: false,
                message: 'Title and event date are required'
            });
        }

        // For holiday/halfday events, ignore client_name, event_time, and duration
        const isHolidayEvent = eventType === 'holiday' || eventType === 'halfday';
        const finalClientName = isHolidayEvent ? null : (clientName || null);
        const finalEventTime = isHolidayEvent ? null : (eventTime || null);
        const finalDuration = isHolidayEvent ? null : (duration || 60);

        db.query(`
            INSERT INTO calendar_events 
            (title, client_name, event_date, event_time, duration_minutes, event_type, notes, created_by, centre_id, assessment_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title,
            finalClientName,
            eventDate,
            finalEventTime,
            finalDuration,
            eventType || 'assessment',
            notes || null,
            req.user ? req.user.id : null,
            centreId || (req.user ? req.user.centre_id : null),
            assessmentId || null
        ], async (error, result) => {
            if (error) {
                console.error('Error creating calendar event:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create event',
                    error: error.message
                });
            }

            const eventId = result.insertId;
            
            // Auto-link assessment if client name provided but no assessment_id
            if (finalClientName && !assessmentId) {
                await findAndLinkAssessment(db, finalClientName, eventId);
            }

            // Fetch the created event with assessment details
            db.query(`
                SELECT ce.*, 
                       u.first_name as creator_first_name, 
                       u.last_name as creator_last_name,
                       c.name as centre_name,
                       ka.assessment_name,
                       ka.price as assessment_price,
                       ka.payment_status,
                       ka.invoice_sent,
                       ka.package_name,
                       ka.tools
                FROM calendar_events ce
                LEFT JOIN kivi_users u ON ce.created_by = u.id
                LEFT JOIN kivi_centres c ON ce.centre_id = c.id
                LEFT JOIN kivi_assessments ka ON ce.assessment_id = ka.id
                WHERE ce.id = ?
            `, [eventId], (fetchError, events) => {
                if (fetchError) {
                    console.error('Error fetching created event:', fetchError);
                    return res.status(500).json({
                        success: false,
                        message: 'Event created but failed to fetch',
                        error: fetchError.message
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Event created successfully',
                    data: events[0]
                });
            });
        });
    } catch (error) {
        console.error('Error in createEvent:', error);
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
        db.query(
            'SELECT * FROM calendar_events WHERE id = ?',
            [id],
            (error, existingEvents) => {
                if (error) {
                    console.error('Error checking event existence:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to check event',
                        error: error.message
                    });
                }

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

                // For holiday/halfday events, ignore client_name, event_time, and duration
                const isHolidayEvent = eventType === 'holiday' || eventType === 'halfday';
                const finalClientName = isHolidayEvent ? null : clientName;
                const finalEventTime = isHolidayEvent ? null : eventTime;
                const finalDuration = isHolidayEvent ? null : duration;

                // Check if client_name changed and we need to auto-link assessment
                const oldClientName = existingEvents[0].client_name;
                const clientNameChanged = finalClientName && finalClientName !== oldClientName && !existingEvents[0].assessment_id;

                db.query(`
                    UPDATE calendar_events 
                    SET title = COALESCE(?, title),
                        client_name = ?,
                        event_date = COALESCE(?, event_date),
                        event_time = ?,
                        duration_minutes = ?,
                        event_type = COALESCE(?, event_type),
                        notes = COALESCE(?, notes),
                        status = COALESCE(?, status),
                        centre_id = COALESCE(?, centre_id)
                    WHERE id = ?
                `, [
                    title,
                    finalClientName,
                    eventDate,
                    finalEventTime,
                    finalDuration,
                    eventType,
                    notes,
                    status,
                    centreId,
                    id
                ], async (updateError, result) => {
                    if (updateError) {
                        console.error('Error updating calendar event:', updateError);
                        return res.status(500).json({
                            success: false,
                            message: 'Failed to update event',
                            error: updateError.message
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'No changes made'
                        });
                    }

                    // Auto-link assessment if client name changed
                    if (clientNameChanged) {
                        await findAndLinkAssessment(db, finalClientName, id);
                    }

                    // Fetch updated event with assessment details
                    db.query(`
                        SELECT ce.*, 
                               u.first_name as creator_first_name, 
                               u.last_name as creator_last_name,
                               c.name as centre_name,
                               ka.assessment_name,
                               ka.price as assessment_price,
                               ka.payment_status,
                               ka.invoice_sent,
                               ka.package_name,
                               ka.tools
                        FROM calendar_events ce
                        LEFT JOIN kivi_users u ON ce.created_by = u.id
                        LEFT JOIN kivi_centres c ON ce.centre_id = c.id
                        LEFT JOIN kivi_assessments ka ON ce.assessment_id = ka.id
                        WHERE ce.id = ?
                    `, [id], (fetchError, events) => {
                        if (fetchError) {
                            console.error('Error fetching updated event:', fetchError);
                            return res.status(500).json({
                                success: false,
                                message: 'Event updated but failed to fetch',
                                error: fetchError.message
                            });
                        }

                        res.json({
                            success: true,
                            message: 'Event updated successfully',
                            data: events[0]
                        });
                    });
                });
            }
        );
    } catch (error) {
        console.error('Error in updateEvent:', error);
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
        db.query(
            'SELECT * FROM calendar_events WHERE id = ?',
            [id],
            (error, existingEvents) => {
                if (error) {
                    console.error('Error checking event existence:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to check event',
                        error: error.message
                    });
                }

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

                db.query('DELETE FROM calendar_events WHERE id = ?', [id], (deleteError) => {
                    if (deleteError) {
                        console.error('Error deleting calendar event:', deleteError);
                        return res.status(500).json({
                            success: false,
                            message: 'Failed to delete event',
                            error: deleteError.message
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Event deleted successfully'
                    });
                });
            }
        );
    } catch (error) {
        console.error('Error in deleteEvent:', error);
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

// Get all assessments for a student with full details
exports.getStudentAssessments = async (req, res) => {
    try {
        const db = getDb();
        const { studentId } = req.params;
        
        console.log('🔍 [getStudentAssessments] Called for student:', studentId);
        
        if (!studentId) {
            console.log('❌ [getStudentAssessments] No studentId provided');
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }

        // Simple query - just get assessments from kivi_assessments table
        const query = `
            SELECT 
                id,
                assessment_name as title,
                assessment_type as type,
                scheduled_date as date,
                scheduled_time as time,
                duration,
                price as amount,
                discount,
                (price - (price * discount / 100)) as final_price,
                payment_status,
                invoice_sent,
                invoice_sent_date,
                status,
                notes,
                examiner_name as evaluator,
                room as location,
                package_id,
                package_name,
                tools
            FROM kivi_assessments
            WHERE student_id = ?
            ORDER BY created_at DESC
        `;

        console.log('📊 [getStudentAssessments] Executing query for student:', studentId);

        db.query(query, [studentId], (error, results) => {
            if (error) {
                console.error('❌ [getStudentAssessments] Database error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch student assessments',
                    error: error.message
                });
            }

            console.log(`✅ [getStudentAssessments] Found ${results.length} assessments for student ${studentId}`);
            
            if (results.length > 0) {
                console.log('📝 [getStudentAssessments] Sample assessment:', results[0]);
            }

            res.json({
                success: true,
                count: results.length,
                data: results
            });
        });
    } catch (error) {
        console.error('❌ [getStudentAssessments] Catch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student assessments',
            error: error.message
        });
    }
};
