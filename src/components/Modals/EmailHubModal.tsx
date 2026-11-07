import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';
import { Partner, EmailItem } from '../../types/brain';

interface EmailHubModalProps {
  currentPartner: Partner;
  selectedEmail?: EmailItem | null;
  onClose: () => void;
}

export const EmailHubModal: React.FC<EmailHubModalProps> = ({
  currentPartner,
  selectedEmail,
  onClose,
}) => {
  const [to, setTo] = useState(selectedEmail ? selectedEmail.from : 'hotel.reservations@memmohotels.com');
  const [subject, setSubject] = useState(selectedEmail ? `Re: ${selectedEmail.subject}` : 'Inquiry: Quiet Room with River Tagus View (May 2027)');
  const [body, setBody] = useState(selectedEmail ? `Hi Inês,\n\nThank you for following up! We would definitely love to lock in the river-facing balcony rooms once bookings open on Dec 1.\n\nWarm regards,\nKey & Nura` : `Dear Reservations Team,\n\nMy partner and I are planning our trip to Lisbon in May 2027 for a special celebration. We would love to enquire about reserving a room with a scenic view over the Tagus river and Alfama.\n\nCould you please confirm your reservation availability and cancellation policy for direct bookings?\n\nWarm regards,\nKey & Nura`);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const applyTemplate = (type: string) => {
    if (type === 'portugal') {
      setTo('hotel.reservations@memmohotels.com');
      setSubject('Inquiry: Quiet Room with River Tagus View (May 2027)');
      setBody(`Dear Reservations Team,\n\nMy partner and I are planning our trip to Lisbon in May 2027 for a special celebration. We would love to enquire about reserving a room with a scenic view over the Tagus river and Alfama.\n\nCould you please confirm your reservation availability and cancellation policy for direct bookings?\n\nWarm regards,\nKey & Nura`);
    } else if (type === 'landlord') {
      setTo('estate.office@residence.com');
      setSubject('Notice: Annual Boiler Safety Certification & Radiator Bleeding');
      setBody(`Dear Building Management,\n\nWe are writing to schedule our regular annual boiler maintenance and safety certification as per our tenancy agreement.\n\nPlease let us know what time slots suit the heating engineer next week.\n\nBest regards,\nKey & Nura`);
    } else if (type === 'dinner') {
      setTo('reservations@rovi-restaurant.com');
      setSubject('Dinner Reservation Request for Two (Friday Night)');
      setBody(`Hello Rovi Team,\n\nWe would love to reserve a cozy table for two this Friday at 7:45 PM for an anniversary dinner. Please let us know if you can accommodate us near the open kitchen counter.\n\nWarmly,\nKey & Nura`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${to}\nSubject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Shared Couple Mailbox
            </span>
            <span className="text-xs text-slate-500 font-mono">key.and.nura@proton.me</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            {selectedEmail ? 'Email Message & Reply' : 'Compose Email as Key & Nura'}
          </h2>
          <p className="text-xs text-slate-500">
            Dispatch reservations, landlord notices, or trip inquiries directly through your Proton bridge.
          </p>
        </div>

        {/* Templates Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Templates:</span>
          <button
            onClick={() => applyTemplate('portugal')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-medium transition-colors"
          >
            ✈️ Portugal Hotel
          </button>
          <button
            onClick={() => applyTemplate('dinner')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-medium transition-colors"
          >
            🍷 Dinner Reservation
          </button>
          <button
            onClick={() => applyTemplate('landlord')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-medium transition-colors"
          >
            🏡 Boiler / Maintenance
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="space-y-3 pt-1 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">To:</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">Message:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors font-medium"
              >
                <span>Open in Mail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send as Key & Nura</span>
              </button>
            </div>
          </div>
        </form>

        {sentSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Email logged and dispatched through ProtonMail bridge!</span>
          </div>
        )}
      </div>
    </div>
  );
};
