import React from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Navigation, 
  Users, 
  Tag, 
  PhoneCall, 
  ShieldCheck,
  Droplets,
  HeartPulse,
  Utensils,
  HelpCircle,
  Home,
  Car,
  Coffee
} from 'lucide-react';
import { Facility, Language } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface FacilityModalProps {
  facility: Facility;
  onClose: () => void;
  onGetRoute: (facility: Facility) => void;
  language: Language;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({
  facility,
  onClose,
  onGetRoute,
  language,
}) => {
  const t = translations[language];

  const handleClose = () => {
    soundFx.playClick();
    onClose();
  };

  const handleDirections = () => {
    soundFx.playSuccess();
    onGetRoute(facility);
  };

  const getCategoryBadge = () => {
    switch (facility.type) {
      case 'ghat':
        return { label: t.filterGhat, bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'medical':
        return { label: t.filterMedical, bg: 'bg-red-100 text-red-800 border-red-300' };
      case 'food':
        return { label: t.filterFood, bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'water':
        return { label: t.filterWater, bg: 'bg-sky-100 text-sky-800 border-sky-300' };
      case 'toilet':
        return { label: t.filterToilet, bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'lodging':
        return { label: t.filterLodging, bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'parking':
        return { label: t.filterParking, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      case 'vendor':
        return { label: t.filterVendor, bg: 'bg-orange-100 text-orange-800 border-orange-300' };
    }
  };

  const getCrowdBadge = () => {
    switch (facility.crowdLevel) {
      case 'low':
        return { label: 'Low Crowding (<40%)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      case 'moderate':
        return { label: 'Moderate Footfall (40-70%)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
      case 'high':
        return { label: 'Heavy Density (70-90%)', color: 'text-orange-700 bg-orange-50 border-orange-300' };
      case 'critical':
        return { label: 'Surge Hold (>90%)', color: 'text-red-700 bg-red-50 border-red-300 animate-pulse' };
    }
  };

  const catBadge = getCategoryBadge();
  const crowdBadge = getCrowdBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="facility-detail-card"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-amber-500/30 overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#4C0519] to-[#881337] px-5 py-4 text-white flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadge.bg}`}>
                {catBadge.label}
              </span>
              {facility.verified && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{t.verifiedService}</span>
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100">
              {facility.name[language]}
            </h2>
            <p className="text-xs text-amber-200/80 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-orange-400" />
              <span>{facility.coords.sector || 'Sector 1 (Nashik Kumbh Core)'}</span>
            </p>
          </div>

          <button
            id="close-facility-modal-btn"
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">{t.distance}</span>
              <span className="text-sm font-bold text-slate-900">{facility.distance}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">{t.walkTime}</span>
              <span className="text-sm font-bold text-slate-900">{facility.walkTime}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">{t.priceRate}</span>
              <span className="text-xs font-bold text-emerald-700 truncate block">
                {facility.price[language]}
              </span>
            </div>
          </div>

          {/* Crowd Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-700">{t.crowdDensity}:</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${crowdBadge.color}`}>
              {crowdBadge.label}
            </span>
          </div>

          {/* Description */}
          <div className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
            {facility.description[language]}
          </div>

          {/* Operating Hours & Contact */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold text-slate-700">{t.operatingHours}:</span>
              <span>{facility.operatingHours}</span>
            </div>
            {facility.contact && (
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold text-slate-700">Helpline / Duty:</span>
                <span className="text-emerald-700 font-medium">{facility.contact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <button
            id="modal-get-route-btn"
            onClick={handleDirections}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>{t.getDirections}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
