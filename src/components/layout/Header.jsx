import { useState } from 'react';
import { Plus, SlidersHorizontal, Moon, LogOut } from 'lucide-react';

const Header = () => {
  // Temporary state for the toggle
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // later this would toggle the 'dark' class on the document.documentElement
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
      {/* Left: Logo & Name */}
      <div className="flex items-center gap-2 cursor-pointer select-none">
        <div className="bg-black text-white p-1.5 rounded-md flex items-center justify-center">
          <Plus size={20} strokeWidth={3} />
        </div>
        <span className="text-xl font-medium text-gray-800 tracking-tight">Dashnote</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Filter / Settings Icon */}
        <button
          className="text-gray-500 hover:text-gray-900 transition-colors p-1"
          aria-label="Filter settings"
        >
          <SlidersHorizontal size={20} />
        </button>

        {/* Dark Mode Toggle Switch */}
        <button
          onClick={toggleDarkMode}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none"
        >
          <span className="sr-only">Enable dark mode</span>
          {/* The Toggle Knob */}
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-gray-700 shadow transition-transform duration-200 ease-in-out flex items-center justify-center ${
              darkMode ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          >
            {/* Moon icon inside the knob */}
            <Moon size={12} className="text-white" />
          </span>
        </button>

        {/* Logout Button */}
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
