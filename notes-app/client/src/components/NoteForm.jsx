import { useState, useEffect } from 'react';

const emptyForm = { title: '', content: '', tags: '', pinned: false };

export default function NoteForm({ editingNote, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  // when the user clicks "Edit" on a card, fill the form with that note
  useEffect(() => {
    if (editingNote) {
      setForm({
        title: editingNote.title,
        content: editingNote.content,
        tags: editingNote.tags.join(', '),
        pinned: editingNote.pinned,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingNote]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      return setError('Title is required');
    }

    const payload = {
      title: form.title,
      content: form.content,
      pinned: form.pinned,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      await onSave(payload);
      setForm(emptyForm);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save note');
    }
  };

    return (
    <form onSubmit={handleSubmit} className="panel note-form">
      <h2>{editingNote ? 'Edit note' : 'New note'}</h2>
      {error && <p className="error">{error}</p>}

      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <textarea name="content" placeholder="Write your note..." rows={4} value={form.content} onChange={handleChange} />
      <input name="tags" placeholder="Tags, separated by commas" value={form.tags} onChange={handleChange} />
      <label className="pin-label">
        <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} />
        Pin this note
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingNote ? 'Update note' : 'Add note'}
        </button>
        {editingNote && (
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}