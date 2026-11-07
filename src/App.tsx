/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Partner, 
  LifeDomain, 
  BrainDocument, 
  PartnerProposal, 
  ChatMessage, 
  WhiteboardNode, 
  WhiteboardConnection,
  LifeTask,
  CalendarEvent,
  EmailItem,
  NewsArticle,
  ScheduledAgent,
  ProjectTimeline,
  InteractiveMapPin,
  TaskStage,
  SecureVaultItem,
  VaultAccessLog,
  DailyIntention,
  GratitudeEntry,
  SpiritualRitual,
  CloudFileItem,
  CollaborationRule,
  Frontmatter
} from './types/brain';
import { 
  INITIAL_DOMAINS, 
  INITIAL_DOCUMENTS, 
  INITIAL_PROPOSALS, 
  INITIAL_CHAT, 
  INITIAL_WHITEBOARD_NODES, 
  INITIAL_WHITEBOARD_CONNECTIONS,
  INITIAL_TASKS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_EMAILS,
  INITIAL_NEWS,
  INITIAL_AGENTS,
  INITIAL_PROJECT_TIMELINES,
  INITIAL_MAP_PINS,
  INITIAL_VAULT_ITEMS,
  INITIAL_VAULT_LOGS,
  INITIAL_INTENTIONS,
  INITIAL_GRATITUDES,
  INITIAL_RITUALS,
  INITIAL_CLOUD_FILES,
  INITIAL_COLLABORATION_RULES
} from './data/initialBrainData';
import { TopBar } from './components/Navigation/TopBar';
import { Sidebar, AppView } from './components/Navigation/Sidebar';
import { ExecutiveDashboard } from './components/Dashboard/ExecutiveDashboard';
import { InteractiveDocumentView } from './components/DocumentView/InteractiveDocumentView';
import { WhiteboardStudio } from './components/Whiteboard/WhiteboardStudio';
import { InAppVideoCallingPod } from './components/Comms/InAppVideoCallingPod';
import { ChatDrawer } from './components/Comms/ChatDrawer';
import { AiCoBuilderModal } from './components/Modals/AiCoBuilderModal';
import { PartnerProposalModal } from './components/Modals/PartnerProposalModal';
import { ProtonExportModal } from './components/Modals/ProtonExportModal';
import { EmailHubModal } from './components/Modals/EmailHubModal';
import { GlobalSearchModal } from './components/Modals/GlobalSearchModal';
import { AgentsManager } from './components/Agents/AgentsManager';
import { CalendarView } from './components/Calendar/CalendarView';
import { NewsFeedView } from './components/News/NewsFeedView';
import { TimelinesView } from './components/Timelines/TimelinesView';
import { TravelMapStudio } from './components/Travel/TravelMapStudio';
import { KanbanTasksView } from './components/Tasks/KanbanTasksView';
import { LiveCoAuthoringEditor } from './components/DocumentView/LiveCoAuthoringEditor';
import { SecurityVaultStudio } from './components/Vault/SecurityVaultStudio';
import { SpiritualWellbeingStudio } from './components/Spiritual/SpiritualWellbeingStudio';
import { UniversalMindMapView } from './components/MindMap/UniversalMindMapView';
import { CloudStorageCollaborationHub } from './components/Storage/CloudStorageCollaborationHub';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Network, 
  Menu 
} from 'lucide-react';

