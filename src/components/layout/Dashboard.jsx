import { useState } from 'react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';

const Dashboard = () => {
  // Main State
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#000000');
  const [tags, setTags] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normal Save Logic
  const handleSaveNote = () => {
    // If both are empty, do nothing
    if (!title.trim() && !content.trim()) return;

    // If there is a title but NO content, trigger the popup
    if (title.trim() && !content.trim()) {
      setIsModalOpen(true);
      return;
    }

    // Otherwise, save immediately (Both Title & Content exist)
    createAndSaveNote(content);
  };

  // Function to handle the actual saving
  const createAndSaveNote = noteContent => {
    const newNote = {
      id: Date.now(),
      title: title.trim() || 'Untitled',
      content: noteContent.trim(),
      color: color,
      tags: tags,
      createdAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    // Clear the form
    setTitle('');
    setContent('');
    setTags([]);
  };

  // Modal Handlers
  const handleModalConfirm = () => {
    // User clicked Confirm - Save with a default sample description
    createAndSaveNote('No description provided.');
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    // User clicked Cancel - Close modal and keep the user's typed title
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row w-full h-[calc(100vh-80px)] p-6 gap-6 overflow-hidden bg-gray-50">
      {/* Left Panel: Note Creator */}
      <div className="w-[42%] min-w-[450px] h-full">
        <NoteEditor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          color={color}
          setColor={setColor}
          tags={tags}
          setTags={setTags}
          onSave={handleSaveNote}
        />
      </div>

      {/* Right Panel: Note Storage */}
      <div className="flex-1 h-full">
        <NotesList notes={notes} />
      </div>

      {/* Render the Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        onConfirm={handleModalConfirm}
        title="Empty Description"
        message="You haven't added any content to this note. Proceed with a default description?"
      />
    </div>
  );
};

export default Dashboard;
