import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  MapPin, 
  UserX, 
  Camera, 
  Radio, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Language, Coordinates, LostPersonReport } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface LostPersonModalProps {
  onClose: () => void;
  language: Language;
  onAddReport: (report: LostPersonReport) => void;
  pinnedCoords: Coordinates | null;
  onActivatePinDrop: () => void;
}

export const LostPersonModal: React.FC<LostPersonModalProps> = ({
  onClose,
  language,
  onAddReport,
  pinnedCoords,
  onActivatePinDrop,
}) => {
  const t = translations[language];

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundFx.playClick();
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFx.playSuccess();
    setIsSubmitting(true);

    const newReport: LostPersonReport = {
      id: `lost-${Date.now()}`,
      personName: name,
      age: parseInt(age) || 30,
      gender,
      contactNumber: phone || '+91 98000 12345',
      description: description || 'Wearing traditional yellow/white mela clothes, separated near holy steps.',
      photoUrl:
        photoPreview ||
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      lastSeenCoords: pinnedCoords || { x: 480, y: 310, sector: 'Ramkund Ghat Core' },
      lastSeenLocationName: pinnedCoords?.sector || 'Ramkund Ghat Central Area',
      reportedAt: 'Just now',
      status: 'broadcasted',
    };

    setTimeout(() => {
      onAddReport(newReport);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="lost-person-modal-card"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-orange-400 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#881337] to-orange-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 border border-white/30">
              <UserX className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-amber-100">
                {t.lostPersonTitle}
              </h2>
              <p className="text-[11px] text-amber-200/80 max-w-xs">{t.lostPersonSub}</p>
            </div>
          </div>

          <button
            id="close-lost-modal-btn"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {t.lostReportSuccess}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Volunteer stations across all 5 sectors, PA speaker towers, and the police lost-and-found tent have received the missing report with photo.
            </p>
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Return to Map
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-slate-800">
            {/* Name, Age, Gender */}
            <div>
              <label className="font-semibold block text-slate-700 mb-1">{t.personName} *</label>
              <input
                id="lost-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra / Smt. Shakuntala"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">{t.personAge}</label>
                <input
                  id="lost-age-input"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 65"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 mb-1">{t.personGender}</label>
                <select
                  id="lost-gender-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Child">Child (Under 12)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block text-slate-700 mb-1">{t.guardianPhone} *</label>
                <input
                  id="lost-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98xxx xxxxx"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Interactive Map Pin Placement */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-300">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>{t.lastSeenLocation}</span>
                </span>
                <button
                  type="button"
                  id="pin-on-map-btn"
                  onClick={() => {
                    soundFx.playClick();
                    onActivatePinDrop();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] shadow-xs cursor-pointer active:scale-95"
                >
                  📍 Click Map to Place Pin
                </button>
              </div>

              {pinnedCoords ? (
                <div className="text-[11px] text-amber-900 bg-white p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                  <span>
                    Location set: <strong>{pinnedCoords.sector || 'Selected Point'}</strong>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    ({pinnedCoords.x}, {pinnedCoords.y})
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-amber-800">
                  Tap 'Click Map to Place Pin', then click anywhere on the Kumbh visual map behind to set the last seen spot!
                </p>
              )}
            </div>

            {/* Clothing and description */}
            <div>
              <label className="font-semibold block text-slate-700 mb-1">{t.clothingDesc}</label>
              <textarea
                id="lost-description-input"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Saffron kurta, walking with cane, speaks Marathi..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Photo Upload with live preview */}
            <div>
              <label className="font-semibold block text-slate-700 mb-1">{t.uploadPhoto}</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 text-slate-700 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-orange-600" />
                  <span>Choose Photo File</span>
                  <input
                    id="lost-photo-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photoPreview && (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400 shadow-sm">
                    <img
                      src={photoPreview}
                      alt="Lost person preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                id="submit-lost-report-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-red-950/20 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>{t.submitLostReport}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
