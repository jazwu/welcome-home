import db, { query, getConnection } from "../db.js";
import { errorHandler } from "../utils/errorHandler.js";
import util from "util";

export const getItemWithPieces = async (req, res, next) => {
  const itemId = req.params.itemId;

  try {
    const itemRows = await query(
      `SELECT Item.ItemID, iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory, pieceNum, pDescription, length, width, height, roomNum, shelfNum, pNotes
      FROM Item LEFT JOIN Piece ON Item.ItemID = Piece.ItemID
      WHERE Item.ItemID = ?`,
      [itemId]
    );

    if (itemRows.length === 0) {
      return next(errorHandler(404, "Item not found"));
    }

    const pieces = itemRows
      .map((item) => {
        if (!item.pieceNum) {
          return null;
        }
        return {
          pieceNum: item.pieceNum,
          pDescription: item.pDescription,
          length: item.length,
          width: item.width,
          height: item.height,
          roomNum: item.roomNum,
          shelfNum: item.shelfNum,
          pNotes: item.pNotes,
        };
      })
      .filter((piece) => piece !== null);

    const itemWithPieces = {
      ItemID: itemRows[0].ItemID,
      iDescription: itemRows[0].iDescription,
      photo: itemRows[0].photo,
      color: itemRows[0].color,
      isNew: itemRows[0].isNew,
      hasPieces: itemRows[0].hasPieces,
      material: itemRows[0].material,
      mainCategory: itemRows[0].mainCategory,
      subCategory: itemRows[0].subCategory,
      pieces,
    };

    res.status(200).json(itemWithPieces);
  } catch (error) {
    return next(error);
  }
};

export const getAllItems = async (req, res, next) => {
  try {
    const items = await query(
      `SELECT Item.ItemID, iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory, COUNT(pieceNum) AS pieceCount
     FROM Item LEFT JOIN Piece ON Item.ItemID = Piece.ItemID
     GROUP BY Item.ItemID`
    );
    res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
};

export const getAvailableItems = (req, res, next) => {
  const { category, sub: subcategory } = req.query;

  let query = `SELECT Item.ItemID, iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory 
     FROM Item LEFT JOIN ItemIn ON Item.ItemID = ItemIn.ItemID 
     WHERE ItemIn.orderID IS NULL `;
  let queryParams = [];

  if (category) {
    query += " AND mainCategory = ?";
    queryParams.push(category);
  }

  if (category && subcategory) {
    query += " AND subCategory = ?";
    queryParams.push(subcategory);
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      return next(error);
    }
    console.log(results);
    res.status(200).json(results);
  });
};

export const createItem = async (req, res, next) => {
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

  let connection;

  try {
    connection = await getConnection();
  } catch (error) {
    return next(error);
  }

  const beginTransaction = util
    .promisify(connection.beginTransaction)
    .bind(connection);
  const commit = util.promisify(connection.commit).bind(connection);
  const rollback = util.promisify(connection.rollback).bind(connection);

  try {
    await beginTransaction();
    const newItem = await query(
      "INSERT INTO Item (iDescription, photo, color, isNew, material, mainCategory, subCategory) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [iDescription, photo, color, isNew, material, mainCategory, subCategory]
    );
    await query(
      "INSERT INTO DonatedBy (ItemID, userName, donateDate) VALUES (?, ?, ?)",
      [newItem.insertId, donor, donateDate]
    );
    await commit();
    res.status(201).json({
      itemId: newItem.insertId,
      iDescription,
      mainCategory,
      subCategory,
    });
  } catch (error) {
    try {
      await rollback();
    } catch (rollbackError) {
      return next(rollbackError);
    }
    return next(error);
  } finally {
    connection.release();
  }
};

export const addPiece = (req, res, next) => {
  if (req.user && !req.user.roles.includes("staff")) {
    return next(errorHandler("Unauthorized", 401));
  }

  const itemId = req.params.itemId;
  const { pieceNum, pDescription, length, width, height, roomNum, shelfNum } =
    req.body;

  db.query(
    "INSERT INTO Piece (ItemID, pieceNum, pDescription, length, width, height, roomNum, shelfNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [itemId, pieceNum, pDescription, length, width, height, roomNum, shelfNum],
    (error) => {
      if (error) {
        return next(error);
      }
      res.status(201).json({ message: `Piece created for Item #${itemId}` });
    }
  );
};
