import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  Map, 
  Edit3, 
  Calendar, 
  Bot, 
  Mail, 
  Newspaper, 
  PenTool, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Plus, 
  BookOpen, 
  HeartHandshake, 
  Target, 
  Home, 
  Terminal, 
  Coins, 
  GraduationCap, 
  Activity, 
  Sparkles, 
  ListOrdered, 
  ShieldCheck,
  FolderOpen,
  Flower2,
  Network,
  Cloud,
  X
} from 'lucide-react';
import { LifeDomain, BrainDocument } from '../../types/brain';

export type AppView = 
  | 'dashboard' 
  | 'kanban_tasks' 
  | 'timelines' 
  | 'travel_map' 
  | 'live_doc' 
  | 'security_vault'
  | 'spiritual_wellbeing'
  | 'mind_map'
  | 'cloud_storage'
  | 'calendar' 
  | 'agents' 
  | 'email' 
  | 'news' 
  | 'whiteboard' 
  | 'document';

interface SidebarProps {
  domains: LifeDomain[];
  documents: BrainDocument[];
  activeDocumentId: string | null;
  activeDomainId: string | null;
  currentView: AppView;
  onSelectDocument: (docId: string) => void;
  onSelectDomain: (domainId: string) => void;
  onSelectView: (view: AppView) => void;
  onNewDocument: (domainId?: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  domains,
  documents,
  activeDocumentId,
  activeDomainId,
  currentView,
  onSelectDocument,
  onSelectDomain,
  onSelectView,
  onNewDocument,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    'tutorials-learning': true,
    'travel-maps': true,
    'goals-timelines': false,
  });

  const toggleDomain = (domainId: string) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      case 'Map': return <Map className="w-4 h-4" />;
      case 'Terminal': return <Terminal className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Coins': return <Coins className="w-4 h-4" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'ListOrdered': return <ListOrdered className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      default: return <FolderOpen className="w-4 h-4" />;
    }
  };

  const PRIMARY_HUBS = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'mind_map', label: 'Universal Mind Map', icon: Network, color: 'text-fuchsia-600 dark:text-fuchsia-400', badge: 'All Data' },
    { id: 'cloud_storage', label: 'Cloud Drive & Sharing', icon: Cloud, color: 'text-sky-600 dark:text-sky-400', badge: 'OneDrive/G-Drive' },
    { id: 'kanban_tasks', label: 'Kanban Tasks', icon: CheckSquare, color: 'text-blue-600 dark:text-blue-400', badge: 'Pipeline' },
    { id: 'timelines', label: 'Project Timelines', icon: Clock, color: 'text-violet-600 dark:text-violet-400', badge: 'Gantt' },
    { id: 'travel_map', label: 'Travel Map Studio', icon: Map, color: 'text-amber-600 dark:text-amber-400', badge: 'Portugal' },
    { id: 'live_doc', label: 'Live Co-Writing', icon: Edit3, color: 'text-emerald-600 dark:text-emerald-400', badge: 'Dual' },
    { id: 'security_vault', label: 'Security Vault', icon: ShieldCheck, color: 'text-red-600 dark:text-red-400', badge: 'Shield' },
    { id: 'spiritual_wellbeing', label: 'Spiritual & Wellbeing', icon: Flower2, color: 'text-purple-600 dark:text-purple-400', badge: 'Sanctuary' },
    { id: 'calendar', label: 'Calendar & Schedule', icon: Calendar, color: 'text-teal-600 dark:text-teal-400' },
    { id: 'agents', label: 'Autonomous Agents', icon: Bot, color: 'text-indigo-600 dark:text-indigo-400', dot: true },
    { id: 'email', label: 'Shared Mailbox', icon: Mail, color: 'text-sky-600 dark:text-sky-400' },
    { id: 'news', label: 'News & Intelligence', icon: Newspaper, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'whiteboard', label: 'Scratch Canvas', icon: PenTool, color: 'text-slate-500 dark:text-slate-400' },
  ] as const;

  const handleViewClick = (view: AppView) => {
    onSelectView(view);
    onCloseMobile?.();
  };

  const handleDocClick = (docId: string) => {
    onSelectDocument(docId);
    onCloseMobile?.();
  };

  const renderSidebarBody = () => (
    <>
      {/* Primary Native App Hubs */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-0.5 overflow-y-auto max-h-[300px]">
        {PRIMARY_HUBS.map((hub) => {
          const Icon = hub.icon;
          const isActive = currentView === hub.id;

          return (
            <button
              key={hub.id}
              onClick={() => handleViewClick(hub.id as AppView)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] active:scale-[0.98] ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${hub.color}`} />
                <span className="truncate">{hub.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {'badge' in hub && hub.badge && (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {hub.badge}
                  </span>
                )}
                {'dot' in hub && hub.dot && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Header for Shared Life Domains */}
      <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono">
          Shared Life Domains
        </span>
        <button
          onClick={() => {
            onNewDocument(activeDomainId || 'tutorials-learning');
            onCloseMobile?.();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Create New Life Doc"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Life Domains Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {domains.map((domain) => {
          const isExpanded = !!expandedDomains[domain.id];
          const domainDocs = documents.filter((d) => d.domainId === domain.id);
          const isDomainActive = activeDomainId === domain.id && currentView === 'document';

          return (
            <div key={domain.id} className="space-y-0.5">
              <div
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer group min-h-[40px] ${
                  isDomainActive
                    ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
                onClick={() => {
                  onSelectDomain(domain.id);
                  toggleDomain(domain.id);
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">{getDomainIcon(domain.iconName)}</span>
                  <span className="truncate text-[12px]">
                    {domain.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                  {domainDocs.length}
                </span>
              </div>

              {isExpanded && (
                <div className="pl-6 pr-1 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-4 my-1">
                  {domainDocs.map((doc) => {
                    const isDocActive = currentView === 'document' && activeDocumentId === doc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocClick(doc.id);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] transition-all flex items-center justify-between group min-h-[36px] ${
                          isDocActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileText className={`w-3 h-3 shrink-0 ${isDocActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                          <span className="truncate">{doc.title}</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase shrink-0 ml-1">
                          {doc.docType.slice(0, 4)}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      onNewDocument(domain.id);
                      onCloseMobile?.();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[10px] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Add doc</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300">Proton Sync Active</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">Key + Nura OS</span>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white dark:bg-slate-900 border-r-2 border-slate-300 dark:border-slate-800 h-[calc(100vh-4rem)] select-none shrink-0 shadow-sm transition-colors">
        {renderSidebarBody()}
      </aside>

      {/* Mobile Slide-Out Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in" 
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r-2 border-slate-300 dark:border-slate-800 flex flex-col h-full select-none shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  NK
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">NuraKey Hubs</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Shared Life OS</p>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                title="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderSidebarBody()}
          </aside>
        </div>
      )}
    </>
  );
};
