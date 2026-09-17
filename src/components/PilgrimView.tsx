import React, { useState } from 'react';
import { 
  Filter, 
  Navigation, 
  UserX, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  UserCheck, 
  Heart, 
  ArrowRight,
  Droplets,
  HeartPulse,
  Utensils,
  Coffee,
  HelpCircle,
  Home,
  Car,
  Layers
} from 'lucide-react';
import { 
  Facility, 
  FacilityType, 
  Language, 
  RouteData, 
  CrowdZone, 
  Coordinates, 
  LostPersonReport 
} from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';
import { CustomMap } from './CustomMap';
import { FacilityModal } from './FacilityModal';
import { LostPersonModal } from './LostPersonModal';
import { SosModal } from './SosModal';
import { AiAssistant } from './AiAssistant';

interface PilgrimViewProps {
  facilities: Facility[];
  routeData: RouteData;
  crowdZones: CrowdZone[];
  language: Language;
  onAddLostReport: (report: LostPersonReport) => void;
  onDispatchSos: (coords: Coordinates, label: string) => void;
  lostReports: LostPersonReport[];
}

export const PilgrimView: React.FC<PilgrimViewProps> = ({
  facilities,
  routeData,
  crowdZones,
  language,
  onAddLostReport,
  onDispatchSos,
  lostReports,
}) => {
  const t = translations[language];

  // Auth / Login State (Mock OTP)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp' | 'preference'>('phone');
  const [selectedPreference, setSelectedPreference] = useState<'general' | 'senior' | 'family'>('general');

  // Map and facilities interaction state
  const [selectedCategory, setSelectedCategory] = useState<FacilityType | 'all'>('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showRoutes, setShowRoutes] = useState(true); // Default open to showcase the core feature!
  const [activeRouteType, setActiveRouteType] = useState<'both' | 'direct' | 'crowd_aware'>('both');
  const [showCrowdOverlay, setShowCrowdOverlay] = useState(true);

  // Modals & Pin-drop state
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [pinDropMode, setPinDropMode] = useState<'lost_person' | 'vendor' | null>(null);
  const [pinnedCoords, setPinnedCoords] = useState<Coordinates | null>(null);

  // Quick Autofill Demo
  const handleAutoFillDemo = () => {
    soundFx.playClick();
    setMobileNumber('9876543210');
    setOtpInput('2026');
    setOtpStep('otp');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setOtpStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    setOtpStep('preference');
  };

  const handleCompleteLogin = () => {
    soundFx.playSuccess();
    setIsLoggedIn(true);
  };

  // Route toggle
  const handleToggleRoute = () => {
    soundFx.playClick();
    setShowRoutes(!showRoutes);
  };

  // Facility selection from assistant or map
  const handleSelectFacilityById = (id: string) => {
    const f = facilities.find((item) => item.id === id);
    if (f) {
      setSelectedFacility(f);
    }
  };

  // Category filter buttons
  const categoryFilters: { type: FacilityType | 'all'; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: t.filterAll, icon: <Layers className="w-3.5 h-3.5" /> },
    { type: 'ghat', label: t.filterGhat, icon: <Droplets className="w-3.5 h-3.5 text-rose-500" /> },
    { type: 'medical', label: t.filterMedical, icon: <HeartPulse className="w-3.5 h-3.5 text-red-500" /> },
    { type: 'food', label: t.filterFood, icon: <Utensils className="w-3.5 h-3.5 text-amber-500" /> },
    { type: 'water', label: t.filterWater, icon: <Droplets className="w-3.5 h-3.5 text-sky-500" /> },
    { type: 'toilet', label: t.filterToilet, icon: <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> },
    { type: 'lodging', label: t.filterLodging, icon: <Home className="w-3.5 h-3.5 text-purple-500" /> },
    { type: 'parking', label: t.filterParking, icon: <Car className="w-3.5 h-3.5 text-slate-500" /> },
    { type: 'vendor', label: t.filterVendor, icon: <Coffee className="w-3.5 h-3.5 text-orange-500" /> },
  ];

  // ─────────────────────────────────────────────
  // 1. LOGIN / ONBOARDING SCREEN (If not logged in)
  // ─────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-b from-[#FFFDF8] via-[#FAF6EE] to-[#F2EDE2]">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-500/40 p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Subtle Decorative Arch Motif */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-orange-500/10 pointer-events-none" />

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold font-serif">
              <span>{t.melaBadge}</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
              {otpStep === 'preference' ? t.preferenceTitle : t.loginHeading}
            </h2>
            <p className="text-xs text-slate-600">
              {otpStep === 'preference' ? t.preferenceSub : t.loginSubheading}
            </p>
          </div>

          {/* Demo helper autofill button */}
          {otpStep !== 'preference' && (
            <button
              id="autofill-demo-btn"
              type="button"
              onClick={handleAutoFillDemo}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.autoFillDemo}</span>
            </button>
          )}

          {/* Step 1: Phone input */}
          {otpStep === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                  <span>{t.mobileNumber}</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 bg-slate-50">
                  <span className="px-3 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs border-r border-slate-300">
                    +91
                  </span>
                  <input
                    id="login-phone-input"
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="send-otp-btn"
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span>Get Mela Access OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: OTP verification */}
          {otpStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{t.otpSentNotice}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.enterOtp}
                </label>
                <input
                  id="login-otp-input"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="2 0 2 6"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                id="verify-otp-btn"
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.verifyAndEnter}</span>
              </button>

              <button
                type="button"
                onClick={() => setOtpStep('phone')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
              >
                Change mobile number
              </button>
            </form>
          )}

          {/* Step 3: Preference Selection */}
          {otpStep === 'preference' && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                <button
                  type="button"
                  id="pref-general-btn"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedPreference('general');
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs transition-all flex items-start gap-3 ${
                    selectedPreference === 'general'
                      ? 'border-orange-500 bg-orange-50/80 shadow-sm text-orange-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-orange-500 text-white shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.prefGeneral}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Fastest crowd-aware routing with normal walkways</p>
                  </div>
                </button>

                <button
                  type="button"
                  id="pref-senior-btn"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedPreference('senior');
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs transition-all flex items-start gap-3 ${
                    selectedPreference === 'senior'
                      ? 'border-orange-500 bg-orange-50/80 shadow-sm text-orange-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0 mt-0.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.prefSenior}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Prioritizes gentle gradients, benches & wheelchair ramp paths</p>
                  </div>
                </button>

                <button
                  type="button"
                  id="pref-family-btn"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedPreference('family');
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs transition-all flex items-start gap-3 ${
                    selectedPreference === 'family'
                      ? 'border-orange-500 bg-orange-50/80 shadow-sm text-orange-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.prefFamily}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Keeps route near child help desks, milk kiosks & safe handrails</p>
                  </div>
                </button>
              </div>

              <button
                id="complete-onboarding-btn"
                type="button"
                onClick={handleCompleteLogin}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white font-bold text-xs shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span>{t.continueToMap}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // 2. MAIN PILGRIM HUB (Interactive Map & Tools)
  // ─────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Top Action & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-amber-200/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-400/30 flex items-center justify-center text-orange-600">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
              <span>{t.rolePilgrim}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Pass Verified ✓
              </span>
            </h2>
            <p className="text-xs text-slate-500">Live navigation & amenities around sacred Godavari Ghats</p>
          </div>
        </div>

        {/* Primary Pilgrim Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Toggle Route Button */}
          <button
            id="toggle-get-route-btn"
            onClick={handleToggleRoute}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
              showRoutes
                ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{showRoutes ? t.closeRoute : t.getRoute}</span>
          </button>

          {/* Report Lost Person Form Trigger */}
          <button
            id="open-lost-report-btn"
            onClick={() => {
              soundFx.playClick();
              setIsLostModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <UserX className="w-4 h-4 text-orange-600" />
            <span>{t.lostPersonBtn}</span>
          </button>

          {/* Prominent SOS Button */}
          <button
            id="pilgrim-hub-sos-btn"
            onClick={() => {
              soundFx.playAlert();
              setIsSosOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shadow-red-950/30"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse text-amber-200" />
            <span>{t.sosButton}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categoryFilters.map((cat) => {
          const isSelected = selectedCategory === cat.type;
          return (
            <button
              key={cat.type}
              id={`filter-pill-${cat.type}`}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat.type);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#881337] to-orange-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Route Detailed Legend Card (when showRoutes is active) */}
      {showRoutes && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-150">
          {/* Direct Route Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-red-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                {t.directRoute}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                ⚠️ High Congestion
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {routeData.directDescription[language]}
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-1 border-t border-slate-100">
              <span>{t.distance}: <strong>{routeData.directDistance}</strong></span>
              <span>{t.walkTime}: <strong>{routeData.directTime}</strong></span>
              <span className="text-red-600">Density: 92% Hold</span>
            </div>
          </div>

          {/* Crowd-Aware Route Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-500/80 shadow-md space-y-2 ring-2 ring-emerald-400/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {t.crowdAwareRoute}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-400">
                ✓ Police Recommended
              </span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {routeData.crowdAwareDescription[language]}
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-emerald-900 pt-1 border-t border-emerald-200/60">
              <span>{t.distance}: <strong>{routeData.crowdAwareDistance}</strong></span>
              <span>{t.walkTime}: <strong className="text-emerald-700">{routeData.crowdAwareTime}</strong></span>
              <span className="text-emerald-700">Smooth Flow (35%)</span>
            </div>
          </div>
        </div>
      )}

      {/* The Visual Map */}
      <CustomMap
        facilities={facilities}
        selectedCategory={selectedCategory}
        selectedFacility={selectedFacility}
        onSelectFacility={(facility) => setSelectedFacility(facility)}
        showRoutes={showRoutes}
        routeData={routeData}
        activeRouteType={activeRouteType}
        setActiveRouteType={setActiveRouteType}
        crowdZones={crowdZones}
        showCrowdOverlay={showCrowdOverlay}
        setShowCrowdOverlay={setShowCrowdOverlay}
        pinDropMode={pinDropMode}
        onPinDropped={(coords) => {
          setPinnedCoords(coords);
          setPinDropMode(null);
          setIsLostModalOpen(true);
        }}
        pinnedCoords={pinnedCoords}
        language={language}
      />

      {/* Active Lost & Found Broadcasts Ticker */}
      {lostReports.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-300/80 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Live Lost & Found Broadcast Bulletin ({lostReports.length} Active)
              </h3>
            </div>
            <span className="text-[11px] text-amber-800">Broadcasting to volunteer units</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {lostReports.map((report) => (
              <div
                key={report.id}
                className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center gap-3 shadow-xs"
              >
                <img
                  src={report.photoUrl}
                  alt={report.personName}
                  className="w-12 h-12 rounded-lg object-cover border border-amber-300 shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 truncate">{report.personName}</h4>
                    <span className="text-[10px] text-slate-400">{report.reportedAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">
                    Age {report.age} • {report.gender} • Last seen: {report.lastSeenLocationName}
                  </p>
                  <p className="text-[10px] text-orange-700 font-semibold mt-0.5 truncate">
                    Contact: {report.contactNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facility Popup Modal on Marker Click */}
      {selectedFacility && (
        <FacilityModal
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
          onGetRoute={() => {
            setShowRoutes(true);
            setSelectedFacility(null);
          }}
          language={language}
        />
      )}

      {/* Lost Person Modal */}
      {isLostModalOpen && (
        <LostPersonModal
          onClose={() => setIsLostModalOpen(false)}
          language={language}
          onAddReport={onAddLostReport}
          pinnedCoords={pinnedCoords}
          onActivatePinDrop={() => {
            setIsLostModalOpen(false);
            setPinDropMode('lost_person');
          }}
        />
      )}

      {/* SOS Modal */}
      {isSosOpen && (
        <SosModal
          onClose={() => setIsSosOpen(false)}
          language={language}
          onDispatchAlert={onDispatchSos}
        />
      )}

      {/* AI Assistant Chat Drawer */}
      <AiAssistant
        facilities={facilities}
        language={language}
        onShowRoute={() => setShowRoutes(true)}
        onSelectFacilityById={handleSelectFacilityById}
        onOpenSos={() => setIsSosOpen(true)}
      />
    </div>
  );
};
