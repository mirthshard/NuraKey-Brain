import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Code, 
  Eye, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  MapPin, 
  Coins, 
  Clock, 
  Copy, 
  Check, 
  Heart, 
  FolderOpen, 
  ChevronRight, 
  X, 
  Hash, 
  Filter, 
  SlidersHorizontal, 
  ArrowUp, 
  ArrowDown, 
  User, 
  Layers, 
  Send, 
  Share2, 
  Bot, 
  CheckSquare, 
  RefreshCw, 
  GripVertical,
  HelpCircle,
  FileCode,
  Tag
} from 'lucide-react';
import { BrainDocument, Partner, Frontmatter } from '../../types/brain';
import { 
  analyzeDocumentWithAi, 
  generatePartnerBriefingText, 
  AiTagSuggestionResult 
} from '../../services/geminiService';

interface InteractiveDocumentViewProps {
  document: BrainDocument;
  currentPartner: Partner;
  onUpdateContent: (newContent: string) => void;
  onUpdateTags?: (docId: string, tags: string[]) => void;
  onUpdateFrontmatter?: (docId: string, updatedFrontmatter: Frontmatter) => void;
  onAddTask?: (title: string, category: any, owner: any, priority: any) => void;
  onOpenAiWithContext: (prompt: string) => void;
  onNavigateDocument?: (docId: string) => void;
  allDocuments?: BrainDocument[];
}

