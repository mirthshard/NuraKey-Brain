import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  Save, 
  MessageSquare, 
  Eye, 
  Edit3, 
  Columns, 
  Check, 
  Share2, 
  Download, 
  Clock, 
  Lock,
  Plus,
  Send,
  CornerDownRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Partner, BrainDocument, LiveDocComment } from '../../types/brain';

interface LiveCoAuthoringEditorProps {
  currentPartner: Partner;
  documents: BrainDocument[];
  activeDocumentId: string;
  onSelectDocument: (docId: string) => void;
  onUpdateContent: (content: string) => void;
  onOpenAi: (prompt: string) => void;
}

export const LiveCoAuthoringEditor: React.FC<LiveCoAuthoringEditorProps> = ({
  currentPartner,
  documents,
  activeDocumentId,
  onSelectDocument,
  onUpdateContent,
  onOpenAi,
}) => {
  const activeDoc = documents.find(d => d.id === activeDocumentId) || documents[0];
  const [content, setContent] = useState(activeDoc.content);
  const [editorMode, setEditorMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Simulated live partner presence
  const otherPartner: Partner = currentPartner === 'Key' ? 'Nura' : 'Key';
  const [isOtherPartnerTyping, setIsOtherPartnerTyping] = useState(false);
  const [partnerStatusText, setPartnerStatusText] = useState(`${otherPartner} is viewing section 2`);

  // Document comments
  const [comments, setComments] = useState<LiveDocComment[]>([
    {
      id: 'c-1',
      author: 'Nura',
      text: 'Should we add Sintra Pena Palace morning slot pre-booking link here?',
      timestamp: 'Today at 09:15',
      resolved: false,
    },
    {
      id: 'c-2',
      author: 'Key',
      text: 'Done! Added to section 3 under Transit & Tickets.',
      timestamp: 'Today at 10:20',
      resolved: true,
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(true);

  // Sync content when activeDoc changes
  useEffect(() => {
    setContent(activeDoc.content);
  }, [activeDoc.id]);

  // Simulate occasional partner activity
  useEffect(() => {
    const timer = setInterval(() => {
      setIsOtherPartnerTyping(prev => !prev);
      if (!isOtherPartnerTyping) {
        setPartnerStatusText(`${otherPartner} is reviewing notes in line 42`);
      } else {
        setPartnerStatusText(`${otherPartner} is co-editing...`);
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [otherPartner, isOtherPartnerTyping]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    setSaveStatus('saving');
    onUpdateContent(newText);
    setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment: LiveDocComment = {
      id: `c-${Date.now()}`,
      author: currentPartner,
      text: newCommentText.trim(),
      timestamp: 'Just now',
      resolved: false,
    };
    setComments(prev => [...prev, newComment]);
    setNewCommentText('');
  };

  const handleToggleResolveComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
  };

  const handleRunInlineAi = (actionType: string) => {
    setIsAiLoading(true);
    setTimeout(() => {
      let appended = '';
      if (actionType === 'checklist') {
        appended = `\n\n### AI Generated Action Items (${new Date().toLocaleDateString()}):\n- [ ] Confirm flight baggage allowance\n- [ ] Check passkey expiration\n- [ ] Update Proton drive shared bookmark\n`;
      } else if (actionType === 'summarize') {
        appended = `\n\n> **Executive Summary for ${currentPartner} & ${otherPartner}:**\n> This doc aligns our shared timeline, budget gates, and verified action milestones.\n`;
      } else {
        appended = `\n\n### AI Enhancement Note:\nDrafted collaborative section based on prompt: "${aiPrompt || 'Refine architecture'}".\n`;
      }
      const updated = content + appended;
      setContent(updated);
      onUpdateContent(updated);
      setIsAiLoading(false);
      setAiPrompt('');
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Presence & Co-Authoring Toolbar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Document Selection & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
            <Edit3 className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <select
                value={activeDoc.id}
                onChange={(e) => onSelectDocument(e.target.value)}
                className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-0 outline-hidden font-display cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 max-w-xs sm:max-w-md truncate"
              >
                {documents.map(d => (
                  <option key={d.id} value={d.id} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">
                    {d.title}
                  </option>
                ))}
              </select>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hidden sm:inline">
                {activeDoc.path}
              </span>
            </div>

            {/* Live Presence indicator */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Dual Live Sync</span>
              </span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[200px]">
                {partnerStatusText}
              </span>
            </div>
          </div>
        </div>

        {/* Partner Presence Badges & Save Status */}
        <div className="flex items-center gap-3">
          {/* Active Avatars */}
          <div className="flex items-center -space-x-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs border-2 border-white dark:border-slate-900 ${
                currentPartner === 'Key' ? 'bg-indigo-600 ring-2 ring-indigo-400/40' : 'bg-slate-500'
              }`}
              title="Key is actively typing"
            >
              K
            </div>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs border-2 border-white dark:border-slate-900 ${
                otherPartner === 'Nura' || currentPartner === 'Nura' ? 'bg-violet-600 ring-2 ring-violet-400/40' : 'bg-slate-500'
              }`}
              title="Nura is online"
            >
              N
            </div>
          </div>

          {/* Sync status */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            {saveStatus === 'saved' ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Proton Buffered</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-500">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing...</span>
              </span>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setEditorMode('split')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                editorMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Split View (Editor & Live Preview)"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEditorMode('edit')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                editorMode === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Raw Editor Only"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEditorMode('preview')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                editorMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Formatted Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle comments drawer */}
          <button
            onClick={() => setShowCommentsSidebar(!showCommentsSidebar)}
            className={`p-1.5 rounded-xl border text-xs font-medium transition-colors relative ${
              showCommentsSidebar
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
            title="Toggle comments"
          >
            <MessageSquare className="w-4 h-4" />
            {comments.filter(c => !c.resolved).length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-600" />
            )}
          </button>
        </div>
      </div>

      {/* Inline AI Quick Assist Strip */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            Co-Writing AI Assist:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => handleRunInlineAi('checklist')}
              disabled={isAiLoading}
              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition-colors whitespace-nowrap"
            >
              + Generate Action Checklist
            </button>
            <button
              onClick={() => handleRunInlineAi('summarize')}
              disabled={isAiLoading}
              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition-colors whitespace-nowrap"
            >
              ✨ Insert Summary Callout
            </button>
          </div>
        </div>

        <button
          onClick={() => onOpenAi(`Help me write and refine the document: "${activeDoc.title}"`)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>Open Full AI Reasoning</span>
          <CornerDownRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Workspace (Editor + Preview + Comments) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        {(editorMode === 'split' || editorMode === 'edit') && (
          <div className={`flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${
            editorMode === 'split' ? 'w-1/2' : 'w-full'
          }`}>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono font-medium">Markdown Source (Dual Live Input)</span>
              <span className="text-[10px] text-slate-400">Autosaving...</span>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start drafting together in markdown..."
              className="flex-1 w-full p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-transparent resize-none outline-hidden leading-relaxed"
              spellCheck="false"
            />
          </div>
        )}

        {/* Styled Visual Preview Pane */}
        {(editorMode === 'split' || editorMode === 'preview') && (
          <div className={`flex flex-col h-full bg-slate-50/70 dark:bg-slate-950 overflow-y-auto ${
            editorMode === 'split' ? 'w-1/2' : 'w-full'
          }`}>
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-700 dark:text-slate-300">Live Styled Preview</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Rendered instantly</span>
            </div>

            <div className="p-6 max-w-2xl mx-auto w-full space-y-4">
              <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </div>
          </div>
        )}

        {/* Live Comments Thread Sidebar */}
        {showCommentsSidebar && (
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
                  Partner Discussion
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {comments.length} notes
              </span>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                    c.resolved
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                        c.author === 'Key' ? 'bg-indigo-600' : 'bg-violet-600'
                      }`}>
                        {c.author[0]}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{c.author}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{c.timestamp}</span>
                  </div>

                  <p className={`text-slate-700 dark:text-slate-300 ${c.resolved ? 'line-through text-slate-400' : ''}`}>
                    {c.text}
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleToggleResolveComment(c.id)}
                      className={`text-[10px] font-medium flex items-center gap-1 ${
                        c.resolved
                          ? 'text-slate-400 hover:text-slate-600'
                          : 'text-indigo-600 dark:text-indigo-400 hover:underline'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{c.resolved ? 'Reopen' : 'Mark Resolved'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Comment as ${currentPartner}...`}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
