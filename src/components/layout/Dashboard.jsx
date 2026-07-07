import { useState } from 'react';
import { Search } from 'lucide-react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';
import useLocalStorage from '../../hooks/useLocalStorage';

const Dashboard = () => {
  const [notes, setNotes] = useLocalStorage('qwicknotes_notes', []);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#000000');
  const [tags, setTags] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Modal State 1: Empty Description Popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State 2: Delete Conflict Popup
  const [deleteConflictOpen, setDeleteConflictOpen] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);

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
      setNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === editingId
            ? { ...n, title: title.trim() || 'Untitled', content: noteContent.trim(), color, tags }
            : n,
        ),
      );
      setEditingId(null);
    } else {
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

    setTitle('');
    setContent('');
    setTags([]);
  };

  const handleEditNote = note => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setTags(note.tags);
    setEditingId(note.id);
  };

  // UPDATED: Delete handler with Conflict Check
  const handleDeleteNote = id => {
    if (editingId === id) {
      // Trigger the Conflict Popup if deleting the currently edited note
      setNoteToDeleteId(id);
      setDeleteConflictOpen(true);
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  // Confirm delete while editing
  const handleDeleteConflictConfirm = () => {
    // 1. Reset the left panel
    setEditingId(null);
    setTitle('');
    setContent('');
    // 2. Delete the note
    setNotes(notes.filter(note => note.id !== noteToDeleteId));
    // 3. Close modal
    setDeleteConflictOpen(false);
    setNoteToDeleteId(null);
  };

  const handleDeleteConflictCancel = () => {
    setDeleteConflictOpen(false);
    setNoteToDeleteId(null);
  };

  // Modal Handlers (Empty desc)
  const handleModalConfirm = () => {
    createAndSaveNote('No description provided.');
    setIsModalOpen(false);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-80px)] p-6 gap-4 bg-gray-50 overflow-hidden">
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center">
        <Search size={18} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search in titles and content..."
          className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>

      <div className="flex flex-row w-full h-full gap-6 overflow-hidden">
        {/* Left Panel */}
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
            isTyping={isTyping}
            isEditing={!!editingId}
            editingId={editingId}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 h-full">
          <NotesList notes={notes} onEdit={handleEditNote} onDelete={handleDeleteNote} />
        </div>
      </div>

      {/* Modal: Empty Description */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        onConfirm={handleModalConfirm}
        title="Empty Description"
        message="You haven't added any content to this note. Proceed with a default description?"
      />

      {/* NEW Modal: Delete Conflict */}
      <ConfirmationModal
        isOpen={deleteConflictOpen}
        onClose={handleDeleteConflictCancel}
        onConfirm={handleDeleteConflictConfirm}
        title="Currently Editing This Note"
        message="You are actively editing this note in the left panel. If you delete it now, the editor will reset to a new note. Are you sure you want to delete it?"
      />
    </div>
  );
};

export default Dashboard;
