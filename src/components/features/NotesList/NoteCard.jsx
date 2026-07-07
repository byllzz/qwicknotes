import { Star, Clock, Pencil, Trash2 } from 'lucide-react';

const formatDateTime = dateString => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} at ${hours}:${minutes} ${ampm}`;
};

const NoteCard = ({ note, onCardClick, onEdit, onDelete, onToggleFavorite, currentEditingId }) => {
  const charSize = note.content.length;
  const sizeLabel = charSize === 0 ? 'Empty' : `${charSize} chars`;

  const displayDate =
    note.updatedAt && note.updatedAt !== note.createdAt ? note.updatedAt : note.createdAt;
  const dateLabel = note.updatedAt && note.updatedAt !== note.createdAt ? 'Updated' : 'Created';

  // Check if this specific card is currently being edited
  const isEditingThisCard = currentEditingId === note.id;

  return (
    <div
      onClick={() => {
        // Completely block card click (Modal open) if currently being edited
        if (!isEditingThisCard) onCardClick(note);
      }}
      className={`group bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between gap-2 ${
        isEditingThisCard ? 'opacity-60' : ''
      }`}
      style={{
        backgroundColor: note.bgColor || '#ffffff',
        color: note.textColor || '#1f2937',
      }}
      title={isEditingThisCard ? 'Currently being edited in the left panel' : ''}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={e => {
            e.stopPropagation();
            if (!isEditingThisCard) onToggleFavorite(note.id);
          }}
          className={`mt-1 shrink-0 hover:scale-110 transition-transform ${note.isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} ${isEditingThisCard ? 'cursor-not-allowed' : ''}`}
        >
          <Star size={16} fill={note.isFavorite ? 'currentColor' : 'none'} />
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium truncate">{note.title}</h4>
          <p className="text-sm opacity-80 line-clamp-2 mt-1">{note.content}</p>
        </div>
      </div>

      <div
        className={`flex justify-between items-center mt-3 pt-3 ${note.textColor ? `border-t border-black/10` : 'border-t border-gray-200'}`}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-70">
          <Clock size={12} /> {dateLabel} {formatDateTime(displayDate)}
        </div>
        <div
          className="flex items-center gap-3 text-[10px] font-medium"
          onClick={e => e.stopPropagation()}
        >
          {/* DISABLED EDIT BUTTON LOGIC */}
          <button
            onClick={() => {
              if (!isEditingThisCard) onEdit(note);
            }}
            className={`flex items-center gap-1 transition-opacity ${
              isEditingThisCard ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            title={isEditingThisCard ? 'Cannot edit while already in left panel' : 'Edit note'}
          >
            <Pencil size={11} /> Edit
          </button>

          <span className="opacity-50 font-normal text-[10px]">{sizeLabel}</span>

          {/* DISABLED DELETE BUTTON LOGIC */}
          <button
            onClick={() => {
              if (!isEditingThisCard) onDelete(note.id);
            }}
            className={`flex items-center gap-1 transition-colors ${
              isEditingThisCard
                ? 'text-gray-300 cursor-not-allowed opacity-30'
                : 'text-red-400 hover:text-red-600'
            }`}
            title={isEditingThisCard ? 'Cannot delete while editing in left panel' : 'Delete note'}
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
