import db from "../db.js";
import { errorHandler } from "../utils/errorHandler.js";
import { getPieces as getPiecesPromise } from "../utils/promise.js";

export const getPieces = async (req, res, next) => {
  const itemId = req.params.id;
  db.query(
    "SELECT * FROM Piece WHERE ItemID = ?",
    [itemId],
    (error, results) => {
      if (error) {
        return next(error);
      }
      res.status(200).json({ pieces: results, total: results.length });
    }
  );
};

export const getItems = (req, res, next) => {
  const { category, sub: subcategory, limit = 10, offset = 0 } = req.query;

  let query =
    "SELECT Item.ItemID, iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory FROM Item LEFT JOIN ItemIn ON Item.ItemID = ItemIn.ItemID WHERE ItemIn.orderID IS NULL ";
  let queryParams = [];

  if (category) {
    query += "AND mainCategory = ?";
    queryParams.push(category);
  }

  if (category && subcategory) {
    query += "AND subCategory = ?";
    queryParams.push(subcategory);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(parseInt(limit), parseInt(offset));

  db.query(query, queryParams, (error, results) => {
    if (error) {
      return next(error);
    }
    console.log(results);
    res.status(200).json({ items: results, total: results.length });
  });
};

export const createItem = (req, res, next) => {
  if (req.user && !req.user.roles.includes("staff")) {
    return next(errorHandler("Unauthorized", 401));
  }

  const {
    iDescription,
    photo,
    color,
    isNew,
    material,
    mainCategory,
    subCategory,
    donor,
    donateDate,
  } = req.body;

  db.query(
    "INSERT INTO Item (iDescription, photo, color, isNew, material, mainCategory, subCategory) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [iDescription, photo, color, isNew, material, mainCategory, subCategory],
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
          res.status(201).json({
            ItemID: results.insertId,
            iDescription,
            mainCategory,
            subCategory,
          });
        }
      );
    }
  );
};

export const createPiece = (req, res, next) => {
  if (req.user && !req.user.roles.includes("staff")) {
    return next(errorHandler("Unauthorized", 401));
  }

  const ItemID = req.params.ItemID;
  const { pieceNum, pDescription, length, width, height, roomNum, shelfNum } =
    req.body;

  db.query(
    "INSERT INTO Piece (ItemID, pieceNum, pDescription, length, width, height, roomNum, shelfNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [ItemID, pieceNum, pDescription, length, width, height, roomNum, shelfNum],
    (error) => {
      if (error) {
        return next(error);
      }
      res.status(201).json({ message: `Piece created for Item #${ItemID}` });
    }
  );
};

export const getAllItems = (req, res, next) => {
  db.query("SELECT * FROM Item", async (error, results) => {
    if (error) {
      return next(error);
    }
    const itemsWithPieces = await Promise.all(
      results.map(async (item) => {
        const pieces = await getPiecesPromise(item.ItemID);
        item.pieces = pieces;
        return item;
      })
    );
    res.status(200).json(itemsWithPieces);
  });
};