export default function App() {
  const [currentPartner, setCurrentPartner] = useState<Partner>('Key');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeDocumentId, setActiveDocumentId] = useState<string>('doc-tut-system');
  const [activeDomainId, setActiveDomainId] = useState<string>('tutorials-learning');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dark Mode Theme Management (clean white iOS app default, dark mode toggleable)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nk_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nk_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nk_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Core Structured State
  const [domains, setDomains] = useState<LifeDomain[]>(INITIAL_DOMAINS);
  const [documents, setDocuments] = useState<BrainDocument[]>(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState<LifeTask[]>(INITIAL_TASKS);
  const [timelines, setTimelines] = useState<ProjectTimeline[]>(INITIAL_PROJECT_TIMELINES);
  const [mapPins, setMapPins] = useState<InteractiveMapPin[]>(INITIAL_MAP_PINS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [agents, setAgents] = useState<ScheduledAgent[]>(INITIAL_AGENTS);
  const [vaultItems, setVaultItems] = useState<SecureVaultItem[]>(INITIAL_VAULT_ITEMS);
  const [accessLogs, setAccessLogs] = useState<VaultAccessLog[]>(INITIAL_VAULT_LOGS);
  const [proposals, setProposals] = useState<PartnerProposal[]>(INITIAL_PROPOSALS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [whiteboardNodes, setWhiteboardNodes] = useState<WhiteboardNode[]>(INITIAL_WHITEBOARD_NODES);
  const [whiteboardConnections, setWhiteboardConnections] = useState<WhiteboardConnection[]>(INITIAL_WHITEBOARD_CONNECTIONS);
  const [intentions, setIntentions] = useState<DailyIntention[]>(INITIAL_INTENTIONS);
  const [gratitudes, setGratitudes] = useState<GratitudeEntry[]>(INITIAL_GRATITUDES);
  const [rituals, setRituals] = useState<SpiritualRitual[]>(INITIAL_RITUALS);
  const [cloudFiles, setCloudFiles] = useState<CloudFileItem[]>(INITIAL_CLOUD_FILES);
  const [collaborationRules, setCollaborationRules] = useState<CollaborationRule[]>(INITIAL_COLLABORATION_RULES);

  // Modals & Panels State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isProtonExportOpen, setIsProtonExportOpen] = useState(false);
  const [isEmailHubOpen, setIsEmailHubOpen] = useState(false);
  const [selectedEmailItem, setSelectedEmailItem] = useState<EmailItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeProposal, setActiveProposal] = useState<PartnerProposal | null>(null);

  const activeDoc = documents.find(d => d.id === activeDocumentId) || documents[0];

  // Navigation handlers
  const handleSelectDocument = (docId: string) => {
    setActiveDocumentId(docId);
    const doc = documents.find(d => d.id === docId);
    if (doc) setActiveDomainId(doc.domainId);
    setCurrentView('document');
  };

  const handleSelectDomain = (domainId: string) => {
    setActiveDomainId(domainId);
    const firstDoc = documents.find(d => d.domainId === domainId);
    if (firstDoc) {
      setActiveDocumentId(firstDoc.id);
      setCurrentView('document');
    }
  };

  const handleSelectView = (view: AppView) => {
    if (view === 'email') {
      setSelectedEmailItem(null);
      setIsEmailHubOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleNewDocument = (domainId?: string) => {
    const targetDomain = domainId || activeDomainId || 'tutorials-learning';
    const newId = `doc-${Date.now()}`;
    const newDoc: BrainDocument = {
      id: newId,
      domainId: targetDomain,
      path: `${targetDomain}/New-Plan-${new Date().toISOString().slice(0, 10)}.md`,
      title: 'Untitled Plan & Note',
      docType: 'general_notes',
      frontmatter: {
        type: 'notes',
        owners: [currentPartner],
        created: new Date().toISOString().slice(0, 10),
        updated: new Date().toISOString().slice(0, 10),
        tags: ['draft'],
      },
      content: `# Untitled Plan & Note\n\nDrafted by ${currentPartner}. Add context, links, or checklist items here.`,
    };

    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocumentId(newId);
    setActiveDomainId(targetDomain);
    setCurrentView('document');
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextCompleted = !t.completed;
      return {
        ...t,
        completed: nextCompleted,
        stage: nextCompleted ? 'completed' : 'todo'
      };
    }));
  };

  const handleAddTask = (
    title: string, 
    category: 'Home' | 'Travel' | 'Finances' | 'Tech' | 'Health' | 'Admin', 
    owner: Partner | 'Both',
    priority: 'high' | 'medium' | 'low' = 'medium',
    stage: TaskStage = 'todo'
  ) => {
    const colorTagMap: Record<string, string> = {
      Tech: 'border-l-4 border-blue-500',
      Travel: 'border-l-4 border-amber-500',
      Finances: 'border-l-4 border-emerald-500',
      Home: 'border-l-4 border-rose-500',
      Health: 'border-l-4 border-teal-500',
      Admin: 'border-l-4 border-purple-500',
    };

    const newTask: LifeTask = {
      id: `tsk-${Date.now()}`,
      title,
      completed: stage === 'completed',
      stage,
      priority,
      dueDate: 'This week',
      category,
      owner,
      colorTag: colorTagMap[category] || 'border-l-4 border-indigo-500',
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleMoveTaskStage = (taskId: string, newStage: TaskStage) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        stage: newStage,
        completed: newStage === 'completed'
      };
    }));
  };

  const handleUpdateTask = (updatedTask: LifeTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Project Timelines Handlers
  const handleToggleMilestone = (timelineId: string, milestoneId: string) => {
    setTimelines(prev => prev.map(tl => {
      if (tl.id !== timelineId) return tl;
      const updatedMilestones = tl.milestones.map(ms => {
        if (ms.id !== milestoneId) return ms;
        return { ...ms, completed: !ms.completed };
      });
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
      return {
        ...tl,
        milestones: updatedMilestones,
        progress,
        status: progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Upcoming'
      };
    }));
  };

  // Travel Map Pins Handlers
  const handleToggleMapPinBooked = (pinId: string) => {
    setMapPins(prev => prev.map(p => {
      if (p.id !== pinId) return p;
      return { ...p, booked: !p.booked };
    }));
  };

  // Calendar Handlers
  const handleAddCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
  };

  // Agent Handlers
  const handleToggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a));
  };

  const handleRunAgent = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      return {
        ...a,
        lastRun: 'Just now',
        lastResult: a.actionType === 'flight_monitor'
          ? 'Checked British Airways & TAP routes. London-Lisbon stable at £182 return.'
          : a.actionType === 'tech_cve'
          ? 'Probed UniFi UDM-Pro & Proxmox clusters. 0 CVEs detected. Uptime nominal.'
          : 'Processed uncompleted items from Inbox.md and drafted life admin summary.',
      };
    }));
  };

  const handleCreateAgent = (agent: ScheduledAgent) => {
    setAgents(prev => [agent, ...prev]);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
  };

  // Email Handlers
  const handleOpenEmailItem = (email: EmailItem) => {
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, unread: false } : e));
    setSelectedEmailItem(email);
    setIsEmailHubOpen(true);
  };

  // Document Content & Tags Update
  const handleUpdateDocumentContent = (newContent: string) => {
    if (!activeDocumentId) return;
    setDocuments(prev => prev.map(d => d.id === activeDocumentId ? { ...d, content: newContent } : d));
  };

  const handleUpdateDocumentTags = (docId: string, newTags: string[]) => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      return {
        ...d,
        frontmatter: {
          ...d.frontmatter,
          tags: newTags,
          updated: new Date().toISOString().slice(0, 10),
        },
      };
    }));
  };

  const handleUpdateFrontmatter = (docId: string, updatedFrontmatter: Frontmatter) => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      return {
        ...d,
        docType: (updatedFrontmatter.type as any) || d.docType,
        frontmatter: updatedFrontmatter,
      };
    }));
  };

  // Cloud Storage & Collaboration Handlers
  const handleAddCloudFile = (file: CloudFileItem) => {
    setCloudFiles(prev => [file, ...prev]);
  };

  const handleLinkFileToDoc = (fileId: string, docId: string) => {
    setCloudFiles(prev => prev.map(f => f.id === fileId ? { ...f, linkedDocId: docId } : f));
  };

  const handleVoteCollaborationRule = (ruleId: string, partner: Partner) => {
    setCollaborationRules(prev => prev.map(r => {
      if (r.id !== ruleId) return r;
      const votes = r.partnerVotes.includes(partner)
        ? r.partnerVotes.filter(p => p !== partner)
        : [...r.partnerVotes, partner];
      return { ...r, partnerVotes: votes };
    }));
  };

  // Proposal Handlers
  const handleCreateProposal = (newProposal: PartnerProposal) => {
    setProposals(prev => [newProposal, ...prev]);
    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'AI',
      text: `${newProposal.createdBy} dispatched a proposal: "${newProposal.title}". Vote on options!`,
      timestamp: 'Just now',
      type: 'proposal_card',
      proposalId: newProposal.id,
    };
    setChatMessages(prev => [...prev, chatMsg]);
    setActiveProposal(newProposal);
  };

  const handleVoteProposalOption = (proposalId: string, optionId: string, partner: Partner) => {
    setProposals(prev => prev.map(prop => {
      if (prop.id !== proposalId) return prop;
      const updatedOptions = prop.options.map(opt => {
        if (opt.id !== optionId) return opt;
        const votes = opt.votes.includes(partner)
          ? opt.votes.filter(v => v !== partner)
          : [...opt.votes, partner];
        return { ...opt, votes };
      });
      return { ...prop, options: updatedOptions };
    }));
  };

  const handleConfirmProposalOption = (proposalId: string, optionId: string, partnerNote?: string) => {
    setProposals(prev => prev.map(prop => {
      if (prop.id !== proposalId) return prop;
      return {
        ...prop,
        status: 'accepted',
        confirmedOptionId: optionId,
        partnerNote,
      };
    }));

    const confirmedProp = proposals.find(p => p.id === proposalId);
    const confirmedOpt = confirmedProp?.options.find(o => o.id === optionId);

    if (confirmedProp && confirmedOpt) {
      // Add decision to decisions doc
      setDocuments(prev => prev.map(doc => {
        if (doc.id === 'doc-goal-decisions' && doc.structuredData?.decisions) {
          const newDecision = {
            id: `dec-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            decision: `Approved Proposal: ${confirmedOpt.title}`,
            why: `Voted and confirmed by ${currentPartner}. Vibe: ${confirmedOpt.vibe}`,
            owner: 'Key + Nura',
            status: 'Confirmed',
            revisitDate: '2026-12-31',
          };
          return {
            ...doc,
            structuredData: {
              ...doc.structuredData,
              decisions: [newDecision, ...doc.structuredData.decisions],
            },
          };
        }
        return doc;
      }));

      // Add to calendar automatically
      const newCalEvt: CalendarEvent = {
        id: `evt-${Date.now()}`,
        title: confirmedOpt.title,
        date: 'Friday, Nov 14',
        time: '19:45 - 22:30',
        duration: '2.5 hrs',
        location: confirmedOpt.location,
        category: 'date',
        attendees: ['Key', 'Nura'],
        syncedWithProton: true,
      };
      setCalendarEvents(prev => [...prev, newCalEvt]);
    }
  };

  // Chat Handlers
  const handleSendMessage = (text: string, type: 'text' | 'voice' = 'text', audioDuration?: number) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentPartner,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      audioDuration,
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  // Whiteboard Handlers
  const handleAddWhiteboardNode = (node: WhiteboardNode) => {
    setWhiteboardNodes(prev => [...prev, node]);
  };

  const handleUpdateNodePosition = (id: string, x: number, y: number) => {
    setWhiteboardNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const handleDeleteWhiteboardNode = (id: string) => {
    setWhiteboardNodes(prev => prev.filter(n => n.id !== id));
  };

  // Security Vault Handlers
  const handleAddVaultItem = (item: SecureVaultItem) => {
    setVaultItems(prev => [item, ...prev]);
  };

  const handleDeleteVaultItem = (id: string) => {
    setVaultItems(prev => prev.filter(i => i.id !== id));
  };

  const handleRecordAccessLog = (log: Omit<VaultAccessLog, 'id' | 'timestamp'>) => {
    const newLog: VaultAccessLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      ...log,
    };
    setAccessLogs(prev => [newLog, ...prev]);
  };

  // Spiritual & Wellbeing Handlers
  const handleSetIntention = (intention: string, mood: DailyIntention['mood']) => {
    const newEntry: DailyIntention = {
      id: `intent-${Date.now()}`,
      partner: currentPartner,
      intention,
      mood,
      date: new Date().toISOString().split('T')[0],
      acknowledgedByPartner: false,
    };
    setIntentions(prev => [newEntry, ...prev]);
  };

  const handleAcknowledgeIntention = (id: string) => {
    setIntentions(prev => prev.map(intent => 
      intent.id === id ? { ...intent, acknowledgedByPartner: true } : intent
    ));
  };

  const handleAddGratitude = (text: string, tag: GratitudeEntry['tag'] = 'Relationship', prompt?: string) => {
    const newEntry: GratitudeEntry = {
      id: `grat-${Date.now()}`,
      author: currentPartner,
      text,
      tag,
      date: new Date().toISOString().split('T')[0],
      likes: [currentPartner],
      prompt,
    };
    setGratitudes(prev => [newEntry, ...prev]);
  };

  const handleToggleGratitudeLike = (id: string) => {
    setGratitudes(prev => prev.map(g => {
      if (g.id !== id) return g;
      const alreadyLiked = g.likes.includes(currentPartner);
      const newLikes = alreadyLiked
        ? g.likes.filter(p => p !== currentPartner)
        : [...g.likes, currentPartner];
      return { ...g, likes: newLikes };
    }));
  };

  const handleToggleRitualPartner = (ritualId: string, partner: Partner) => {
    setRituals(prev => prev.map(r => {
      if (r.id !== ritualId) return r;
      const wasCompleted = r.completedToday[partner];
      const otherPartner: Partner = partner === 'Key' ? 'Nura' : 'Key';
      const willBothBeCompleted = !wasCompleted && r.completedToday[otherPartner];
      const newStreak = willBothBeCompleted ? r.streak + 1 : r.streak;
      return {
        ...r,
        completedToday: {
          ...r.completedToday,
          [partner]: !wasCompleted,
        },
        streak: newStreak,
      };
    }));
  };

  const handleOpenAi = (initialPrompt: string = '') => {
    setAiInitialPrompt(initialPrompt);
    setIsAiModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Top Application Header */}
      <TopBar
        currentPartner={currentPartner}
        onSwitchPartner={setCurrentPartner}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAi={() => handleOpenAi()}
        onOpenCall={() => setIsVideoCallOpen(true)}
        onOpenExport={() => setIsProtonExportOpen(true)}
        onOpenEmail={() => {
          setSelectedEmailItem(null);
          setIsEmailHubOpen(true);
        }}
        onToggleChat={() => setIsChatDrawerOpen(!isChatDrawerOpen)}
        onOpenAgents={() => setCurrentView('agents')}
        unreadChatCount={0}
        unreadEmailCount={emails.filter(e => e.unread).length}
        proposals={proposals}
        onOpenProposal={(p) => setActiveProposal(p)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Hubs & Life Domains */}
        <Sidebar
          domains={domains}
          documents={documents}
          activeDocumentId={activeDocumentId}
          activeDomainId={activeDomainId}
          currentView={currentView}
          onSelectDocument={handleSelectDocument}
          onSelectDomain={handleSelectDomain}
          onSelectView={handleSelectView}
          onNewDocument={handleNewDocument}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Central Viewport - Crisp Background Contrast for Separating Elevated Cards */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100/90 dark:bg-slate-950 transition-colors pb-16 md:pb-0">
          {currentView === 'dashboard' && (
            <ExecutiveDashboard
              currentPartner={currentPartner}
              calendarEvents={calendarEvents}
              tasks={tasks}
              emails={emails}
              news={news}
              agents={agents}
              documents={documents}
              intentions={intentions}
              gratitudes={gratitudes}
              rituals={rituals}
              onToggleTask={handleToggleTask}
              onAddTask={(title, category, owner) => handleAddTask(title, category, owner)}
              onOpenDocument={handleSelectDocument}
              onOpenEmailItem={handleOpenEmailItem}
              onOpenComposeEmail={() => {
                setSelectedEmailItem(null);
                setIsEmailHubOpen(true);
              }}
              onOpenAgentsManager={() => setCurrentView('agents')}
              onOpenCalendarView={() => setCurrentView('calendar')}
              onOpenNewsView={() => setCurrentView('news')}
              onRunAgent={handleRunAgent}
              onOpenAi={handleOpenAi}
              onOpenKanbanView={() => setCurrentView('kanban_tasks')}
              onOpenTimelinesView={() => setCurrentView('timelines')}
              onOpenTravelMapView={() => setCurrentView('travel_map')}
              onOpenLiveDoc={() => setCurrentView('live_doc')}
              onOpenSecurityVault={() => setCurrentView('security_vault')}
              onOpenSpiritualStudio={() => setCurrentView('spiritual_wellbeing')}
              onOpenMindMapView={() => setCurrentView('mind_map')}
              onOpenCloudStorageView={() => setCurrentView('cloud_storage')}
              onQuickAddGratitude={(text) => handleAddGratitude(text, 'Relationship')}
              onQuickSetIntention={(text) => handleSetIntention(text, 'grounded')}
            />
          )}

          {currentView === 'mind_map' && (
            <UniversalMindMapView
              currentPartner={currentPartner}
              domains={domains}
              documents={documents}
              tasks={tasks}
              timelines={timelines}
              mapPins={mapPins}
              vaultItems={vaultItems}
              agents={agents}
              rituals={rituals}
              onNavigateToDocument={handleSelectDocument}
              onNavigateToView={setCurrentView}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'cloud_storage' && (
            <CloudStorageCollaborationHub
              currentPartner={currentPartner}
              documents={documents}
              cloudFiles={cloudFiles}
              collaborationRules={collaborationRules}
              onAddCloudFile={handleAddCloudFile}
              onLinkFileToDoc={handleLinkFileToDoc}
              onVoteRule={handleVoteCollaborationRule}
              onNavigateToDoc={handleSelectDocument}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'security_vault' && (
            <SecurityVaultStudio
              currentPartner={currentPartner}
              vaultItems={vaultItems}
              accessLogs={accessLogs}
              onAddVaultItem={handleAddVaultItem}
              onDeleteVaultItem={handleDeleteVaultItem}
              onRecordAccessLog={handleRecordAccessLog}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'spiritual_wellbeing' && (
            <SpiritualWellbeingStudio
              currentPartner={currentPartner}
              intentions={intentions}
              gratitudes={gratitudes}
              rituals={rituals}
              onSetIntention={handleSetIntention}
              onAcknowledgeIntention={handleAcknowledgeIntention}
              onAddGratitude={handleAddGratitude}
              onToggleGratitudeLike={handleToggleGratitudeLike}
              onToggleRitualPartner={handleToggleRitualPartner}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'kanban_tasks' && (
            <KanbanTasksView
              currentPartner={currentPartner}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onMoveTaskStage={handleMoveTaskStage}
              onOpenAi={handleOpenAi}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentView === 'timelines' && (
            <TimelinesView
              currentPartner={currentPartner}
              timelines={timelines}
              onToggleMilestone={handleToggleMilestone}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'travel_map' && (
            <TravelMapStudio
              currentPartner={currentPartner}
              pins={mapPins}
              onToggleBooked={handleToggleMapPinBooked}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'live_doc' && (
            <LiveCoAuthoringEditor
              currentPartner={currentPartner}
              documents={documents}
              activeDocumentId={activeDocumentId}
              onSelectDocument={setActiveDocumentId}
              onUpdateContent={handleUpdateDocumentContent}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              currentPartner={currentPartner}
              events={calendarEvents}
              onAddEvent={handleAddCalendarEvent}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'agents' && (
            <AgentsManager
              agents={agents}
              onToggleAgentStatus={handleToggleAgentStatus}
              onRunAgent={handleRunAgent}
              onCreateAgent={handleCreateAgent}
              onDeleteAgent={handleDeleteAgent}
            />
          )}

          {currentView === 'news' && (
            <NewsFeedView
              news={news}
              onOpenAi={handleOpenAi}
            />
          )}

          {currentView === 'document' && activeDoc && (
            <InteractiveDocumentView
              document={activeDoc}
              currentPartner={currentPartner}
              onUpdateContent={handleUpdateDocumentContent}
              onUpdateTags={handleUpdateDocumentTags}
              onUpdateFrontmatter={handleUpdateFrontmatter}
              onAddTask={handleAddTask}
              onOpenAiWithContext={(prompt) => handleOpenAi(prompt)}
              onNavigateDocument={handleSelectDocument}
              allDocuments={documents}
            />
          )}

          {currentView === 'whiteboard' && (
            <WhiteboardStudio
              currentPartner={currentPartner}
              nodes={whiteboardNodes}
              connections={whiteboardConnections}
              onAddNode={handleAddWhiteboardNode}
              onUpdateNodePosition={handleUpdateNodePosition}
              onDeleteNode={handleDeleteWhiteboardNode}
            />
          )}
        </main>
      </div>

      {/* In-App Video Calling Pod */}
      {isVideoCallOpen && (
        <InAppVideoCallingPod
          currentPartner={currentPartner}
          onClose={() => setIsVideoCallOpen(false)}
        />
      )}

      {/* Chat & Voice Memos Drawer */}
      {isChatDrawerOpen && (
        <ChatDrawer
          currentPartner={currentPartner}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onOpenProposal={(proposalId) => {
            const prop = proposals.find(p => p.id === proposalId);
            if (prop) setActiveProposal(prop);
          }}
          onClose={() => setIsChatDrawerOpen(false)}
        />
      )}

      {/* AI Co-Builder Voice & Reasoning Modal */}
      {isAiModalOpen && (
        <AiCoBuilderModal
          currentPartner={currentPartner}
          initialPrompt={aiInitialPrompt}
          onClose={() => setIsAiModalOpen(false)}
          onCreateProposal={handleCreateProposal}
        />
      )}

      {/* Partner Proposal Modal */}
      {activeProposal && (
        <PartnerProposalModal
          proposal={activeProposal}
          currentPartner={currentPartner}
          onClose={() => setActiveProposal(null)}
          onVoteOption={handleVoteProposalOption}
          onConfirmOption={handleConfirmProposalOption}
        />
      )}

      {/* Proton Drive & Markdown Tree Export Modal */}
      {isProtonExportOpen && (
        <ProtonExportModal
          domains={domains}
          documents={documents}
          onClose={() => setIsProtonExportOpen(false)}
        />
      )}

      {/* In-App Shared Email Hub Modal */}
      {isEmailHubOpen && (
        <EmailHubModal
          currentPartner={currentPartner}
          selectedEmail={selectedEmailItem}
          onClose={() => setIsEmailHubOpen(false)}
        />
      )}

      {/* Global ⌘K Search Modal */}
      {isSearchOpen && (
        <GlobalSearchModal
          documents={documents}
          onSelectDocument={handleSelectDocument}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* Mobile Fixed Bottom Navigation Bar (Phone Ergonomics) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 px-1 shadow-lg select-none">
        <button
          onClick={() => {
            setCurrentView('dashboard');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Overview</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('kanban_tasks');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentView === 'kanban_tasks'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Tasks</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('document');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentView === 'document'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Docs</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('mind_map');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentView === 'mind_map'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Network className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Mind Map</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            isMobileMenuOpen
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Hubs</span>
        </button>
      </nav>
    </div>
  );
}
