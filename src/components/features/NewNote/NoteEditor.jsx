import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Check,
} from 'lucide-react';

// Predefined Palettes
const BG_COLORS = [
  { label: 'Default', value: '' },
  { label: 'White', value: '#ffffff' },
  { label: 'Light Gray', value: '#f3f4f6' },
  { label: 'Yellow', value: '#fef9c3' },
  { label: 'Blue', value: '#dbeafe' },
  { label: 'Red', value: '#fee2e2' },
  { label: 'Green', value: '#dcfce7' },
  { label: 'Purple', value: '#f3e8ff' },
];

const TEXT_COLORS = [
  { label: 'Black', value: '#1f2937' },
  { label: 'White', value: '#ffffff' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Green', value: '#16a34a' },
];

const NoteEditor = ({
  title,
  setTitle,
  content,
  setContent,
  borderColor,
  setBorderColor,
  bgColor,
  setBgColor,
  textColor,
  setTextColor,
  tags,
  setTags,
  onSave,
  isTyping,
  isEditing,
  isFavorite,
  onToggleFavorite,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBG = value => {
    setBgColor(value);
    setShowPicker(false);
  };

  const handleSelectText = value => {
    setTextColor(value);
    setShowPicker(false);
  };

  // Determine label to show on the button
  const currentBGLabel = BG_COLORS.find(c => c.value === bgColor)?.label || 'Default';
  const currentTextLabel = TEXT_COLORS.find(c => c.value === textColor)?.label || 'Black';

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${isEditing ? 'border-blue-400 border-2 bg-blue-50/20' : 'border-gray-100'} p-6 h-full flex flex-col relative transition-all duration-200`}
    >
      {/* Header & Star */}
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

      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
        className={`w-full text-lg font-medium text-gray-800 placeholder-gray-300 bg-transparent border-b pb-2 mb-6 focus:outline-none focus:border-gray-400 transition-colors ${isEditing ? 'border-blue-400' : 'border-gray-200'}`}
      />

      {/* Border Color Slider */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-xs text-gray-500 font-medium">Accent Color</span>
        <input
          type="range"
          min="#000000"
          max="#ffffff"
          value={borderColor}
          onChange={e => setBorderColor(e.target.value)}
          className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
        <div
          className="w-5 h-5 rounded-full border border-gray-200"
          style={{ backgroundColor: borderColor }}
        ></div>
      </div>

      {/* Color Style Picker (Replaces Tags Section) */}
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
            <span className="text-gray-700">BG: {currentBGLabel}</span>
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

        {/* The Popup */}
        {showPicker && (
          <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-64 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Background
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BG_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectBG(c.value)}
                    className={`w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${bgColor === c.value ? 'ring-2 ring-black ring-offset-1' : ''}`}
                    style={{ backgroundColor: c.value || '#ffffff' }}
                    title={c.label}
                  >
                    {c.value === '' && <span className="text-[8px] text-gray-400">∅</span>}
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

            <div className="w-full h-px bg-gray-100 my-1"></div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Text Color
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectText(c.value)}
                    className={`w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${textColor === c.value ? 'ring-2 ring-black ring-offset-1' : ''}`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    <span className="text-[10px] font-bold text-white mix-blend-difference">
                      Aa
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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
