import React, { useState, useMemo, useRef } from 'react';
import { 
  Network, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  Filter, 
  FileText, 
  CheckSquare, 
  Clock, 
  ShieldCheck, 
  Bot, 
  Flower2, 
  Map, 
  Layers, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  Eye, 
  X,
  Target,
  Terminal,
  Heart,
  Coins,
  BookOpen,
  Home,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { 
  Partner, 
  LifeDomain, 
  BrainDocument, 
  LifeTask, 
  ProjectTimeline, 
  InteractiveMapPin, 
  SecureVaultItem, 
  ScheduledAgent, 
  SpiritualRitual,
  MindMapFilter
} from '../../types/brain';

interface UniversalMindMapViewProps {
  currentPartner: Partner;
  domains: LifeDomain[];
  documents: BrainDocument[];
  tasks: LifeTask[];
  timelines: ProjectTimeline[];
  mapPins: InteractiveMapPin[];
  vaultItems: SecureVaultItem[];
  agents: ScheduledAgent[];
  rituals: SpiritualRitual[];
  onNavigateToDocument: (docId: string) => void;
  onNavigateToView: (view: any) => void;
  onOpenAi: (prompt?: string) => void;
}

interface MindNode {
  id: string;
  title: string;
  subtitle?: string;
  type: 'core' | 'domain' | 'document' | 'task' | 'timeline' | 'vault' | 'agent' | 'travel' | 'spiritual';
  domainId?: string;
  parentId?: string;
  owner?: Partner | 'Both';
  tags?: string[];
  status?: string;
  details?: string;
  color: string;
  icon: any;
  targetView?: string;
  targetId?: string;
  x?: number;
  y?: number;
}

export const UniversalMindMapView: React.FC<UniversalMindMapViewProps> = ({
  currentPartner,
  domains,
  documents,
  tasks,
  timelines,
  mapPins,
  vaultItems,
  agents,
  rituals,
  onNavigateToDocument,
  onNavigateToView,
  onOpenAi,
}) => {
  const [filterType, setFilterType] = useState<MindMapFilter>('all');
  const [filterPartner, setFilterPartner] = useState<'All' | 'Key' | 'Nura'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<MindNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewLayout, setViewLayout] = useState<'constellation' | 'tree' | 'quadrants'>('constellation');
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    'tutorials-learning': true,
    'travel-maps': true,
    'finances-wealth': true,
    'tech-homelab': true,
  });

  const toggleDomainExpand = (id: string) => {
    setExpandedDomains(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build the complete universal dataset graph
  const allNodes: MindNode[] = useMemo(() => {
    const list: MindNode[] = [];

    // Central Root Node
    list.push({
      id: 'root-brain',
      title: 'Key & Nura Life OS',
      subtitle: 'Universal Central Nervous System',
      type: 'core',
      color: '#4F46E5', // indigo-600
      icon: Sparkles,
      owner: 'Both',
      details: 'Dual-executive life system uniting 12 Life Domains, Proton dual-sync, automation agents, and travel plans.',
    });

    // 12 Life Domains
    domains.forEach((dom) => {
      list.push({
        id: `domain-${dom.id}`,
        title: dom.title,
        subtitle: dom.subtitle,
        type: 'domain',
        parentId: 'root-brain',
        domainId: dom.id,
        color: '#6366F1',
        icon: Layers,
        owner: 'Both',
        details: dom.description,
      });
    });

    // Documents
    documents.forEach((doc) => {
      list.push({
        id: `doc-${doc.id}`,
        title: doc.title,
        subtitle: `${doc.docType.toUpperCase()} · ${doc.frontmatter.updated}`,
        type: 'document',
        parentId: `domain-${doc.domainId}`,
        domainId: doc.domainId,
        color: '#10B981', // emerald
        icon: FileText,
        owner: doc.frontmatter.owners.includes('Key') && doc.frontmatter.owners.includes('Nura') ? 'Both' : doc.frontmatter.owners[0],
        tags: doc.frontmatter.tags,
        details: doc.content.replace(/^#+ .*\n/, '').slice(0, 200) + '...',
        targetView: 'document',
        targetId: doc.id,
      });
    });

    // Actionable Tasks
    tasks.forEach((t) => {
      const domMap: Record<string, string> = {
        'Home': 'home-household',
        'Travel': 'travel-maps',
        'Finances': 'finances-wealth',
        'Tech': 'tech-homelab',
        'Health': 'health-wellbeing',
        'Admin': 'tutorials-learning',
      };
      const domId = domMap[t.category] || 'tutorials-learning';
      list.push({
        id: `task-${t.id}`,
        title: t.title,
        subtitle: `${t.category} · Priority: ${t.priority.toUpperCase()}`,
        type: 'task',
        parentId: `domain-${domId}`,
        domainId: domId,
        color: '#3B82F6', // blue
        icon: CheckSquare,
        owner: t.owner,
        status: t.completed ? 'Completed' : t.stage,
        details: `Due Date: ${t.dueDate} · Stage: ${t.stage} · Owner: ${t.owner}`,
        targetView: 'kanban_tasks',
        targetId: t.id,
      });
    });

    // Timelines & Milestones
    timelines.forEach((tl) => {
      list.push({
        id: `timeline-${tl.id}`,
        title: tl.title,
        subtitle: `${tl.category} · ${tl.progress}% Progress`,
        type: 'timeline',
        parentId: 'domain-goals-timelines',
        domainId: 'goals-timelines',
        color: '#8B5CF6', // violet
        icon: Clock,
        owner: 'Both',
        status: tl.status,
        details: `Gantt Range: ${tl.startDate} to ${tl.endDate} · ${tl.milestones.length} Milestones scheduled.`,
        targetView: 'timelines',
        targetId: tl.id,
      });
    });

    // Travel Map Pins
    mapPins.forEach((pin) => {
      list.push({
        id: `travel-${pin.id}`,
        title: pin.name,
        subtitle: `${pin.region} · Day ${pin.day} (${pin.category})`,
        type: 'travel',
        parentId: 'domain-travel-maps',
        domainId: 'travel-maps',
        color: '#F59E0B', // amber
        icon: Map,
        owner: 'Both',
        status: pin.booked ? 'Booked' : 'Planned',
        details: `${pin.description}${pin.mustTry ? ` · Must Try: ${pin.mustTry}` : ''}`,
        targetView: 'travel_map',
        targetId: pin.id,
      });
    });

    // Security Vault Items
    vaultItems.forEach((v) => {
      list.push({
        id: `vault-${v.id}`,
        title: v.title,
        subtitle: `${v.category.toUpperCase()} · Level: ${v.securityLevel}`,
        type: 'vault',
        parentId: 'domain-tutorials-learning',
        domainId: 'tutorials-learning',
        color: '#EF4444', // red
        icon: ShieldCheck,
        owner: v.owner,
        tags: v.tags,
        details: `Encrypted credential item. Updated: ${v.lastUpdated}. Access audited in vault logs.`,
        targetView: 'security_vault',
        targetId: v.id,
      });
    });

    // Autonomous Agents
    agents.forEach((ag) => {
      list.push({
        id: `agent-${ag.id}`,
        title: ag.name,
        subtitle: `Cron: ${ag.schedule} · ${ag.status}`,
        type: 'agent',
        parentId: 'domain-tech-homelab',
        domainId: 'tech-homelab',
        color: '#6366F1',
        icon: Bot,
        owner: 'Both',
        status: ag.status,
        details: ag.description,
        targetView: 'agents',
        targetId: ag.id,
      });
    });

    // Spiritual Rituals
    rituals.forEach((rit) => {
      list.push({
        id: `ritual-${rit.id}`,
        title: rit.title,
        subtitle: `${rit.timeOfDay.toUpperCase()} · ${rit.durationMinutes}m · ${rit.streak}d streak`,
        type: 'spiritual',
        parentId: 'domain-health-wellbeing',
        domainId: 'health-wellbeing',
        color: '#A855F7', // purple
        icon: Flower2,
        owner: 'Both',
        details: `Daily grounding practice with partner streak tracking.`,
        targetView: 'spiritual_wellbeing',
        targetId: rit.id,
      });
    });

    return list;
  }, [domains, documents, tasks, timelines, mapPins, vaultItems, agents, rituals]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return allNodes.filter((node) => {
      if (filterType !== 'all') {
        if (filterType === 'domains' && node.type !== 'domain') return false;
        if (filterType === 'documents' && node.type !== 'document') return false;
        if (filterType === 'tasks' && node.type !== 'task') return false;
        if (filterType === 'timelines' && node.type !== 'timeline') return false;
        if (filterType === 'vault' && node.type !== 'vault') return false;
        if (filterType === 'agents' && node.type !== 'agent') return false;
        if (filterType === 'spiritual' && node.type !== 'spiritual') return false;
      }

      if (filterPartner !== 'All' && node.owner) {
        if (node.owner !== filterPartner && node.owner !== 'Both') return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = node.title.toLowerCase().includes(query);
        const matchesSubtitle = node.subtitle?.toLowerCase().includes(query);
        const matchesTags = node.tags?.some(t => t.toLowerCase().includes(query));
        const matchesDetails = node.details?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtitle && !matchesTags && !matchesDetails) {
          return false;
        }
      }

      return true;
    });
  }, [allNodes, filterType, filterPartner, searchQuery]);

  const handleOpenTarget = (node: MindNode) => {
    if (node.type === 'document' && node.targetId) {
      onNavigateToDocument(node.targetId);
    } else if (node.targetView) {
      onNavigateToView(node.targetView);
    }
  };

  const domainNodes = useMemo(() => {
    return domains.map(dom => {
      const childDocs = documents.filter(d => d.domainId === dom.id);
      const childTasks = tasks.filter(t => {
        const domMap: Record<string, string> = {
          'Home': 'home-household',
          'Travel': 'travel-maps',
          'Finances': 'finances-wealth',
          'Tech': 'tech-homelab',
          'Health': 'health-wellbeing',
          'Admin': 'tutorials-learning',
        };
        return domMap[t.category] === dom.id;
      });
      return {
        domain: dom,
        docs: childDocs,
        tasks: childTasks,
        totalChildren: childDocs.length + childTasks.length,
      };
    });
  }, [domains, documents, tasks]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-100/90 dark:bg-slate-950 overflow-hidden relative select-none">
      {/* Top Floating Control Bar - High Contrast */}
      <div className="p-4 sm:p-5 border-b-2 border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-600 text-white flex items-center justify-center shadow-xs">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
                Universal Mind Map & Knowledge Graph
              </h1>
              <span className="text-[10px] font-mono font-bold bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800 px-2 py-0.5 rounded-full">
                {filteredNodes.length} Nodes Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Interactive holistic neural graph connecting all 12 domains, documents, tasks, timelines, vault items & agents.
            </p>
          </div>
        </div>

        {/* Global Search and Filter Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mind graph..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 w-48 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-[11px]">
            {(['all', 'domains', 'documents', 'tasks', 'timelines', 'vault'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all uppercase text-[10px] font-mono ${
                  filterType === f
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Partner Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl text-[11px]">
            {(['All', 'Key', 'Nura'] as const).map(p => (
              <button
                key={p}
                onClick={() => setFilterPartner(p)}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                  filterPartner === p
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Zoom In / Out Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors ml-0.5"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onOpenAi('Help us uncover hidden connections and prioritize goals across our Mind Map')}
            className="p-2 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 border-2 border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1 text-xs font-bold"
            title="Ask AI to Analyze Graph"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Graph Analysis</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-6 relative">
        <div 
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }} 
          className="transition-transform duration-150 max-w-7xl mx-auto space-y-8 pb-20"
        >
          {/* Central Nucleus Card */}
          <div className="flex flex-col items-center justify-center">
            <div 
              onClick={() => setSelectedNode(allNodes[0])}
              className="bg-white dark:bg-slate-900 border-3 border-indigo-600 dark:border-indigo-500 rounded-3xl p-6 shadow-xl text-center max-w-md w-full cursor-pointer hover:scale-102 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md group-hover:rotate-6 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Key & Nura — Life Brain OS
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Central Nucleus · 12 Domains · Dual-Partner Collaborative HQ
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                  {domains.length} Domains
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  {documents.length} Docs
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                  {tasks.length} Tasks
                </span>
              </div>
            </div>

            {/* Connecting Stems */}
            <div className="w-0.5 h-8 bg-indigo-300 dark:bg-indigo-800 my-1" />
          </div>

          {/* 12 Life Domains Constellation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainNodes.map(({ domain, docs, tasks: domainTasks, totalChildren }) => {
              const isExpanded = !!expandedDomains[domain.id];
              const domainNode = allNodes.find(n => n.domainId === domain.id && n.type === 'domain');

              return (
                <div 
                  key={domain.id}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
                >
                  {/* Domain Header Pill */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
                    <div 
                      onClick={() => domainNode && setSelectedNode(domainNode)}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white truncate font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {domain.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {domain.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleDomainExpand(domain.id)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
                    >
                      {isExpanded ? `Hide (${totalChildren})` : `Show (${totalChildren})`}
                    </button>
                  </div>

                  {/* Child Entities: Docs, Tasks, Timelines */}
                  {isExpanded && (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                      {/* Documents in Domain */}
                      {docs.map(doc => {
                        const isSelected = selectedNode?.id === `doc-${doc.id}`;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => {
                              const node = allNodes.find(n => n.id === `doc-${doc.id}`);
                              if (node) setSelectedNode(node);
                            }}
                            className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
                                : 'bg-slate-50/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-xs truncate">{doc.title}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[9px] font-mono uppercase bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                                {doc.docType.slice(0, 4)}
                              </span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                          </div>
                        );
                      })}

                      {/* Tasks in Domain */}
                      {domainTasks.map(task => {
                        const isSelected = selectedNode?.id === `task-${task.id}`;
                        return (
                          <div
                            key={task.id}
                            onClick={() => {
                              const node = allNodes.find(n => n.id === `task-${task.id}`);
                              if (node) setSelectedNode(node);
                            }}
                            className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 font-bold'
                                : 'bg-slate-50/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${task.completed ? 'text-emerald-500' : 'text-blue-500'}`} />
                              <span className={`text-xs truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                {task.title}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 shrink-0">
                              {task.priority}
                            </span>
                          </div>
                        );
                      })}

                      {/* Travel Pins if in Travel Domain */}
                      {domain.id === 'travel-maps' && (
                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">
                            Portugal 2027 Sights ({mapPins.length})
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mapPins.slice(0, 4).map(pin => (
                              <button
                                key={pin.id}
                                onClick={() => {
                                  const node = allNodes.find(n => n.id === `travel-${pin.id}`);
                                  if (node) setSelectedNode(node);
                                }}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 truncate max-w-[120px]"
                              >
                                {pin.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Security Items if in Tutorials / Security Domain */}
                      {domain.id === 'tutorials-learning' && (
                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold uppercase">
                            Security Vault ({vaultItems.length} Secrets)
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {vaultItems.slice(0, 3).map(v => (
                              <button
                                key={v.id}
                                onClick={() => {
                                  const node = allNodes.find(n => n.id === `vault-${v.id}`);
                                  if (node) setSelectedNode(node);
                                }}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 truncate max-w-[120px]"
                              >
                                {v.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slide-out Interactive Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute right-4 top-20 bottom-4 w-96 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-30 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {selectedNode.type.toUpperCase()}
                </span>
                {selectedNode.owner && (
                  <span className="text-[10px] font-mono text-slate-500">
                    Owner: {selectedNode.owner}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-display leading-tight">
                {selectedNode.title}
              </h2>
              {selectedNode.subtitle && (
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                  {selectedNode.subtitle}
                </p>
              )}
            </div>

            {selectedNode.status && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                <span className="text-slate-500 font-mono">Current Status:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedNode.status}</span>
              </div>
            )}

            {selectedNode.details && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Entity Context & Summary:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedNode.details}
                </p>
              </div>
            )}

            {selectedNode.tags && selectedNode.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Associated Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Direct Actions */}
          <div className="pt-4 border-t-2 border-slate-100 dark:border-slate-800 space-y-2">
            {(selectedNode.type === 'document' || selectedNode.targetView) && (
              <button
                onClick={() => handleOpenTarget(selectedNode)}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Open in {selectedNode.type === 'document' ? 'Document Studio' : 'Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onOpenAi(`Synthesize and analyze connections for our entity: "${selectedNode.title}" in ${selectedNode.type}`)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Ask AI About this Node</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
