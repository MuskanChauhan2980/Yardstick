require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
 

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret";



 const loginDetails =  async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        tenantId: user.tenantId,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


//get user Details request
const getUserData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

 const healthCheck =  (req, res) => {
  res.status(200).json({ status: "ok" });
};

module.exports={loginDetails,healthCheck}