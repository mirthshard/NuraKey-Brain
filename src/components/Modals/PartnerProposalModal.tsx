import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Coins, 
  ThumbsUp, 
  Share2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartnerProposal, ProposalOption, Partner } from '../../types/brain';

interface PartnerProposalModalProps {
  proposal: PartnerProposal;
  currentPartner: Partner;
  onClose: () => void;
  onVoteOption: (proposalId: string, optionId: string, partner: Partner) => void;
  onConfirmOption: (proposalId: string, optionId: string, partnerNote?: string) => void;
}

export const PartnerProposalModal: React.FC<PartnerProposalModalProps> = ({
  proposal,
  currentPartner,
  onClose,
  onVoteOption,
  onConfirmOption,
}) => {
  const [partnerNote, setPartnerNote] = useState('');
  const [confirmedId, setConfirmedId] = useState<string | null>(proposal.confirmedOptionId || null);

  const handleConfirm = (optionId: string) => {
    setConfirmedId(optionId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B'],
    });
    onConfirmOption(proposal.id, optionId, partnerNote);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              Partner Proposal Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Created by {proposal.createdBy} for {proposal.targetPartner}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            {proposal.title}
          </h2>

          <p className="text-xs text-slate-500">
            Prompt used: <span className="italic text-slate-700">"{proposal.promptUsed}"</span>
          </p>
        </div>

        {/* 3 Proposal Options */}
        <div className="space-y-4">
          {proposal.options.map((opt) => {
            const hasVoted = opt.votes.includes(currentPartner);
            const isConfirmed = confirmedId === opt.id || proposal.confirmedOptionId === opt.id;

            return (
              <div
                key={opt.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
                  isConfirmed
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {isConfirmed && (
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                    <Check className="w-3 h-3" />
                    <span>CONFIRMED & SCHEDULED</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-12">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {opt.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {opt.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1 font-mono text-emerald-700 font-bold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{opt.estimatedCost}</span>
                  </div>
                  {opt.location && (
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opt.location}</span>
                    </div>
                  )}
                  <span className="text-indigo-600 font-medium">Vibe: {opt.vibe}</span>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-700">
                  {opt.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Voting & Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVoteOption(proposal.id, opt.id, currentPartner)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        hasVoted
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{hasVoted ? 'Voted by You' : 'Vote for This'}</span>
                      <span className="font-mono text-[10px] ml-1 bg-black/10 px-1.5 py-0.2 rounded">
                        {opt.votes.length}
                      </span>
                    </button>

                    {opt.votes.length > 0 && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        Voted by: {opt.votes.join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {opt.bookingUrl && (
                      <a
                        href={opt.bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors font-medium"
                      >
                        <span>Reserve</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {!isConfirmed && (
                      <button
                        onClick={() => handleConfirm(opt.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Option</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Autonomous Action on Confirmation:</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            Locking in an option logs the choice into <span className="font-mono text-indigo-600 font-semibold">02-Goals-and-Planning/Decisions/Decision-Log.md</span>, notifies your partner, and creates a ready-to-import event for Proton Calendar.
          </p>
        </div>
      </div>
    </div>
  );
};
