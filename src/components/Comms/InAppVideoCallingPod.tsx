import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Volume2
} from 'lucide-react';
import { Partner } from '../../types/brain';

interface InAppVideoCallingPodProps {
  currentPartner: Partner;
  onClose: () => void;
}

export const InAppVideoCallingPod: React.FC<InAppVideoCallingPodProps> = ({
  currentPartner,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [seconds, setSeconds] = useState(14);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const partnerName = currentPartner === 'Key' ? 'Nura' : 'Key';

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isVideoOn && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Graceful fallback
        });
    } else {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }
    }
  }, [isVideoOn]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {partnerName[0]}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div>
          <div className="text-xs font-bold text-slate-900">
            Call with {partnerName}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 font-semibold">
            {formatTime(seconds)} · Connected
          </div>
        </div>

        <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Expand Video"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
            title="End Call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
      {/* Pod Top Bar */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-900">In-App Call with {partnerName}</span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
            {formatTime(seconds)}
          </span>
        </div>

        <button
          onClick={() => setIsMinimized(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          title="Minimize to Picture-in-Picture"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Video Stream Frame */}
      <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
        {/* Remote Partner Feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-2">
            {partnerName[0]}
          </div>
          <div className="text-xs font-semibold text-white">{partnerName} is on stream</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Encrypted WebRTC Mesh Room</div>

          {/* Audio Visualizer Spectrum */}
          <div className="flex items-end gap-1 h-4 mt-3">
            <span className="w-1 bg-emerald-400 rounded-full h-3 animate-pulse" />
            <span className="w-1 bg-emerald-400 rounded-full h-4 animate-pulse delay-75" />
            <span className="w-1 bg-emerald-400 rounded-full h-2 animate-pulse delay-150" />
            <span className="w-1 bg-emerald-400 rounded-full h-3.5 animate-pulse delay-100" />
            <span className="w-1 bg-emerald-400 rounded-full h-1.5 animate-pulse" />
          </div>
        </div>

        {/* Local Video Thumbnail */}
        <div className="absolute bottom-3 right-3 w-24 h-18 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shadow-lg flex items-center justify-center">
          {isVideoOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[10px] font-mono text-slate-400">Camera Off</div>
          )}
          <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white bg-black/60 px-1 rounded">
            You
          </span>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2.5 rounded-xl border transition-colors ${
            isMuted
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-2.5 rounded-xl border transition-colors ${
            !isVideoOn
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-2.5 rounded-xl border transition-colors ${
            isScreenSharing
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title="Share Screen"
        >
          <Monitor className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors active:scale-95"
          title="End Call"
        >
          <PhoneOff className="w-4 h-4" />
          <span>Hang Up</span>
        </button>
      </div>
    </div>
  );
};
