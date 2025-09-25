
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getNotes = async (req, res) => {
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



const postNotes = async (req, res) => {
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

const getNotesById = async (req, res) => {
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

  if (!id) return res.status(400).json({ message: "Note ID is required" });

  try {
    // 1️⃣ Find the note first
    const note = await prisma.note.findUnique({
      where: { id }, // string id
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // 2️⃣ Check tenant authorization
    if (note.tenantId !== req.user.tenantId) {
      return res.status(403).json({ message: "Not authorized to update this note" });
    }

    // 3️⃣ Update the note
    const updatedNote = await prisma.note.update({
      where: { id }, // only the unique id
      data: { title, content },
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



const deleteNoteById = async (req, res) => {
  const { id } = req.params; // id comes as string from URL

  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  try {
  
    const note = await prisma.note.findUnique({
      where: { id }, // keep it as string
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
 
    if (note.tenantId !== req.user.tenantId) {
      return res.status(403).json({ message: "Not authorized to delete this note" });
    }

   
    await prisma.note.delete({
      where: { id },
    });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
  getNotes,
  postNotes,
  getNotesById,
  updateNotesById,
  deleteNoteById
}