import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const initialDraft = {
  title: '',
  content: '',
  bgColor: '',
  textColor: '#1f2937',
  editorFavorite: false,
  tags: [],
};

const useNotes = () => {
  const [notes, setNotes] = useLocalStorage('qwicknotes_notes', []);
  const [searchQuery, setSearchQuery] = useLocalStorage('qwicknotes_search', '');
  const [sortOption, setSortOption] = useLocalStorage('qwicknotes_sort', 'Newest First');
  const [showFavoritesOnly, setShowFavoritesOnly] = useLocalStorage('qwicknotes_show_favs', false);
  const [filterTag, setFilterTag] = useLocalStorage('qwicknotes_filter_tag', null);
  const [allTags, setAllTags] = useLocalStorage('qwicknotes_all_tags', ['Work', 'Personal']);
  const [editorDraft, setEditorDraft] = useLocalStorage('qwicknotes_editor_draft', initialDraft);
  const [editingId, setEditingId] = useLocalStorage('qwicknotes_editing_id', null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const stripHtml = html => (html ? html.replace(/<[^>]*>/g, '') : '');
  const isTyping = editorDraft.title.trim() !== '' || stripHtml(editorDraft.content).trim() !== '';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (trimmed && !allTags.includes(trimmed)) {
      setAllTags([trimmed, ...allTags]);
    }
    setNewTagName('');
    setIsCreatingTag(false);
  };

  const handleDeleteGlobalTag = tagToDelete => {
    setAllTags(prev => prev.filter(t => t !== tagToDelete));
    setNotes(prevNotes =>
      prevNotes.map(n => ({
        ...n,
        tags: n.tags ? n.tags.filter(t => t !== tagToDelete) : [],
      })),
    );
    if (editorDraft.tags.includes(tagToDelete)) {
      setEditorDraft(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tagToDelete),
      }));
    }
    if (filterTag === tagToDelete) setFilterTag(null);
  };

  const handleDeleteAllGlobalTags = () => {
    setAllTags([]);
    setNotes(prevNotes => prevNotes.map(n => ({ ...n, tags: [] })));
    setEditorDraft(prev => ({ ...prev, tags: [] }));
    setFilterTag(null);
  };

  const handleDeleteAllNotes = () => {
    setNotes([]);
    setEditingId(null);
    setEditorDraft(initialDraft);
    setFilterTag(null);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase());
    if (showFavoritesOnly && !note.isFavorite) return false;
    if (filterTag && !(note.tags && note.tags.includes(filterTag))) return false;
    return matchesSearch;
  });

  const applySort = (list, option) => {
    const sorted = [...list];
    switch (option) {
      case 'Newest First':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'Oldest First':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'Recently Updated':
        return sorted.sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt),
        );
      case 'Largest Size':
        return sorted.sort((a, b) => stripHtml(b.content).length - stripHtml(a.content).length);
      case 'Smallest Size':
        return sorted.sort((a, b) => stripHtml(a.content).length - stripHtml(b.content).length);
      case 'Title A-Z':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'Title Z-A':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  const displayNotes = applySort(filteredNotes, sortOption);

  const createAndSaveNote = noteContent => {
    if (editingId) {
      setNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === editingId
            ? {
                ...n,
                title: editorDraft.title.trim() || 'Untitled',
                content: noteContent.trim(),
                bgColor: editorDraft.bgColor,
                textColor: editorDraft.textColor,
                isFavorite: editorDraft.editorFavorite,
                tags: editorDraft.tags,
                updatedAt: new Date().toISOString(),
              }
            : n,
        ),
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: editorDraft.title.trim() || 'Untitled',
        content: noteContent.trim(),
        bgColor: editorDraft.bgColor,
        textColor: editorDraft.textColor,
        isFavorite: editorDraft.editorFavorite,
        tags: editorDraft.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    setEditorDraft(initialDraft);
  };

  const handleSaveNote = () => {
    if (!editorDraft.title.trim() && !stripHtml(editorDraft.content).trim()) return;
    if (editorDraft.title.trim() && !stripHtml(editorDraft.content).trim()) {
      setIsModalOpen(true);
      return;
    }
    createAndSaveNote(editorDraft.content);
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

  return {
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    showFavoritesOnly,
    setShowFavoritesOnly,
    filterTag,
    setFilterTag,
    allTags,
    setAllTags,
    editorDraft,
    setEditorDraft,
    editingId,
    setEditingId,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    noteToDelete,
    setNoteToDelete,
    isCreatingTag,
    setIsCreatingTag,
    newTagName,
    setNewTagName,
    stripHtml,
    isTyping,
    handleCreateTag,
    handleDeleteGlobalTag,
    handleDeleteAllGlobalTags,
    handleDeleteAllNotes,
    filteredNotes,
    displayNotes,
    handleSaveNote,
    handleEditNote,
    handleToggleFavorite,
    handleDeleteNote,
    handleDeleteConfirmed,
    handleModalConfirm,
    handleModalCancel,
  };
};

export default useNotes;
