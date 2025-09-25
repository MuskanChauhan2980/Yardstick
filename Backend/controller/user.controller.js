const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret";

// Login route
const loginDetails = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },  
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Create JWT with tenantSlug
    const token = jwt.sign(
      {
        id: user.id,
        tenantId: user.tenantId,
        tenantSlug: user.tenant.slug,  
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // 4. Respond with token
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
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

module.exports={loginDetails,healthCheck,getUserData}