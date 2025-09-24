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
      setUserRole(response.data.role); // Assuming your backend sends back this info
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      // Optional: Handle token expiration
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
      const tenantSlug = 'acme'; // Or 'globex' based on logged-in user's tenant
      await axios.post(`/api/tenants/${tenantSlug}/upgrade`);
      setIsPro(true);
      alert('Subscription upgraded to Pro!');
    } catch (err) {
      alert('Only admins can upgrade the subscription.');
    }
  };

  return (
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
  );
}

export default NotesPage;