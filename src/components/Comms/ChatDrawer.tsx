import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  Play, 
  Pause, 
  Share2, 
  Sparkles, 
  Volume2
} from 'lucide-react';
import { Partner, ChatMessage } from '../../types/brain';

interface ChatDrawerProps {
  currentPartner: Partner;
  messages: ChatMessage[];
  onSendMessage: (text: string, type?: 'text' | 'voice', audioDuration?: number) => void;
  onOpenProposal: (proposalId: string) => void;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  currentPartner,
  messages,
  onSendMessage,
  onOpenProposal,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const partnerName = currentPartner === 'Key' ? 'Nura' : 'Key';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text');
    setInputText('');
  };

  const handleRecordVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      onSendMessage('Voice memo: Just checked the Portugal flight alert. British Airways has great May seats!', 'voice', 12);
    }, 2000);
  };

  const togglePlayVoice = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {partnerName[0]}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{partnerName} & {currentPartner}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Encrypted Channel · Live Sync
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 bg-white border border-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.sender === currentPartner;
          const isAi = msg.sender === 'AI';

          if (isAi && msg.type === 'proposal_card' && msg.proposalId) {
            return (
              <div key={msg.id} className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-800 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>AI PARTNER PROPOSAL DISPATCHED</span>
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="text-xs text-slate-800 font-medium">
                  {msg.text}
                </div>
                <button
                  onClick={() => onOpenProposal(msg.proposalId!)}
                  className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Review & Vote on Options</span>
                  <Share2 className="w-3 h-3" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-mono text-slate-500">{msg.sender}</span>
                <span className="text-[9px] font-mono text-slate-400">{msg.timestamp}</span>
              </div>

              {msg.type === 'voice' ? (
                <div
                  className={`p-3 rounded-2xl flex items-center gap-3 border shadow-xs ${
                    isMe
                      ? 'bg-indigo-600 border-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <button
                    onClick={() => togglePlayVoice(msg.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                      isMe ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {playingVoiceId === msg.id ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {[4, 8, 14, 6, 12, 16, 9, 5, 11, 7, 13, 8].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className={`w-0.5 rounded-full ${
                            playingVoiceId === msg.id 
                              ? (isMe ? 'bg-white animate-pulse' : 'bg-indigo-600 animate-pulse') 
                              : (isMe ? 'bg-white/60' : 'bg-slate-400')
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[9px] font-mono opacity-80">
                      Voice note ({msg.audioDuration || 14}s)
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] border shadow-xs ${
                    isMe
                      ? 'bg-indigo-600 border-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecordVoice}
            className={`p-2 rounded-xl border transition-all ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Record Voice Memo"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${partnerName}...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {isRecording && (
          <div className="mt-1.5 text-[10px] text-rose-600 font-mono flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Recording voice note...</span>
          </div>
        )}
      </div>
    </div>
  );
};
