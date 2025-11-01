export const auth = async (req, res, next) => {
  try {
    // Simple session check - if request has user data, allow it
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Please login to continue" });
    }

    req.user = {
      id: userId,
      // These will be set by the auth controller during login
      email: req.headers["x-user-email"],
      role: req.headers["x-user-role"],
    };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};
