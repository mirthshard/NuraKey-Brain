import React, { useState } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Mail, 
  Newspaper, 
  Bot, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ExternalLink, 
  Play, 
  RefreshCw, 
  Plane, 
  Coins, 
  Terminal, 
  Heart,
  ChevronRight,
  Filter,
  Map,
  Edit3,
  Layers,
  Sparkle,
  ShieldCheck,
  Lock,
  Flower2,
  Wind,
  Compass,
  Send,
  Flame,
  Network,
  Cloud
} from 'lucide-react';
import { 
  Partner, 
  CalendarEvent, 
  LifeTask, 
  EmailItem, 
  NewsArticle, 
  ScheduledAgent, 
  BrainDocument,
  DailyIntention,
  GratitudeEntry,
  SpiritualRitual
} from '../../types/brain';

interface ExecutiveDashboardProps {
  currentPartner: Partner;
  calendarEvents: CalendarEvent[];
  tasks: LifeTask[];
  emails: EmailItem[];
  news: NewsArticle[];
  agents: ScheduledAgent[];
  documents: BrainDocument[];
  intentions?: DailyIntention[];
  gratitudes?: GratitudeEntry[];
  rituals?: SpiritualRitual[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, category: 'Home' | 'Travel' | 'Finances' | 'Tech' | 'Health', owner: Partner | 'Both') => void;
  onOpenDocument: (docId: string) => void;
  onOpenEmailItem: (email: EmailItem) => void;
  onOpenComposeEmail: () => void;
  onOpenAgentsManager: () => void;
  onOpenCalendarView: () => void;
  onOpenNewsView: () => void;
  onRunAgent: (agentId: string) => void;
  onOpenAi: (initialPrompt?: string) => void;
  onOpenKanbanView?: () => void;
  onOpenTimelinesView?: () => void;
  onOpenTravelMapView?: () => void;
  onOpenLiveDoc?: () => void;
  onOpenSecurityVault?: () => void;
  onOpenSpiritualStudio?: () => void;
  onOpenMindMapView?: () => void;
  onOpenCloudStorageView?: () => void;
  onQuickAddGratitude?: (text: string) => void;
  onQuickSetIntention?: (text: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  currentPartner,
  calendarEvents,
  tasks,
  emails,
  news,
  agents,
  documents,
  intentions = [],
  gratitudes = [],
  rituals = [],
  onToggleTask,
  onAddTask,
  onOpenDocument,
  onOpenEmailItem,
  onOpenComposeEmail,
  onOpenAgentsManager,
  onOpenCalendarView,
  onOpenNewsView,
  onRunAgent,
  onOpenAi,
  onOpenKanbanView,
  onOpenTimelinesView,
  onOpenTravelMapView,
  onOpenLiveDoc,
  onOpenSecurityVault,
  onOpenSpiritualStudio,
  onOpenMindMapView,
  onOpenCloudStorageView,
  onQuickAddGratitude,
  onQuickSetIntention,
}) => {
  const [taskFilter, setTaskFilter] = useState<'All' | 'Mine' | 'High'>('All');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  // Quick Spiritual Inputs
  const [quickIntentionText, setQuickIntentionText] = useState('');
  const [quickGratitudeText, setQuickGratitudeText] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'High') return t.priority === 'high' && !t.completed;
    if (taskFilter === 'Mine') return (t.owner === currentPartner || t.owner === 'Both') && !t.completed;
    return true;
  });

  const unreadEmailCount = emails.filter(e => e.unread).length;
  const pendingTaskCount = tasks.filter(t => !t.completed).length;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    onAddTask(newTaskInput.trim(), 'Home', currentPartner);
    setNewTaskInput('');
  };

  const handleTriggerAgent = (agentId: string) => {
    setRunningAgentId(agentId);
    setTimeout(() => {
      onRunAgent(agentId);
      setRunningAgentId(null);
    }, 1500);
  };

  const otherPartner: Partner = currentPartner === 'Key' ? 'Nura' : 'Key';
  const isTodayIntention = (i: DailyIntention) => 
    i.date.includes('Today') || i.date === new Date().toISOString().split('T')[0] || i.id.startsWith('intent-');
  const partnerIntention = intentions.find(i => i.partner === otherPartner && isTodayIntention(i));
  const myIntention = intentions.find(i => i.partner === currentPartner && isTodayIntention(i));
  const latestGratitude = gratitudes[0];

  const handleIntentionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickIntentionText.trim() || !onQuickSetIntention) return;
    onQuickSetIntention(quickIntentionText.trim());
    setQuickIntentionText('');
  };

  const handleGratitudeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickGratitudeText.trim() || !onQuickAddGratitude) return;
    onQuickAddGratitude(quickGratitudeText.trim());
    setQuickGratitudeText('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Executive Clean Header & Quick Stats Strip - Elevated High Contrast */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {currentPartner}'s Executive View · Proton Dual-Sync Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Workspace Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Unified schedule, tasks, shared mailbox, spiritual practice, and autonomous agents for Key & Nura.
          </p>
        </div>

        {/* 5 Summary Stat Pills - Crisp Elevated Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 shadow-2xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Next Event</span>
            </div>
            <div className="font-extrabold text-slate-900 dark:text-white mt-1 truncate text-sm">Today, 19:30</div>
            <div className="text-[10px] text-slate-400 truncate">Evening Walk & Tea</div>
          </div>

          <div 
            onClick={onOpenKanbanView}
            className="bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-3.5 cursor-pointer transition-all shadow-2xs group"
          >
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 font-semibold">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Pending Tasks</span>
            </div>
            <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-sm">{pendingTaskCount} active</div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold group-hover:underline">Kanban Pipeline →</div>
          </div>

          <div 
            onClick={onOpenSpiritualStudio}
            className="bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl p-3.5 cursor-pointer transition-all shadow-2xs group"
          >
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 font-semibold">
              <Flower2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Mindfulness</span>
            </div>
            <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-sm">21d Streak 🔥</div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold group-hover:underline">Sanctuary →</div>
          </div>

          <div 
            onClick={onOpenSecurityVault}
            className="bg-white dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-400 rounded-2xl p-3.5 cursor-pointer transition-all shadow-2xs group"
          >
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Security Vault</span>
            </div>
            <div className="font-extrabold text-slate-900 dark:text-white mt-1 text-sm">Protected</div>
            <div className="text-[10px] text-red-600 dark:text-red-400 font-bold group-hover:underline">Open Vault →</div>
          </div>
        </div>
      </div>

      {/* Feature Studios Quick Launcher Bar - High Visual Definition & Solid Borders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <button
          onClick={onOpenMindMapView}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-fuchsia-500 dark:hover:border-fuchsia-500 rounded-3xl p-3.5 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-800">
                <Network className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-fuchsia-600 dark:text-fuchsia-400 font-bold uppercase">All Data</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
              Universal Mind Map
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              Neural graph of all domains & docs
            </p>
          </div>
          <span className="text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-400 group-hover:underline pt-2">
            Explore Graph →
          </span>
        </button>

        <button
          onClick={onOpenCloudStorageView}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 rounded-3xl p-3.5 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                <Cloud className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold uppercase">OneDrive</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Cloud Storage & Sync
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              OneDrive, G-Drive & sharing rules
            </p>
          </div>
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 group-hover:underline pt-2">
            Open Cloud Hub →
          </span>
        </button>

        <button
          onClick={onOpenKanbanView}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-3.5 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <CheckSquare className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase">Pipeline</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Color Kanban
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              5 Task pipeline stages
            </p>
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline pt-2">
            Manage Tasks →
          </span>
        </button>

        <button
          onClick={onOpenTimelinesView}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 rounded-3xl p-3.5 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                <Clock className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold uppercase">Gantt</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              Timelines
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              Multi-month roadmaps
            </p>
          </div>
          <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 group-hover:underline pt-2">
            View Gantt →
          </span>
        </button>

        <button
          onClick={onOpenSpiritualStudio}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 rounded-3xl p-3.5 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <Flower2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase">Sanctuary</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Spiritual & Wellbeing
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              Intentions & gratitude
            </p>
          </div>
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline pt-2">
            Sanctuary →
          </span>
        </button>

        <button
          onClick={onOpenTravelMapView}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 rounded-3xl p-3.5 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Map className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">Portugal</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Travel Map
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              Route pins & bookings
            </p>
          </div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 group-hover:underline pt-2">
            Open Map →
          </span>
        </button>

        <button
          onClick={onOpenLiveDoc}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-3.5 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Edit3 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">Dual Live</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Co-Writing
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              Real-time collaboration
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline pt-2">
            Live Editor →
          </span>
        </button>
      </div>

      {/* DEDICATED DASHBOARD WIDGET: SPIRITUAL PRACTICE & MEDITATION */}
      <div className="bg-white dark:bg-slate-900 border-2 border-purple-300 dark:border-purple-900/70 border-t-4 border-t-purple-600 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-purple-100 dark:border-purple-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                  Spiritual Practice & Meditation Sanctuary
                </h2>
                <span className="text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                  Daily Grounding
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Shared intention exchange, gratitude journal, and 2-minute couple breathwork reset
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSpiritualStudio}
            className="px-3.5 py-1.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Sanctuary Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Column Split: Intentions & Gratitude */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column 1: Today's Couple Intentions */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border-2 border-purple-100 dark:border-purple-950 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Today's Daily Intentions</span>
              </div>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                {myIntention && partnerIntention ? 'Both Set ✨' : '1 Active'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center">K</span>
                    <span className="font-bold text-slate-900 dark:text-white">Key</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-1.5 rounded">Grounded 🌿</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">
                  "{myIntention ? myIntention.intention : 'Bring calm, unhurried presence to the infrastructure deployment sprint.'}"
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">N</span>
                    <span className="font-bold text-slate-900 dark:text-white">Nura</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-600 font-semibold bg-purple-50 dark:bg-purple-950/50 px-1.5 rounded">Calm 🌊</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">
                  "{partnerIntention ? partnerIntention.intention : 'Honor rest between study sessions and savor our evening tea ritual.'}"
                </p>
              </div>
            </div>

            {/* Quick Set Intention Input */}
            <form onSubmit={handleIntentionSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={quickIntentionText}
                onChange={(e) => setQuickIntentionText(e.target.value)}
                placeholder={`Set ${currentPartner}'s intention for today...`}
                className="flex-1 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!quickIntentionText.trim()}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                Set
              </button>
            </form>
          </div>

          {/* Column 2: Latest Gratitude & Breathwork Reset */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border-2 border-purple-100 dark:border-purple-950 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Shared Gratitude Journal</span>
                </div>
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                  {gratitudes.length} Memories
                </span>
              </div>

              {latestGratitude && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{latestGratitude.author}</span>
                    <span className="text-[10px] font-mono text-purple-600">{latestGratitude.tag}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">
                    "{latestGratitude.text}"
                  </p>
                </div>
              )}

              {/* Quick Add Gratitude Bar */}
              <form onSubmit={handleGratitudeSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={quickGratitudeText}
                  onChange={(e) => setQuickGratitudeText(e.target.value)}
                  placeholder="Record what you are grateful for today..."
                  className="flex-1 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!quickGratitudeText.trim()}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick 2-Minute Breathing Launcher Button */}
            <div className="pt-2 border-t border-purple-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                <span>Box Breathing (4-4-4-4)</span>
              </span>

              <button
                onClick={onOpenSpiritualStudio}
                className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                <span>Begin 2-Min Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Scheduled Agents Strip - High Definition */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-5 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Autonomous Background Agents</span>
                <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-300 dark:border-emerald-800">
                  {agents.filter(a => a.status === 'Active').length} ACTIVE
                </span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                Scheduled background tasks monitoring flights, synthesizing weekly admin notes, and auditing CVEs
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAgentsManager}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Configure & Schedule Agents</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{agent.name}</span>
                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {agent.schedule}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {agent.lastResult || agent.description}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                <span className="text-slate-400 font-mono">Last run: {agent.lastRun}</span>
                <button
                  onClick={() => handleTriggerAgent(agent.id)}
                  disabled={runningAgentId === agent.id}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Play className={`w-2.5 h-2.5 ${runningAgentId === agent.id ? 'animate-spin' : ''}`} />
                  <span>{runningAgentId === agent.id ? 'Running...' : 'Run Now'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Main Operational Quadrants - Crisp Solid Borders & Header Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quadrant 1: Calendar & Schedule (Top Indigo Stripe) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 border-t-4 border-t-indigo-600 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Calendar & Schedule</h2>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 font-bold">
                Proton Sync
              </span>
            </div>
            <button
              onClick={onOpenCalendarView}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
            >
              Full Calendar View →
            </button>
          </div>

          <div className="space-y-2.5">
            {calendarEvents.map((evt) => (
              <div 
                key={evt.id} 
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700/80 transition-colors flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{evt.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{evt.date}</span>
                    <span>·</span>
                    <span>{evt.time}</span>
                    {evt.location && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{evt.location}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {evt.attendees.map(att => (
                    <span key={att} className="text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300 font-semibold">
                      {att}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[11px]">Synced with Proton Calendar</span>
            <button
              onClick={() => onOpenAi('Help us schedule our next weekly life admin check-in')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Schedule Assistant</span>
            </button>
          </div>
        </div>

        {/* Quadrant 2: Actionable Tasks (Top Emerald Stripe) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 border-t-4 border-t-emerald-600 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Tasks & Pipeline</h2>
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold border border-slate-200 dark:border-slate-700">
                {pendingTaskCount} open
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[11px]">
                {(['All', 'Mine', 'High'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors ${
                      taskFilter === filter
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {onOpenKanbanView && (
                <button
                  onClick={onOpenKanbanView}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Full Kanban →
                </button>
              )}
            </div>
          </div>

          {/* Quick Task Add Bar */}
          <form onSubmit={handleTaskSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Add new task for Proton Tasks..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-hidden focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newTaskInput.trim()}
              className="p-2.5 rounded-2xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-colors shadow-2xs"
              title="Add task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400 line-through'
                    : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    task.completed 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                  }`}>
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <span className="text-xs truncate font-medium">{task.title}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${
                    task.priority === 'high' 
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {task.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Shared Couple Mailbox (Top Sky Stripe) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 border-t-4 border-t-sky-500 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Shared Mailbox</h2>
              <span className="text-[10px] font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 font-bold">
                key.and.nura@proton.me
              </span>
            </div>

            <button
              onClick={onOpenComposeEmail}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {emails.map((em) => (
              <div
                key={em.id}
                onClick={() => onOpenEmailItem(em)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                  em.unread
                    ? 'bg-sky-50/50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800/80 shadow-2xs'
                    : 'bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700/70 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {em.unread && <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />}
                    <span className="font-bold text-slate-900 dark:text-white truncate">{em.from.split('@')[0]}</span>
                    <span className="text-slate-400 font-mono text-[11px] truncate">({em.tag})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{em.date}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{em.subject}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{em.snippet}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 4: News & Intelligence Radar (Top Amber Stripe) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 border-t-4 border-t-amber-500 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">News & Intelligence</h2>
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 font-bold">
                Tech & Travel
              </span>
            </div>

            <button
              onClick={onOpenNewsView}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline transition-colors"
            >
              Full Feed →
            </button>
          </div>

          <div className="space-y-2.5">
            {news.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700/70 transition-colors space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.timeAgo}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span className="font-mono text-[11px]">Curated for Key & Nura</span>
            <button
              onClick={() => onOpenAi('Summarize the top tech and travel developments this week')}
              className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI News Briefing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Life Domains Quick Access - Elevated Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Shared Life Domains Quick Access
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">12 Structured Domains</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onOpenDocument('doc-tut-system')}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-indigo-500 rounded-3xl p-5 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[10px]">TUTORIALS</span>
              <Terminal className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              System Manual & Operating Rules
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
              Inbox triage, Proton sync, and shared life operating guidelines
            </p>
          </div>

          <div 
            onClick={() => onOpenDocument('doc-rel-traditions')}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-rose-500 rounded-3xl p-5 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-[10px]">RELATIONSHIP</span>
              <Heart className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
              Traditions, Rituals & Love
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
              Date nights, anniversary timeline, and bucket list
            </p>
          </div>

          <div 
            onClick={() => onOpenDocument('doc-tech-homelab')}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-blue-500 rounded-3xl p-5 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-blue-600 dark:text-blue-400 font-mono font-bold text-[10px]">TECH LAB</span>
              <Terminal className="w-4 h-4 text-blue-500 group-hover:rotate-6 transition-transform" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Home Lab & Cluster Architecture
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
              Atlas Proxmox cluster, TrueNAS ZFS, UniFi topology
            </p>
          </div>

          <div 
            onClick={onOpenSecurityVault}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-800 hover:border-red-500 rounded-3xl p-5 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-red-600 dark:text-red-400 font-mono font-bold text-[10px]">SECURITY VAULT</span>
              <ShieldCheck className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
              Emergency & Credential Vault
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
              Master credentials, utility shutoffs, and audit logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
