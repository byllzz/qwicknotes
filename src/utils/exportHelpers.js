import jsPDF from 'jspdf';
import JSZip from 'jszip';

// Strip HTML for text-based exports
const stripHtml = html => (html ? html.replace(/<[^>]*>/g, '') : '');

// 1. Download as .txt
export const downloadText = (content, filename = 'note') => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// 2. Download as .md
export const downloadMarkdown = (content, filename = 'note') => {
  // For markdown, we just use the stripped text but save as .md
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

// 3. Download as .pdf (Text-based, simple and reliable)
export const downloadPDF = (content, filename = 'note') => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 10, 10);
  doc.save(`${filename}.pdf`);
};

// 4. Download ALL notes as a ZIP file containing individual .txt files
export const downloadAllAsZip = notes => {
  const zip = new JSZip();
  notes.forEach((note, index) => {
    const textContent = `${note.title}\n\n${stripHtml(note.content)}`;
    zip.file(`note_${index + 1}_${note.title}.txt`, textContent);
  });
  zip.generateAsync({ type: 'blob' }).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_notes.zip';
    a.click();
    URL.revokeObjectURL(url);
  });
};
