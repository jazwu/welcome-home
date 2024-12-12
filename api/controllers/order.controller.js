import db from "../db.js";

export const getOrder = async (req, res, next) => {
  const orderId = req.params.id;

  const getOrderItems = (orderId) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT ItemID, orderID, orderDate, supervisor, client FROM Ordered NATURAL JOIN ItemIn WHERE orderID = ?",
        [orderId],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
  };

  const getPieces = (itemId) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Piece WHERE ItemID = ?",
        [itemId],
        (error, pieces) => {
          if (error) {
            reject(error);
          }
          resolve(pieces);
        }
      );
    });
  };

  try {
    const items = await getOrderItems(orderId);
    const itemsWithPieces = await Promise.all(
      items.map(async (item) => {
        const pieces = await getPieces(item.ItemID);
        item.pieces = pieces;
        return item;
      })
    );

    return res.status(200).json(itemsWithPieces);
  } catch (error) {
    return next(error);
  }
};

export const createOrder = async (req, res, next) => {
  if (req.user && req.user.role !== "staff") {
    return next(errorHandler("Unauthorized", 401));
  }

  const { orderDate, supervisorID, clientID, items } = req.body;

  db.query(
    "INSERT INTO Ordered (orderDate, supervisor, client) VALUES (?, ?, ?)",
    [orderDate, supervisorID, clientID],
    (error, results) => {
      if (error) {
        return next(error);
      }
      items.forEach((item) => {
        db.query(
          "INSERT INTO ItemIn (orderID, ItemID) VALUES (?, ?)",
          [results.insertId, item.ItemID],
          (error, results) => {
            if (error) {
              return next(error);
            }
          }
        );
      });
      return res.status(201).json({ message: "Order created" });
    }
  );
};
