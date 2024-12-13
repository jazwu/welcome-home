import db from "../db.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

export const logout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUser = (req, res, next) => {
  const id = req.params.id;

  db.query(
    "SELECT userName, fname, lname, email, roleID FROM Person NATURAL JOIN Act WHERE userName = ?",
    [id],
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const newResults = {
        userName: results[0].userName,
        fname: results[0].fname,
        lname: results[0].lname,
        email: results[0].email,
        roles: results.map((result) => result.roleID),
      };
      res.status(200).json(newResults);
    }
  );
};

export const addRole = (req, res, next) => {
  const { userName, roleID } = req.params;

  db.query(
    "INSERT INTO Act (userName, roleID) VALUES (?, ?)",
    [userName, roleID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Role added successfully" });
    }
  );
};
