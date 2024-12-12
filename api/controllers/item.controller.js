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
  const { category, sub: subcategory, limit = 10, offset = 0 } = req.query;

  let query = "SELECT * FROM Item";
  let queryParams = [];

  if (category && category.length > 0 && category !== "All") {
    query += " WHERE mainCategory = ?";
    queryParams.push(category);
  }

  if (subcategory && subcategory.length > 0) {
    query += category && category.length > 0 ? " AND" : " WHERE";
    query += " subCategory = ?";
    queryParams.push(subcategory);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(parseInt(limit), parseInt(offset));

  db.query(query, queryParams, (error, results) => {
    if (error) {
      return next(error);
    }
    res.status(200).json({ items: results, total: results.length });
  });
};

export const createItem = (req, res, next) => {
  const {
    iDescription,
    photo,
    color,
    isNew,
    material,
    mainCategory,
    subCategory,
  } = req.body.item;
  const { donor, donateDate } = req.body.donation;
  const pieces = req.body.pieces;

  db.query(
    "INSERT INTO Item (iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      iDescription,
      photo,
      color,
      isNew,
      hasPieces,
      material,
      mainCategory,
      subCategory,
    ],
    (error, results) => {
      if (error) {
        return next(error);
      }
      db.query(
        "INSERT INTO DonatedBy (ItemID, userName, donateDate) VALUES (?, ?, ?)",
        [results.insertId, donor, donateDate],
        (error) => {
          if (error) {
            return next(error);
          }
        }
      );
      pieces.forEach((piece) => {
        db.query(
          "INSERT INTO Piece (ItemID, pieceNum, pDescription, length, width, height, roomNum, selfNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            results.insertId,
            piece.pieceNum,
            piece.pDescription,
            piece.length,
            piece.width,
            piece.height,
            piece.roomNum,
            piece.selfNum,
          ],
          (error) => {
            if (error) {
              return next(error);
            }
          }
        );
      });
      res.status(201).json({ message: "Item created" });
    }
  );
};
