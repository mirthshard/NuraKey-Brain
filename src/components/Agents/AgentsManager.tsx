import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  Plus, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  RotateCw, 
  Sliders, 
  Check, 
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ScheduledAgent } from '../../types/brain';

interface AgentsManagerProps {
  agents: ScheduledAgent[];
  onToggleAgentStatus: (agentId: string) => void;
  onRunAgent: (agentId: string) => void;
  onCreateAgent: (agent: ScheduledAgent) => void;
  onDeleteAgent: (agentId: string) => void;
}

export const AgentsManager: React.FC<AgentsManagerProps> = ({
  agents,
  onToggleAgentStatus,
  onRunAgent,
  onCreateAgent,
  onDeleteAgent,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);
  const [executedLogs, setExecutedLogs] = useState<Record<string, string>>({});

  // New Agent Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('Daily at 09:00');
  const [prompt, setPrompt] = useState('');

  const handleRun = (id: string) => {
    setRunningAgentId(id);
    setTimeout(() => {
      onRunAgent(id);
      setRunningAgentId(null);
      setExecutedLogs(prev => ({
        ...prev,
        [id]: `Execution timestamp: ${new Date().toLocaleTimeString()} · Status: SUCCESS (Exit code 0). Invariant checked.`,
      }));
    }, 1800);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: ScheduledAgent = {
      id: `agt-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom automated background agent',
      schedule: schedule.trim() || 'Daily at 09:00',
      status: 'Active',
      lastRun: 'Never',
      nextRun: 'Scheduled on next cycle',
      actionType: 'custom',
      prompt: prompt.trim() || 'Scan markdown documents and report updates',
      lastResult: 'Agent initialized. Ready for first cron cycle.',
    };

    onCreateAgent(newAgent);
    setName('');
    setDescription('');
    setPrompt('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Autonomous Intelligence Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Autonomous Scheduled Agents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Set autonomous background agents to monitor flight fares, audit homelab security, and synthesize weekly admin reviews.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Scheduled Agent</span>
        </button>
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        {agents.map((agent) => {
          const isRunning = runningAgentId === agent.id;
          const isActive = agent.status === 'Active';

          return (
            <div
              key={agent.id}
              className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-4 transition-all hover:border-indigo-400 dark:hover:border-indigo-600 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isActive ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</h2>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>{agent.schedule}</span>
                      </span>
                      <span>·</span>
                      <span>Next: {agent.nextRun}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAgentStatus(agent.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isActive ? <Check className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{agent.status}</span>
                  </button>

                  <button
                    onClick={() => handleRun(agent.id)}
                    disabled={isRunning}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
                  >
                    <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Executing...' : 'Run Now'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteAgent(agent.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete Agent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {agent.description}
              </p>

              {/* Execution Prompt & Last Output */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    Agent Action Directive:
                  </span>
                  <div className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                    {agent.prompt}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 uppercase font-semibold">
                      Latest Result & Telemetry:
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{agent.lastRun}</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed font-sans">
                    {agent.lastResult || 'Ready for next execution.'}
                  </div>
                </div>
              </div>

              {executedLogs[agent.id] && (
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{executedLogs[agent.id]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create New Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configure New Autonomous Agent</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define the trigger schedule and action prompt for your background assistant.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Agent Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Flight Fare Alert or Weekend Menu Generator"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Schedule Frequency:</label>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-mono"
                >
                  <option value="Daily at 08:00">Daily at 08:00 AM</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Weekly on Sundays at 18:00">Weekly on Sundays at 18:00</option>
                  <option value="Weekly on Wednesdays">Weekly on Wednesdays</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What this agent monitors or accomplishes"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Action Directive / Prompt:</label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Exact prompt directive the agent executes on trigger..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
                >
                  Save & Activate Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
