import { ArrowRight, Star, Search, Download, Tags, Moon, Sun, Zap } from 'lucide-react';

const features = [
  {
    icon: <Zap size={18} />,
    title: 'Rich-text editor',
    desc: 'Bold, italic, headings, lists, blockquotes — all in a clean TipTap-powered editor.',
  },
  {
    icon: <Tags size={18} />,
    title: 'Tags & Favorites',
    desc: 'Organize with custom tags, star the notes that matter most, and filter instantly.',
  },
  {
    icon: <Search size={18} />,
    title: 'Instant search',
    desc: 'Find anything across titles and content in real time — no loading, no waiting.',
  },
  {
    icon: <Download size={18} />,
    title: 'Export anywhere',
    desc: 'Download notes as .txt, .md, or .pdf — individually or all at once as a zip.',
  },
  {
    icon: <Star size={18} />,
    title: 'Colourful cards',
    desc: 'Pick background and text colours, or choose from curated gradient presets.',
  },
  {
    icon: <Moon size={18} />,
    title: 'Dark mode',
    desc: 'Toggle between light and dark themes. Your preference is saved automatically.',
  },
];

const LandingPage = ({ onStart }) => {
  return (
    <main className="flex-1 w-full max-w-[1300px] mx-auto px-6 py-16 flex flex-col items-center">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-6 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-full">
          100% local · no account needed
        </span>

        <h1 className="text-6xl font-extralight text-gray-800 dark:text-gray-100 tracking-tight leading-[1.1] mb-6">
          Notes that stay
          <br />
          <span className="font-semibold">on your device.</span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-lg mx-auto">
          Qwicknotes is a minimalist note-taking app that lives entirely in your browser.
          No servers, no sign-up, no cloud — just your words, right here.
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl text-base font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors group"
        >
          Start creating notes
          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
          A quick guide will walk you through the app on first launch.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
        {features.map(f => (
          <div
            key={f.title}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="text-gray-700 dark:text-gray-300 mb-3">{f.icon}</div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom CTA strip */}
      <div className="w-full max-w-4xl bg-gray-900 dark:bg-gray-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-white text-lg font-semibold mb-1">Ready to write?</p>
          <p className="text-gray-400 text-sm">Your notes are waiting — and they go nowhere but here.</p>
        </div>
        <button
          onClick={onStart}
          className="shrink-0 inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors group"
        >
          Open the app
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-gray-400 dark:text-gray-600 text-center">
        Built with React · Tailwind CSS · TipTap · localStorage
      </p>
    </main>
  );
};

export default LandingPage;
