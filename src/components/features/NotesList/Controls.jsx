import { useRef, useState, useEffect } from 'react';
import { Star, ArrowDownUp, Download, Tags, Trash2 } from 'lucide-react';
import ExportDropdown from '../Export/ExportDropdown';

const sortOptions = [
  'Newest First',
  'Oldest First',
  'Recently Updated',
  'Largest Size',
  'Smallest Size',
  'Title A-Z',
  'Title Z-A',
];

const Controls = ({
  notes,
  rawNotes,
  allNotes,
  sortOption,
  setSortOption,
  showFavoritesOnly,
  setShowFavoritesOnly,
  filterTag,
  setFilterTag,
  allTags,
  onDeleteAllNotes,
  setIsDeleteAllOpen,
  setIsIndividualExportOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const tagFilterRef = useRef(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const hasNotes = allNotes.length > 0;
  const usedTags = [...new Set(rawNotes.flatMap(n => n.tags || []))];

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

  return (
    <div className="flex justify-between items-center mb-4 relative notes-controls">
      <span className="text-gray-500 text-sm font-medium tracking-wider">
        NOTES ({notes.length})
      </span>

      <div className="flex items-center gap-4 text-sm text-gray-500 relative">
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
                className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${
                  !filterTag ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'
                }`}
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
                  className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${
                    filterTag === tag ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

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
                  className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${
                    sortOption === option ? 'text-black font-semibold bg-gray-50' : 'text-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;
