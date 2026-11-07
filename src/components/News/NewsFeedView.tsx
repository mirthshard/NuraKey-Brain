import React, { useState } from 'react';
import { 
  Newspaper, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Check
} from 'lucide-react';
import { NewsArticle } from '../../types/brain';

interface NewsFeedViewProps {
  news: NewsArticle[];
  onOpenAi: (prompt: string) => void;
}

export const NewsFeedView: React.FC<NewsFeedViewProps> = ({
  news,
  onOpenAi,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [savedArticles, setSavedArticles] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Tech & AI', 'Travel & Culture', 'Privacy & Security'];

  const filtered = news.filter(n => 
    selectedCategory === 'All' ? true : n.category === selectedCategory
  );

  const toggleSave = (id: string) => {
    setSavedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Curated Intelligence Stream
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            News & Tech Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Curated updates across travel infrastructure, software engineering, AI, and digital privacy.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isSaved = !!savedArticles[item.id];
          const isExpanded = expandedSummaryId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-md shadow-slate-200/50 dark:shadow-black/50 space-y-3 transition-all hover:border-indigo-400 dark:hover:border-indigo-600 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.source}</span>
                  <span>·</span>
                  <span>{item.timeAgo}</span>
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px]">
                  {item.category}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.summary}
              </p>

              {isExpanded && (
                <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Analysis for Key & Nura:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-900 dark:text-indigo-200">
                    This update directly impacts our future plans: it validates our decision to plan European train routes in Portugal and confirms our home lab security hygiene.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandedSummaryId(isExpanded ? null : item.id)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide AI Takeaway' : 'AI Analysis'}</span>
                  </button>

                  <button
                    onClick={() => toggleSave(item.id)}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono text-[11px] flex items-center gap-1"
                >
                  <span>Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
