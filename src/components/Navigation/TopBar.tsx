import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Video, 
  Download, 
  Bell, 
  MessageSquare,
  Bot,
  Mail,
  Calendar,
  CheckSquare,
  ChevronDown,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import { Partner, PartnerProposal } from '../../types/brain';

interface TopBarProps {
  currentPartner: Partner;
  onSwitchPartner: (partner: Partner) => void;
  onOpenSearch: () => void;
  onOpenAi: () => void;
  onOpenCall: () => void;
  onOpenExport: () => void;
  onOpenEmail: () => void;
  onToggleChat: () => void;
  onOpenAgents: () => void;
  unreadChatCount: number;
  unreadEmailCount: number;
  proposals: PartnerProposal[];
  onOpenProposal: (proposal: PartnerProposal) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPartner,
  onSwitchPartner,
  onOpenSearch,
  onOpenAi,
  onOpenCall,
  onOpenExport,
  onOpenEmail,
  onToggleChat,
  onOpenAgents,
  unreadChatCount,
  unreadEmailCount,
  proposals,
  onOpenProposal,
  isDarkMode,
  onToggleDarkMode,
  onToggleMobileMenu,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const partnerName = currentPartner === 'Key' ? 'Nura' : 'Key';

  return (
    <header className="h-16 border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Left zone: Mobile Menu Toggle, Clean App Brand & Global Search */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors active:scale-95"
            title="Open Hubs Menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm text-white font-bold text-sm tracking-tight shrink-0">
            NK
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 truncate">
              <span>NuraKey</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hidden xs:inline">
                Brain OS
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              Shared Executive Life Headquarters
            </div>
          </div>
        </div>

        {/* Global Search Shortcut */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-500 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors w-72 justify-between group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="truncate">Search tasks, emails, trips, notes...</span>
          </div>
          <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Middle zone: Native App Action Controls */}
      <div className="flex items-center gap-2">
        {/* Mobile Search */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-xl"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Co-Builder Trigger */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-100" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Autonomous Agents Trigger */}
        <button
          onClick={onOpenAgents}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-colors whitespace-nowrap"
          title="View and schedule background autonomous agents"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-600" />
          <span>Agents</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </button>

        {/* In-App Direct Video Calling Trigger */}
        <button
          onClick={onOpenCall}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-colors whitespace-nowrap"
          title={`Call ${partnerName}`}
        >
          <Video className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden lg:inline">Call {partnerName}</span>
        </button>

        {/* Email Hub Trigger */}
        <button
          onClick={onOpenEmail}
          className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-colors"
          title="Shared Email Hub"
        >
          <Mail className="w-4 h-4" />
          {unreadEmailCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadEmailCount}
            </span>
          )}
        </button>

        {/* Chat Drawer Toggle */}
        <button
          onClick={onToggleChat}
          className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-colors"
          title="Partner Chat & Voice Notes"
        >
          <MessageSquare className="w-4 h-4" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingProposals.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-slate-900">Notifications</span>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {pendingProposals.length} proposal
                </span>
              </div>
              {pendingProposals.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">
                  All caught up! No pending alerts.
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingProposals.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => {
                        onOpenProposal(prop);
                        setShowNotificationMenu(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/60 transition-colors block group"
                    >
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 line-clamp-1">
                        {prop.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                        <span>From {prop.createdBy}</span>
                        <span className="text-amber-600 font-mono text-[10px]">Vote Needed →</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Proton Sync */}
        <button
          onClick={onOpenExport}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors whitespace-nowrap"
          title="Export Markdown Files to Proton Drive"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Proton Sync</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-2xs"
          title={isDarkMode ? 'Switch to Clean Light Theme' : 'Switch to Sleek Dark Theme'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>

      {/* Right zone: Clean iOS Partner Switcher */}
      <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onSwitchPartner(currentPartner === 'Key' ? 'Nura' : 'Key')}
          className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all text-xs font-medium text-slate-700 dark:text-slate-200"
          title="Switch perspective between Key and Nura"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white shadow-xs ${
            currentPartner === 'Key' ? 'bg-indigo-600' : 'bg-violet-600'
          }`}>
            {currentPartner[0]}
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">{currentPartner}</span>
          <span className="text-[10px] text-slate-400 font-mono">({partnerName} ↺)</span>
        </button>
      </div>
    </header>
  );
};
