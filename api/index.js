import express from "express";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 8889,
  database: "WelcomeHome",
});

connection.connect((err) => {
  if (err) {
    console.error("An error occurred while connecting to the DB");
    throw err;
  }
  console.log("Connected to the database");
});

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

connection.end();
