import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Wind, 
  Sun, 
  Moon, 
  Smile, 
  Coffee, 
  Check, 
  Plus, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Filter, 
  Flame, 
  Calendar, 
  Send,
  MessageCircle,
  Flower2,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { DailyIntention, GratitudeEntry, SpiritualRitual, Partner } from '../../types/brain';

interface SpiritualWellbeingStudioProps {
  currentPartner: Partner;
  intentions: DailyIntention[];
  gratitudes: GratitudeEntry[];
  rituals: SpiritualRitual[];
  onSetIntention: (intention: string, mood: DailyIntention['mood']) => void;
  onAcknowledgeIntention: (id: string) => void;
  onAddGratitude: (text: string, tag: GratitudeEntry['tag'], prompt?: string) => void;
  onToggleGratitudeLike: (id: string) => void;
  onToggleRitualPartner: (ritualId: string, partner: Partner) => void;
  onOpenAi: (prompt: string) => void;
}

export const SpiritualWellbeingStudio: React.FC<SpiritualWellbeingStudioProps> = ({
  currentPartner,
  intentions,
  gratitudes,
  rituals,
  onSetIntention,
  onAcknowledgeIntention,
  onAddGratitude,
  onToggleGratitudeLike,
  onToggleRitualPartner,
  onOpenAi,
}) => {
  const [activeTab, setActiveTab] = useState<'intentions' | 'gratitude' | 'breathwork' | 'rituals'>('intentions');
  
  // Intention input state
  const [newIntentionText, setNewIntentionText] = useState('');
  const [selectedMood, setSelectedMood] = useState<DailyIntention['mood']>('grounded');

  // Gratitude input state
  const [newGratitudeText, setNewGratitudeText] = useState('');
  const [gratitudeTag, setGratitudeTag] = useState<GratitudeEntry['tag']>('Relationship');
  const [gratitudeFilter, setGratitudeFilter] = useState<string>('all');
  const [isAddGratitudeOpen, setIsAddGratitudeOpen] = useState(false);

  // Breathwork interactive timer state (Box breathing: 4s inhale, 4s hold, 4s exhale, 4s hold)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [ambientAudioOn, setAmbientAudioOn] = useState(false);

  const otherPartner: Partner = currentPartner === 'Key' ? 'Nura' : 'Key';
  const isTodayIntention = (i: DailyIntention) => 
    i.date.includes('Today') || i.date === new Date().toISOString().split('T')[0] || i.id.startsWith('intent-');
  const partnerIntention = intentions.find(i => i.partner === otherPartner && isTodayIntention(i));
  const myIntention = intentions.find(i => i.partner === currentPartner && isTodayIntention(i));

  // Breathwork loop effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            setBreathPhase(currPhase => {
              if (currPhase === 'Inhale') return 'Hold';
              if (currPhase === 'Hold') return 'Exhale';
              if (currPhase === 'Exhale') return 'Rest';
              setCompletedCycles(c => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  const handleSaveIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntentionText.trim()) return;
    onSetIntention(newIntentionText.trim(), selectedMood);
    setNewIntentionText('');
  };

  const handleSaveGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGratitudeText.trim()) return;
    onAddGratitude(newGratitudeText.trim(), gratitudeTag);
    setNewGratitudeText('');
    setIsAddGratitudeOpen(false);
  };

  const getMoodBadge = (mood: DailyIntention['mood']) => {
    switch (mood) {
      case 'grounded': return { label: 'Grounded 🌿', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' };
      case 'calm': return { label: 'Calm 🌊', color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800' };
      case 'inspired': return { label: 'Inspired ⚡', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' };
      case 'grateful': return { label: 'Grateful ✨', color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800' };
      case 'focused': return { label: 'Focused 🎯', color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800' };
      default: return { label: 'Recharging 🌙', color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800' };
    }
  };

  const filteredGratitudes = gratitudes.filter(g => 
    gratitudeFilter === 'all' ? true : g.tag === gratitudeFilter
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Sacred Couple Sanctuary
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Mindfulness & Peace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <span>Spiritual & Wellbeing Studio</span>
            <Flower2 className="w-6 h-6 text-purple-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Daily intention exchanges, shared gratitude logs, couple breathwork sync, and mindful habit streaks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => onOpenAi('Suggest a beautiful evening contemplation question for Key and Nura to reflect on tonight')}
            className="px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Evening Prompt</span>
          </button>

          <button
            onClick={() => setIsAddGratitudeOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Add Gratitude</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-2 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('intentions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'intentions'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Daily Intentions</span>
          </button>

          <button
            onClick={() => setActiveTab('gratitude')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'gratitude'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Gratitude Journal ({gratitudes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('breathwork')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'breathwork'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Box Breathwork & Meditation</span>
          </button>

          <button
            onClick={() => setActiveTab('rituals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rituals'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Mindful Habits ({rituals.length})</span>
          </button>
        </div>

        <div className="text-xs font-mono text-purple-600 dark:text-purple-400 px-3 py-1 font-bold">
          Key & Nura Sanctuary
        </div>
      </div>

      {/* TAB 1: DAILY INTENTIONS */}
      {activeTab === 'intentions' && (
        <div className="space-y-6">
          {/* Dual Partner Intention Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key's Intention Card */}
            <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-100 dark:border-indigo-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    K
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Key's Daily Intention</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Today, Nov 6</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Grounded 🌿
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                "{myIntention ? myIntention.intention : 'Bring calm, unhurried presence to the infrastructure deployment sprint and listen deeply tonight.'}"
              </p>

              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <span className="text-[11px] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Acknowledged with love</span>
                </span>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  Shared
                </span>
              </div>
            </div>

            {/* Nura's Intention Card */}
            <div className="bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/60 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100 dark:border-purple-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    N
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nura's Daily Intention</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Today, Nov 6</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Calm 🌊
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                "{partnerIntention ? partnerIntention.intention : 'Honor rest between study sessions and savor our evening tea ritual without screens.'}"
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => partnerIntention && onAcknowledgeIntention(partnerIntention.id)}
                  className="px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                  <span>Send Love & Acknowledge</span>
                </button>
                <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                  Shared
                </span>
              </div>
            </div>
          </div>

          {/* Set New Daily Intention Form */}
          <form onSubmit={handleSaveIntention} className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Set Your Intention as {currentPartner}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onOpenAi(`Suggest a grounding daily intention for ${currentPartner} and ${otherPartner}`)}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Prompt Suggestions</span>
              </button>
            </div>

            <div className="space-y-3">
              <textarea
                value={newIntentionText}
                onChange={(e) => setNewIntentionText(e.target.value)}
                placeholder="What energy, mindset, or gift of presence do you wish to bring to today?"
                rows={3}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-purple-600 leading-relaxed"
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">Vibe:</span>
                  {(['grounded', 'calm', 'inspired', 'grateful', 'focused', 'recharging'] as const).map(mood => {
                    const badge = getMoodBadge(mood);
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                          selectedMood === mood
                            ? `${badge.color} ring-2 ring-purple-500/40 font-bold scale-105`
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {badge.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  disabled={!newIntentionText.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Confirm Intention for {currentPartner}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SHARED GRATITUDE JOURNAL */}
      {activeTab === 'gratitude' && (
        <div className="space-y-6">
          {/* Gratitude Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter Topic:</span>
              {(['all', 'Relationship', 'Nature', 'Work', 'Health', 'Small Joys', 'Home'] as const).map(tag => (
                <button
                  key={tag}
                  onClick={() => setGratitudeFilter(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    gratitudeFilter === tag
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddGratitudeOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Gratitude</span>
            </button>
          </div>

          {/* Gratitude Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGratitudes.map((grat) => {
              const hasLiked = grat.likes.includes(currentPartner);

              return (
                <div
                  key={grat.id}
                  className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-3xl p-5 shadow-sm space-y-3 transition-all group"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-2xs ${
                        grat.author === 'Key' ? 'bg-indigo-600' : 'bg-purple-600'
                      }`}>
                        {grat.author[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{grat.author}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[11px] font-mono text-slate-400">{grat.date}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {grat.tag}
                    </span>
                  </div>

                  {grat.prompt && (
                    <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{grat.prompt}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
                    "{grat.text}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => onToggleGratitudeLike(grat.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all font-bold ${
                        hasLiked
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800'
                          : 'text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{grat.likes.length} Love</span>
                    </button>

                    <span className="text-[10px] font-mono text-slate-400">
                      Key & Nura Sanctuary
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BOX BREATHWORK & MEDITATION */}
      {activeTab === 'breathwork' && (
        <div className="bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/60 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
              Autonomic Nervous System Reset
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Box Breathing Sync (4-4-4-4)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Follow the expanding circle. 4 seconds Inhale, 4 seconds Hold, 4 seconds Exhale, 4 seconds Rest.
            </p>
          </div>

          {/* Animated Breath Pulse Circle */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Outer Pulsing Glow */}
            <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              isBreathingActive && breathPhase === 'Inhale' ? 'scale-110 bg-purple-200/50 dark:bg-purple-900/40' :
              isBreathingActive && breathPhase === 'Hold' ? 'scale-110 bg-indigo-200/50 dark:bg-indigo-900/40' :
              isBreathingActive && breathPhase === 'Exhale' ? 'scale-90 bg-teal-200/50 dark:bg-teal-900/40' :
              'scale-95 bg-slate-100 dark:bg-slate-800'
            }`} />

            {/* Inner Core Circle */}
            <div className={`relative z-10 w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition-all duration-1000 ${
              breathPhase === 'Inhale' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 scale-105' :
              breathPhase === 'Hold' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 scale-105' :
              breathPhase === 'Exhale' ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 scale-95' :
              'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 scale-95'
            }`}>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase font-mono tracking-widest">
                {isBreathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono my-1">
                {isBreathingActive ? breathCount : '4'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {completedCycles} cycles completed
              </span>
            </div>
          </div>

          {/* Breath Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                isBreathingActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'
              }`}
            >
              {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isBreathingActive ? 'Pause Breath' : 'Begin 4-4-4-4 Sync'}</span>
            </button>

            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathPhase('Inhale');
                setBreathCount(4);
                setCompletedCycles(0);
              }}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAmbientAudioOn(!ambientAudioOn)}
              className={`p-3 rounded-2xl border transition-colors ${
                ambientAudioOn
                  ? 'bg-purple-50 dark:bg-purple-950 text-purple-600 border-purple-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title="Ambient sound toggle"
            >
              {ambientAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: MINDFUL COUPLE RITUALS */}
      {activeTab === 'rituals' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Couple Mindfulness Rituals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily shared spiritual practices maintaining our center amidst IT deadlines.
                </p>
              </div>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 font-bold">
                Daily Discipline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rituals.map((rit) => (
                <div
                  key={rit.id}
                  className="bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                        {rit.timeOfDay === 'morning' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rit.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-600 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{rit.streak} days</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      Duration: {rit.durationMinutes} mins
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleRitualPartner(rit.id, 'Key')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          rit.completedToday.Key
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Key</span>
                      </button>

                      <button
                        onClick={() => onToggleRitualPartner(rit.id, 'Nura')}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          rit.completedToday.Nura
                            ? 'bg-purple-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Nura</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD GRATITUDE ENTRY MODAL */}
      {isAddGratitudeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveGratitude}
            className="bg-white dark:bg-slate-900 border-2 border-purple-300 dark:border-purple-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Record Couple Gratitude Entry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGratitudeOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category Tag</label>
                <select
                  value={gratitudeTag}
                  onChange={(e) => setGratitudeTag(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Relationship">Relationship & Partner Love</option>
                  <option value="Nature">Nature & Outdoors</option>
                  <option value="Work">Craft, IT & Independence</option>
                  <option value="Health">Health & Vitality</option>
                  <option value="Small Joys">Small Everyday Joys</option>
                  <option value="Home">Home & Sanctuary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Your Reflection as {currentPartner}</label>
                <textarea
                  value={newGratitudeText}
                  onChange={(e) => setNewGratitudeText(e.target.value)}
                  placeholder="What are you grateful for today? A small gesture from partner, quiet tea moment, breakthrough..."
                  rows={4}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-purple-600 leading-relaxed text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddGratitudeOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
              >
                Save Gratitude
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
