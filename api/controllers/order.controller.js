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
