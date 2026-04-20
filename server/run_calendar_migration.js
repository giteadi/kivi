const fs = require('fs');
const path = require('path');
const { getDb } = require('./database');

async function runMigration() {
    try {
        console.log('🔄 Running calendar event types migration...');
        
        const migrationPath = path.join(__dirname, 'migrations', 'add_holiday_event_types.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        const db = getDb();
        
        db.query(sql, (error, result) => {
            if (error) {
                console.error('❌ Migration failed:', error);
                process.exit(1);
            }
            
            console.log('✅ Migration completed successfully!');
            console.log('📋 Event types now include: assessment, therapy, evaluation, followup, meeting, ot_si, speech, behaviour, counselling, holiday, halfday');
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Error running migration:', error);
        process.exit(1);
    }
}

runMigration();
