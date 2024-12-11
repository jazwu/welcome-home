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
      if (results.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(results);
    }
  );
};
