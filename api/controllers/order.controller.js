import db from "../db.js";

export const getOrder = async (req, res, next) => {
  const orderId = req.params.id;

  db.query(
    "SELECT * FROM Ordered NATURAL JOIN ItemIn NATURAL JOIN Piece WHERE orderID = ?",
    [orderId],
    (error, results) => {
      if (error) {
        next(error);
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(results[0]);
    }
  );
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
