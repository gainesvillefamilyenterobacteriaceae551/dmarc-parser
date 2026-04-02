'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function DropZone({ onFiles }: { onFiles: (files: FileList) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-md p-12 text-center cursor-pointer transition-colors',
        dragging
          ? 'border-blue-500 bg-blue-950/30'
          : 'border-[#30363d] bg-[#161b22] hover:border-blue-700 hover:bg-blue-950/10'
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="text-4xl mb-3 opacity-60 select-none">📨</div>
      <p className="text-sm font-semibold text-neutral-200 mb-1">
        Drop DMARC XML or ZIP files here
      </p>
      <p className="text-xs text-neutral-500 mb-4">or</p>
      <button
        className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043] text-white text-sm font-medium rounded-md transition-colors"
        onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
      >
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".xml,.zip"
        className="hidden"
        onChange={e => { if (e.target.files?.length) { onFiles(e.target.files); e.target.value = ''; } }}
      />
      <p className="text-xs text-neutral-600 mt-4">
        Supports multiple .xml and .zip files simultaneously
      </p>
    </div>
  );
}
