import { useState } from 'react';
import { X, Star, Tags, Clock } from 'lucide-react';
import ExportNoteCard from './ExportNoteCard';

const IndividualExportModal = ({ isOpen, onClose, notes }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'fav') return n.isFavorite === true;
    if (activeTab === 'edited') return n.updatedAt && n.updatedAt !== n.createdAt;
    if (activeTab === 'tags') return true;
    return true;
  });

  const uniqueTags = [...new Set(notes.flatMap(n => n.tags || []))].sort();

  const getNotesForTag = tag => {
    if (!tag) return [];
    return notes.filter(n => n.tags && n.tags.includes(tag));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            Export Notes{' '}
            <span className="text-sm font-normal text-gray-500">({notes.length} total)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-4 border-b border-gray-100 flex gap-6 shrink-0">
          {['all', 'fav', 'tags', 'edited'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedTag(null);
              }}
              className={`pb-3 text-xs font-medium uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'all' && 'All Notes'}
              {tab === 'fav' && (
                <span className="flex items-center gap-1">
                  Favorites <Star size={12} className="fill-yellow-400 text-yellow-400" />
                </span>
              )}
              {tab === 'tags' && (
                <span className="flex items-center gap-1">
                  Tags <Tags size={12} />
                </span>
              )}
              {tab === 'edited' && (
                <span className="flex items-center gap-1">
                  Edited <Clock size={12} />
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'tags' ? (
            <div className="flex flex-col h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    !selectedTag
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Tags
                </button>
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-black text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedTag ? (
                  getNotesForTag(selectedTag).map(note => (
                    <ExportNoteCard key={note.id} note={note} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-gray-400 mt-10">
                    <Tags size={48} className="text-gray-200 mb-2" />
                    <p className="text-sm font-medium">Select a tag above to see notes</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredNotes.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 mt-10">
                  <p className="text-sm font-medium">No notes match this filter.</p>
                </div>
              ) : (
                filteredNotes.map(note => <ExportNoteCard key={note.id} note={note} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualExportModal;
