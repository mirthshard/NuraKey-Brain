import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Mic, 
  Bot, 
  Share2, 
  Volume2, 
  Lightbulb,
  Check
} from 'lucide-react';
import { Partner, PartnerProposal } from '../../types/brain';

interface AiCoBuilderModalProps {
  currentPartner: Partner;
  initialPrompt?: string;
  onClose: () => void;
  onCreateProposal: (proposal: PartnerProposal) => void;
}

export const AiCoBuilderModal: React.FC<AiCoBuilderModalProps> = ({
  currentPartner,
  initialPrompt = '',
  onClose,
  onCreateProposal,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; proposalData?: any }>>([
    {
      sender: 'ai',
      text: `Hello ${currentPartner}! I am your NuraKey Autonomous Co-Builder. I index all 11 life pillars, active tasks, calendar events, and emails. What would you like to plan, schedule, or automate today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const transcribed = "Hey AI, make me a list of date ideas to send to Nura for a date for her to confirm based on what we like";
      setPrompt(transcribed);
      handleSendMessage(transcribed);
    }, 2200);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || prompt).trim();
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);

      if (query.toLowerCase().includes('date') || query.toLowerCase().includes('nura') || query.toLowerCase().includes('propos')) {
        const proposal: PartnerProposal = {
          id: `prop-${Date.now()}`,
          title: 'Curated Romantic Date Night: Dining, Acoustic Music & City Lights',
          category: 'date',
          createdBy: currentPartner,
          targetPartner: currentPartner === 'Key' ? 'Nura' : 'Key',
          status: 'pending',
          promptUsed: query,
          createdAt: new Date().toISOString(),
          options: [
            {
              id: 'opt-a',
              title: 'Option 1: Candlelit Tasting at Rovi & Craft Cocktail Lounge in Fitzrovia',
              description: 'Wood-fired Mediterranean cuisine, quiet corner table, intimate conversations with zero screen distractions.',
              vibe: 'Sophisticated, ambient & romantic',
              estimatedCost: '£110 total',
              location: 'Fitzrovia, London',
              highlights: ['Ottolenghi wood-fire signature dishes', 'Artisan organic wines', 'Warm acoustic atmosphere'],
              bookingUrl: 'https://www.opentable.com',
              votes: [currentPartner],
            },
            {
              id: 'opt-b',
              title: 'Option 2: Artisan Pasta & Wine Night at Padella followed by River Thames Walk',
              description: 'Fresh hand-rolled pici cacio e pepe and beef shin ragu, followed by a twilight stroll across Millennium Bridge under the skyline lights.',
              vibe: 'Vibrant, casual & heartwarming',
              estimatedCost: '£65 total',
              location: 'Borough / London Bridge',
              highlights: ['Authentic hand-rolled pasta', 'Iconic riverside twilight views', 'Dessert stop at artisan gelateria'],
              bookingUrl: 'https://www.padella.co',
              votes: [],
            },
            {
              id: 'opt-c',
              title: 'Option 3: Cozy Home Gourmet Pasta Workshop with Barolo & Vinyl Records',
              description: 'We pick up fresh semolina flour, guanciale, and truffles; open a bottle of vintage wine and cook together while playing our favorite jazz rotation.',
              vibe: 'Playful, intimate & zero-effort commute',
              estimatedCost: '£45 total',
              location: 'Our Home Kitchen',
              highlights: ['Zero transit friction', 'Shared cooking ritual', 'Our custom 07-Media playlist on the speakers'],
              votes: [],
            },
          ],
        };

        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `I've researched your favorite dining spots in 08-Lists/Restaurants-and-Cafes.md and your couple traditions in 01-Us. I've formulated 3 personalized date night options ready to dispatch to ${currentPartner === 'Key' ? 'Nura' : 'Key'} for one-tap confirmation!`,
            proposalData: proposal,
          },
        ]);
      } else if (query.toLowerCase().includes('portugal') || query.toLowerCase().includes('trip') || query.toLowerCase().includes('travel')) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `Analyzing 04-Travel/Trips/2027-Portugal/Trip-Overview.md...\n\nYour target budget is £2,500 (£420 committed so far). I recommend reserving your Alfama boutique stay (Memmo Alfama) 5 months in advance to lock in lower shoulder-season rates. For Day 3 in Sintra, ensure you pre-book the 9:30 AM timed slot at Pena Palace to avoid peak crowds. Would you like me to update the packing checklist with camera gear and adapters?`,
          },
        ]);
      } else if (query.toLowerCase().includes('goal') || query.toLowerCase().includes('q4') || query.toLowerCase().includes('admin')) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `Here is a summary of your active Q4 Goals from 02-Goals-and-Planning:\n\n• Joint Savings Vault: £12,450 / £15,000 (83% complete, on track for Dec 31)\n• Key's CKA Kubernetes Certification: 45% of syllabus completed\n• Nura's Distributed Systems Go Track: 60% completed\n• Home Lab Proxmox cluster: Atlas node operating with 142 days uptime\n\nSuggestion: Schedule your 20-minute Sunday Life Admin check-in to clear the 4 unprocessed items from 00-Start-Here/Inbox.md.`,
          },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `Understood! I've logged this action against your knowledge graph in NuraKey-Brain. I can draft full Markdown specifications, calculate budget distributions, generate travel timelines, or schedule a Proton reminder. What would you like to tackle next?`,
          },
        ]);
      }
    }, 1200);
  };

  const handleDispatchProposal = (proposal: PartnerProposal) => {
    onCreateProposal(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>NuraKey Autonomous Co-Builder</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  Gemini 3.8 Flash
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Grounded in all 11 life pillars · Taste Memory Active
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-white border border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Action Chips */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold shrink-0">Prompts:</span>
          <button
            onClick={() => handleSendMessage('Plan a surprise date for Nura based on our favorites')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[11px] text-slate-700 border border-slate-200 shrink-0 transition-colors shadow-2xs font-medium"
          >
            💖 Propose Date for Nura
          </button>
          <button
            onClick={() => handleSendMessage('Research a 4-day Portugal trip with budget under £1200')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[11px] text-slate-700 border border-slate-200 shrink-0 transition-colors shadow-2xs font-medium"
          >
            ✈️ Portugal Trip Optimizer
          </button>
          <button
            onClick={() => handleSendMessage('Summarize our Q4 goals and list overdue tasks')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[11px] text-slate-700 border border-slate-200 shrink-0 transition-colors shadow-2xs font-medium"
          >
            🎯 Q4 Goals Check-in
          </button>
          <button
            onClick={() => handleSendMessage('Audit our home lab tech stack and suggest backup checks')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[11px] text-slate-700 border border-slate-200 shrink-0 transition-colors shadow-2xs font-medium"
          >
            🖥️ Tech Stack Audit
          </button>
        </div>

        {/* Chat History View */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-700">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.proposalData && (
                  <div className="mt-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Ready to Dispatch
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        3 Curated Options
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900">
                      {msg.proposalData.title}
                    </div>

                    <button
                      onClick={() => handleDispatchProposal(msg.proposalData)}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Send Proposal Card to {currentPartner === 'Key' ? 'Nura' : 'Key'} Now</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                  {currentPartner[0]}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-mono animate-pulse pl-10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded reasoning across all 11 life pillars...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI Co-Builder or tap mic to speak..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
            />

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Dictate voice prompt"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!prompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

          {isListening && (
            <div className="mt-2 text-[11px] text-rose-600 font-mono flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Listening to voice... converting to prompt</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
