import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

const stripHtml = html => (html ? html.replace(/<[^>]*>/g, '') : '');

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, note }) => {
  if (!isOpen || !note) return null;

  const charSize = stripHtml(note.content).length;
  const sizeLabel = charSize === 0 ? 'Empty' : `${charSize} chars`;
  const previewContent =
    stripHtml(note.content).length > 40
      ? stripHtml(note.content).substring(0, 40) + '...'
      : note.content;
  const isEdited = note.updatedAt && note.updatedAt !== note.createdAt;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="p-2 bg-red-50 rounded-full">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete Note?</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            You are about to permanently delete this note. This action cannot be undone.
          </p>

          <div
            className="rounded-lg p-4 border border-gray-200 mb-6 shadow-sm"
            style={{
              backgroundColor: note.bgColor || '#ffffff',
              color: note.textColor || '#1f2937',
            }}
          >
            <h4 className="font-medium text-base mb-1 truncate">{note.title}</h4>
            {stripHtml(note.content).trim() ? (
              <div
                className="text-sm opacity-90 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            ) : (
              <p className="text-sm italic opacity-70">No description provided.</p>
            )}
            <div
              className={`mt-3 pt-3 border-t ${note.textColor ? 'border-black/10' : 'border-gray-200'} flex justify-between items-center text-[10px] opacity-80`}
            >
              <span className="flex items-center gap-1">
                <Clock size={12} /> {isEdited ? 'Edited' : 'Created'}
              </span>
              <span>{sizeLabel}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
