import { Plus, X, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

const TagManager = ({
  allTags,
  tags,
  setTags,
  isCreatingTag,
  setIsCreatingTag,
  newTagName,
  setNewTagName,
  handleCreateTag,
  onDeleteTag,
  onDeleteAllTags,
}) => {
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const manageTagsRef = useRef(null);

  const toggleTag = tag => {
    if (isCreatingTag) return;
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  return (
    <div className="mb-4 relative" ref={manageTagsRef}>
      <span className="text-xs text-gray-500 font-medium block mb-1.5">Tags</span>
      <div className="flex flex-wrap gap-1.5 items-center pr-8">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
              isCreatingTag
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : tags.includes(tag)
                  ? 'bg-black text-white border border-black'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
        <button
          onClick={() => setIsCreatingTag(!isCreatingTag)}
          className="flex items-center gap-0.5 px-2 py-1 rounded-full border border-dashed border-gray-300 text-[10px] text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <button
        onClick={() => setIsManageTagsOpen(!isManageTagsOpen)}
        className="absolute right-0 top-0 text-gray-400 hover:text-red-500 transition-colors mt-1"
      >
        <Trash2 size={16} />
      </button>

      {isCreatingTag && (
        <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-48 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-gray-700">New Tag</span>
            <button
              onClick={() => {
                setIsCreatingTag(false);
                setNewTagName('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
          <input
            autoFocus
            type="text"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateTag()}
            placeholder="Tag name..."
            className="w-full px-2 py-1 text-[10px] border border-gray-200 rounded focus:outline-none focus:border-black mb-2"
          />
          <button
            onClick={handleCreateTag}
            className="w-full py-1 bg-black text-white text-[10px] font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Create
          </button>
        </div>
      )}

      {isManageTagsOpen && (
        <div className="absolute right-0 top-full z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-56 animate-in fade-in zoom-in-95 duration-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Manage Tags
          </p>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 mb-3">
            {allTags.length === 0 ? (
              <p className="text-[10px] text-gray-400 italic text-center">No tags created yet.</p>
            ) : (
              allTags.map(tag => (
                <div
                  key={tag}
                  className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded"
                >
                  <span className="text-[10px] font-medium text-gray-700">#{tag}</span>
                  <button
                    onClick={() => {
                      onDeleteTag(tag);
                      setIsManageTagsOpen(false);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => {
              if (window.confirm('Delete all tags? This will remove them from all saved notes.')) {
                onDeleteAllTags();
                setIsManageTagsOpen(false);
              }
            }}
            className="w-full py-1.5 bg-red-50 text-red-600 text-[10px] font-medium rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
          >
            <Trash2 size={12} /> Delete All
          </button>
        </div>
      )}
    </div>
  );
};

export default TagManager;
