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

export const getRole = (req, res, next) => {
  const id = req.params.id;

  db.query("SELECT roleID FROM Act WHERE userName = ?", [id], (err, result) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json(result[0]);
    }
  });
};
