import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import useLocalStorage from '../../hooks/useLocalStorage';

const initialDraft = {
  title: '',
  content: '',
  bgColor: '',
  textColor: '#1f2937',
  editorFavorite: false,
  tags: [], // Added tags to the draft
};

const Dashboard = () => {
  const [notes, setNotes] = useLocalStorage('qwicknotes_notes', []);
  const [searchQuery, setSearchQuery] = useLocalStorage('qwicknotes_search', '');
  const [sortOption, setSortOption] = useLocalStorage('qwicknotes_sort', 'Newest First');
  const [showFavoritesOnly, setShowFavoritesOnly] = useLocalStorage('qwicknotes_show_favs', false);
  const [filterTag, setFilterTag] = useLocalStorage('qwicknotes_filter_tag', null);
  const [allTags, setAllTags] = useLocalStorage('qwicknotes_all_tags', ['Work', 'Personal']);
  const [editorDraft, setEditorDraft] = useLocalStorage('qwicknotes_editor_draft', initialDraft);

  // FIXED: Added fallback default array `= []` to prevent undefined tags
  const { title, content, bgColor, textColor, editorFavorite, tags = [] } = editorDraft;

  const setTitle = val => setEditorDraft(prev => ({ ...prev, title: val }));
  const setContent = val => setEditorDraft(prev => ({ ...prev, content: val }));
  const setBgColor = val => setEditorDraft(prev => ({ ...prev, bgColor: val }));
  const setTextColor = val => setEditorDraft(prev => ({ ...prev, textColor: val }));
  const setEditorFavorite = val => setEditorDraft(prev => ({ ...prev, editorFavorite: val }));
  const setEditorTags = val => setEditorDraft(prev => ({ ...prev, tags: val }));

  const [editingId, setEditingId] = useLocalStorage('qwicknotes_editing_id', null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const isTyping = title.trim() !== '' || content.trim() !== '';

  useEffect(() => {
    if (editingId) {
      const noteToEdit = notes.find(n => n.id === editingId);
      if (noteToEdit) {
        setEditorDraft({
          title: noteToEdit.title,
          content: noteToEdit.content,
          bgColor: noteToEdit.bgColor || '',
          textColor: noteToEdit.textColor || '#1f2937',
          editorFavorite: noteToEdit.isFavorite || false,
          tags: noteToEdit.tags || [],
        });
      } else {
        setEditingId(null);
        setEditorDraft(initialDraft);
      }
    }
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (showFavoritesOnly && !note.isFavorite) return false;
    if (filterTag && !(note.tags && note.tags.includes(filterTag))) return false;

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

  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (trimmed && !allTags.includes(trimmed)) {
      setAllTags([trimmed, ...allTags]);
    }
    setNewTagName('');
    setIsCreatingTag(false);
  };

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
                tags: tags,
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
        tags: tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    setEditorDraft(initialDraft);
  };

  const handleEditNote = note => {
    setEditorDraft({
      title: note.title,
      content: note.content,
      bgColor: note.bgColor || '',
      textColor: note.textColor || '#1f2937',
      editorFavorite: note.isFavorite || false,
      tags: note.tags || [],
    });
    setEditingId(note.id);
  };

  const handleToggleFavorite = id => {
    setNotes(prevNotes =>
      prevNotes.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)),
    );
  };

  const handleDeleteNote = id => {
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (editingId === noteToDelete) {
      setEditingId(null);
      setEditorDraft(initialDraft);
    }
    setNotes(notes.filter(note => note.id !== noteToDelete));
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
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
            tags={tags}
            setTags={setEditorTags}
            allTags={allTags}
            isCreatingTag={isCreatingTag}
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
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            allTags={allTags}
            isCreatingTag={isCreatingTag}
            setIsCreatingTag={setIsCreatingTag}
            newTagName={newTagName}
            setNewTagName={setNewTagName}
            handleCreateTag={handleCreateTag}
            currentEditingId={editingId}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        note={notes.find(n => n.id === noteToDelete)}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
};

export default Dashboard;
