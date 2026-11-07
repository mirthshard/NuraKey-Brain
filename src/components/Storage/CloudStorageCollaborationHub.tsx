import React, { useState } from 'react';
import { 
  Cloud, 
  Folder, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Image, 
  Archive, 
  File, 
  ExternalLink, 
  Link2, 
  Check, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  HardDrive, 
  CheckCircle2, 
  Share2, 
  Star, 
  Trash2, 
  ArrowUpRight,
  ThumbsUp,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { 
  Partner, 
  BrainDocument, 
  CloudFileItem, 
  CloudProvider, 
  CollaborationRule 
} from '../../types/brain';

interface CloudStorageCollaborationHubProps {
  currentPartner: Partner;
  documents: BrainDocument[];
  cloudFiles: CloudFileItem[];
  collaborationRules: CollaborationRule[];
  onAddCloudFile: (file: CloudFileItem) => void;
  onLinkFileToDoc: (fileId: string, docId: string) => void;
  onVoteRule: (ruleId: string, partner: Partner) => void;
  onNavigateToDoc: (docId: string) => void;
  onOpenAi: (prompt?: string) => void;
}

export const CloudStorageCollaborationHub: React.FC<CloudStorageCollaborationHubProps> = ({
  currentPartner,
  documents,
  cloudFiles,
  collaborationRules,
  onAddCloudFile,
  onLinkFileToDoc,
  onVoteRule,
  onNavigateToDoc,
  onOpenAi,
}) => {
  const [activeProvider, setActiveProvider] = useState<CloudProvider>('onedrive');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [linkingFileId, setLinkingFileId] = useState<string | null>(null);
  const [selectedDocIdToLink, setSelectedDocIdToLink] = useState<string>(documents[0]?.id || '');
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);

  // New File State
  const [newFileName, setNewFileName] = useState('');
  const [newFileFolder, setNewFileFolder] = useState('01_Travel_Portugal_2027');
  const [newFileType, setNewFileType] = useState<'document' | 'spreadsheet' | 'pdf' | 'archive'>('spreadsheet');
  const [newFileSize, setNewFileSize] = useState('1.5 MB');

  // Sync Simulation State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
    }, 1200);
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newFile: CloudFileItem = {
      id: `cloud-${Date.now()}`,
      name: newFileName.trim().endsWith('.xlsx') || newFileName.trim().endsWith('.pdf') ? newFileName.trim() : `${newFileName.trim()}.${newFileType === 'spreadsheet' ? 'xlsx' : newFileType === 'pdf' ? 'pdf' : 'docx'}`,
      provider: activeProvider,
      folder: newFileFolder,
      size: newFileSize,
      modified: 'Just now',
      modifiedBy: currentPartner,
      type: newFileType,
      syncStatus: 'synced',
      sharingAccess: 'Key & Nura (Shared)',
      starred: true,
    };

    onAddCloudFile(newFile);
    setNewFileName('');
    setIsNewFileModalOpen(false);
  };

  const handleConfirmLink = () => {
    if (linkingFileId && selectedDocIdToLink) {
      onLinkFileToDoc(linkingFileId, selectedDocIdToLink);
      setIsLinkingModalOpen(false);
      setLinkingFileId(null);
    }
  };

  // Unique folders
  const allFolders = Array.from(new Set(cloudFiles.map(f => f.folder))).sort();

  // Filtered files
  const filteredFiles = cloudFiles.filter(file => {
    if (activeProvider !== 'proton' && file.provider !== activeProvider && file.provider !== 'proton') {
      // allow viewing provider
      if (file.provider !== activeProvider) return false;
    }
    if (selectedFolder !== 'all' && file.folder !== selectedFolder) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return file.name.toLowerCase().includes(q) || file.folder.toLowerCase().includes(q);
    }
    return true;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'spreadsheet': return <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'pdf': return <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'document': return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'archive': return <Archive className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'image': return <Image className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default: return <File className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto bg-slate-100/90 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
      {/* Top Executive Header Card - High Visual Contrast */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 border-t-4 border-t-sky-500 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                Multi-Cloud Storage & Real-Time Collaboration Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              OneDrive & Google Drive Integration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Bi-directional cloud sync, linked external spreadsheets/PDFs, shared family quotas, and collaborative co-authoring rules for Key & Nura.
            </p>
          </div>

          {/* Sync Trigger and Cloud Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Storage...' : 'Sync Cloud Storage'}</span>
            </button>

            <button
              onClick={() => setIsNewFileModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Link Cloud Asset</span>
            </button>
          </div>
        </div>

        {/* 3 Storage Quota / Health Metric Cards - Crisp High Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Provider 1: Microsoft OneDrive */}
          <div 
            onClick={() => setActiveProvider('onedrive')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs ${
              activeProvider === 'onedrive'
                ? 'bg-sky-50/70 dark:bg-sky-950/50 border-sky-500 ring-2 ring-sky-500/20'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-sky-600" />
                <span>Microsoft OneDrive</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                Connected
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              1.4 TB <span className="text-xs text-slate-400 font-normal">/ 2.0 TB Used</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '70%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>Key & Nura Shared Folder</span>
              <span>70% full</span>
            </div>
          </div>

          {/* Provider 2: Google Drive */}
          <div 
            onClick={() => setActiveProvider('googledrive')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs ${
              activeProvider === 'googledrive'
                ? 'bg-amber-50/70 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-amber-600" />
                <span>Google Drive Workspace</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                Connected
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              840 GB <span className="text-xs text-slate-400 font-normal">/ 2.0 TB Used</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>Shared Google Drive Root</span>
              <span>42% full</span>
            </div>
          </div>

          {/* Provider 3: Proton Drive Shield */}
          <div 
            onClick={() => setActiveProvider('proton')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs ${
              activeProvider === 'proton'
                ? 'bg-purple-50/70 dark:bg-purple-950/50 border-purple-500 ring-2 ring-purple-500/20'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Proton Drive E2EE Vault</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300">
                Zero-Knowledge
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              45 GB <span className="text-xs text-slate-400 font-normal">/ 500 GB Encrypted</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '9%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>Dual-Partner Key Exchange</span>
              <span>9% full</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud File Explorer & Linked Brain Assets */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {activeProvider === 'onedrive' ? 'Microsoft OneDrive' : activeProvider === 'googledrive' ? 'Google Drive' : 'Proton Drive'} Shared Folder Explorer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse, attach, and cross-reference external spreadsheets, legal PDFs, and photos with NuraKey-Brain documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter files..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-sky-500 w-44"
              />
            </div>

            {/* Folder Dropdown */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 font-mono"
            >
              <option value="all">All Folders</option>
              {allFolders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* File Table / Card List */}
        <div className="space-y-2.5">
          {filteredFiles.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500">
              No files found in this provider or folder. Click "Add / Link Cloud Asset" to register a cloud file.
            </div>
          ) : (
            filteredFiles.map((file) => {
              const linkedDoc = documents.find(d => d.id === file.linkedDocId);

              return (
                <div 
                  key={file.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700/80 transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {file.name}
                        </span>
                        {file.starred && (
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        <span className="text-sky-600 dark:text-sky-400 font-semibold">{file.folder}</span>
                        <span>·</span>
                        <span>{file.size}</span>
                        <span>·</span>
                        <span>Modified {file.modified} by {file.modifiedBy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Linked Doc Badge and Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                    {linkedDoc ? (
                      <button
                        onClick={() => onNavigateToDoc(linkedDoc.id)}
                        className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                        title="Click to jump to linked document"
                      >
                        <Link2 className="w-3 h-3 text-indigo-600" />
                        <span className="truncate max-w-[130px]">{linkedDoc.title}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setLinkingFileId(file.id);
                          setIsLinkingModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Link this external file to a Brain document"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Link to Note</span>
                      </button>
                    )}

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                      Synced
                    </span>

                    <button
                      onClick={() => onOpenAi(`Synthesize and extract key data points from cloud asset "${file.name}" for Key and Nura.`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                      title="Analyze with AI"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Couple Collaboration Roadmap & Sharing Architecture Matrix */}
      <div className="bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-900/60 border-t-4 border-t-indigo-600 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-indigo-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Couple Collaboration & Shared Storage Architecture Roadmap
                </h2>
                <span className="text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-300">
                  Dual-Vote Config
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Features planned & active to enable seamless co-working on documents, shared storage, and life logistics.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAi('Help Key and Nura brainstorm next-generation shared life collaboration features.')}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Propose Collaboration Rule</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {collaborationRules.map((rule) => {
            const hasVoted = rule.partnerVotes.includes(currentPartner);

            return (
              <div 
                key={rule.id}
                className="bg-white dark:bg-slate-800/80 border-2 border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 space-y-2 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      {rule.badge}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      rule.status === 'active' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300'
                    }`}>
                      {rule.status === 'active' ? 'Active in OS' : 'Roadmap'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {rule.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400">Votes ({rule.partnerVotes.length}/2):</span>
                    <div className="flex items-center -space-x-1">
                      {rule.partnerVotes.map(v => (
                        <div
                          key={v}
                          className={`w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${
                            v === 'Key' ? 'bg-indigo-600' : 'bg-purple-600'
                          }`}
                          title={v}
                        >
                          {v[0]}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onVoteRule(rule.id, currentPartner)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-2.5 h-2.5" />
                    <span>{hasVoted ? 'Endorsed' : 'Endorse'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Link File to Document Modal */}
      {isLinkingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
              Link Cloud File to Brain Document
            </h3>
            <p className="text-xs text-slate-500">
              Select which document note should reference this external cloud spreadsheet or document:
            </p>

            <select
              value={selectedDocIdToLink}
              onChange={(e) => setSelectedDocIdToLink(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white font-medium"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>
                  [{d.domainId}] {d.title}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLinkingModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLink}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                Confirm Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewFile} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
              Add Cloud Asset ({activeProvider.toUpperCase()})
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-mono mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Flight_Reservations_TAP_Air.pdf"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-mono mb-1">Folder Category</label>
                  <select
                    value={newFileFolder}
                    onChange={(e) => setNewFileFolder(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  >
                    {allFolders.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-mono mb-1">Asset Type</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="spreadsheet">Spreadsheet (.xlsx)</option>
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="document">Doc (.docx)</option>
                    <option value="archive">Archive (.zip/.tar)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewFileModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                Register Cloud File
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
