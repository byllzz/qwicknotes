import { useState, useEffect } from 'react';
import {
  Plus,
  Info,
  X,
  Sparkles,
  BookOpen,
  Database,
  CheckCircle,
  SlidersVertical,
} from 'lucide-react';

const Header = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Theme State (Light/Dark)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qwicknotes_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme to <html> tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('qwicknotes_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="flex justify-between items-center px-6 h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 w-full transition-colors duration-200">
      <div className="flex items-center justify-between w-full max-w-[1250px] mx-auto">
        {/* Logo - add class "header-logo" for tour */}
        <div className="flex items-center gap-2 cursor-pointer select-none header-logo">
          <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded-md flex items-center justify-center transition-colors duration-200">
            <Plus size={17} strokeWidth={3} />
          </div>
          <span className="text-2xl font-light text-gray-800/80 dark:text-gray-200/80 tracking-tight">
            Qwicknotes
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Slider Toggle for Dark Mode - add class "theme-toggle" for tour */}
          <label className="relative inline-flex items-center cursor-pointer theme-toggle">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-gray-300 flex items-center justify-center">
              {/* Sun (light mode) */}
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 dark:text-gray-400 transition-opacity peer-checked:opacity-0">
                ☀️
              </span>
              {/* Moon (dark mode) */}
              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 dark:text-gray-400 transition-opacity peer-checked:opacity-100">
                🌙
              </span>
            </div>
          </label>

          {/* About Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="About QwickNotes"
          >
            <SlidersVertical size={18} />
          </button>
        </div>
      </div>

      {/* About Modal */}
      {isHelpOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <BookOpen className="text-gray-600 dark:text-gray-400" /> About QwickNotes
              </h2>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 text-gray-600 dark:text-gray-300 text-sm space-y-6">
              {/* 1. Overview */}
              <section>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Sparkles size={18} /> What is QwickNotes?
                </h3>
                <p className="leading-relaxed">
                  QwickNotes is a minimalist, browser-based note-taking application built with{' '}
                  <strong>React</strong> and <strong>Tailwind CSS</strong>. It saves every note
                  locally in your browser’s <strong>localStorage</strong>, so your data never leaves
                  your device.
                </p>
              </section>

              {/* 2. Key Features */}
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
                    <strong>Tags</strong> – add, delete, filter by tag, and manage all tags
                    globally.
                  </li>
                  <li>
                    <strong>Favourites</strong> – mark important notes with a star.
                  </li>
                  <li>
                    <strong>Search &amp; Sort</strong> – search across titles and content, sort by
                    date, size, or alphabetically.
                  </li>
                  <li>
                    <strong>Export</strong> – export single notes or all notes as <code>.txt</code>,
                    <code>.md</code>, <code>.pdf</code>, or as a <code>.zip</code> archive.
                  </li>
                  <li>
                    <strong>Dark mode</strong> – toggle between light and dark themes (persisted in
                    localStorage).
                  </li>
                </ul>
              </section>

              {/* 3. Tech Stack */}
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

              {/* 4. Data & Privacy */}
              <section>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Info size={18} /> Data Persistence
                </h3>
                <p className="leading-relaxed">
                  All notes, tags, editor drafts, and user preferences are saved automatically to
                  your browser’s <strong>localStorage</strong>. No data is sent to any server – your
                  notes remain entirely on your own device.
                </p>
              </section>

              {/* Modal Footer */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2 flex items-center justify-between text-xs">
                <p className="text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-600 dark:text-gray-300">Version:</span>{' '}
                  1.0.0
                </p>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-xs font-medium"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
