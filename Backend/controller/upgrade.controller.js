require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const upgradeFeature = async (req, res) => {
  const { slug } = req.params;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    if (tenant.id !== req.user.tenantId) {
      return res.status(403).json({ message: "You can only upgrade your own tenant." });
    }

    if (tenant.plan === "pro") {
      return res.status(400).json({ message: "Tenant is already on a Pro plan." });
    }

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { plan: "pro" },
    });

    res.status(200).json({ message: "Subscription upgraded to Pro." });
  } catch (error) {
    console.error("Error upgrading tenant:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports={upgradeFeature}