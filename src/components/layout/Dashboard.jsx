import React, { useState } from 'react';
import { Search } from 'lucide-react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';
import useLocalStorage from '../../hooks/useLocalStorage';

// Default draft state if nothing is in localstorage yet
const initialDraft = {
  title: '',
  content: '',
  bgColor: '',
  textColor: '#1f2937',
  editorFavorite: false,
};

const Dashboard = () => {
  const [notes, setNotes] = useLocalStorage('qwicknotes_notes', []);
  const [searchQuery, setSearchQuery] = useLocalStorage('qwicknotes_search', '');
  const [sortOption, setSortOption] = useLocalStorage('qwicknotes_sort', 'Newest First');
  const [showFavoritesOnly, setShowFavoritesOnly] = useLocalStorage('qwicknotes_show_favs', false);

  // Persist the ENTIRE left panel draft state
  const [editorDraft, setEditorDraft] = useLocalStorage('qwicknotes_editor_draft', initialDraft);

  // Destructure the draft for the props expected by NoteEditor
  const { title, content, bgColor, textColor, editorFavorite } = editorDraft;

  // Create wrapper setters that update the draft object in localStorage
  const setTitle = val => setEditorDraft(prev => ({ ...prev, title: val }));
  const setContent = val => setEditorDraft(prev => ({ ...prev, content: val }));
  const setBgColor = val => setEditorDraft(prev => ({ ...prev, bgColor: val }));
  const setTextColor = val => setEditorDraft(prev => ({ ...prev, textColor: val }));
  const setEditorFavorite = val => setEditorDraft(prev => ({ ...prev, editorFavorite: val }));

  const [editingId, setEditingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConflictOpen, setDeleteConflictOpen] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);

  const isTyping = title.trim() !== '' || content.trim() !== '';

  // Filter Logic
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (showFavoritesOnly) return matchesSearch && note.isFavorite === true;
    return matchesSearch;
  });

  // Sorting Logic
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
                bgColor,
                textColor,
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
        bgColor,
        textColor,
        isFavorite: editorFavorite,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }

    // Clear the entire draft back to empty defaults
    setEditorDraft(initialDraft);
  };

  const handleEditNote = note => {
    // Load the note's data into the editor draft
    setEditorDraft({
      title: note.title,
      content: note.content,
      bgColor: note.bgColor || '',
      textColor: note.textColor || '#1f2937',
      editorFavorite: note.isFavorite || false,
    });
    setEditingId(note.id);
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
    setEditorDraft(initialDraft); // Reset draft fully on conflict delete
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
            bgColor={bgColor}
            setBgColor={setBgColor}
            textColor={textColor}
            setTextColor={setTextColor}
            tags={[]}
            setTags={() => {}} // Kept to avoid breaking props if needed later
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
