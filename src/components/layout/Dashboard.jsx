import { useState } from 'react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#000000');
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normal Save Logic
  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) return;
    if (title.trim() && !content.trim()) {
      setIsModalOpen(true);
      return;
    }
    createAndSaveNote(content);
  };

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
    setTitle('');
    setContent('');
    setTags([]);
  };

  // NEW: Delete Logic
  const handleDeleteNote = id => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Modal Handlers
  const handleModalConfirm = () => {
    createAndSaveNote('No description provided.');
    setIsModalOpen(false);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row w-full h-[calc(100vh-80px)] p-6 gap-6 overflow-hidden bg-gray-50">
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

      {/* Pass the delete handler down to the list */}
      <div className="flex-1 h-full">
        <NotesList notes={notes} onDelete={handleDeleteNote} />
      </div>

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
