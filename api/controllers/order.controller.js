import db from "../db.js";
import { errorHandler } from "../utils/errorHandler.js";
import { getOrderItems, getItemDetails, getPieces } from "../utils/promise.js";

export const getOrder = async (req, res, next) => {
  const orderId = req.params.id;

  try {
    const order = await getOrderItems(orderId);
    const items = order.items;

    let itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        try {
          const itemDetails = await getItemDetails(item.ItemID);
          return itemDetails;
        } catch (error) {
          return null;
        }
      })
    );
    itemsWithDetails = itemsWithDetails.filter((item) => item !== null);

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

export const getOrders = async (req, res, next) => {
  db.query(`SELECT * FROM Ordered`, (error, results) => {
    if (error) {
      return next(error);
    }

    return res.status(200).json(results);
  });
};

export const createOrder = async (req, res, next) => {
  if (req.user && !req.user.roles.includes("staff")) {
    return next(errorHandler({ message: "Unauthorized", statusCode: 401 }));
  }

  const { supervisor, client, orderDate } = req.body;
  db.query(
    "INSERT INTO Ordered (supervisor, client, orderDate) VALUES (?, ?, ?)",
    [supervisor, client, orderDate],
    (error, results) => {
      if (error) {
        return next(error);
      }

      return res.status(201).json({ orderID: results.insertId });
    }
  );
};

export const addItems = async (req, res, next) => {
  if (req.user && !req.user.roles.includes("staff")) {
    return next(errorHandler({ message: "Unauthorized", statusCode: 401 }));
  }

  const orderID = req.params.orderID;
  const ItemID = req.body.ItemID;
  db.query(
    "INSERT INTO ItemIn (orderID, ItemID) VALUES (?, ?)",
    [orderID, ItemID],
    (error, results) => {
      if (error) {
        return next(error);
      }

      return res.status(201).json({ message: "Item added to order" });
    }
  );
};
