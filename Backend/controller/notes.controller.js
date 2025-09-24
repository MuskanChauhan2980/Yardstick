
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


 const getNotes =  async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { tenantId: req.user.tenantId },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



 const postNotes =  async (req, res) => {
  const { title, content } = req.body;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.user.tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    if (tenant.plan === "free") {
      const noteCount = await prisma.note.count({
        where: { tenantId: req.user.tenantId },
      });
      if (noteCount >= 3) {
        return res.status(403).json({ message: "Free plan limit reached (3 notes)." });
      }
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        tenantId: req.user.tenantId,
        authorId: req.user.id,
      },
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getNotesById =  async (req, res) => {
  const { id } = req.params;

  try {
    const note = await prisma.note.findUnique({
      where: {
        id,
        tenantId: req.user.tenantId,
      },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const updateNotesById = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id,
        tenantId: req.user.tenantId,
      },
      data: { title, content },
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


const deleteNotesById =  async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.note.delete({
      where: {
        id,
        tenantId: req.user.tenantId,
      },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports={
    getNotes,
    postNotes,
    getNotesById,
    updateNotesById,
    deleteNotesById 
}