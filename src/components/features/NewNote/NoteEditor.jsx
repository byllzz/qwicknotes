import {
  Star,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

const NoteEditor = ({
  title,
  setTitle,
  content,
  setContent,
  color,
  setColor,
  tags,
  setTags,
  onSave,
  isTyping,
  isEditing,
}) => {
  return (
    /* Add conditional border and background color for Edit Mode */
    <div
      className={`bg-white rounded-xl shadow-sm border ${isEditing ? 'border-blue-400 border-2 bg-blue-50/20' : 'border-gray-100'} p-6 h-full flex flex-col relative transition-all duration-200`}
    >
      {/* Header & Star */}
      <div className="flex justify-between items-start mb-4">
        {/* Change text dynamically based on mode */}
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
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Star size={20} />
          </button>
        </div>
      </div>

      {/* Title Input - Add highlight background */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
        className={`w-full text-lg font-medium text-gray-800 placeholder-gray-300 bg-transparent border-b pb-2 mb-6 focus:outline-none focus:border-gray-400 transition-colors ${isEditing ? 'border-blue-400' : 'border-gray-200'}`}
      />

      {/* Color Slider */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="range"
          min="#000000"
          max="#ffffff"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
        <div
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
        ></div>
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <button className="text-gray-500 text-sm flex items-center gap-1 mb-2 hover:text-gray-700 transition-colors">
          <span className="rotate-45 text-lg font-light">+</span> Add Tags
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-500">
            <div className="w-3 h-3 rounded-full border border-gray-400 mr-2"></div>
            None
          </div>
        </div>
      </div>

      {/* Rich Text Toolbar */}
      <div className="bg-gray-50 rounded-lg p-1.5 flex flex-wrap gap-1 mb-4">
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Bold size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Italic size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Underline size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Heading1 size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Heading2 size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Heading3 size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <List size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Quote size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Undo size={16} />
        </button>
        <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
          <Redo size={16} />
        </button>
      </div>

      {/* Text Area */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Start writing..."
        className={`flex-1 w-full bg-transparent text-gray-700 placeholder-gray-400 resize-none focus:outline-none min-h-[150px] ${isEditing ? 'bg-blue-50/30 p-2 rounded' : ''}`}
      />

      {/* Save Button */}
      <button
        onClick={onSave}
        className={`mt-4 w-full py-3 font-medium rounded-lg transition-colors ${isEditing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white'}`}
      >
        {isEditing ? 'Update Note' : 'Save Note'}
      </button>
    </div>
  );
};

export default NoteEditor;
