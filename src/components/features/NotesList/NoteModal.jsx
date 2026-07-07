import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Download, Pencil, Trash2, FileText, FileOutput, FileJson } from 'lucide-react';
import { downloadText, downloadMarkdown, downloadPDF } from '../../../utils/exportHelpers';

const formatDateTime = dateString => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} at ${hours}:${minutes} ${ampm}`;
};

// Helper to strip HTML tags for plain text exports
const stripHtml = html => (html ? html.replace(/<[^>]*>/g, '') : '');

const NoteModal = ({ note, isOpen, onClose, onEdit, onDelete }) => {
  const [showExportDrop, setShowExportDrop] = useState(false);
  const exportDropdownRef = useRef(null);

  // Click outside logic for the dropdown
  useEffect(() => {
    const handleClickOutside = event => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDrop(false);
      }
    };
    if (showExportDrop) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportDrop]);

  if (!isOpen || !note) return null;

  const handleExportNote = format => {
    const textContent = `${note.title}\n\n${stripHtml(note.content)}`;
    const filename = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    if (format === 'txt') downloadText(textContent, filename);
    else if (format === 'md') downloadMarkdown(textContent, filename);
    else if (format === 'pdf') downloadPDF(textContent, filename);

    setShowExportDrop(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: note.bgColor || '#ffffff', color: note.textColor || '#1f2937' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2 relative">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 hover:opacity-70 transition-opacity"
          >
            <X size={20} />
          </button>
          <h3 className="text-2xl font-medium pr-8 mb-2">{note.title}</h3>
          <div className="flex items-center gap-1.5 text-xs opacity-60 mt-1">
            <Clock size={14} /> {formatDateTime(note.createdAt)}
          </div>
        </div>

        {/* Body */}
        <div
          className={`px-6 py-5 text-sm leading-relaxed border-y ${note.textColor ? 'border-black/10' : 'border-gray-100'} flex-1 max-h-[300px] overflow-y-auto prose prose-sm max-w-none`}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        {/* Footer */}
        <div
          className={`px-6 py-4 flex justify-between items-center border-t ${note.textColor ? 'border-black/10' : 'border-gray-100'}`}
        >
          {/* Export Button with Dropdown */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              onClick={() => setShowExportDrop(!showExportDrop)}
              className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
            >
              <Download size={16} /> Export
            </button>

            {showExportDrop && (
              <div className="absolute left-0 bottom-8 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => handleExportNote('txt')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <FileText size={12} /> Text
                </button>
                <button
                  onClick={() => handleExportNote('md')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <FileOutput size={12} /> Markdown
                </button>
                <button
                  onClick={() => handleExportNote('pdf')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <FileJson size={12} /> PDF
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => {
                onEdit(note);
                onClose();
              }}
              className="hover:opacity-70 flex items-center gap-1.5 transition-opacity"
            >
              <Pencil size={16} /> Edit Note
            </button>
            <button
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              className="text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
