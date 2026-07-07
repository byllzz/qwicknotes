import { Star, ArrowDownUp, Download, FileText } from 'lucide-react';
import NoteCard from './NoteCard'; // Import the new component

const NotesList = ({ notes, onDelete }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-500 text-sm font-medium tracking-wider">
          NOTES ({notes.length})
        </span>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button className="hover:text-gray-800">
            <Star size={18} />
          </button>
          <button className="flex items-center gap-1 hover:text-gray-800">
            Newest First <ArrowDownUp size={14} />
          </button>
          <button className="flex items-center gap-1 hover:text-gray-800">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
              <FileText size={40} className="text-gray-300" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-6 border-2 border-gray-200 bg-white"></div>
            </div>
            <p className="text-gray-400 font-medium">No notes yet. Start writing!</p>
          </div>
        ) : (
          // Grid or Vertical Stack for Notes
          <div className="flex flex-col gap-4">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
