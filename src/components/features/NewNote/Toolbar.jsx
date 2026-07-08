import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

const Toolbar = ({ editor }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-1.5 flex flex-wrap gap-1 mb-1.5 editor-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('underline') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <UnderlineIcon size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <Heading2 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <Heading3 size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'hover:bg-gray-200'
        }`}
      >
        <Quote size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          !editor.can().undo() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
        }`}
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`p-1.5 rounded text-gray-600 transition-colors ${
          !editor.can().redo() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
        }`}
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default Toolbar;
