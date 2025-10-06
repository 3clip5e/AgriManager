     // test-db.js (CommonJS, sans TS)
     require('dotenv').config();
     const mysql = require('mysql2/promise');

     async function testDB() {
       try {
         const db = await mysql.createConnection({
           host: process.env.MYSQL_HOST || 'localhost',
           user: process.env.MYSQL_USER || 'root',
           password: process.env.MYSQL_PASSWORD || '',
           database: process.env.MYSQL_DATABASE || 'agricultural_app',
         });
         const [rows] = await db.execute('SELECT 1 as test');
         console.log('✅ DB OK:', rows[0]);
         await db.end();
       } catch (error) {
         console.error('❌ DB Error:', error.message);
       }
     }

     testDB();
     