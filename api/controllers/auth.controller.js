import db from "../db.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";

export const signup = (req, res, next) => {
  const { username, password, fname, lname, email } = req.body;

  if (!username || !password || !fname || !lname || !email) {
    next(errorHandler({ statusCode: 400, message: "All fields are required" }));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  db.query(
    "INSERT INTO Person (userName, password, fname, lname, email) VALUES (?, ?, ?, ?, ?)",
    [username, hashedPassword, fname, lname, email],
    (error) => {
      if (error) {
        next(errorHandler({ statusCode: 500, message: error.message }));
      }
      res.status(201).json({ message: "User added" });
    }
  );
};
