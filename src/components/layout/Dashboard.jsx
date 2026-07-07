import { useState } from 'react';
import NoteEditor from '../featrues/NewNote/NoteEditor';
import NotesList from '../featrues/NotesList/NotesList';

const Dashboard = () => {
  // Main State
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#000000');
  const [tags, setTags] = useState([]);

  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) return;

    const newNote = {
      id: Date.now(),
      title: title.trim() || 'Untitled',
      content: content.trim(),
      color: color,
      tags: tags,
      createdAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]); // Add new note to top
    // Clear the form
    setTitle('');
    setContent('');
    setTags([]);
  };

  return (
    <div className="flex flex-row w-full h-[calc(100vh-80px)] p-6 gap-6 overflow-hidden bg-gray-50">
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
        />
      </div>

      {/* Right Panel: Note Storage */}
      <div className="flex-1 h-full">
        <NotesList notes={notes} />
      </div>
    </div>
  );
};

export default Dashboard;
