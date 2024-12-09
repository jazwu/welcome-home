import db from "../db.js";
import bcryptjs from "bcryptjs";

export const signup = (req, res) => {
  const { username, password, fname, lname, email } = req.body;

  if (!username || !password || !fname || !lname || !email) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  db.query(
    "INSERT INTO Person (userName, password, fname, lname, email) VALUES (?, ?, ?, ?, ?)",
    [username, hashedPassword, fname, lname, email],
    (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to insert user" });
      }
      res.status(201).json({ message: "User added" });
    }
  );
};
