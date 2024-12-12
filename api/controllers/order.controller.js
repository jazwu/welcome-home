import db from "../db.js";
import { errorHandler } from "../utils/errorHandler.js";
import { getOrderItems, getItemDetails, getPieces } from "../utils/promise.js";

export const getOrder = async (req, res, next) => {
  const orderId = req.params.id;

  try {
    const order = await getOrderItems(orderId);
    const items = order.items;
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const itemDetails = await getItemDetails(item.ItemID);
        return itemDetails;
      })
    );
    const itemsWithPieces = await Promise.all(
      itemsWithDetails.map(async (item) => {
        const pieces = await getPieces(item.ItemID);
        item.pieces = pieces;
        return item;
      })
    );
    order.items = itemsWithPieces;

    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

export const createOrder = async (req, res, next) => {
  if (req.user && req.user.role !== "staff") {
    return next(errorHandler({ message: "Unauthorized", statusCode: 401 }));
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
