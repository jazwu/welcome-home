import db from "../db.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = (req, res, next) => {
  const { username, password, fname, lname, email, role } = req.body;

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
      db.query(
        "INSERT INTO Act (userName, roleID) VALUES (?, ?)",
        [username, role],
        (error) => {
          if (error) {
            next(errorHandler({ statusCode: 500, message: error.message }));
          }
        }
      );
      res.status(201).json({ message: "User added" });
    }
  );
};

export const signin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next(errorHandler({ statusCode: 400, message: "All fields are required" }));
  }

  db.query(
    "SELECT * FROM Person WHERE userName = ?",
    [username],
    (error, results) => {
      if (error) {
        next(errorHandler({ statusCode: 500, message: error.message }));
      }

      if (results.length === 0) {
        next(errorHandler({ statusCode: 404, message: "User not found" }));
      }

      const user = results[0];

      if (!bcryptjs.compareSync(password, user.password)) {
        next(errorHandler({ statusCode: 400, message: "Invalid password" }));
      }

      db.query(
        "SELECT * FROM Act WHERE userName = ?",
        [username],
        (error, results) => {
          if (error) {
            next(errorHandler({ statusCode: 500, message: error.message }));
          }

          const user = results[0];

          const token = jwt.sign(
            { username: user.userName, role: user.roleID },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );

          res
            .status(200)
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .json({ username: user.userName, role: user.roleID });
        }
      );
    }
  );
};
