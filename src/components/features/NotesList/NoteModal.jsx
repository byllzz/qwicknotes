import React from 'react';
import { X, Clock, Download, Pencil, Trash2 } from 'lucide-react';

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

const NoteModal = ({ note, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !note) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: note.bgColor || '#ffffff',
          color: note.textColor || '#1f2937',
        }}
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
          className={`px-6 py-5 text-sm leading-relaxed whitespace-pre-wrap border-y ${note.textColor ? 'border-black/10' : 'border-gray-100'} flex-1 max-h-[300px] overflow-y-auto`}
        >
          {note.content}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 flex justify-between items-center border-t ${note.textColor ? 'border-black/10' : 'border-gray-100'}`}
        >
          <button className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity">
            <Download size={16} /> Export
          </button>
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
