import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Hotel, 
  Compass, 
  Utensils, 
  Camera, 
  Train
} from 'lucide-react';
import { InteractiveMapPin, Partner } from '../../types/brain';

interface TravelMapStudioProps {
  currentPartner: Partner;
  pins: InteractiveMapPin[];
  onToggleBooked: (pinId: string) => void;
  onOpenAi: (prompt: string) => void;
}

export const TravelMapStudio: React.FC<TravelMapStudioProps> = ({
  currentPartner,
  pins,
  onToggleBooked,
  onOpenAi,
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string>(pins[0]?.id || '');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');

  const selectedPin = pins.find(p => p.id === selectedPinId) || pins[0];

  const filteredPins = pins.filter(p => 
    selectedDayFilter === 'all' ? true : p.day === selectedDayFilter
  );

  const getPinIcon = (cat: string) => {
    switch (cat) {
      case 'hotel': return <Hotel className="w-3.5 h-3.5" />;
      case 'restaurant': return <Utensils className="w-3.5 h-3.5" />;
      case 'transit': return <Train className="w-3.5 h-3.5" />;
      default: return <Camera className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Interactive Travel Map Studio
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            Portugal 2027 Interactive Route Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Click any pin to inspect hotels, Sintra castles, Douro cellars, and walking routes.
          </p>
        </div>

        {/* Day Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              selectedDayFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Stops ({pins.length})
          </button>
          {[1, 2, 3, 4].map(day => (
            <button
              key={day}
              onClick={() => setSelectedDayFilter(day)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedDayFilter === day
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Stylized Portugal Map Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Atlantic Iberian Coastline (Portugal)</span>
            </span>
            <span>Tap Pin to Inspect</span>
          </div>

          {/* Stylized Geo Map Outline with Pins */}
          <div className="relative w-full h-[380px] my-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
            {/* SVG Coastline Backdrop */}
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 dark:opacity-20 pointer-events-none stroke-indigo-400 fill-indigo-50/20 dark:fill-indigo-950/20">
              <path d="M 40 10 C 35 25, 45 40, 30 65 C 20 75, 25 85, 30 90 L 55 90 L 55 10 Z" strokeWidth="1" strokeDasharray="2 2" />
              {/* Route connecting Lisbon to Porto */}
              <line x1="32" y1="70" x2="42" y2="24" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            {/* Geo Pins on Map */}
            {filteredPins.map((pin) => {
              const isSelected = selectedPinId === pin.id;

              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPinId(pin.id)}
                  style={{
                    left: `${pin.coords.x}%`,
                    top: `${pin.coords.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all group z-10 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 scale-125 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-110 shadow-md border border-slate-200 dark:border-slate-700'
                  }`}
                  title={`${pin.name} (Day ${pin.day})`}
                >
                  {getPinIcon(pin.category)}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg">
                    {pin.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>North: Porto & Douro · South: Lisbon & Sintra</span>
            <span className="text-amber-600 dark:text-amber-400">Alfa Pendular High Speed Route</span>
          </div>
        </div>

        {/* Selected Pin Detailed Studio Card (5 cols) */}
        {selectedPin && (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-md shadow-slate-200/50 dark:shadow-black/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 font-semibold">
                  Day {selectedPin.day} · {selectedPin.category.toUpperCase()}
                </span>

                <button
                  onClick={() => onToggleBooked(selectedPin.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
                    selectedPin.booked
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedPin.booked ? 'Booked' : 'Planned'}</span>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedPin.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{selectedPin.region}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedPin.description}
              </p>

              {selectedPin.mustTry && (
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-bold font-mono text-[10px] uppercase text-amber-700 dark:text-amber-400 block">
                    Must-Try / Secret Tip:
                  </span>
                  <div>{selectedPin.mustTry}</div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => onOpenAi(`Suggest the optimal walking tour and dining around ${selectedPin.name} in ${selectedPin.region} for Day ${selectedPin.day}`)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Route & Timing Planner</span>
              </button>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Portugal"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
