import { useState } from 'react';
import { Search } from 'lucide-react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#000000');
  const [tags, setTags] = useState([]);

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Typing indicator logic
  const isTyping = title.trim() !== '' || content.trim() !== '';

  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) return;
    if (title.trim() && !content.trim()) {
      setIsModalOpen(true);
      return;
    }
    createAndSaveNote(content);
  };

  const createAndSaveNote = noteContent => {
    if (editingId) {
      // UPDATE existing note logic
      setNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === editingId
            ? {
                ...n,
                title: title.trim() || 'Untitled',
                content: noteContent.trim(),
                color,
                tags,
              }
            : n,
        ),
      );
      setEditingId(null); // Reset edit mode
    } else {
      // CREATE new note logic
      const newNote = {
        id: Date.now(),
        title: title.trim() || 'Untitled',
        content: noteContent.trim(),
        color,
        tags,
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }

    // Clear the form
    setTitle('');
    setContent('');
    setTags([]);
  };

  // Edit handler (Populates left panel)
  const handleEditNote = note => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setTags(note.tags);
    setEditingId(note.id);
  };

  // Delete handler
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
    <div className="flex flex-col w-full h-[calc(100vh-80px)] p-6 gap-4 bg-gray-50 overflow-hidden">
      {/* Top Search Bar (Matches Screenshot 2) */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center">
        <Search size={18} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search in titles and content..."
          className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>

      <div className="flex flex-row w-full h-full gap-6 overflow-hidden">
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
            isTyping={isTyping} // Pass typing state
            editingId={editingId}
          />
        </div>

        {/* Right Panel: Note Storage */}
        <div className="flex-1 h-full">
          <NotesList notes={notes} onEdit={handleEditNote} onDelete={handleDeleteNote} />
        </div>
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
