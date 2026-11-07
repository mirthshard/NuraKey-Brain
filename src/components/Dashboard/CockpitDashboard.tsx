import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Compass, 
  Plane, 
  Terminal, 
  Coins, 
  Calendar, 
  Heart, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Share2, 
  Mic, 
  Send,
  Zap,
  CheckSquare
} from 'lucide-react';
import { Partner, BrainDocument, PartnerProposal } from '../../types/brain';

interface CockpitDashboardProps {
  currentPartner: Partner;
  proposals: PartnerProposal[];
  documents: BrainDocument[];
  onOpenDocument: (docId: string) => void;
  onOpenProposal: (proposal: PartnerProposal) => void;
  onOpenAi: (initialPrompt?: string) => void;
  onOpenCall: () => void;
  onOpenWhiteboard: () => void;
  onAddInboxItem: (text: string) => void;
  inboxItems: Array<{ id: string; text: string; done: boolean; addedBy: Partner; date: string; tag: string }>;
  onToggleInboxItem: (id: string) => void;
}

export const CockpitDashboard: React.FC<CockpitDashboardProps> = ({
  currentPartner,
  proposals,
  documents,
  onOpenDocument,
  onOpenProposal,
  onOpenAi,
  onOpenCall,
  onOpenWhiteboard,
  onAddInboxItem,
  inboxItems,
  onToggleInboxItem,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const pendingProposal = proposals.find(p => p.status === 'pending');
  const partnerName = currentPartner === 'Key' ? 'Nura' : 'Key';

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onAddInboxItem(quickInput.trim());
    setQuickInput('');
  };

  const handleVoiceRecord = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      onAddInboxItem('Voice capture: Check flight times from Gatwick to Lisbon for May 2027');
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Relationship Status & Live Presence */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Key & Nura Synced
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Proton Encrypted Cloud</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              Good evening, {currentPartner}.
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Here is your shared headquarters. 11 life pillars organized, 1 trip on the horizon, and ready for whatever you build together today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAi('Hey AI, make me a list of date ideas to send to Nura for her to confirm based on what we like')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Propose Date for {partnerName}</span>
            </button>

            <button
              onClick={onOpenCall}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-medium text-xs transition-colors whitespace-nowrap"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>In-App Video Call</span>
            </button>

            <button
              onClick={onOpenWhiteboard}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-medium text-xs transition-colors whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Open Whiteboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Date Proposal Spotlight (If Any) */}
      {pendingProposal && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Pending Partner Confirmation
                </span>
                <span className="text-xs text-slate-400">Created by {pendingProposal.createdBy}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {pendingProposal.title}
              </h2>
              <p className="text-xs text-slate-300">
                {pendingProposal.options.length} curated options ready for {pendingProposal.targetPartner} to review, vote, or confirm!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenProposal(pendingProposal)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-2"
              >
                <span>View & Vote on Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Inbox Capture Bar */}
      <div className="bg-[#0E1526] border border-slate-800/80 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Spontaneous Thought Capture (00-Start-Here / Inbox)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {inboxItems.filter(i => !i.done).length} unprocessed items
          </span>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Type any thought, link, or idea to capture into your shared Inbox..."
            className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          <button
            type="button"
            onClick={handleVoiceRecord}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecordingVoice
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Dictate voice memo into Inbox"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Capture</span>
          </button>
        </form>

        {isRecordingVoice && (
          <div className="mt-2 text-[11px] text-rose-400 font-mono flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Listening to voice note... converting to text for 00-Start-Here/Inbox.md</span>
          </div>
        )}
      </div>

      {/* 4 Feature Spotlight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Portugal 2027 Master Trip */}
        <div 
          onClick={() => onOpenDocument('doc-04-portugal')}
          className="bg-[#0E1526] hover:bg-[#131D33] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                04 · Travel
              </span>
              <Plane className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Portugal 2027 Expedition
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Lisbon, Sintra palaces & Porto riverside wine valley. 7-day culinary and walking adventure.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Budget Spent</span>
              <span className="text-slate-200">£420 / £2,500</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '17%' }} />
            </div>
            <div className="text-[10px] text-amber-400/80 font-mono text-right pt-0.5">
              189 Days Until Departure →
            </div>
          </div>
        </div>

        {/* Card 2: Shared Financial Ledger */}
        <div 
          onClick={() => onOpenDocument('doc-03-finances')}
          className="bg-[#0E1526] hover:bg-[#131D33] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                03 · Finances
              </span>
              <Coins className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Shared Savings Vault
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Joint high-yield reserve, vacation fund, and life admin monthly budget tracking.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Progress</span>
              <span className="text-emerald-400 font-semibold">£12,450 (83%)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '83%' }} />
            </div>
            <div className="text-[10px] text-slate-400 font-mono text-right pt-0.5">
              Target: £15,000 →
            </div>
          </div>
        </div>

        {/* Card 3: Home Lab & Tech Infrastructure */}
        <div 
          onClick={() => onOpenDocument('doc-06-homelab')}
          className="bg-[#0E1526] hover:bg-[#131D33] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                06 · Tech Lab
              </span>
              <Terminal className="w-4 h-4 text-blue-400 group-hover:rotate-6 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              Home Lab & Network
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Proxmox Atlas cluster, TrueNAS ZFS vault, UniFi 6GHz mesh, and Cloudflare daemons.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Uptime:</span>
              <span className="text-emerald-400">142 Days Nominal</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Cluster:</span>
              <span className="text-slate-200">2 Nodes / 24 Clients</span>
            </div>
            <div className="text-[10px] text-blue-400/80 font-mono text-right pt-0.5">
              Inspect Network Topology →
            </div>
          </div>
        </div>

        {/* Card 4: Shared Gratitude & Reflections */}
        <div 
          onClick={() => onOpenDocument('doc-10-gratitude')}
          className="bg-[#0E1526] hover:bg-[#131D33] border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                10 · Mindfulness
              </span>
              <Heart className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Shared Gratitude Journal
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Weekly reflection rituals, morning quiet reflections, and grounding moments.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
            <div className="text-[11px] text-slate-300 italic line-clamp-1">
              "Grateful for our morning tea ritual and sunny park walk..."
            </div>
            <div className="text-[10px] text-purple-400/80 font-mono text-right pt-0.5">
              Read Latest Entry →
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Inbox Triage Stream + Weekly Life Admin Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triage Inbox */}
        <div className="bg-[#0E1526] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Active Inbox Items</h3>
            </div>
            <button
              onClick={() => onOpenDocument('doc-00-inbox')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Open Full Inbox.md →
            </button>
          </div>

          <div className="space-y-2">
            {inboxItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleInboxItem(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.done
                    ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    item.done ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600'
                  }`}>
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-xs truncate">{item.text}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">{item.addedBy}</span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Life Admin Routine Checklist */}
        <div className="bg-[#0E1526] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Sunday Life Admin Routine (20 mins)</h3>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Weekly Rhythm
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
              <span className="font-mono text-indigo-400 font-bold">1.</span>
              <div>
                <span className="font-semibold text-white">Inbox Zero:</span> Process and file new ideas from `00-Start-Here/Inbox.md` into goals or lists.
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
              <span className="font-mono text-indigo-400 font-bold">2.</span>
              <div>
                <span className="font-semibold text-white">Calendar Alignment:</span> Sync upcoming dates in Proton Calendar and check flight watch alerts.
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
              <span className="font-mono text-indigo-400 font-bold">3.</span>
              <div>
                <span className="font-semibold text-white">Shared Finances:</span> Quick review of joint savings progress and upcoming bills.
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
              <span className="font-mono text-indigo-400 font-bold">4.</span>
              <div>
                <span className="font-semibold text-white">Gratitude & Connection:</span> Add one weekly gratitude entry in `10-Spirituality`.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
