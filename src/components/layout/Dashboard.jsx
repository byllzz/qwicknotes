import React, { useState } from 'react';
import { Search } from 'lucide-react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';
import useLocalStorage from '../../hooks/useLocalStorage';

const Dashboard = () => {
  const [notes, setNotes] = useLocalStorage('qwicknotes_notes', []);
  const [searchQuery, setSearchQuery] = useLocalStorage('qwicknotes_search', '');
  const [sortOption, setSortOption] = useLocalStorage('qwicknotes_sort', 'Newest First');
  const [showFavoritesOnly, setShowFavoritesOnly] = useLocalStorage('qwicknotes_show_favs', false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [borderColor, setBorderColor] = useState('#000000'); // Renamed for clarity
  const [bgColor, setBgColor] = useState(''); // Empty = transparent
  const [textColor, setTextColor] = useState('#1f2937'); // Default dark gray
  const [tags, setTags] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editorFavorite, setEditorFavorite] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConflictOpen, setDeleteConflictOpen] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);

  const isTyping = title.trim() !== '' || content.trim() !== '';

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (showFavoritesOnly) return matchesSearch && note.isFavorite === true;
    return matchesSearch;
  });

  const applySort = (notesList, sortOption) => {
    const sortedList = [...notesList];
    switch (sortOption) {
      case 'Newest First':
        return sortedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'Oldest First':
        return sortedList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'Recently Updated':
        return sortedList.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt),
        );
      case 'Largest Size':
        return sortedList.sort((a, b) => b.content.length - a.content.length);
      case 'Smallest Size':
        return sortedList.sort((a, b) => a.content.length - b.content.length);
      case 'Title A-Z':
        return sortedList.sort((a, b) => a.title.localeCompare(b.title));
      case 'Title Z-A':
        return sortedList.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sortedList;
    }
  };

  const displayNotes = applySort(filteredNotes, sortOption);

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
            ? {
                ...n,
                title: title.trim() || 'Untitled',
                content: noteContent.trim(),
                borderColor,
                bgColor,
                textColor, // Save colors
                tags,
                isFavorite: editorFavorite,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim() || 'Untitled',
        content: noteContent.trim(),
        borderColor,
        bgColor,
        textColor, // Save colors
        tags,
        isFavorite: editorFavorite,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }

    // Reset all fields
    setTitle('');
    setContent('');
    setTags([]);
    setBorderColor('#000000'); // Reset to default black
    setBgColor(''); // Reset transparent
    setTextColor('#1f2937'); // Reset default dark text
    setEditorFavorite(false);
  };

  const handleEditNote = note => {
    setTitle(note.title);
    setContent(note.content);
    setBorderColor(note.borderColor || '#000000');
    setBgColor(note.bgColor || '');
    setTextColor(note.textColor || '#1f2937');
    setTags(note.tags);
    setEditingId(note.id);
    setEditorFavorite(note.isFavorite || false);
  };

  const handleToggleFavorite = id => {
    setNotes(prevNotes =>
      prevNotes.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)),
    );
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
    setBorderColor('#000000');
    setBgColor('');
    setTextColor('#1f2937');
    setEditorFavorite(false);
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
        <div className="w-[42%] min-w-[450px] h-full">
          <NoteEditor
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            borderColor={borderColor}
            setBorderColor={setBorderColor}
            bgColor={bgColor}
            setBgColor={setBgColor}
            textColor={textColor}
            setTextColor={setTextColor}
            tags={tags}
            setTags={setTags}
            onSave={handleSaveNote}
            isTyping={isTyping}
            isEditing={!!editingId}
            isFavorite={editorFavorite}
            onToggleFavorite={() => setEditorFavorite(!editorFavorite)}
          />
        </div>
        <div className="flex-1 h-full">
          <NotesList
            notes={displayNotes}
            rawNotes={filteredNotes}
            searchQuery={searchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalCancel}
        onConfirm={handleModalConfirm}
        title="Empty Description"
        message="You haven't added any content. Proceed with a default description?"
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
