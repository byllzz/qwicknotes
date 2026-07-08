import React, { useState } from 'react';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import DeleteAllNotesModal from '../../common/DeleteAllNotesModal';
import IndividualExportModal from '../IndividualExport/IndividualExportModal';
import Controls from './Controls';
import EmptyState from './EmptyState';

const NotesList = ({
  notes,
  rawNotes,
  allNotes,
  searchQuery,
  sortOption,
  setSortOption,
  showFavoritesOnly,
  setShowFavoritesOnly,
  filterTag,
  setFilterTag,
  allTags,
  currentEditingId,
  onEdit,
  onDelete,
  onToggleFavorite,
  onDeleteAllNotes,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isIndividualExportOpen, setIsIndividualExportOpen] = useState(false);

  const handleCardClick = note => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const isSearchingEmpty = searchQuery.trim() !== '' && notes.length === 0;

  return (
    <div className="h-full flex flex-col relative top-2">
      <Controls
        notes={notes}
        rawNotes={rawNotes}
        allNotes={allNotes}
        sortOption={sortOption}
        setSortOption={setSortOption}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        allTags={allTags}
        onDeleteAllNotes={onDeleteAllNotes}
        setIsDeleteAllOpen={setIsDeleteAllOpen}
        setIsIndividualExportOpen={setIsIndividualExportOpen}
      />

      <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 overflow-y-auto">
        {notes.length === 0 ? (
          <EmptyState isSearchingEmpty={isSearchingEmpty} />
        ) : (
          <div className="flex flex-col gap-4">
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                currentEditingId={currentEditingId}
                onCardClick={handleCardClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <DeleteAllNotesModal
        isOpen={isDeleteAllOpen}
        notes={rawNotes}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          onDeleteAllNotes();
          setIsDeleteAllOpen(false);
        }}
      />

      <IndividualExportModal
        isOpen={isIndividualExportOpen}
        onClose={() => setIsIndividualExportOpen(false)}
        notes={notes}
      />
    </div>
  );
};

export default NotesList;
