import React, { useState } from 'react';
import { X, Star, Tags, Clock, FileText, FileOutput, FileJson } from 'lucide-react';
import { downloadText, downloadMarkdown, downloadPDF } from '../../../utils/exportHelpers';

const stripHtml = html => (html ? html.replace(/<[^>]*>/g, '') : '');

const IndividualExportModal = ({ isOpen, onClose, notes }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [exportingId, setExportingId] = useState(null);

  if (!isOpen) return null;

  // Tab Filter Logic
  const filteredNotes = notes.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'fav') return n.isFavorite === true;
    if (activeTab === 'edited') return n.updatedAt && n.updatedAt !== n.createdAt;
    if (activeTab === 'tags') return true; // Handled specially below
    return true;
  });

  // Unique tags list for the Tags tab
  const uniqueTags = [...new Set(notes.flatMap(n => n.tags || []))].sort();
  const [selectedTag, setSelectedTag] = useState(null);

  const getNotesForTag = tag => {
    if (!tag) return [];
    return notes.filter(n => n.tags && n.tags.includes(tag));
  };

  const handleExportNote = (note, format) => {
    const content = `${note.title}\n\n${stripHtml(note.content)}`;
    const filename = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    if (format === 'txt') downloadText(content, filename);
    else if (format === 'md') downloadMarkdown(content, filename);
    else if (format === 'pdf') downloadPDF(content, filename);

    setExportingId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            Export Notes{' '}
            <span className="text-sm font-normal text-gray-500">({notes.length} total)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 pt-4 border-b border-gray-100 flex gap-6 shrink-0">
          {['all', 'fav', 'tags', 'edited'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedTag(null);
              }}
              className={`pb-3 text-xs font-medium uppercase tracking-wider transition-all border-b-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab === 'all' && 'All Notes'}
              {tab === 'fav' && (
                <span className="flex items-center gap-1">
                  Favorites <Star size={12} className="fill-yellow-400 text-yellow-400" />
                </span>
              )}
              {tab === 'tags' && (
                <span className="flex items-center gap-1">
                  Tags <Tags size={12} />
                </span>
              )}
              {tab === 'edited' && (
                <span className="flex items-center gap-1">
                  Edited <Clock size={12} />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* TAGS TAB SPECIAL RENDERING */}
          {activeTab === 'tags' ? (
            <div className="flex flex-col h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!selectedTag ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  All Tags
                </button>
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTag === tag ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedTag ? (
                  getNotesForTag(selectedTag).map(note => (
                    <ExportNoteCard
                      key={note.id}
                      note={note}
                      onExport={handleExportNote}
                      exportingId={exportingId}
                      setExportingId={setExportingId}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-gray-400 mt-10">
                    <Tags size={48} className="text-gray-200 mb-2" />
                    <p className="text-sm font-medium">Select a tag above to see notes</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STANDARD TABS (ALL, FAV, EDITED) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredNotes.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center text-gray-400 mt-10">
                  <p className="text-sm font-medium">No notes match this filter.</p>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <ExportNoteCard
                    key={note.id}
                    note={note}
                    onExport={handleExportNote}
                    exportingId={exportingId}
                    setExportingId={setExportingId}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for the Export Note Card inside the Modal
const ExportNoteCard = ({ note, onExport, exportingId, setExportingId }) => {
  const isExporting = exportingId === note.id;
  const [showFormatDrop, setShowFormatDrop] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between gap-3 hover:shadow-md transition-shadow">
      <div>
        <h4 className="font-medium text-gray-800 truncate">{note.title}</h4>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
          <span>
            {note.tags && note.tags.length > 0
              ? note.tags
                  .slice(0, 2)
                  .map(t => `#${t}`)
                  .join(' ')
              : 'No tags'}
          </span>
          {note.isFavorite && <Star size={12} className="fill-yellow-400 text-yellow-400" />}
        </div>
      </div>

      <div className="relative self-end">
        <button
          onClick={() => setShowFormatDrop(!showFormatDrop)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors text-gray-700"
        >
          Export <span className="text-gray-400 ml-1">▼</span>
        </button>

        {showFormatDrop && (
          <div className="absolute right-0 top-8 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => {
                onExport(note, 'txt');
                setShowFormatDrop(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              <FileText size={12} /> Text
            </button>
            <button
              onClick={() => {
                onExport(note, 'md');
                setShowFormatDrop(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              <FileOutput size={12} /> Markdown
            </button>
            <button
              onClick={() => {
                onExport(note, 'pdf');
                setShowFormatDrop(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              <FileJson size={12} /> PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualExportModal;
