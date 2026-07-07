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
  onSave,
  isTyping,
  isEditing,
  isFavorite,
  onToggleFavorite,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

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

  const handleSelectGradient = (bg, text) => {
    setBgColor(bg);
    setTextColor(text);
    setShowPicker(false);
  };

  const currentBGLabel = BG_COLORS.find(c => c.value === bgColor)?.label || 'Default';
  const currentTextLabel = TEXT_COLORS.find(c => c.value === textColor)?.label || 'Black';
  const matchedGradient = GRADIENT_COLORS.find(g => g.bg === bgColor && g.text === textColor);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${isEditing ? 'border-blue-400 border-2 bg-blue-50/20' : 'border-gray-100'} p-6 h-full flex flex-col relative transition-all duration-200`}
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

        {/* The Popup - 3 Columns Layout */}
        {showPicker && (
          <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-72 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-100">
            {/* Gradients - 3 Columns */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                ✨ Quick Gradients
              </p>
              <div className="grid grid-cols-3 gap-2">
                {GRADIENT_COLORS.map(g => (
                  <button
                    key={g.label}
                    onClick={() => handleSelectGradient(g.bg, g.text)}
                    className="w-full aspect-square rounded-full border border-gray-200 flex items-center justify-center hover:scale-110 transition-all"
                    style={{ backgroundColor: g.bg }}
                    title={g.label}
                  >
                    <span className="text-[10px] font-bold" style={{ color: g.text }}>
                      Aa
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-gray-100"></div>

            {/* Background Colors - 3 Columns */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Background
              </p>
              <div className="grid grid-cols-3 gap-2">
                {BG_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectBG(c.value)}
                    className={`w-full aspect-square rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${bgColor === c.value ? 'ring-2 ring-black ring-offset-1' : ''}`}
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

            <div className="w-full h-px bg-gray-100"></div>

            {/* Text Colors - 3 Columns */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Text Color
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectText(c.value)}
                    className={`w-full aspect-square rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${textColor === c.value ? 'ring-2 ring-black ring-offset-1' : ''}`}
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

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Start writing..."
        className={`flex-1 w-full bg-transparent text-gray-700 placeholder-gray-400 resize-none focus:outline-none min-h-[150px] ${isEditing ? 'bg-blue-50/30 p-2 rounded' : ''}`}
      />

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
