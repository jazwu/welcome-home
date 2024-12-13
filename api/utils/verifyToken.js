import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error(error.message);
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
