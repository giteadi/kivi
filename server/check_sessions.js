const mysql = require('mysql2/promise');

async function checkSessions() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'kivi'
    });
    
    console.log('=== Recent Sessions ===');
    const [sessions] = await connection.execute('SELECT * FROM kivi_sessions ORDER BY created_at DESC LIMIT 5');
    console.log(JSON.stringify(sessions, null, 2));
    
    console.log('\n=== Student Records for User 4 ===');
    const [students] = await connection.execute('SELECT * FROM kivi_students WHERE user_id = 4');
    console.log(JSON.stringify(students, null, 2));
    
    console.log('\n=== User 4 Sessions ===');
    const [userSessions] = await connection.execute(`
      SELECT
        s.id,
        s.session_id,
        s.session_date,
        s.session_time,
        s.status,
        s.notes,
        s.student_id,
        CONCAT(u.first_name, ' ', u.last_name) as therapist_name,
        c.name as centre_name,
        p.name as programme_name
      FROM kivi_sessions s
      LEFT JOIN kivi_therapists th ON s.therapist_id = th.id
      LEFT JOIN kivi_users u ON th.user_id = u.id
      LEFT JOIN kivi_centres c ON s.centre_id = c.id
      LEFT JOIN kivi_programmes p ON s.programme_id = p.id
      WHERE s.student_id IN (SELECT id FROM kivi_students WHERE user_id = 4)
      ORDER BY s.session_date DESC, s.session_time DESC
      LIMIT 10
    `);
    console.log(JSON.stringify(userSessions, null, 2));
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSessions();
