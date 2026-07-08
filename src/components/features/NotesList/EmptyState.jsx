import { FileText } from 'lucide-react';

const EmptyState = ({ isSearchingEmpty }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-20 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center mb-4 relative">
        <FileText size={40} className="text-gray-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-6 border-2 border-gray-200 bg-white" />
      </div>
      {isSearchingEmpty ? (
        <>
          <p className="text-gray-400 font-medium text-base">No matching notes found</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search terms</p>
        </>
      ) : (
        <p className="text-gray-400 font-medium">No notes yet. Start writing!</p>
      )}
    </div>
  );
};

export default EmptyState;
