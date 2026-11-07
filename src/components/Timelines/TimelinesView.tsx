import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Flag, 
  TrendingUp, 
  User
} from 'lucide-react';
import { ProjectTimeline, Partner } from '../../types/brain';

interface TimelinesViewProps {
  currentPartner: Partner;
  timelines: ProjectTimeline[];
  onToggleMilestone: (timelineId: string, milestoneId: string) => void;
  onOpenAi: (prompt: string) => void;
}

export const TimelinesView: React.FC<TimelinesViewProps> = ({
  currentPartner,
  timelines,
  onToggleMilestone,
  onOpenAi,
}) => {
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(timelines[0]?.id || '');
  const activeTimeline = timelines.find(t => t.id === selectedTimelineId) || timelines[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Couple Project Roadmaps
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Project Timelines & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Multi-month roadmaps, travel preparation gates, tech infrastructure sprints, and shared milestones.
          </p>
        </div>

        <button
          onClick={() => onOpenAi('Help us structure a project timeline for our upcoming goals')}
          className="px-3.5 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>AI Milestone Generator</span>
        </button>
      </div>

      {/* Timeline Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timelines.map((tl) => {
          const isSelected = tl.id === selectedTimelineId;
          const completedCount = tl.milestones.filter(m => m.completed).length;

          return (
            <div
              key={tl.id}
              onClick={() => setSelectedTimelineId(tl.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2.5 ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-100 dark:shadow-black/60'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm shadow-slate-200/50 dark:shadow-black/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  {tl.category}
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {tl.status}
                </span>
              </div>

              <h2 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {tl.title}
              </h2>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{tl.startDate} → {tl.endDate}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{tl.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${tl.progress}%`, backgroundColor: tl.color }}
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-right">
                {completedCount} of {tl.milestones.length} milestones complete
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Timeline Detail & Gantt Strip */}
      {activeTimeline && (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {activeTimeline.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeTimeline.startDate} – {activeTimeline.endDate}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {activeTimeline.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-mono">Overall Completion</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {activeTimeline.progress}%
                </div>
              </div>
            </div>
          </div>

          {/* Visual Milestone Progression Track */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Phase Gates & Checkpoints</span>
            </h3>

            <div className="space-y-3">
              {activeTimeline.milestones.map((ms, index) => (
                <div
                  key={ms.id}
                  onClick={() => onToggleMilestone(activeTimeline.id, ms.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    ms.completed
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400 w-5 shrink-0">
                      #{index + 1}
                    </span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      ms.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {ms.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-medium truncate">{ms.name}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                    <span className="text-slate-400">{ms.date}</span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {ms.owner}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
