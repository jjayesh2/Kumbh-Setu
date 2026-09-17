import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  X, 
  Radio, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language, Coordinates } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface SosModalProps {
  onClose: () => void;
  language: Language;
  onDispatchAlert: (coords: Coordinates, locationLabel: string) => void;
}

export const SosModal: React.FC<SosModalProps> = ({
  onClose,
  language,
  onDispatchAlert,
}) => {
  const t = translations[language];
  const [countdown, setCountdown] = useState(5);
  const [isSent, setIsSent] = useState(false);

  const mockCoords: Coordinates = {
    x: 480,
    y: 310,
    sector: 'Sector 1 (Sacred Core - Ramkund Walkway)',
    geoLabel: '19.9975° N, 73.7898° E',
  };

  useEffect(() => {
    soundFx.playAlert();

    // Auto-dispatch alert after 3 seconds
    const timer = setTimeout(() => {
      setIsSent(true);
      onDispatchAlert(mockCoords, 'Ramkund Walkway Near Pillar #12 (Crowd Alert)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    soundFx.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="sos-alert-modal"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-red-500 overflow-hidden"
      >
        {/* Pulsing Emergency Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 px-6 py-5 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-900/30 animate-pulse pointer-events-none" />
          
          <div className="mx-auto w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center mb-2 animate-bounce shadow-lg">
            <ShieldAlert className="w-9 h-9 text-white animate-pulse" />
          </div>

          <h2 className="text-xl font-black tracking-wide uppercase font-serif">
            {t.sosTitle}
          </h2>
          <p className="text-xs text-red-100 mt-1 max-w-xs mx-auto">
            {t.sosSubtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Dispatch Status Card */}
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center gap-3">
            <Radio className="w-6 h-6 text-red-600 animate-pulse shrink-0" />
            <div>
              <div className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                <span>Status: Rapid Response Alert Active</span>
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              </div>
              <p className="text-[11px] text-red-800 mt-0.5">
                Command Center #7 has logged your exact coordinates and notified 4 motorcycle medics nearby.
              </p>
            </div>
          </div>

          {/* Coordinates Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{t.coordinatesLabel}:</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                19.9975° N, 73.7898° E
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{t.melaSector}:</span>
              <span className="font-bold text-slate-900">Sector 1 (Ramkund Core)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">{t.nearestPost}:</span>
              <span className="font-bold text-red-600">Civil Trauma Post #1 (180m)</span>
            </div>
          </div>

          {/* Quick Emergency Phone Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:108"
              onClick={() => soundFx.playClick()}
              className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-900/20 active:scale-95 transition-all text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.callAmbulance}</span>
            </a>
            <a
              href="tel:112"
              onClick={() => soundFx.playClick()}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 active:scale-95 transition-all text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.callPolice}</span>
            </a>
          </div>

          {/* Instructions */}
          <div className="text-[11px] text-slate-500 text-center bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            💡 Stay where you are if safe. A volunteer in high-visibility orange Kumbh vest will reach your location shortly.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            id="cancel-sos-btn"
            onClick={handleCancel}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {t.cancelSos}
          </button>
        </div>
      </div>
    </div>
  );
};
