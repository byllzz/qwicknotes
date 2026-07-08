import { ChevronDown, Check } from 'lucide-react';

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

const ColorPicker = ({
  bgColor,
  setBgColor,
  textColor,
  setTextColor,
  showPicker,
  setShowPicker,
  pickerRef,
}) => {
  const currentBGLabel = BG_COLORS.find(c => c.value === bgColor)?.label || 'Default';
  const currentTextLabel = TEXT_COLORS.find(c => c.value === textColor)?.label || 'Black';

  return (
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
          />
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

      {showPicker && (
        <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-[320px] max-w-[90vw] animate-in fade-in zoom-in-95 duration-100">
          <div className="flex gap-4">
            {/* Background colors */}
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                BG
              </p>
              <div className="flex flex-wrap gap-1">
                {BG_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => setBgColor(c.value)}
                    className={`w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${
                      bgColor === c.value ? 'ring-2 ring-black ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: c.value || '#ffffff' }}
                    title={c.label}
                  >
                    {c.value === '' && <span className="text-[8px] text-gray-400">∅</span>}
                    {bgColor === c.value && c.value !== '' && (
                      <Check
                        size={12}
                        className={c.value === '#ffffff' ? 'text-black' : 'text-white'}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Text colors */}
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Text
              </p>
              <div className="flex flex-wrap gap-1">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c.label}
                    onClick={() => setTextColor(c.value)}
                    className={`w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:scale-110 ${
                      textColor === c.value ? 'ring-2 ring-black ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    {textColor === c.value ? (
                      <Check size={12} className="text-white mix-blend-difference" />
                    ) : (
                      <span className="text-[8px] font-bold text-white mix-blend-difference">
                        Aa
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
