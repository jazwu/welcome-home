import mysql from "mysql";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  port: 8889,
  database: "WelcomeHome",
});

export default pool;
