export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

export const logout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
