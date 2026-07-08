import { useState } from 'react';
import { Star, FileText, FileOutput, FileJson } from 'lucide-react';
import { downloadText, downloadMarkdown, downloadPDF } from '../../../utils/exportHelpers';

const stripHtml = html => (html ? html.replace(/<[^>]*>/g, '') : '');

const ExportNoteCard = ({ note }) => {
  const [showFormatDrop, setShowFormatDrop] = useState(false);

  const handleExportNote = format => {
    const content = `${note.title}\n\n${stripHtml(note.content)}`;
    const filename = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    if (format === 'txt') downloadText(content, filename);
    else if (format === 'md') downloadMarkdown(content, filename);
    else if (format === 'pdf') downloadPDF(content, filename);
    setShowFormatDrop(false);
  };

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
    </div>
  );
};

export default ExportNoteCard;
