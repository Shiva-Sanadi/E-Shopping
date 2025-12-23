const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


const admin = (req, res, next) => {
  if (req.user?.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};



module.exports = { protect, admin };