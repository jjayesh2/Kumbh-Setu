import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Store, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Activity, 
  Radio, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { Vendor, SOSAlert, CrowdZone, Language, Facility } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';
import { CustomMap } from './CustomMap';

interface AdminViewProps {
  vendors: Vendor[];
  sosAlerts: SOSAlert[];
  crowdZones: CrowdZone[];
  facilities: Facility[];
  onApproveVendor: (id: string) => void;
  onRejectVendor: (id: string) => void;
  onResolveSos: (id: string) => void;
  onDispatchSosTeam: (id: string) => void;
  language: Language;
}

export const AdminView: React.FC<AdminViewProps> = ({
  vendors,
  sosAlerts,
  crowdZones,
  facilities,
  onApproveVendor,
  onRejectVendor,
  onResolveSos,
  onDispatchSosTeam,
  language,
}) => {
  const t = translations[language];

  // Map settings in Admin View
  const [showCrowdOverlay, setShowCrowdOverlay] = useState(true);

  // Statistics calculation
  const totalVendors = vendors.length;
  const verifiedVendors = vendors.filter((v) => v.status === 'verified').length;
  const pendingVendors = vendors.filter((v) => v.status === 'pending');
  const activeAlerts = sosAlerts.filter((s) => s.status !== 'resolved').length;

  const handleApprove = (id: string) => {
    soundFx.playSuccess();
    onApproveVendor(id);
  };

  const handleReject = (id: string) => {
    soundFx.playClick();
    onRejectVendor(id);
  };

  const handleDispatch = (id: string) => {
    soundFx.playAlert();
    onDispatchSosTeam(id);
  };

  const handleResolve = (id: string) => {
    soundFx.playSuccess();
    onResolveSos(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Admin Command Header */}
      <div className="bg-gradient-to-r from-[#2D030D] via-[#4C0519] to-[#3B0212] text-white p-6 rounded-3xl shadow-xl border-2 border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-100">
                {t.adminTitle}
              </h2>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-amber-200/80 mt-1">{t.adminSub}</p>
          </div>
        </div>

        <div className="bg-black/40 px-4 py-2 rounded-xl border border-amber-500/30 text-right self-stretch sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-amber-300/80 block">Telemetry Stream</span>
          <span className="text-xs font-mono font-bold text-emerald-400">STATUS: ALL SECTORS LIVE</span>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total Pilgrims Today */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-orange-100 text-orange-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              {t.statPilgrimsToday}
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-serif">2,480,000</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">+12% vs yesterday</span>
          </div>
        </div>

        {/* Total & Verified Vendors */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              {t.statVerifiedVendors}
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-serif">
              {verifiedVendors} <span className="text-xs text-slate-400 font-normal">/ {totalVendors}</span>
            </span>
            <span className="text-[10px] text-amber-700 font-semibold block">
              {pendingVendors.length} awaiting approval
            </span>
          </div>
        </div>

        {/* Active Emergency SOS Alerts */}
        <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-red-100 text-red-700">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              {t.statActiveSos}
            </span>
            <span className="text-xl font-extrabold text-red-600 font-serif">{activeAlerts}</span>
            <span className="text-[10px] text-red-600 font-semibold block">Dispatched patrols</span>
          </div>
        </div>

        {/* Overall Mela Crowd Index */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              {t.statCrowdIndex}
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-serif">74%</span>
            <span className="text-[10px] text-amber-600 font-semibold block">Moderate High Hold</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & SOS Incident Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pending Vendors Approval Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                  <span>{t.pendingApprovals}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {pendingVendors.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review submitted business licenses, hygiene certification, and stall pins
                </p>
              </div>
            </div>

            {pendingVendors.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">{t.noPendingVendors}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingVendors.map((vendor) => (
                  <div key={vendor.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={vendor.photoUrl}
                        alt={vendor.businessName}
                        className="w-14 h-14 rounded-xl object-cover border border-amber-300 shrink-0 shadow-xs"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{vendor.businessName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {vendor.categoryLabel[language]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          <span>{vendor.sector}</span>
                        </p>
                        {vendor.ocrExtractedData && (
                          <p className="text-[11px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                            OCR: {vendor.ocrExtractedData.licenseNo} ({vendor.ocrExtractedData.sanitationRating})
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Approve / Reject Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        id={`reject-vendor-${vendor.id}`}
                        onClick={() => handleReject(vendor.id)}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t.rejectBtn}</span>
                      </button>

                      <button
                        id={`approve-vendor-${vendor.id}`}
                        onClick={() => handleApprove(vendor.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.approveBtn}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Crowd Density Visual Map Overview */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <span>{t.crowdControlTitle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                    Telemetry Live
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visual map overview showing sector surge zones and facility deployment
                </p>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowCrowdOverlay(!showCrowdOverlay);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showCrowdOverlay
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.toggleCrowdOverlay}</span>
              </button>
            </div>

            <CustomMap
              facilities={facilities}
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
              crowdZones={crowdZones}
              showCrowdOverlay={showCrowdOverlay}
              setShowCrowdOverlay={setShowCrowdOverlay}
              language={language}
            />
          </div>
        </div>

        {/* Right 1 Col: Active SOS Emergency Dispatch Incident Feed */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-red-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 animate-pulse" />
                <h3 className="text-sm font-bold font-serif">{t.activeSosFeed}</h3>
              </div>
              <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded font-bold">
                {activeAlerts} OPEN
              </span>
            </div>

            <div className="p-4 space-y-3">
              {sosAlerts.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  All emergency beacons resolved. Normal patrol active.
                </p>
              ) : (
                sosAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      alert.status === 'resolved'
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : alert.status === 'dispatched'
                        ? 'bg-amber-50/80 border-amber-300'
                        : 'bg-red-50 border-red-300 ring-2 ring-red-400/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            alert.status === 'active'
                              ? 'bg-red-600 animate-ping'
                              : alert.status === 'dispatched'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {alert.locationLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mb-2">
                      {alert.pilgrimName || 'Emergency Pilgrim Beacon'} • GPS: ({alert.coords.x}, {alert.coords.y})
                    </p>

                    {/* Dispatch & Resolve Controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Status: {alert.status}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {alert.status === 'active' && (
                          <button
                            onClick={() => handleDispatch(alert.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] shadow-xs cursor-pointer active:scale-95"
                          >
                            {t.dispatchTeam}
                          </button>
                        )}
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-xs cursor-pointer active:scale-95"
                          >
                            {t.resolveAlert}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
