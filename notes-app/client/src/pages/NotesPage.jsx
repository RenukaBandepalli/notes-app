import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import useDebounce from '../hooks/useDebounce';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 400);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const loadNotes = useCallback(async () => {
    try {
      const { data } = await api.get('/notes', { params: { search: debouncedSearch, tag } });
      setNotes(data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) logout();
      else setError('Could not load notes');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, tag, logout]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSave = async (payload) => {
    if (editingNote) {
      await api.put(`/notes/${editingNote._id}`, payload);
      setEditingNote(null);
    } else {
      await api.post('/notes', payload);
    }
    loadNotes();
  };

  const handleTogglePin = async (note) => {
    await api.put(`/notes/${note._id}`, {
      title: note.title,
      content: note.content,
      tags: note.tags,
      pinned: !note.pinned,
    });
    loadNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    if (editingNote?._id === id) setEditingNote(null);
    loadNotes();
  };

  return (
    <div>
      <header className="app-header">
        <h1>{user.name ? `${user.name}'s Notes` : 'My Notes'}</h1>
        <button className="btn" onClick={logout}>Logout</button>
      </header>

      <NoteForm
        editingNote={editingNote}
        onSave={handleSave}
        onCancel={() => setEditingNote(null)}
      />

      <div className="filters">
        <input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Filter by tag" value={tag} onChange={(e) => setTag(e.target.value)} />
        {(search || tag) && (
          <button className="btn" onClick={() => { setSearch(''); setTag(''); }}>Clear filters</button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="empty">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="empty">
          {search || tag ? 'No notes match your search.' : 'No notes yet. Add your first one above!'}
        </p>
      ) : (
        notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={(n) => { setEditingNote(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onDelete={handleDelete}
            onTogglePin={handleTogglePin}
            onTagClick={setTag}
          />
        ))
      )}
    </div>
  );
}