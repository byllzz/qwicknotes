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

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConflictOpen, setDeleteConflictOpen] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);

  const isTyping = title.trim() !== '' || content.trim() !== '';

  // Filter Logic: Search in both Title and Content (Case insensitive)
  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  const handleDeleteNote = id => {
    if (editingId === id) {
      setNoteToDeleteId(id);
      setDeleteConflictOpen(true);
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleDeleteConflictConfirm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setNotes(notes.filter(note => note.id !== noteToDeleteId));
    setDeleteConflictOpen(false);
    setNoteToDeleteId(null);
  };

  const handleDeleteConflictCancel = () => {
    setDeleteConflictOpen(false);
    setNoteToDeleteId(null);
  };

  const handleModalConfirm = () => {
    createAndSaveNote('No description provided.');
    setIsModalOpen(false);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-80px)] p-6 gap-4 bg-gray-50 overflow-hidden">
      {/* Top Search Bar with logic attached */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center">
        <Search size={18} className="text-gray-400 mr-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
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

        {/* Right Panel - Pass filteredNotes instead of notes */}
        <div className="flex-1 h-full">
          <NotesList notes={filteredNotes} onEdit={handleEditNote} onDelete={handleDeleteNote} />
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        onConfirm={handleModalConfirm}
        title="Empty Description"
        message="You haven't added any content to this note. Proceed with a default description?"
      />
      <ConfirmationModal
        isOpen={deleteConflictOpen}
        onClose={handleDeleteConflictCancel}
        onConfirm={handleDeleteConflictConfirm}
        title="Currently Editing This Note"
        message="You are actively editing this note. If you delete it, the editor will reset."
      />
    </div>
  );
};

export default Dashboard;
