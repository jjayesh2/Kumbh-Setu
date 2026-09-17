import React, { useState } from 'react';
import { 
  Store, 
  Upload, 
  MapPin, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Power,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Vendor, Coordinates, Language } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';
import { CustomMap } from './CustomMap';

interface VendorViewProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Vendor) => void;
  onUpdateVendorStatus: (id: string, isOpen: boolean) => void;
  language: Language;
}

export const VendorView: React.FC<VendorViewProps> = ({
  vendors,
  onAddVendor,
  onUpdateVendorStatus,
  language,
}) => {
  const t = translations[language];

  // Tab view: 'dashboard' | 'register'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register'>('dashboard');

  // Registration Form State
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<Vendor['category']>('food');
  const [sector, setSector] = useState('Sector 1 (Ramkund Promenade)');
  const [pricingItems, setPricingItems] = useState<{ item: string; price: string }[]>([
    { item: 'Kanda Poha / Upma', price: '₹25' },
    { item: 'Special Masala Chai', price: '₹10' },
  ]);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [ocrData, setOcrData] = useState<Vendor['ocrExtractedData'] | null>(null);
  const [pinnedCoords, setPinnedCoords] = useState<Coordinates | null>({ x: 380, y: 310 });
  const [pinDropMode, setPinDropMode] = useState<'vendor' | null>(null);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);

  // Selected current vendor for dashboard management
  const [activeVendorId, setActiveVendorId] = useState<string>(vendors[0]?.id || 'v-1');
  const currentVendor = vendors.find((v) => v.id === activeVendorId) || vendors[0];

  // Handle Certificate Upload & Simulate OCR
  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundFx.playClick();
    const file = e.target.files?.[0];
    if (file) {
      setCertificateUploaded(true);
      // Simulate OCR extraction delay
      setTimeout(() => {
        soundFx.playSuccess();
        setOcrData({
          licenseNo: `FSSAI-NMC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          holderName: businessName || 'Authorized Kumbh Vendor',
          authority: 'Nashik Municipal Corporation & FSSAI',
          sanitationRating: 'Grade A+ (Certified Clean Satvik)',
          validity: 'Valid through 31 Dec 2026',
        });
      }, 400);
    }
  };

  // Add Item to Menu
  const handleAddMenuItem = () => {
    soundFx.playClick();
    setPricingItems((prev) => [...prev, { item: '', price: '' }]);
  };

  const handleRemoveMenuItem = (idx: number) => {
    soundFx.playClick();
    setPricingItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateItem = (idx: number, field: 'item' | 'price', val: string) => {
    setPricingItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  // Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundFx.playClick();
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle Form Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    soundFx.playSuccess();

    const newVendor: Vendor = {
      id: `v-${Date.now()}`,
      businessName,
      category,
      categoryLabel: {
        en: category === 'food' ? 'Satvik Food & Beverages' : 'Puja & Offerings',
        hi: category === 'food' ? 'सात्विक भोजन एवं पेय' : 'पूजा सामग्री',
        mr: category === 'food' ? 'सात्विक भोजन व पेय' : 'पूजा साहित्य',
      },
      coords: pinnedCoords || { x: 380, y: 310 },
      sector: pinnedCoords?.sector || sector,
      pricingMenu: pricingItems.filter((i) => i.item.trim()),
      photoUrl:
        photoPreview ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
      certificateUrl: 'FSSAI-KUMBH-2026.pdf',
      ocrExtractedData: ocrData || {
        licenseNo: 'NMC-KMB-2026-8819',
        holderName: businessName,
        authority: 'Nashik Municipal Corporation',
        sanitationRating: 'Grade A (Inspected)',
        validity: 'Valid through 31 Dec 2026',
      },
      status: 'pending', // submitted to admin approval queue
      isOpen: true,
      rating: 5.0,
      submittedAt: 'Just now',
    };

    onAddVendor(newVendor);
    setActiveVendorId(newVendor.id);
    setIsRegisteredSuccess(true);

    setTimeout(() => {
      setIsRegisteredSuccess(false);
      setActiveTab('dashboard');
    }, 1500);
  };

  // Availability Toggle Switch (Open / Closed)
  const handleToggleAvailability = (vendor: Vendor) => {
    const nextState = !vendor.isOpen;
    soundFx.playToggle(nextState);
    onUpdateVendorStatus(vendor.id, nextState);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
      {/* Top Vendor Banner */}
      <div className="bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#9A1742] text-white p-5 rounded-3xl shadow-lg border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100">
                {t.vendorPortalTitle}
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                NMC Authorized
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">{t.vendorPortalSub}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-[#2D030D] p-1.5 rounded-2xl border border-amber-500/30 self-stretch sm:self-auto">
          <button
            id="vendor-tab-dashboard"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('dashboard');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-amber-200/80 hover:text-white'
            }`}
          >
            My Stall Dashboard
          </button>
          <button
            id="vendor-tab-register"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('register');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-amber-200/80 hover:text-white'
            }`}
          >
            + Register New Stall
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* 1. VENDOR DASHBOARD VIEW                      */}
      {/* ───────────────────────────────────────────── */}
      {activeTab === 'dashboard' && currentVendor && (
        <div className="space-y-4">
          {/* Vendor Selector dropdown if multiple stalls exist */}
          {vendors.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Switch Stall:</span>
              {vendors.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveVendorId(v.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    v.id === currentVendor.id
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  {v.businessName}
                </button>
              ))}
            </div>
          )}

          {/* Main Operational Stall Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={currentVendor.photoUrl}
                  alt={currentVendor.businessName}
                  className="w-20 h-20 rounded-2xl object-cover border border-amber-300 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      {currentVendor.businessName}
                    </h3>

                    {/* Status Badge */}
                    {currentVendor.status === 'verified' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.statusVerified}</span>
                      </span>
                    )}
                    {currentVendor.status === 'pending' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.statusPending}</span>
                      </span>
                    )}
                    {currentVendor.status === 'rejected' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>{t.statusRejected}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{currentVendor.sector} (GPS: {currentVendor.coords.x}, {currentVendor.coords.y})</span>
                  </p>
                  <p className="text-xs text-amber-800 font-medium mt-0.5">
                    Category: {currentVendor.categoryLabel[language]}
                  </p>
                </div>
              </div>

              {/* LIVE AVAILABILITY TOGGLE SWITCH */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    {t.availabilitySwitch}
                  </span>
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      currentVendor.isOpen ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        currentVendor.isOpen ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
                      }`}
                    />
                    <span>{currentVendor.isOpen ? t.stallOpen : t.stallClosed}</span>
                  </span>
                </div>

                {/* Custom Accessible Audio-Reactive Toggle Switch */}
                <button
                  id="vendor-availability-toggle"
                  type="button"
                  onClick={() => handleToggleAvailability(currentVendor)}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    currentVendor.isOpen ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                      currentVendor.isOpen ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Simulated OCR Verification Card */}
            {currentVendor.ocrExtractedData && (
              <div className="p-5 bg-emerald-50/60 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-800 border border-emerald-300 shrink-0">
                    <FileCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-950 font-serif">
                        OCR License Verification Record
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 border border-emerald-300">
                        {currentVendor.ocrExtractedData.sanitationRating}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900 font-mono mt-0.5">
                      Lic: {currentVendor.ocrExtractedData.licenseNo} • Holder: {currentVendor.ocrExtractedData.holderName}
                    </p>
                    <p className="text-[11px] text-emerald-800/80">
                      Authority: {currentVendor.ocrExtractedData.authority} • {currentVendor.ocrExtractedData.validity}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items / Pricing List */}
            <div className="p-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Authorized Pricing & Menu (Kumbh Mela Rate Ceiling)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {currentVendor.pricingMenu.map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{item.item}</span>
                    <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────── */}
      {/* 2. REGISTER NEW STALL FORM                    */}
      {/* ───────────────────────────────────────────── */}
      {activeTab === 'register' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {isRegisteredSuccess ? (
            <div className="text-center py-10 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Stall Registered & Submitted for Verification!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your stall pin has been placed on the visual map and sent to the Command Center admin approval queue.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs text-slate-800">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold font-serif text-slate-900">
                  New Kumbh Mela Merchant Registration
                </h3>
                <p className="text-xs text-slate-500">
                  Official municipal vetting for kiosks, food stalls, and puja shops
                </p>
              </div>

              {/* Business Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block text-slate-700 mb-1.5">
                    {t.businessName} *
                  </label>
                  <input
                    id="vendor-business-name-input"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Godavari Satvik Poha & Chai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold block text-slate-700 mb-1.5">
                    {t.vendorCategory} *
                  </label>
                  <select
                    id="vendor-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Vendor['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
                  >
                    <option value="food">Satvik Food & Beverages (अन्न/पेय)</option>
                    <option value="puja">Puja Samagri & Diya Offerings (पूजा साहित्य)</option>
                    <option value="handicraft">Handicrafts & Souvenirs (हस्तकला)</option>
                    <option value="cloakroom">Cloakroom & Shoe Storage (पादत्राण)</option>
                    <option value="health">Ayurvedic Essentials & Foot Care (आयुर्वेद)</option>
                  </select>
                </div>
              </div>

              {/* Location Map Pin Placement */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-amber-950">{t.vendorLocation}</span>
                  </div>
                  <button
                    type="button"
                    id="vendor-pin-map-btn"
                    onClick={() => {
                      soundFx.playClick();
                      setPinDropMode(pinDropMode ? null : 'vendor');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      pinDropMode
                        ? 'bg-orange-600 text-white animate-pulse'
                        : 'bg-white border border-amber-300 text-amber-950 hover:bg-amber-100'
                    }`}
                  >
                    {pinDropMode ? 'Click Map Below to Place Pin' : '📍 Pick Location on Map'}
                  </button>
                </div>

                {pinnedCoords && (
                  <p className="text-[11px] text-amber-900">
                    Selected Stall Pin: <strong>{pinnedCoords.sector || 'Sector 1'}</strong> (X: {pinnedCoords.x}, Y: {pinnedCoords.y})
                  </p>
                )}

                {/* Inline mini preview map if pin drop mode active */}
                {pinDropMode && (
                  <div className="mt-2 border-2 border-orange-400 rounded-2xl overflow-hidden">
                    <p className="bg-orange-500 text-white text-[11px] font-bold px-3 py-1 text-center">
                      Click anywhere on the Kumbh visual layout to place your stall marker!
                    </p>
                    <CustomMap
                      facilities={[]}
                      selectedCategory="all"
                      selectedFacility={null}
                      onSelectFacility={() => {}}
                      showRoutes={false}
                      routeData={{
                        directPath: '',
                        directDistance: '',
                        directTime: '',
                        directCrowdStatus: 'moderate',
                        directDescription: { en: '', hi: '', mr: '' },
                        crowdAwarePath: '',
                        crowdAwareDistance: '',
                        crowdAwareTime: '',
                        crowdAwareStatus: 'recommended',
                        crowdAwareDescription: { en: '', hi: '', mr: '' },
                      }}
                      activeRouteType="both"
                      setActiveRouteType={() => {}}
                      crowdZones={[]}
                      showCrowdOverlay={false}
                      setShowCrowdOverlay={() => {}}
                      pinDropMode="vendor"
                      onPinDropped={(coords) => {
                        setPinnedCoords(coords);
                        setPinDropMode(null);
                      }}
                      pinnedCoords={pinnedCoords}
                      language={language}
                    />
                  </div>
                )}
              </div>

              {/* Pricing / Menu Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block text-slate-700">
                    {t.pricingMenu}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMenuItem}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {pricingItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Item name (e.g. Masala Chai)"
                        value={item.item}
                        onChange={(e) => handleUpdateItem(idx, 'item', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:ring-1 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Price (e.g. ₹10)"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(idx, 'price', e.target.value)}
                        className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:ring-1 focus:ring-orange-500 font-bold text-emerald-700"
                      />
                      {pricingItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMenuItem(idx)}
                          className="p-2 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo & Certificate Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Stall Photo */}
                <div>
                  <label className="font-semibold block text-slate-700 mb-1.5">
                    {t.stallPhoto}
                  </label>
                  <label className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-orange-600" />
                    <span className="text-slate-600">Choose Stall Photo</span>
                    <input
                      id="vendor-photo-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Stall preview"
                      className="w-16 h-16 rounded-xl object-cover mt-2 border border-slate-200"
                    />
                  )}
                </div>

                {/* Certificate Upload with Simulated OCR */}
                <div>
                  <label className="font-semibold block text-slate-700 mb-1.5">
                    {t.certificateUpload} *
                  </label>
                  <label className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 cursor-pointer transition-colors">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-600">
                      {certificateUploaded ? 'Certificate Attached ✓' : 'Upload FSSAI License'}
                    </span>
                    <input
                      id="vendor-cert-file-input"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleCertUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Simulated OCR Result Box */}
              {ocrData && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{t.simulatedOcrTitle}</span>
                  </div>
                  <div className="text-[11px] text-emerald-900 grid grid-cols-2 gap-2 bg-white/70 p-2.5 rounded-xl border border-emerald-200">
                    <div>
                      <span className="text-slate-500 block">License No:</span>
                      <span className="font-mono font-bold text-slate-900">{ocrData.licenseNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Issued To:</span>
                      <span className="font-bold text-slate-900">{ocrData.holderName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hygiene Rating:</span>
                      <span className="font-bold text-emerald-700">{ocrData.sanitationRating}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Validity:</span>
                      <span className="font-bold text-slate-900">{ocrData.validity}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-3">
                <button
                  id="submit-vendor-btn"
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                >
                  <Store className="w-4 h-4" />
                  <span>{t.registerVendorBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
