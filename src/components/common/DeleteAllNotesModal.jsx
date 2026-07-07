import React from 'react';
import { Trash2, Star } from 'lucide-react';

const DeleteAllNotesModal = ({ isOpen, onClose, onConfirm, notes }) => {
  if (!isOpen) return null;

  // Calculate Statistics
  const totalNotes = notes.length;
  const totalFavorites = notes.filter(n => n.isFavorite).length;

  // Calculate tag counts
  const tagCounts = {};
  notes.forEach(note => {
    if (note.tags && note.tags.length > 0) {
      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  const tagEntries = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]); // Sort by most used

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="p-2 bg-red-50 rounded-full">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete All Notes?</h3>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            This action will permanently delete every note in your workspace. This cannot be undone.
          </p>

          {/* Statistics Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Workspace Statistics
            </p>

            <div className="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-0">
              <span className="text-sm text-gray-600">Total Notes</span>
              <span className="text-sm font-semibold text-gray-800">{totalNotes}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-0">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> Favorites
              </span>
              <span className="text-sm font-semibold text-gray-800">{totalFavorites}</span>
            </div>

            <div className="pt-2 mt-2 border-t border-gray-200">
              <p className="text-[10px] font-medium text-gray-500 mb-1.5">Breakdown by Tags</p>
              {tagEntries.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No tags used across notes.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {tagEntries.map(([tag, count]) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] text-gray-600"
                    >
                      #{tag} <span className="font-semibold text-gray-800">{count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAllNotesModal;
