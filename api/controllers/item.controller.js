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

export const getItems = (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const category = req.query.category;
  const subcategory = req.query.sub;

  db.query(
    `
    SELECT * 
    FROM Item 
    ${
      category && subcategory
        ? "WHERE mainCategory = ? AND subCategory = ?"
        : ""
    }
    LIMIT ? 
    OFFSET ?
    `,
    category && subcategory
      ? [category, subcategory, limit, offset]
      : [limit, offset],
    (error, results) => {
      if (error) {
        next(error);
      }
      res.status(200).json({ items: results, total: results.length });
    }
  );
};
