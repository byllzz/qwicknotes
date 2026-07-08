import { Plus, SlidersVertical, HelpCircle } from 'lucide-react';
import { IoLogoGithub } from 'react-icons/io';

const Header = ({ onOpenAbout, onOpenTour }) => {
  return (
    <header className="flex justify-between items-center px-6 h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 w-full transition-colors duration-200">
      <div className="flex items-center justify-between w-full max-w-[1250px] mx-auto">
        <div className="flex items-center gap-2 cursor-pointer select-none header-logo">
          <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded-md flex items-center justify-center transition-colors duration-200">
            <Plus size={17} strokeWidth={3} />
          </div>
          <span className="text-2xl font-light text-gray-800/80 dark:text-gray-200/80 tracking-tight">
            Qwicknotes
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTour}
            className="p-2 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Open guide tour"
          >
            <HelpCircle size={18} />
          </button>
          <button
            onClick={onOpenAbout}
            className="p-2 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="About QwickNotes"
          >
            <SlidersVertical size={18} />
          </button>
          <a
            href="https://github.com/byllzz/qwicknotes.git"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="GitHub repository"
          >
            <IoLogoGithub size={18} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
