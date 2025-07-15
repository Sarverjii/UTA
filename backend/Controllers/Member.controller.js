const MemberServices = require("../Services/Members.service");
const { authenticateDB } = require("../MiddleWare/authMiddleware"); // Import the new middleware

const register = async (req, res) => {
  try {
    const reply = await MemberServices.Register(req.body);
    res.status(200).json(reply);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { type, identifier, password } = req.body;

    const result = await MemberServices.Login({ type, identifier, password });

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "Lax",
    });
    return res.status(200).json({
      success: result.success,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("Error in loginController:", error);
    const statusCode = error.statusCode || 500;
    const errorMessage =
      error.message || "An unexpected error occurred during login.";

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const userDetails = req.user;

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      user: userDetails,
    });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user details.",
    });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ success: false, message: "Logout failed." });
  }
};

module.exports = { register, login, logout, getMe };
