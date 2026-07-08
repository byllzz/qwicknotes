import React, { useState, useRef, useEffect } from 'react';
import { Star, ArrowDownUp, Download, FileText, Tags, Trash2 } from 'lucide-react';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import DeleteAllNotesModal from '../../common/DeleteAllNotesModal';
import ExportDropdown from './ExportDropdown';
import IndividualExportModal from './IndividualExportModal';

const sortOptions = [
  'Newest First',
  'Oldest First',
  'Recently Updated',
  'Largest Size',
  'Smallest Size',
  'Title A-Z',
  'Title Z-A',
];

const NotesList = ({
  notes,
  rawNotes,
  allNotes,
  searchQuery,
  sortOption,
  setSortOption,
  showFavoritesOnly,
  setShowFavoritesOnly,
  filterTag,
  setFilterTag,
  allTags,
  currentEditingId,
  onEdit,
  onDelete,
  onToggleFavorite,
  onDeleteAllNotes,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const tagFilterRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isIndividualExportOpen, setIsIndividualExportOpen] = useState(false);

  const handleCardClick = note => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsDropdownOpen(false);
      if (tagFilterRef.current && !tagFilterRef.current.contains(event.target))
        setIsTagFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSearchingEmpty = searchQuery.trim() !== '' && notes.length === 0;
  const usedTags = [...new Set(rawNotes.flatMap(n => n.tags || []))];

  // FIXED: Base logic for disabling controls now uses the GLOBAL total notes
  const hasNotes = allNotes.length > 0;

  return (
    <div className="h-full flex flex-col relative top-2">
      {/* Top controls - add class "notes-controls" for tour */}
      <div className="flex justify-between items-center mb-4 relative notes-controls">
        <span className="text-gray-500 text-sm font-medium tracking-wider">
          NOTES ({notes.length})
        </span>

        <div className="flex items-center gap-4 text-sm text-gray-500 relative">
          {/* Delete All Notes Button - Disabled if 0 notes */}
          <button
            onClick={() => hasNotes && setIsDeleteAllOpen(true)}
            disabled={!hasNotes}
            className={`flex items-center gap-1.5 transition-colors border-r border-gray-200 pr-3 ${
              hasNotes
                ? 'text-red-400 hover:text-red-600'
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
            title={hasNotes ? 'Delete all notes' : 'No notes to delete'}
          >
            <Trash2 size={16} /> Delete All
          </button>

          {/* Export Button - Disabled if 0 notes */}
          <div className="relative">
            <button
              onClick={() => hasNotes && setIsExportOpen(!isExportOpen)}
              disabled={!hasNotes}
              className={`flex items-center gap-1 transition-colors ${
                hasNotes
                  ? 'hover:text-gray-800 text-gray-500'
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
            >
              <Download size={16} /> Export
            </button>
            <ExportDropdown
              isOpen={isExportOpen}
              onClose={() => setIsExportOpen(false)}
              notes={notes}
              onOpenIndividualExport={() => setIsIndividualExportOpen(true)}
            />
          </div>

          {/* Tags Filter Button - Disabled if 0 notes */}
          <div className="relative" ref={tagFilterRef}>
            <button
              onClick={() => hasNotes && setIsTagFilterOpen(!isTagFilterOpen)}
              disabled={!hasNotes}
              className={`flex items-center gap-1.5 transition-colors ${
                hasNotes
                  ? filterTag
                    ? 'text-blue-500 hover:text-gray-800'
                    : 'text-gray-500 hover:text-gray-800'
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
            >
              <Tags size={18} />
              <span className="font-medium">{filterTag ? filterTag : 'Tags'}</span>
            </button>

            {hasNotes && isTagFilterOpen && (
              <div className="absolute right-0 top-8 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-10 py-1 overflow-hidden">
                <button
                  onClick={() => {
                    setFilterTag(null);
                    setIsTagFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${!filterTag ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'}`}
                >
                  All Tags
                </button>
                {usedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilterTag(tag);
                      setIsTagFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${filterTag === tag ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites Filter Button - Disabled if 0 notes */}
          <button
            onClick={() => hasNotes && setShowFavoritesOnly(!showFavoritesOnly)}
            disabled={!hasNotes}
            className={`flex items-center gap-1.5 transition-colors ${
              hasNotes
                ? showFavoritesOnly
                  ? 'text-yellow-500'
                  : 'text-gray-500 hover:text-gray-800'
                : 'opacity-50 cursor-not-allowed text-gray-400'
            }`}
          >
            <Star size={18} className={showFavoritesOnly ? 'fill-yellow-400' : ''} />
            <span className="font-medium">Favorites</span>
          </button>

          {/* Sort Dropdown - Disabled if 0 notes */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => hasNotes && setIsDropdownOpen(!isDropdownOpen)}
              disabled={!hasNotes}
              className={`flex items-center gap-1 transition-colors ${
                hasNotes
                  ? 'hover:text-gray-800 text-gray-500'
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }`}
            >
              {sortOption} <ArrowDownUp size={14} />
            </button>
            {hasNotes && isDropdownOpen && (
              <div className="absolute right-0 top-8 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-10 py-1 overflow-hidden">
                {sortOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortOption(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${sortOption === option ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-100  p-4 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
              <FileText size={40} className="text-gray-300" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-6 border-2 border-gray-200 bg-white"></div>
            </div>
            {isSearchingEmpty ? (
              <>
                <p className="text-gray-400 font-medium text-base">No matching notes found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search terms</p>
              </>
            ) : (
              <p className="text-gray-400 font-medium">No notes yet. Start writing!</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                currentEditingId={currentEditingId}
                onCardClick={handleCardClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <DeleteAllNotesModal
        isOpen={isDeleteAllOpen}
        notes={rawNotes}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          onDeleteAllNotes();
          setIsDeleteAllOpen(false);
        }}
      />

      <IndividualExportModal
        isOpen={isIndividualExportOpen}
        onClose={() => setIsIndividualExportOpen(false)}
        notes={notes}
      />
    </div>
  );
};

export default NotesList;
