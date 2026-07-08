import { useState, useEffect, useRef } from 'react';

const steps = [
  {
    target: '.header-logo',
    title: 'Welcome to QwickNotes!',
    description: 'This is your digital notebook. All your notes are stored locally on your device.',
  },
  {
    target: '.search-input',
    title: 'Search Notes',
    description: 'Search through your notes by title or content instantly.',
  },
  {
    target: '.note-editor-container',
    title: 'Write & Edit',
    description: 'Create new notes or edit existing ones here. Use the rich‑text toolbar below.',
  },
  {
    target: '.editor-toolbar',
    title: 'Formatting Tools',
    description: 'Bold, italic, underline, headings, lists, and more. Undo/Redo also available.',
  },
  {
    target: '.notes-list-container',
    title: 'Your Notes List',
    description: 'All your saved notes appear here. Click on a note to view it in detail.',
  },
  {
    target: '.notes-controls',
    title: 'Manage & Export',
    description:
      'Filter by favorites or tags, sort your list, or export notes individually or in bulk.',
  },
];

const UserGuideTour = ({ isOpen, onClose, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const finishingRef = useRef(false); // prevent double-call

  // Reset step when tour closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      finishingRef.current = false;
    }
  }, [isOpen]);

  const calculatePopupPosition = rect => {
    if (!rect) return { top: 0, left: 0 };
    const popupWidth = 320;
    const popupHeight = 180;
    let top, left;
    if (rect.bottom + popupHeight + 20 < window.innerHeight) {
      top = rect.bottom + 16;
    } else {
      top = rect.top - popupHeight - 16;
    }
    left = rect.left + rect.width / 2 - popupWidth / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - popupWidth - 16));
    return { top, left };
  };

  const updateTarget = () => {
    const el = document.querySelector(steps[currentStep].target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      setPopupPos(calculatePopupPosition(rect));
    } else {
      setTimeout(updateTarget, 100);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateTarget();
      const handleResize = () => updateTarget();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isOpen, currentStep]);

  // Enter key handler
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Enter') {
        // Ignore if typing in an input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        e.preventDefault(); // prevent any default action
        e.stopPropagation();

        // Prevent double‑finish
        if (finishingRef.current) return;

        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          finishingRef.current = true;
          onFinish(); // this closes the tour
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentStep, onFinish]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Overlay with cutout */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{
          clipPath: targetRect
            ? `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${targetRect.top}px, ${targetRect.left}px ${targetRect.top}px, ${targetRect.left}px ${targetRect.bottom}px, ${targetRect.right}px ${targetRect.bottom}px, ${targetRect.right}px ${targetRect.top}px, 0% ${targetRect.top}px)`
            : 'none',
        }}
      />

      {/* Highlight border */}
      {targetRect && (
        <div
          className="absolute border-2 border-white rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 20px rgba(255,255,255,0.3)',
            animation: 'pulse 2s infinite',
          }}
        />
      )}

      {/* Popup */}
      {targetRect && (
        <div
          className="absolute pointer-events-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5 max-w-[320px] transition-all duration-300"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
          <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">
            {steps[currentStep].title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {steps[currentStep].description}
          </p>
          <div className="flex justify-end gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (finishingRef.current) return;
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  finishingRef.current = true;
                  onFinish();
                }
              }}
              className="px-4 py-1.5 text-xs font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              {currentStep < steps.length - 1 ? 'Next (Enter)' : 'Finish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGuideTour;
