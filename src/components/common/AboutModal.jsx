import { X, Sparkles, BookOpen, Database, CheckCircle, Info } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="text-gray-600 dark:text-gray-400" /> About QwickNotes
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 text-gray-600 dark:text-gray-300 text-sm space-y-6">
          <section>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
              What is QwickNotes?
            </h3>
            <p className="leading-relaxed">
              QwickNotes is a minimalist, browser-based note-taking application built with{' '}
              <strong>React</strong> and <strong>Tailwind CSS</strong>. It saves every note locally
              in your browser’s <strong>localStorage</strong>, so your data never leaves your
              device.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
              <CheckCircle size={18} /> Key Features
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Rich‑text editor</strong> powered by TipTap – bold, italic, underline,
                headings, lists, blockquotes, undo/redo.
              </li>
              <li>
                <strong>Colourful cards</strong> – choose background and text colours, including
                pre‑set gradients.
              </li>
              <li>
                <strong>Tags</strong> – add, delete, filter by tag, and manage all tags globally.
              </li>
              <li>
                <strong>Favourites</strong> – mark important notes with a star.
              </li>
              <li>
                <strong>Search &amp; Sort</strong> – search across titles and content, sort by date,
                size, or alphabetically.
              </li>
              <li>
                <strong>Export</strong> – export single notes or all notes as <code>.txt</code>,
                <code>.md</code>, <code>.pdf</code>, or as a <code>.zip</code> archive.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Database size={18} /> Built With
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                React 18
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                Tailwind CSS
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                TipTap
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                jsPDF
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                JSZip
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                localStorage
              </span>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Info size={18} /> Data Persistence
            </h3>
            <p className="leading-relaxed">
              All notes, tags, editor drafts, and user preferences are saved automatically to your
              browser’s <strong>localStorage</strong>. No data is sent to any server – your notes
              remain entirely on your own device.
            </p>
          </section>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2 flex items-center justify-between text-xs">
            <p className="text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-600 dark:text-gray-300">Version:</span> 1.0.0
            </p>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
