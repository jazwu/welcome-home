import db from "../db.js";

export const getOrderItems = (orderId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ItemID, orderID, orderDate, supervisor, client FROM Ordered NATURAL JOIN ItemIn WHERE orderID = ?",
      [orderId],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.length === 0) {
          reject(errorHandler("Order not found", 404));
        }
        const newResults = {
          orderID: results[0].orderID,
          orderDate: results[0].orderDate,
          supervisor: results[0].supervisor,
          client: results[0].client,
          items: results.map((result) => {
            return { ItemID: result.ItemID };
          }),
        };

        resolve(newResults);
      }
    );
  });
};

export const getItemDetails = (itemId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ItemID, iDescription, photo, color, isNew, material, mainCategory, subCategory FROM Item WHERE ItemID = ?",
      [itemId],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.length === 0) {
          reject(errorHandler("Item not found", 404));
        }
        resolve(results[0]);
      }
    );
  });
};

export const getPieces = (itemId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT pieceNum, pDescription, length, width, height, roomNum, shelfNum FROM Piece WHERE ItemID = ?",
      [itemId],
      (error, pieces) => {
        if (error) {
          reject(error);
        }
        if (pieces.length === 0) {
          reject(errorHandler("Pieces not found", 404));
        }
        resolve(pieces);
      }
    );
  });
};
