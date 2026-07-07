import React, { useRef, useEffect } from 'react';
import { Download, FileText, FileOutput, FileJson, Layers } from 'lucide-react';
import { downloadAllAsZip, downloadPDF } from '../../../utils/exportHelpers';

const stripHtml = html => (html ? html.replace(/<[^>]*>/g, '') : '');

const ExportDropdown = ({ isOpen, onClose, notes, onOpenIndividualExport }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate a combined text string of all notes
  const getCombinedText = () => {
    return notes.map(n => `${n.title}\n\n${stripHtml(n.content)}\n\n---\n\n`).join('');
  };

  const handleExportAllText = () => {
    const content = getCombinedText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_notes.txt';
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleExportAllMD = () => {
    const content = notes.map(n => `# ${n.title}\n\n${stripHtml(n.content)}\n\n---\n`).join('');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_notes.md';
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleExportAllPDF = () => {
    const content = notes.map(n => `${n.title}\n\n${stripHtml(n.content)}\n\n`).join('');
    downloadPDF(content, 'all_notes');
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-8 mt-1 w-56 bg-white border border-gray-100 rounded-lg shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        Bulk Exports
      </p>

      <button
        onClick={handleExportAllText}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors text-left"
      >
        <FileText size={14} /> Download all as Text
      </button>

      <button
        onClick={handleExportAllMD}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors text-left"
      >
        <FileOutput size={14} /> Download all as Markdown
      </button>

      <button
        onClick={handleExportAllPDF}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors text-left"
      >
        <FileJson size={14} /> Download all as PDF
      </button>

      <div className="w-full h-px bg-gray-100 my-1"></div>

      <button
        onClick={() => {
          onOpenIndividualExport();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors text-left font-medium"
      >
        <Layers size={14} /> Individual download...
      </button>
    </div>
  );
};

export default ExportDropdown;
