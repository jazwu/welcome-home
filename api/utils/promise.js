import db from "../db.js";
import { errorHandler } from "./errorHandler.js";

export const getOrderItems = (orderId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ItemID, Ordered.orderID, orderDate, supervisor, client FROM Ordered LEFT JOIN ItemIn ON Ordered.orderID = ItemIn.orderID WHERE Ordered.orderID = ?",
      [orderId],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        if (results.length === 0) {
          return reject(errorHandler(404, "Order not found"));
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
          return reject(error);
        }
        if (results.length === 0) {
          return reject(errorHandler(404, "Item not found"));
        }
        resolve(results[0]);
      }
    );
  });
};

export const getPieces = (itemId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ItemID, pieceNum, pDescription, length, width, height, roomNum, shelfNum FROM Piece WHERE ItemID = ?",
      [itemId],
      (error, pieces) => {
        if (error) {
          return reject(error);
        }
        if (pieces.length === 0) {
          return reject(errorHandler(404, "No pieces found for this item"));
        }
        resolve(pieces);
      }
    );
  });
};
