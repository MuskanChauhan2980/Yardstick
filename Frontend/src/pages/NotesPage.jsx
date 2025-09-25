 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NotesPage.css';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/api/notes');
      setNotes(response.data || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create or update a note
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await axios.put(`/api/notes/${editingNote.id}`, {
          content: noteContent,
          title: noteTitle,
        });
        setEditingNote(null);
      } else {
        await axios.post('/api/notes', {
          content: noteContent,
          title: noteTitle,
        });
      }
      setNoteContent('');
      setNoteTitle('');
      fetchNotes();
    } catch (err) {
      alert('Failed to save note. Maybe plan limit reached.');
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
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
    setNoteContent('');
    setNoteTitle('');
  };

  if (loading) {
    return (
      <div className="notes-container">
        <h2>Loading Notes...</h2>
      </div>
    );
  }

  return (
    <div className="notes-container">
      {/* ✅ Navbar */}
      <div className="navbar">
        <h1 className="logo">NotesApp</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')} className="login-btn">Login</button>
          <button className="upgrade-btn">Upgrade to Pro</button>
        </div>
      </div>

      <h2>Your Notes</h2>

      {/* Form */}
      <div className="note-card">
        <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
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
              {editingNote ? 'Update Note' : 'Create Note'}
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

      {/* Notes Table */}
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
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  No notes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotesPage;
