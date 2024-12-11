import db from "../db.js";

export const getMainCategories = (req, res, next) => {
  db.query("SELECT DISTINCT mainCategory FROM Category", (error, results) => {
    if (error) {
      return next(error);
    }
    results = results.map((result) => result.mainCategory);
    res.status(200).json(results);
  });
};

export const getSubCategories = (req, res, next) => {
  const mainCat = req.params.mainCat;
  db.query(
    "SELECT * FROM Category WHERE mainCategory = ?",
    [mainCat],
    (error, results) => {
      if (error) {
        return next(error);
      }
      results = results.map((result) => result.subCategory);
      res.status(200).json(results);
    }
  );
};
