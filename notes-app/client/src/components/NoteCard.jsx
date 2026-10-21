export default function NoteCard({ note, onEdit, onDelete, onTogglePin, onTagClick }) {
  return (
    <div className={`note-card ${note.pinned ? 'pinned' : ''}`}>
      <h3>
        {note.pinned && '📌 '}
        {note.title}
      </h3>

      <p className="note-content">{note.content}</p>

      {note.tags.length > 0 && (
        <div className="tags">
          {note.tags.map((t) => (
            <button key={t} className="tag" onClick={() => onTagClick(t)}>
              #{t}
            </button>
          ))}
        </div>
      )}

      <small className="note-meta">
        Updated {new Date(note.updatedAt).toLocaleString()}
      </small>

      <div className="note-actions">
        <button className="btn" onClick={() => onTogglePin(note)}>
          {note.pinned ? 'Unpin' : 'Pin'}
        </button>
        <button className="btn" onClick={() => onEdit(note)}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(note._id)}>Delete</button>
      </div>
    </div>
  );
}