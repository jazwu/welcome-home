import db, { query, getConnection } from "../db.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import util from "util";

dotenv.config();

export const signup = async (req, res, next) => {
  const { username, password, fname, lname, email, role } = req.body;

  if (!username || !password || !fname || !lname || !email) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!role) {
    return next(errorHandler(400, "Role is required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  let connection;
  try {
    connection = await getConnection();
  } catch (error) {
    return next(error);
  }

  const beginTransation = util
    .promisify(connection.beginTransaction)
    .bind(connection);
  const commit = util.promisify(connection.commit).bind(connection);
  const rollback = util.promisify(connection.rollback).bind(connection);

  try {
    await beginTransation();
    await query(
      "INSERT INTO Person (userName, password, fname, lname, email) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, fname, lname, email]
    );
    await query("INSERT INTO Act (userName, roleID) VALUES (?, ?)", [
      username,
      role,
    ]);
    await commit();
    res.status(201).json({ message: "User added" });
  } catch (error) {
    try {
      await rollback();
    } catch (rollbackError) {
      return next(rollbackError);
    }
    return next(error);
  } finally {
    connection.release();
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const sqlQuery = `SELECT Person.userName, Person.password, Act.roleID 
      FROM Person LEFT JOIN Act ON Person.userName = Act.userName
      WHERE Person.userName = ?`;

  try {
    const userRoles = await query(sqlQuery, [username]);

    if (userRoles.length === 0) {
      return next(errorHandler(404, "User not found"));
    }

    const user = userRoles[0];

    if (!bcryptjs.compareSync(password, user.password)) {
      return next(errorHandler(400, "Invalid password"));
    }

    const roles = userRoles
      .map((result) => result.roleID)
      .filter((role) => role !== null);

    const token = jwt.sign(
      { username: user.userName, roles: roles },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ user: { username: user.userName, roles: roles } });
  } catch (error) {
    return next(error);
  }
};
