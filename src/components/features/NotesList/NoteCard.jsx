import { Star, Clock, Pencil, Trash2 } from 'lucide-react';

// Helper to match screenshot date format exactly: M/D/YYYY at HH:MM AM/PM
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

const NoteCard = ({ note, onClick, onEdit, onDelete }) => {
  return (
    <div
      onClick={() => onClick(note)}
      className="group bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-gray-200 p-4 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between gap-2"
    >
      {/* Top: Star Icon, Title, & Text */}
      <div className="flex items-start gap-3">
        <Star className="text-gray-300 mt-1 shrink-0" size={16} />
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-800 truncate">{note.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{note.content}</p>
        </div>
      </div>

      {/* Bottom: Date & Action Buttons */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
          <Clock size={12} /> {formatDateTime(note.createdAt)}
        </div>
        <div
          className="flex items-center gap-3 text-[10px] font-medium"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(note)}
            className="text-gray-400 hover:text-gray-700 flex items-center gap-1"
          >
            <Pencil size={11} /> Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-400 hover:text-red-600 flex items-center gap-1"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
