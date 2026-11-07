import React, { useState, useEffect } from 'react';
import { Search, X, FileText, ArrowRight } from 'lucide-react';
import { BrainDocument } from '../../types/brain';

interface GlobalSearchModalProps {
  documents: BrainDocument[];
  onSelectDocument: (docId: string) => void;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  documents,
  onSelectDocument,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filtered = documents.filter(d => {
    const q = query.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.path.toLowerCase().includes(q) ||
      d.frontmatter.tags.some(t => t.toLowerCase().includes(q)) ||
      d.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-4 shadow-2xl space-y-3 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, Portugal trip, goals, homelab, recipes..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              No matching files or notes found for "{query}"
            </div>
          ) : (
            filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  onSelectDocument(doc.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors flex items-center justify-between group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                      {doc.title}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate pl-5">
                    {doc.path}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                    {doc.docType}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or ↵ Enter</span>
          <span>ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
