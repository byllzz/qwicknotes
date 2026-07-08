import { useState, useRef, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
//  Placeholder extension
import Placeholder from '@tiptap/extension-placeholder';
import { PenIcon, Star } from 'lucide-react';
import Toolbar from './Toolbar';
import ColorPicker from './ColorPicker';
import TagManager from './TagManager';

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

  const extensions = useMemo(
    () => [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Write your note description here...',
      }),
    ],
    [],
  );

  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none outline-none min-h-[150px] text-inherit [&_p.is-empty]:before:content-[attr(data-placeholder)] [&_p.is-empty]:before:text-gray-400 [&_p.is-empty]:before:float-left [&_p.is-empty]:before:pointer-events-none [&_p.is-empty]:before:h-0',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${
        isEditing ? 'border-blue-400 border-2 bg-blue-50/20' : 'border-gray-100'
      } pt-6 pb-2 px-8 h-full flex flex-col relative transition-all duration-200`}
    >
      <div className="flex justify-between items-start mb-4">
        <h2
          className={`text-2xl ${
            isEditing ? 'text-blue-600 font-medium' : 'text-gray-700 font-light'
          }`}
        >
          {isEditing ? '✏️ Editing Note' : 'New Note'}
        </h2>
        <div className="flex items-center gap-3">
          {isTyping && (
            <span className="text-[10px] gap-1 text-orange-400 bg-orange-50 px-2 py-0.5 rounded-full flex items-center">
              <PenIcon className="w-2.5 h-2.5" /> typing...
            </span>
          )}
          <button
            onClick={onToggleFavorite}
            className={`hover:scale-110 transition-transform ${
              isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-600'
            }`}
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
        className="w-full text-lg font-medium text-gray-800 placeholder-gray-300 bg-transparent border-b border-gray-200 pb-2 mb-6 focus:outline-none focus:border-gray-400 transition-colors"
      />

      <TagManager
        allTags={allTags}
        tags={tags}
        setTags={setTags}
        isCreatingTag={isCreatingTag}
        setIsCreatingTag={setIsCreatingTag}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        handleCreateTag={handleCreateTag}
        onDeleteTag={onDeleteTag}
        onDeleteAllTags={onDeleteAllTags}
      />

      <ColorPicker
        bgColor={bgColor}
        setBgColor={setBgColor}
        textColor={textColor}
        setTextColor={setTextColor}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        pickerRef={pickerRef}
      />

      <Toolbar editor={editor} />

      {/* Note Card Preview Area */}
      <div
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 overflow-y-auto transition-all duration-200"
        style={{
          backgroundColor: bgColor || '#ffffff',
          color: textColor || '#1f2937',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={onSave}
        className={`mt-4 w-full py-3 font-medium rounded-lg transition-colors ${
          isEditing
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-black hover:bg-black/90 text-white'
        }`}
      >
        {isEditing ? 'Update Note' : 'Save Note'}
      </button>
    </div>
  );
};

export default NoteEditor;
