 const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware.controller.js/usermiddleware");
const {
    getNotes,
    getNotesById,
    postNotes,
    updateNotesById,
    deleteNoteById,
} = require("../controller/notes.controller");

 
router.get("/notes", authenticate, getNotes);
router.post("/notes", authenticate, postNotes);
router.get("/notes/:id", authenticate, getNotesById);
router.put("/notes/:id", authenticate, updateNotesById);
router.delete("/notes/:id", authenticate, deleteNoteById);

module.exports = router;