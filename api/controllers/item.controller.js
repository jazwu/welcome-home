import db from "../db.js";

export const getPieces = (req, res, next) => {
  const itemId = req.params.id;
  db.query(
    "SELECT * FROM Piece WHERE ItemID = ?",
    [itemId],
    (error, results) => {
      if (error) {
        next(error);
      }
      res.status(200).json(results);
    }
  );
};
