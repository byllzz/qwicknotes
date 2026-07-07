import { X } from 'lucide-react';

const NoteCard = ({ note, onDelete }) => {
  // Format the timestamp to a readable date
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative group bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 ease-in-out">
      {/* Color Border on the left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: note.color || '#000000' }}
      ></div>

      {/* Delete Button (Only shows on hover or is always faint) */}
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete note"
      >
        <X size={18} />
      </button>

      {/* Note Content */}
      <div className="pr-6">
        <h4 className="font-semibold text-gray-800 text-base mb-1 truncate pr-4">{note.title}</h4>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{note.content}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{formattedDate}</span>
          {/* Optional: Display the first tag if exists */}
          {note.tags && note.tags.length > 0 && (
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
              {note.tags[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
