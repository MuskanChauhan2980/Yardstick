import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data.notes);
      setIsPro(response.data.isPro);
      setUserRole(response.data.role);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notes', { content: newNote });
      setNewNote('');
      fetchNotes();
    } catch (err) {
      alert('Failed to create note. Note limit reached for Free plan.');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote(note.content);
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/notes/${editingNote.id}`, { content: newNote });
      setNewNote('');
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleUpgrade = async () => {
    try {
      const tenantSlug = 'acme';
      await axios.post(`/api/tenants/${tenantSlug}/upgrade`);
      setIsPro(true);
      alert('Subscription upgraded to Pro!');
    } catch (err) {
      alert('Only admins can upgrade the subscription.');
    }
  };

  return (
    <>
      <style>{`
        body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #eef2f7, #ffffff);
  margin: 0;
  color: #2c3e50;
}

.notes-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: 0.3s;
}

.notes-container h2 {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 1.8rem;
  color: #2575fc;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.upgrade-message {
  background: #fff8eb;
  border-left: 6px solid #ff9800;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  margin-bottom: 1.8rem;
  text-align: center;
  font-size: 1rem;
  color: #704214;
}

.upgrade-message button {
  margin-top: 0.7rem;
  background: #ff9800;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
}

.upgrade-message button:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

form {
  margin-bottom: 2rem;
}

textarea {
  width: 100%;
  padding: 14px;
  border: 1.5px solid #dcdfe3;
  border-radius: 14px;
  font-size: 1rem;
  resize: none;
  min-height: 120px;
  margin-bottom: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background: #f9fafc;
}

textarea:focus {
  border-color: #2575fc;
  background: #fff;
  box-shadow: 0 0 8px rgba(37,117,252,0.25);
}

form button {
  width: 100%;
  background: linear-gradient(135deg, #2575fc, #4a90e2);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

form button:hover {
  background: linear-gradient(135deg, #1b5ed9, #357ae8);
  transform: translateY(-2px);
}

.notes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.note-item {
  background: #fdfdfd;
  padding: 1.2rem;
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.note-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.note-item p {
  color: #333;
  flex: 1;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  line-height: 1.5;
}

.note-actions {
  display: flex;
  gap: 0.6rem;
}

.note-actions button {
  flex: 1;
  padding: 8px;
  font-size: 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s ease;
}

.note-actions button:nth-child(1) {
  background: #f39c12;
  color: #fff;
}
.note-actions button:nth-child(1):hover {
  background: #e67e22;
}

.note-actions button:nth-child(2) {
  background: #e74c3c;
  color: #fff;
}
.note-actions button:nth-child(2):hover {
  background: #c0392b;
}

@media (max-width: 600px) {
  .notes-container {
    padding: 1.5rem;
  }
  .notes-container h2 {
    font-size: 1.7rem;
  }
  form button {
    font-size: 0.95rem;
  }
}
      `}</style>

      <div className="notes-container">
        <h2>Your Notes</h2>

        {!isPro && notes.length >= 3 && (
          <div className="upgrade-message">
            <p>You have reached your note limit.</p>
            {userRole === 'Admin' && (
              <button onClick={handleUpgrade}>Upgrade to Pro</button>
            )}
          </div>
        )}

        <form onSubmit={editingNote ? handleUpdateNote : handleCreateNote}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
            disabled={!isPro && notes.length >= 3}
            required
          ></textarea>
          <button type="submit">
            {editingNote ? 'Update Note' : 'Create Note'}
          </button>
        </form>

        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <p>{note.content}</p>
              <div className="note-actions">
                <button onClick={() => handleEditNote(note)}>Edit</button>
                <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default NotesPage;