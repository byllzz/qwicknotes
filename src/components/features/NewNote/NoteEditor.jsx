import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Star,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  Undo,
  Redo,
  ChevronDown,
  Check,
  Plus,
  X,
  Trash2,
} from 'lucide-react';

const BG_COLORS = [
  { label: 'Default', value: '' },
  { label: 'White', value: '#ffffff' },
  { label: 'Light Gray', value: '#f3f4f6' },
  { label: 'Yellow', value: '#fef9c3' },
  { label: 'Orange', value: '#ffedd5' },
  { label: 'Rose', value: '#ffe4e6' },
  { label: 'Red', value: '#fee2e2' },
  { label: 'Teal', value: '#ccfbf1' },
  { label: 'Blue', value: '#dbeafe' },
  { label: 'Indigo', value: '#e0e7ff' },
  { label: 'Purple', value: '#f3e8ff' },
  { label: 'Green', value: '#dcfce7' },
  { label: 'Slate', value: '#f1f5f9' },
];

const TEXT_COLORS = [
  { label: 'Black', value: '#1f2937' },
  { label: 'White', value: '#ffffff' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Green', value: '#16a34a' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Rose', value: '#e11d48' },
];

const GRADIENT_COLORS = [
  { label: 'Sunset', bg: '#fef08a', text: '#b45309' },
  { label: 'Midnight', bg: '#1e293b', text: '#f8fafc' },
  { label: 'Forest', bg: '#dcfce7', text: '#166534' },
  { label: 'Ocean', bg: '#e0f2fe', text: '#0369a1' },
  { label: 'Lavender', bg: '#f3e8ff', text: '#6b21a8' },
  { label: 'Rose Gold', bg: '#ffe4e6', text: '#be123c' },
  { label: 'Storm', bg: '#cbd5e1', text: '#1e293b' },
  { label: 'Candy', bg: '#fce7f3', text: '#9d174d' },
];

const NoteEditor = ({
  title,
  setTitle,
  content,
  setContent,
  bgColor,
  setBgColor,
  textColor,
  setTextColor,
  tags,
  setTags,
  allTags,
  isCreatingTag,
  setIsCreatingTag,
  newTagName,
  setNewTagName,
  handleCreateTag,
  onDeleteTag,
  onDeleteAllTags,
  onSave,
  isTyping,
  isEditing,
  isFavorite,
  onToggleFavorite,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const manageTagsRef = useRef(null);

  // FIXED: Memoize extensions to prevent duplicate extension warnings
  const extensions = useMemo(() => [StarterKit, Underline], []);

  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none outline-none min-h-[150px] text-gray-700 placeholder-gray-400',
      },
    },
  });

  // Sync editor content when the `content` prop changes from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) setShowPicker(false);
      if (manageTagsRef.current && !manageTagsRef.current.contains(event.target))
        setIsManageTagsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers ---
  const handleSelectBG = value => {
    setBgColor(value);
    setShowPicker(false);
  };
  const handleSelectText = value => {
    setTextColor(value);
    setShowPicker(false);
  };
  const handleSelectGradient = (bg, text) => {
    setBgColor(bg);
    setTextColor(text);
    setShowPicker(false);
  };

  const currentBGLabel = BG_COLORS.find(c => c.value === bgColor)?.label || 'Default';
  const currentTextLabel = TEXT_COLORS.find(c => c.value === textColor)?.label || 'Black';
  const matchedGradient = GRADIENT_COLORS.find(g => g.bg === bgColor && g.text === textColor);

  const toggleTag = tag => {
    if (isCreatingTag) return;
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  // If editor isn't ready yet, return null
  if (!editor) return null;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${isEditing ? 'border-blue-400 border-2 bg-blue-50/20' : 'border-gray-100'} pt-6 pb-2 px-8 h-full flex flex-col relative transition-all duration-200`}
    >
      <div className="flex justify-between items-start mb-4">
        <h2
          className={`text-2xl ${isEditing ? 'text-blue-600 font-medium' : 'text-gray-700 font-light'}`}
        >
          {isEditing ? '✏️ Editing Note' : 'New Note'}
        </h2>
        <div className="flex items-center gap-3">
          {isTyping && (
            <span className="text-[10px] text-orange-400 bg-orange-50 px-2 py-0.5 rounded-full flex items-center">
              ✏️ typing...
            </span>
          )}
          <button
            onClick={onToggleFavorite}
            className={`hover:scale-110 transition-transform ${isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
        className={`w-full text-lg font-medium text-gray-800 placeholder-gray-300 bg-transparent border-b pb-2 mb-6 focus:outline-none focus:border-gray-400 transition-colors ${isEditing ? 'border-blue-400' : 'border-gray-200'}`}
      />

      {/* Tags Section */}
      <div className="mb-4 relative" ref={manageTagsRef}>
        <span className="text-xs text-gray-500 font-medium block mb-1.5">Tags</span>
        <div className="flex flex-wrap gap-1.5 items-center pr-8">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${isCreatingTag ? 'opacity-50 cursor-not-allowed pointer-events-none' : tags.includes(tag) ? 'bg-black text-white border border-black' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-200'}`}
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
                if (
                  window.confirm('Delete all tags? This will remove them from all saved notes.')
                ) {
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

      {/* Color Style Picker */}
      <div className="relative mb-4" ref={pickerRef}>
        <span className="text-xs text-gray-500 font-medium block mb-1.5">Card Style</span>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: bgColor || '#ffffff' }}
            ></span>
            <span className="text-gray-700">
              {matchedGradient ? `✨ ${matchedGradient.label}` : `BG: ${currentBGLabel}`}
            </span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[10px]" style={{ color: textColor }}>
              Aa
            </span>
            <span className="text-gray-700">Text: {currentTextLabel}</span>
          </span>
          <ChevronDown size={14} className="text-gray-400 ml-1" />
        </button>
        {showPicker && (
          <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-[340px] flex flex-row gap-3 items-start animate-in fade-in zoom-in-95 duration-100">
            <div className="flex flex-col items-center flex-1 gap-1.5">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                ✨ Gradients
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {GRADIENT_COLORS.map(g => (
                  <button
                    key={g.label}
                    onClick={() => handleSelectGradient(g.bg, g.text)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:scale-110 transition-all"
                    style={{ backgroundColor: g.bg }}
                    title={g.label}
                  >
                    <span className="text-[6px] font-bold" style={{ color: g.text }}>
                      Aa
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px bg-gray-200 self-stretch"></div>
            <div className="flex flex-col items-center flex-1 gap-1.5">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Background
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {BG_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectBG(c.value)}
                    className={`w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${bgColor === c.value ? 'ring-1 ring-black ring-offset-1' : ''}`}
                    style={{ backgroundColor: c.value || '#ffffff' }}
                    title={c.label}
                  >
                    {c.value === '' && <span className="text-[6px] text-gray-400">∅</span>}
                    {bgColor === c.value && (
                      <Check
                        size={10}
                        className={
                          c.value === '' || c.value === '#ffffff' ? 'text-black' : 'text-white'
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px bg-gray-200 self-stretch"></div>
            <div className="flex flex-col items-center flex-1 gap-1.5">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Text Color
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectText(c.value)}
                    className={`w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${textColor === c.value ? 'ring-1 ring-black ring-offset-1' : ''}`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    <span className="text-[6px] font-bold text-white mix-blend-difference">Aa</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RICH TEXT TOOLBAR & EDITOR */}
      {/* Add class "editor-toolbar" for tour */}
      <div className="bg-gray-50 rounded-lg p-1.5 flex flex-wrap gap-1 mb-1.5 editor-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('underline') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <UnderlineIcon size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <Heading3 size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'}`}
        >
          <Quote size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${!editor.can().undo() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`p-1.5 rounded text-gray-600 transition-colors ${!editor.can().redo() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >
          <Redo size={16} />
        </button>
      </div>

      {/* THE ACTUAL EDITOR AREA */}
      <div className="flex-1 border border-gray-100 rounded-lg px-3 py-1 overflow-y-auto bg-white">
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={onSave}
        className={`mt-4 w-full py-3 font-medium rounded-lg transition-colors ${isEditing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-black hover:bg-black/90 text-white'}`}
      >
        {isEditing ? 'Update Note' : 'Save Note'}
      </button>
    </div>
  );
};

export default NoteEditor;
