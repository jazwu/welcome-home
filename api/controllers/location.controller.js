import db from "../db.js";

export const getRooms = async (req, res, next) => {
  db.query("SELECT DISTINCT roomNum FROM Location", (error, results) => {
    if (error) {
      return next(error);
    }
    results = results.map((result) => result.roomNum);
    res.status(200).json(results);
  });
};

export const getShelves = async (req, res, next) => {
  const roomNum = req.params.roomNum;
  db.query(
    "SELECT * FROM Location WHERE roomNum = ?",
    [roomNum],
    (error, results) => {
      if (error) {
        return next(error);
      }
      results = results.map((result) => result.shelfNum);
      res.status(200).json(results);
    }
  );
};
