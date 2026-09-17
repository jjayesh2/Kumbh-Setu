import React from 'react';
import { Flame, ShieldAlert, Volume2, VolumeX, Globe, MapPin, Sparkles } from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenSos: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  activeSosCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setRole,
  language,
  setLanguage,
  onOpenSos,
  isMuted,
  setIsMuted,
  activeSosCount,
}) => {
  const t = translations[language];

  const handleRoleChange = (role: UserRole) => {
    soundFx.playClick();
    setRole(role);
  };

  const handleLangChange = (lang: Language) => {
    soundFx.playClick();
    setLanguage(lang);
  };

  const handleSoundToggle = () => {
    const nextMute = !isMuted;
    soundFx.isMuted = nextMute;
    setIsMuted(nextMute);
    if (!nextMute) {
      soundFx.playClick();
    }
  };

  const handleSosClick = () => {
    soundFx.playAlert();
    onOpenSos();
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#78122B] text-white border-b-2 border-amber-500/30 shadow-lg">
      {/* Top Banner Notice */}
      <div className="bg-[#3B0212] px-4 py-1 border-b border-amber-500/20 text-xs flex flex-wrap items-center justify-between text-amber-200/90 font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-amber-300">Shahi Snan Ready:</span>
          <span>Holy Godavari River Current 1.8 m/s • 34 Water Quality Patrols Active</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-amber-100/70">
          <span>Nashik Mela Helpline: 1950 / 0253-222401</span>
          <span className="hidden sm:inline">• Control Room Live</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-md shadow-amber-900/40 border border-amber-300">
              <Flame className="w-6 h-6 text-amber-950 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-amber-100 drop-shadow-sm flex items-center gap-1.5">
                  {t.appTitle}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  2026
                </span>
              </div>
              <p className="text-xs text-amber-200/80 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span>Nashik • Godavari Riverbanks</span>
              </p>
            </div>
          </div>

          {/* Mobile SOS button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              id="mobile-sos-btn"
              onClick={handleSosClick}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950 flex items-center gap-1.5 animate-bounce transition-all active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Center Role Navigation Switcher */}
        <nav className="flex items-center p-1 rounded-xl bg-[#2D030D]/80 border border-amber-500/30 shadow-inner">
          <button
            id="role-btn-pilgrim"
            onClick={() => handleRoleChange('pilgrim')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              currentRole === 'pilgrim'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.rolePilgrim}</span>
          </button>

          <button
            id="role-btn-vendor"
            onClick={() => handleRoleChange('vendor')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              currentRole === 'vendor'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{t.roleVendor}</span>
          </button>

          <button
            id="role-btn-admin"
            onClick={() => handleRoleChange('admin')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 relative ${
              currentRole === 'admin'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-amber-200/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{t.roleAdmin}</span>
            {activeSosCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </nav>

        {/* Right Tools: Language Switcher, Sound & SOS */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-[#2D030D]/80 p-1 rounded-lg border border-amber-500/20 text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-amber-300 ml-1 mr-0.5 hidden sm:inline" />
            <button
              id="lang-btn-en"
              onClick={() => handleLangChange('en')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'en'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              id="lang-btn-hi"
              onClick={() => handleLangChange('hi')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'hi'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              id="lang-btn-mr"
              onClick={() => handleLangChange('mr')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'mr'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={handleSoundToggle}
            title={isMuted ? 'Unmute UI Audio' : 'Mute UI Audio'}
            className="p-2 rounded-lg bg-[#2D030D]/80 border border-amber-500/20 text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Desktop SOS Button */}
          <button
            id="desktop-sos-btn"
            onClick={handleSosClick}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-red-950/50 border border-red-400/40 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse text-amber-200" />
            <span>{t.sosButton}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
