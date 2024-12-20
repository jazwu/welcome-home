import db, { query } from "../db.js";
import { errorHandler } from "../utils/errorHandler.js";

export const getOrderWithItems = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    const orderRows = await query(
      `SELECT Ordered.orderID, orderDate, supervisor, client, ItemIn.ItemID, iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory
       FROM Ordered LEFT JOIN ItemIn ON Ordered.orderID = ItemIn.orderID LEFT JOIN Item ON ItemIn.ItemID = Item.ItemID
       WHERE Ordered.orderID = ?`,
      [orderId]
    );
    if (orderRows.length === 0) {
      return next(errorHandler(404, "Order not found"));
    }
    const items = orderRows
      .map((result) => {
        if (!result.ItemID) {
          return null;
        }

        return {
          ItemID: result.ItemID,
          iDescription: result.iDescription,
          photo: result.photo,
          color: result.color,
          isNew: result.isNew,
          hasPieces: result.hasPieces,
          material: result.material,
          mainCategory: result.mainCategory,
          subCategory: result.subCategory,
        };
      })
      .filter((item) => item !== null);

    const orderWithItems = {
      orderID: orderRows[0].orderID,
      orderDate: orderRows[0].orderDate,
      supervisor: orderRows[0].supervisor,
      client: orderRows[0].client,
      items: items,
    };
    res.status(200).json(orderWithItems);
  } catch (error) {
    return next(error);
  }
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

      return res.status(201).json({ orderId: results.insertId });
    }
  );
};

export const addOneItem = async (req, res, next) => {
  if (req.user && !req.user.roles.includes("staff")) {
    return next(errorHandler({ message: "Unauthorized", statusCode: 401 }));
  }

  const orderId = req.params.orderId;
  const itemId = req.body.itemId;
  db.query(
    "INSERT INTO ItemIn (orderID, ItemID) VALUES (?, ?)",
    [orderId, itemId],
    (error, results) => {
      if (error) {
        return next(error);
      }

      return res.status(201).json({ message: "Item added to order" });
    }
  );
};
