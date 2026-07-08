import { Search } from 'lucide-react';
import NoteEditor from '../features/NewNote/NoteEditor';
import NotesList from '../features/NotesList/NotesList';
import ConfirmationModal from '../common/ConfirmationModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import useNotes from '../../hooks/useNotes';

const Dashboard = () => {
  const {
    notes,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    showFavoritesOnly,
    setShowFavoritesOnly,
    filterTag,
    setFilterTag,
    allTags,
    editorDraft,
    setEditorDraft,
    editingId,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    noteToDelete,
    isCreatingTag,
    setIsCreatingTag,
    newTagName,
    setNewTagName,
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
  } = useNotes();

  return (
    <div className="flex flex-row w-full h-[calc(100vh-80px)] p-6 gap-8 overflow-hidden">
      <div className="w-[48%] min-w-[450px] h-full flex flex-col gap-3">
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-4 flex items-center shrink-0 transition-colors duration-200 search-input">
          <Search size={18} className="text-gray-400 dark:text-gray-500 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search in titles and content..."
            className="w-full outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
          />
        </div>

        <div className="flex-1 h-full note-editor-container">
          <NoteEditor
            title={editorDraft.title}
            setTitle={val => setEditorDraft(prev => ({ ...prev, title: val }))}
            content={editorDraft.content}
            setContent={val => setEditorDraft(prev => ({ ...prev, content: val }))}
            bgColor={editorDraft.bgColor}
            setBgColor={val => setEditorDraft(prev => ({ ...prev, bgColor: val }))}
            textColor={editorDraft.textColor}
            setTextColor={val => setEditorDraft(prev => ({ ...prev, textColor: val }))}
            tags={editorDraft.tags}
            setTags={val => setEditorDraft(prev => ({ ...prev, tags: val }))}
            allTags={allTags}
            isCreatingTag={isCreatingTag}
            setIsCreatingTag={setIsCreatingTag}
            newTagName={newTagName}
            setNewTagName={setNewTagName}
            handleCreateTag={handleCreateTag}
            onDeleteTag={handleDeleteGlobalTag}
            onDeleteAllTags={handleDeleteAllGlobalTags}
            onSave={handleSaveNote}
            isTyping={isTyping}
            isEditing={!!editingId}
            isFavorite={editorDraft.editorFavorite}
            onToggleFavorite={() =>
              setEditorDraft(prev => ({ ...prev, editorFavorite: !prev.editorFavorite }))
            }
          />
        </div>
      </div>

      <div className="flex-1 h-full notes-list-container">
        <NotesList
          notes={displayNotes}
          rawNotes={filteredNotes}
          allNotes={notes}
          searchQuery={searchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          allTags={allTags}
          currentEditingId={editingId}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onToggleFavorite={handleToggleFavorite}
          onDeleteAllNotes={handleDeleteAllNotes}
        />
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
