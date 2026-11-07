import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Check, 
  Copy, 
  Cloud
} from 'lucide-react';
import { BrainDocument, LifeDomain } from '../../types/brain';

interface ProtonExportModalProps {
  domains: LifeDomain[];
  documents: BrainDocument[];
  onClose: () => void;
}

export const ProtonExportModal: React.FC<ProtonExportModalProps> = ({
  domains,
  documents,
  onClose,
}) => {
  const [copiedTree, setCopiedTree] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadAllMarkdown = () => {
    const bundleText = documents.map(d => {
      return `=== FILE: ${d.path} ===\n---\ntype: ${d.frontmatter.type}\nowners: [${d.frontmatter.owners.join(', ')}]\ncreated: ${d.frontmatter.created}\nupdated: ${d.frontmatter.updated}\ntags: [${d.frontmatter.tags.join(', ')}]\n---\n\n${d.content}\n\n`;
    }).join('\n===============================\n\n');

    const blob = new Blob([bundleText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NuraKey-Brain-Proton-Tree.md';
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyFolderStructure = () => {
    const treeText = `Key-Nura/
├── Tutorials/
│   ├── NuraKey-Brain-Manual.md
│   └── Inbox.md
├── Relationship/
│   ├── Traditions-and-Things-We-Love.md
│   ├── Bucket-List.md
│   └── Important-Dates.md
├── Goals-and-Planning/
│   ├── Life-Plan.md
│   ├── 2026-Goals.md
│   └── Decision-Log.md
├── Home-and-Life-Admin/
│   ├── Maintenance-Log.md
│   └── Shared-Financial-Goals.md
├── Travel/
│   └── 2027-Portugal/
├── Education-and-Academy/
│   └── Learning-Roadmap.md
├── Tech-and-Builds/
│   └── Home-Lab-and-Network.md
├── Health-and-Wellbeing/
│   └── Shared-Habits.md
├── Spirituality-and-Mindfulness/
│   └── Gratitude-Journal.md
├── Curated-Lists/
│   └── Restaurants-and-Cafes.md
└── Security-Vault/
    └── Emergency-Runbook.md`;

    navigator.clipboard.writeText(treeText);
    setCopiedTree(true);
    setTimeout(() => setCopiedTree(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Proton Drive & Open Markdown Export
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Zero Lock-in Guarantee</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
            Proton Drive & Local File Tree Sync
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export all life domains into standard, human-readable Markdown files (<span className="font-mono text-slate-700 dark:text-slate-300">.md</span>) formatted for your local Proton folder or Cloudflare Pages / S3.
          </p>
        </div>

        {/* Tree Preview Box */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-700 dark:text-slate-300 max-h-56 overflow-y-auto space-y-1">
          <div className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">Key-Nura/ ({domains.length} Domains · {documents.length} Files Ready)</div>
          {domains.map((domain) => {
            const domainDocs = documents.filter(d => d.domainId === domain.id);
            return (
              <div key={domain.id} className="pl-2">
                <span className="text-slate-400 dark:text-slate-600">├── </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{domain.title.replace(/\s+/g, '-')}</span>/
                {domainDocs.map(d => (
                  <div key={d.id} className="pl-6 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="text-slate-400 dark:text-slate-600">│   ├── </span>
                    <span>{d.path.split('/').pop()}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Sync Instructions */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>How to use this with Proton Drive:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
            <li>Click <strong>Download All (.md bundle)</strong> below to export all active files.</li>
            <li>Place the downloaded files into your local <strong>Key-Nura</strong> folder on your PC.</li>
            <li>Proton Drive desktop app automatically syncs the files to both your and Nura's devices!</li>
            <li>Use Proton Calendar for time-sensitive events and Proton Tasks for daily to-dos.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopyFolderStructure}
            className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs transition-colors font-semibold"
          >
            {copiedTree ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTree ? 'Folder Tree Copied' : 'Copy Directory Tree ASCII'}</span>
          </button>

          <button
            onClick={handleDownloadAllMarkdown}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download All ({documents.length} Files as Markdown)</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Files exported successfully to your local downloads!</span>
          </div>
        )}
      </div>
    </div>
  );
};
