import db from "../db.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = (req, res, next) => {
  const { username, password, fname, lname, email, role } = req.body;

  if (!username || !password || !fname || !lname || !email) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!role) {
    return next(errorHandler(400, "Role is required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  db.query(
    "INSERT INTO Person (userName, password, fname, lname, email) VALUES (?, ?, ?, ?, ?)",
    [username, hashedPassword, fname, lname, email],
    (error) => {
      if (error) {
        return next(errorHandler(500, error.message));
      }
      db.query(
        "INSERT INTO Act (userName, roleID) VALUES (?, ?)",
        [username, role],
        (error) => {
          if (error) {
            return next(errorHandler(500, error.message));
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
    return next(errorHandler(400, "All fields are required"));
  }

  db.query(
    "SELECT * FROM Person WHERE userName = ?",
    [username],
    (error, results) => {
      if (error) {
        return next(errorHandler(500, error.message));
      }

      if (results.length === 0) {
        return next(errorHandler(404, "User not found"));
      }

      const user = results[0];

      if (!bcryptjs.compareSync(password, user.password)) {
        return next(errorHandler(400, "Invalid password"));
      }

      db.query(
        "SELECT * FROM Act WHERE userName = ?",
        [username],
        (error, results) => {
          if (error) {
            return next(errorHandler(500, error.message));
          }

          const user = results[0];
          const roles = results.map((result) => result.roleID);

          const token = jwt.sign(
            { username: user.userName, roles: roles },
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
            .json({ user: { username: user.userName, roles: roles } });
        }
      );
    }
  );
};
