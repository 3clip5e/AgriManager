import mysql from "mysql2/promise"

const connectionConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD ||"",
  database: process.env.MYSQL_DATABASE || "agricultural_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const pool = mysql.createPool(connectionConfig)

export const db = pool 


export async function query(sql: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// export { pool as db }
 // si pool est ton objet MySQL
// export const query = (...args) => pool.query(...args)