export const InteractiveDocumentView: React.FC<InteractiveDocumentViewProps> = ({
  document,
  currentPartner,
  onUpdateContent,
  onUpdateTags,
  onUpdateFrontmatter,
  onAddTask,
  onOpenAiWithContext,
  onNavigateDocument,
  allDocuments = [],
}) => {
  const [viewMode, setViewMode] = useState<'app' | 'markdown'>('app');
  const [copied, setCopied] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(document.content);
  
  // Dedicated Frontmatter Metadata Panel State
  const [isMetadataPanelOpen, setIsMetadataPanelOpen] = useState(true);
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);

  // Editable Frontmatter State
  const [frontmatterState, setFrontmatterState] = useState<Frontmatter>({
    type: document.frontmatter?.type || document.docType || 'general_notes',
    status: document.frontmatter?.status || 'Active',
    owners: document.frontmatter?.owners || [currentPartner],
    created: document.frontmatter?.created || new Date().toISOString().slice(0, 10),
    updated: document.frontmatter?.updated || new Date().toISOString().slice(0, 10),
    tags: document.frontmatter?.tags || [],
    category: document.frontmatter?.category || document.domainId,
    location: document.frontmatter?.location || '',
    budget: document.frontmatter?.budget,
    summary: document.frontmatter?.summary || '',
  });

  // Tag Add input
  const [newTagInput, setNewTagInput] = useState('');
  
  // AI Feature States
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AiTagSuggestionResult | null>(null);
  const [isDraftingMessage, setIsDraftingMessage] = useState(false);
  const [partnerMessageDraft, setPartnerMessageDraft] = useState<string | null>(null);
  const [copiedPartnerMessage, setCopiedPartnerMessage] = useState(false);
  const [dispatchedTaskCount, setDispatchedTaskCount] = useState<number | null>(null);

  // Interactive checklist state for markdown notes
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Sync state when active document changes
  useEffect(() => {
    setMarkdownContent(document.content);
    setFrontmatterState({
      type: document.frontmatter?.type || document.docType || 'general_notes',
      status: document.frontmatter?.status || 'Active',
      owners: document.frontmatter?.owners || [currentPartner],
      created: document.frontmatter?.created || new Date().toISOString().slice(0, 10),
      updated: document.frontmatter?.updated || new Date().toISOString().slice(0, 10),
      tags: document.frontmatter?.tags || [],
      category: document.frontmatter?.category || document.domainId,
      location: document.frontmatter?.location || '',
      budget: document.frontmatter?.budget,
      summary: document.frontmatter?.summary || '',
    });
    setAiAnalysisResult(null);
    setPartnerMessageDraft(null);
    setDispatchedTaskCount(null);
  }, [document.id, document.content, document.frontmatter]);

  // Compute all unique tags across the brain for suggestions
  const allBrainTags = useMemo(() => {
    const set = new Set<string>();
    allDocuments.forEach(doc => {
      doc.frontmatter?.tags?.forEach(t => set.add(t));
    });
    ['urgent', 'shared', 'portugal', 'budget', 'routine', 'tech', 'someday', 'checklist', 'priority'].forEach(t => set.add(t));
    return Array.from(set).sort();
  }, [allDocuments]);

  const suggestedUnusedTags = useMemo(() => {
    const currentTags = new Set(frontmatterState.tags || []);
    return allBrainTags.filter(t => !currentTags.has(t)).slice(0, 8);
  }, [allBrainTags, frontmatterState.tags]);

  // Helper to re-generate YAML frontmatter and sync with markdown
  const syncWithMarkdown = (updatedFm: Frontmatter) => {
    const yamlLines = [
      '---',
      `type: ${updatedFm.type || 'notes'}`,
      `status: ${updatedFm.status || 'Active'}`,
      `owners: [${updatedFm.owners.join(', ')}]`,
      `created: ${updatedFm.created}`,
      `updated: ${updatedFm.updated}`,
      `tags: [${updatedFm.tags.join(', ')}]`,
    ];
    if (updatedFm.category) yamlLines.push(`category: ${updatedFm.category}`);
    if (updatedFm.location) yamlLines.push(`location: ${updatedFm.location}`);
    if (updatedFm.budget) yamlLines.push(`budget: ${updatedFm.budget}`);
    if (updatedFm.summary) yamlLines.push(`summary: "${updatedFm.summary.replace(/"/g, '\\"')}"`);
    yamlLines.push('---');
    const newYamlHeader = yamlLines.join('\n');

    let newContent = markdownContent;
    if (newContent.startsWith('---')) {
      const parts = newContent.split(/---\r?\n/);
      if (parts.length >= 3) {
        // Replace existing frontmatter
        newContent = `${newYamlHeader}\n${parts.slice(2).join('---\n')}`;
      } else {
        newContent = `${newYamlHeader}\n\n${newContent}`;
      }
    } else {
      newContent = `${newYamlHeader}\n\n${newContent}`;
    }

    setMarkdownContent(newContent);
    onUpdateContent(newContent);
  };

  const handleSaveFrontmatterChange = (partial: Partial<Frontmatter>) => {
    const updated: Frontmatter = {
      ...frontmatterState,
      ...partial,
      updated: new Date().toISOString().slice(0, 10),
    };
    setFrontmatterState(updated);
    if (onUpdateFrontmatter) {
      onUpdateFrontmatter(document.id, updated);
    }
    if (partial.tags && onUpdateTags) {
      onUpdateTags(document.id, partial.tags);
    }
    syncWithMarkdown(updated);
  };

  // Reordering tags
  const handleMoveTagUp = (index: number) => {
    if (index <= 0) return;
    const newTags = [...frontmatterState.tags];
    const temp = newTags[index - 1];
    newTags[index - 1] = newTags[index];
    newTags[index] = temp;
    handleSaveFrontmatterChange({ tags: newTags });
  };

  const handleMoveTagDown = (index: number) => {
    if (index >= frontmatterState.tags.length - 1) return;
    const newTags = [...frontmatterState.tags];
    const temp = newTags[index + 1];
    newTags[index + 1] = newTags[index];
    newTags[index] = temp;
    handleSaveFrontmatterChange({ tags: newTags });
  };

  const handleAddTag = (tagToAdd: string) => {
    const cleanTag = tagToAdd.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanTag) return;
    if (frontmatterState.tags.includes(cleanTag)) {
      setNewTagInput('');
      return;
    }
    const newTags = [...frontmatterState.tags, cleanTag];
    handleSaveFrontmatterChange({ tags: newTags });
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = frontmatterState.tags.filter(t => t !== tagToRemove);
    handleSaveFrontmatterChange({ tags: newTags });
    if (activeFilterTag === tagToRemove) {
      setActiveFilterTag(null);
    }
  };

  const handleToggleOwner = (partner: Partner) => {
    let nextOwners: Partner[];
    if (frontmatterState.owners.includes(partner)) {
      if (frontmatterState.owners.length === 1) return; // Keep at least one owner
      nextOwners = frontmatterState.owners.filter(p => p !== partner);
    } else {
      nextOwners = [...frontmatterState.owners, partner];
    }
    handleSaveFrontmatterChange({ owners: nextOwners });
  };

  // AI Actions
  const handleRunAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    try {
      const result = await analyzeDocumentWithAi(document, currentPartner);
      setAiAnalysisResult(result);
      
      // Auto-apply suggested tags if wanted
      const mergedTags = Array.from(new Set([...frontmatterState.tags, ...result.suggestedTags]));
      handleSaveFrontmatterChange({
        tags: mergedTags,
        category: result.suggestedCategory || frontmatterState.category,
        status: result.suggestedStatus || frontmatterState.status,
        summary: result.summary,
      });
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleGeneratePartnerBriefing = async () => {
    setIsDraftingMessage(true);
    try {
      const text = await generatePartnerBriefingText(document, currentPartner);
      setPartnerMessageDraft(text);
    } finally {
      setIsDraftingMessage(false);
    }
  };

  const handlePushTasksToKanban = () => {
    if (!onAddTask) return;
    const actionsToPush = aiAnalysisResult?.actionItems || [];
    
    // Also parse document lines for unchecked boxes
    const lines = markdownContent.split('\n');
    lines.forEach(l => {
      if (l.trim().startsWith('- [ ]')) {
        const text = l.replace('- [ ]', '').trim();
        if (text && !actionsToPush.includes(text)) {
          actionsToPush.push(text);
        }
      }
    });

    if (actionsToPush.length === 0) {
      actionsToPush.push(`Review milestones for ${document.title}`);
    }

    actionsToPush.forEach((actionText) => {
      const cat = (document.domainId.includes('travel') ? 'Travel' : 
                   document.domainId.includes('finance') ? 'Finances' : 
                   document.domainId.includes('tech') ? 'Tech' : 'Home') as any;
      onAddTask(actionText, cat, 'Both', 'medium');
    });

    setDispatchedTaskCount(actionsToPush.length);
    setTimeout(() => setDispatchedTaskCount(null), 4000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleCheckItem = (key: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getTagColorClass = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes('portugal') || lower.includes('travel') || lower.includes('flight') || lower.includes('vacation')) {
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    }
    if (lower.includes('finance') || lower.includes('budget') || lower.includes('savings') || lower.includes('wealth')) {
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
    if (lower.includes('tech') || lower.includes('docker') || lower.includes('homelab') || lower.includes('zfs') || lower.includes('system')) {
      return 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
    }
    if (lower.includes('relationship') || lower.includes('love') || lower.includes('tradition') || lower.includes('date')) {
      return 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    }
    if (lower.includes('urgent') || lower.includes('high') || lower.includes('priority')) {
      return 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800';
    }
    if (lower.includes('ritual') || lower.includes('spiritual') || lower.includes('mindful') || lower.includes('health')) {
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800';
    }
    return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
  };

  const matchingTaggedDocs = activeFilterTag 
    ? allDocuments.filter(d => d.frontmatter?.tags?.includes(activeFilterTag) && d.id !== document.id)
    : [];

  const relatedDocs = allDocuments.filter(d => d.domainId === document.domainId && d.id !== document.id);

  // App-grade visual renderer for Markdown sections
  const renderAppFormattedContent = () => {
    const lines = markdownContent.split('\n');
    const renderedElements: React.ReactNode[] = [];
    let currentChecklist: { id: string; text: string; defaultChecked: boolean }[] = [];
    let currentCodeBlock: string[] | null = null;
    let codeLanguage = '';

    const flushChecklist = (keyPrefix: number) => {
      if (currentChecklist.length === 0) return;
      const list = [...currentChecklist];
      currentChecklist = [];
      renderedElements.push(
        <div 
          key={`checkgroup-${keyPrefix}`} 
          className="bg-slate-50/90 dark:bg-slate-850 border-2 border-slate-300/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 my-4 space-y-2.5 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pb-2 border-b-2 border-slate-200 dark:border-slate-700 font-mono">
            <span>ACTION CHECKLIST</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {list.filter(item => completedItems[item.id] ?? item.defaultChecked).length} of {list.length} completed
            </span>
          </div>
          <div className="space-y-2">
            {list.map((item) => {
              const isChecked = completedItems[item.id] ?? item.defaultChecked;
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheckItem(item.id)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-white/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs hover:border-indigo-500'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      isChecked 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold truncate">{item.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    lines.forEach((line, idx) => {
      // Skip YAML frontmatter header in App formatted view
      if (idx === 0 && line.startsWith('---')) {
        let skipUntil = -1;
        for (let j = 1; j < lines.length; j++) {
          if (lines[j].startsWith('---')) {
            skipUntil = j;
            break;
          }
        }
        if (skipUntil > 0) {
          lines.splice(0, skipUntil + 1);
          return;
        }
      }

      if (line.startsWith('```')) {
        if (currentCodeBlock !== null) {
          const codeText = currentCodeBlock.join('\n');
          currentCodeBlock = null;
          renderedElements.push(
            <div key={`code-${idx}`} className="my-4 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-900 text-slate-100 shadow-md font-mono text-xs">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                <span>{codeLanguage || 'terminal / config'}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeText)}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto leading-relaxed text-indigo-300">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        } else {
          flushChecklist(idx);
          codeLanguage = line.replace('```', '').trim();
          currentCodeBlock = [];
        }
        return;
      }

      if (currentCodeBlock !== null) {
        currentCodeBlock.push(line);
        return;
      }

      if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]')) {
        const isDefaultChecked = line.trim().startsWith('- [x]');
        const text = line.trim().replace(/- \[(x| )\] /, '');
        currentChecklist.push({
          id: `chk-${idx}-${text.slice(0, 15)}`,
          text,
          defaultChecked: isDefaultChecked,
        });
        return;
      } else {
        flushChecklist(idx);
      }

      if (line.startsWith('# ')) {
        renderedElements.push(
          <div key={`h1-${idx}`} className="pt-2 pb-3 border-b-2 border-slate-200 dark:border-slate-800 my-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              {line.replace('# ', '')}
            </h1>
          </div>
        );
      } else if (line.startsWith('## ')) {
        renderedElements.push(
          <div key={`h2-${idx}`} className="pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 my-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-indigo-600 inline-block" />
              <span>{line.replace('## ', '')}</span>
            </h2>
          </div>
        );
      } else if (line.startsWith('### ')) {
        renderedElements.push(
          <h3 key={`h3-${idx}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        renderedElements.push(
          <div key={`quote-${idx}`} className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 font-medium my-3 shadow-xs leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="flex-1">{line.replace('> ', '')}</div>
          </div>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        renderedElements.push(
          <div key={`bullet-${idx}`} className="flex items-start gap-2.5 my-1.5 pl-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
            <span className="leading-relaxed">{line.trim().replace(/^[-*] /, '')}</span>
          </div>
        );
      } else if (line.trim().length > 0) {
        renderedElements.push(
          <p key={`p-${idx}`} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-2">
            {line}
          </p>
        );
      }
    });

    flushChecklist(lines.length);
    return renderedElements;
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-100/90 dark:bg-slate-950">
      {/* Primary Document Reading & Writing Column */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="hover:text-indigo-600 cursor-pointer">Shared Life Domains</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-200 font-semibold">{document.domainId}</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[200px]">{document.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Proton & OneDrive Synced
            </span>
          </div>
        </div>

        {/* Primary Executive Document Hero Card - High Contrast Elevation */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 border-t-4 border-t-indigo-600 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/40 space-y-4 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                  {frontmatterState.type.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  frontmatterState.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' :
                  frontmatterState.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' :
                  frontmatterState.status === 'Review Needed' ? 'bg-purple-50 text-purple-700 border border-purple-300 dark:bg-purple-950/60 dark:text-purple-300' :
                  'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {frontmatterState.status}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Updated {frontmatterState.updated}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
                {document.title}
              </h1>

              {/* Tag Pills & Quick Metadata Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Owners:</span>
                  <div className="flex items-center -space-x-1.5">
                    {frontmatterState.owners.map(owner => (
                      <div
                        key={owner}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs ${
                          owner === 'Key' ? 'bg-indigo-600' : 'bg-violet-600'
                        }`}
                        title={owner}
                      >
                        {owner[0]}
                      </div>
                    ))}
                  </div>
                </div>

                <span>•</span>

                {/* Ordered Tag Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {frontmatterState.tags.map((t, idx) => (
                    <span
                      key={t}
                      onClick={() => setActiveFilterTag(activeFilterTag === t ? null : t)}
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer font-medium shadow-2xs flex items-center gap-1 ${getTagColorClass(t)} ${
                        activeFilterTag === t ? 'ring-2 ring-indigo-500 font-bold' : ''
                      }`}
                      title={`#${t} (Position ${idx + 1}) · Click to filter related docs`}
                    >
                      <span>#{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Summary Banner if exists */}
              {frontmatterState.summary && (
                <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Executive TL;DR: </span>
                    <span>{frontmatterState.summary}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & View Switcher */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="p-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl flex items-center gap-1 shadow-2xs">
                <button
                  onClick={() => setViewMode('app')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'app'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Formatted App View</span>
                </button>
                <button
                  onClick={() => setViewMode('markdown')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'markdown'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-slate-500" />
                  <span>Raw Markdown</span>
                </button>
              </div>

              {/* Toggle Dedicated Frontmatter Metadata Panel Button */}
              <button
                onClick={() => setIsMetadataPanelOpen(!isMetadataPanelOpen)}
                className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                  isMetadataPanelOpen
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
                title="Open Dedicated Frontmatter Metadata Sidebar"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Metadata Panel</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-white font-bold">
                  {frontmatterState.tags.length}
                </span>
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border-2 border-slate-300 dark:border-slate-700 rounded-xl transition-colors shadow-2xs"
                title="Copy Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>

          {/* Tag Filter Shelf (if clicked) */}
          {activeFilterTag && (
            <div className="bg-indigo-50/90 dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 rounded-2xl p-4 space-y-3 shadow-md animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Other Notes Tagged <span className="font-mono text-indigo-600">#{activeFilterTag}</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                    {matchingTaggedDocs.length} more
                  </span>
                </div>
                <button
                  onClick={() => setActiveFilterTag(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {matchingTaggedDocs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No other documents currently share this tag.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchingTaggedDocs.map(mdoc => (
                    <div
                      key={mdoc.id}
                      onClick={() => onNavigateDocument && onNavigateDocument(mdoc.id)}
                      className="p-3 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition-all shadow-xs"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{mdoc.title}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{mdoc.domainId} · {mdoc.docType}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Body */}
          {viewMode === 'app' ? (
            <div className="space-y-4 pt-2">
              {renderAppFormattedContent()}
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Markdown Source Editor (YAML Auto-Synced)</span>
                <span>Proton / OneDrive Ready</span>
              </div>
              <textarea
                value={markdownContent}
                onChange={(e) => {
                  setMarkdownContent(e.target.value);
                  onUpdateContent(e.target.value);
                }}
                rows={22}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-4 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 leading-relaxed shadow-inner"
              />
            </div>
          )}
        </div>

        {/* Related Notes in Life Domain */}
        {relatedDocs.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-indigo-600" />
                <span>Other Plans & Notes in {document.domainId}</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{relatedDocs.length} files</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedDocs.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateDocument && onNavigateDocument(rel.id)}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-4 transition-all cursor-pointer shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      {rel.docType}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {rel.content.replace(/^#+ .*\n/, '').slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DEDICATED SIDEBAR PANEL: DOCUMENT FRONTMATTER METADATA & AI SUITE */}
      {isMetadataPanelOpen && (
        <aside className="w-80 lg:w-96 shrink-0 border-l-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto p-5 space-y-5 shadow-xl transition-all animate-in slide-in-from-right duration-200">
          {/* Panel Top Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
                  Frontmatter Metadata
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  YAML Auto-Synced
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMetadataPanelOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="Close Metadata Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI INTELLIGENT SUITE STRIP */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-indigo-50/30 dark:from-slate-800 dark:via-indigo-950/40 dark:to-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-indigo-950 dark:text-indigo-200 font-display flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Metadata & Life Concierge</span>
              </span>
              <span className="text-[9px] font-mono font-bold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.2 rounded">
                Gemini 3.8
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 1-Click AI Auto Tag & Extract */}
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAiAnalyzing}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50 border-2 border-indigo-200 dark:border-slate-700 text-left transition-all shadow-2xs group disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                  <Sparkles className={`w-3 h-3 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAiAnalyzing ? 'Analyzing...' : 'Smart Tag'}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Auto-infer tags & status
                </div>
              </button>

              {/* Push to Kanban */}
              <button
                onClick={handlePushTasksToKanban}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-50 border-2 border-emerald-200 dark:border-slate-700 text-left transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  <CheckSquare className="w-3 h-3" />
                  <span>To Kanban</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  {dispatchedTaskCount ? `✓ ${dispatchedTaskCount} sent!` : 'Extract tasks'}
                </div>
              </button>
            </div>

            {/* Draft Partner Briefing Note */}
            <button
              onClick={handleGeneratePartnerBriefing}
              disabled={isDraftingMessage}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Send className="w-3 h-3" />
              <span>{isDraftingMessage ? 'Generating Message...' : `Draft Note to ${currentPartner === 'Key' ? 'Nura' : 'Key'}`}</span>
            </button>

            {partnerMessageDraft && (
              <div className="p-3 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-800 rounded-xl space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase font-mono">
                  <span>Partner Briefing:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(partnerMessageDraft);
                      setCopiedPartnerMessage(true);
                      setTimeout(() => setCopiedPartnerMessage(false), 2000);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    {copiedPartnerMessage ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                    <span>{copiedPartnerMessage ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{partnerMessageDraft}"
                </p>
              </div>
            )}
          </div>

          {/* 1. CUSTOM TAGS MANAGEMENT & REORDERING SUITE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tags & Ordering ({frontmatterState.tags.length})</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">Use ↑ ↓ to reorder</span>
            </div>

            {/* Reorderable Tag List */}
            <div className="space-y-1.5">
              {frontmatterState.tags.map((tag, idx) => (
                <div
                  key={tag}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs shadow-2xs group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-slate-400 font-bold w-4">
                      #{idx + 1}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${getTagColorClass(tag)} truncate`}>
                      #{tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveTagUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                      title="Move Tag Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveTagDown(idx)}
                      disabled={idx === frontmatterState.tags.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                      title="Move Tag Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete Tag"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Tag Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTag(newTagInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Add custom tag..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="submit"
                disabled={!newTagInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                Add
              </button>
            </form>

            {/* Quick Suggestions Chips */}
            {suggestedUnusedTags.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Quick Add Brain Suggestions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {suggestedUnusedTags.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleAddTag(st)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-0.5"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>#{st}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. OWNERS / AUTHORS TOGGLE */}
          <div className="space-y-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Authors & Co-Owners</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleToggleOwner('Key')}
                className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  frontmatterState.owners.includes('Key')
                    ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">K</span>
                <span>Key</span>
                {frontmatterState.owners.includes('Key') && <Check className="w-3 h-3 text-indigo-600" />}
              </button>

              <button
                type="button"
                onClick={() => handleToggleOwner('Nura')}
                className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  frontmatterState.owners.includes('Nura')
                    ? 'bg-purple-50 dark:bg-purple-950 border-purple-600 text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center">N</span>
                <span>Nura</span>
                {frontmatterState.owners.includes('Nura') && <Check className="w-3 h-3 text-purple-600" />}
              </button>
            </div>
          </div>

          {/* 3. DOCUMENT STATUS */}
          <div className="space-y-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              Document Status
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['Active', 'In Progress', 'Draft', 'Review Needed', 'Approved', 'Archived'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSaveFrontmatterChange({ status: s })}
                  className={`py-1.5 px-2 rounded-xl border-2 font-bold text-[10px] font-mono transition-all truncate ${
                    frontmatterState.status === s
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 4. DOCUMENT TYPE & DATES */}
          <div className="space-y-3 pt-2 border-t-2 border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-slate-500 mb-1 font-bold">Document Type</label>
              <select
                value={frontmatterState.type}
                onChange={(e) => handleSaveFrontmatterChange({ type: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-2 font-mono text-xs text-slate-900 dark:text-white"
              >
                <option value="general_notes">general_notes</option>
                <option value="checklist">checklist</option>
                <option value="itinerary">itinerary</option>
                <option value="kanban">kanban</option>
                <option value="decision_log">decision_log</option>
                <option value="budget">budget</option>
                <option value="tech_diagram">tech_diagram</option>
                <option value="journal">journal</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 mb-1">Created Date</label>
                <input
                  type="text"
                  value={frontmatterState.created}
                  onChange={(e) => handleSaveFrontmatterChange({ created: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono text-slate-500">Updated</label>
                  <button
                    type="button"
                    onClick={() => handleSaveFrontmatterChange({ updated: new Date().toISOString().slice(0, 10) })}
                    className="text-[9px] font-mono text-indigo-600 font-bold hover:underline"
                  >
                    Touch Today
                  </button>
                </div>
                <input
                  type="text"
                  value={frontmatterState.updated}
                  onChange={(e) => handleSaveFrontmatterChange({ updated: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 mb-1">Location / Target Region</label>
              <input
                type="text"
                value={frontmatterState.location || ''}
                placeholder="e.g. Lisbon & Sintra, Portugal"
                onChange={(e) => handleSaveFrontmatterChange({ location: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* 5. LIVE YAML FRONTMATTER PREVIEW BOX */}
          <div className="space-y-2 pt-2 border-t-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Generated YAML Header</span>
              </span>
              <button
                onClick={() => {
                  const yamlSnippet = `---\ntype: ${frontmatterState.type}\nstatus: ${frontmatterState.status}\nowners: [${frontmatterState.owners.join(', ')}]\ncreated: ${frontmatterState.created}\nupdated: ${frontmatterState.updated}\ntags: [${frontmatterState.tags.join(', ')}]\n---`;
                  navigator.clipboard.writeText(yamlSnippet);
                }}
                className="text-[10px] hover:text-indigo-600 transition-colors"
              >
                Copy YAML
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 text-indigo-300 font-mono text-[10px] leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
              <code>
{`---
type: ${frontmatterState.type}
status: ${frontmatterState.status}
owners: [${frontmatterState.owners.join(', ')}]
created: ${frontmatterState.created}
updated: ${frontmatterState.updated}
tags: [${frontmatterState.tags.join(', ')}]
${frontmatterState.location ? `location: ${frontmatterState.location}\n` : ''}---`}
              </code>
            </pre>
          </div>
        </aside>
      )}
    </div>
  );
};
