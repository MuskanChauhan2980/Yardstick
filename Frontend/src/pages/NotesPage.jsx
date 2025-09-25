import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NotesPage.css";
 
function NotesPage() {
  const [user, setUser] = useState(null);

  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("/api/notes");
      setNotes(response.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

 

 


useEffect(() => {
  const initialize = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`);
      setUser(userRes.data.user);

      const notesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`);
      setNotes(notesRes.data || []);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  initialize();
}, []);



  // Create or update a note
  const handleSubmit = async (e) => {
  e.preventDefault();
  const newNote = { title: noteTitle, content: noteContent };
  setNotes(prev => editingNote 
    ? prev.map(n => n.id === editingNote.id ? { ...n, ...newNote } : n)
    : [...prev, { ...newNote, id: Date.now() }]); // temporary id
  setNoteContent("");
  setNoteTitle("");

  try {
    if (editingNote) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/${editingNote.id}`, newNote);
      setEditingNote(null);
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, newNote);
    }
  } catch (err) {
    alert("Failed to save. Refreshing...");
    fetchNotes(); // rollback
  }
};



  // Upgrade tenant plan
  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem("token");
      const tenantSlug = localStorage.getItem("tenantSlug"); // e.g. "acme" or "globex"

      if (!token || !tenantSlug) {
        alert("Missing token or tenant info. Please login again.");
        navigate("/login");
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tenants/${tenantSlug}/upgrade`);

      alert(response.data.message || "Upgraded successfully to Pro!");
      fetchNotes();
    } catch (err) {
      console.error("Failed to upgrade:", err);
      if (err.response) {
        alert(err.response.data.message || "Upgrade failed");
      } else {
        alert("Upgrade failed due to network error.");
      }
    }
  };

  // Delete note
 const handleDelete = async (id) => {
  setNotes(prev => prev.filter(note => note.id !== id)); // remove immediately
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`);
  } catch (err) {
    alert("Failed to delete. Refreshing...");
    fetchNotes(); // rollback
  }
};

  // Edit note
  const handleEdit = (note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setNoteTitle(note.title);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingNote(null);
    setNoteContent("");
    setNoteTitle("");
  };

  // The loading block is now a simple centered div
  if (loading) {
    return (
      <div className="notes-container">
        <h2>Loading Notes...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="navbar">
        <h1 className="logo">NotesApp</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
          {user && user.role === "admin" && (
            <button onClick={handleUpgrade} className="upgrade-btn">
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* The main content wrapper centers the notes-container */}
      <div className="main-content-wrapper">
        <div className="notes-container">
          <h2>Your Notes</h2>
          <div className="note-card">
            <h3>{editingNote ? "Edit Note" : "Create New Note"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title"
                className="note-title-input"
                required
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your note here..."
                required
              ></textarea>
              <div className="form-buttons">
                <button type="submit" className="create-btn">
                  {editingNote ? "Update Note" : "Create Note"}
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="notes-table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(notes || []).map((note) => (
                  <tr key={note.id}>
                    <td>{note.title}</td>
                    <td>{note.content}</td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleEdit(note)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {notes.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No notes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotesPage;
