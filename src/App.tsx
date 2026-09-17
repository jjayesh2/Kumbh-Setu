import React, { useState } from 'react';
import { 
  Language, 
  UserRole, 
  Facility, 
  Vendor, 
  LostPersonReport, 
  SOSAlert, 
  Coordinates 
} from './types';
import { 
  initialFacilities, 
  initialCrowdZones, 
  routeComparisonData, 
  initialVendors, 
  initialLostReports, 
  initialSosAlerts 
} from './data/mockData';
import { Header } from './components/Header';
import { PilgrimView } from './components/PilgrimView';
import { VendorView } from './components/VendorView';
import { AdminView } from './components/AdminView';
import { SosModal } from './components/SosModal';
import { soundFx } from './utils/audio';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('pilgrim');
  const [language, setLanguage] = useState<Language>('en');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Core Mock Datasets
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [lostReports, setLostReports] = useState<LostPersonReport[]>(initialLostReports);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(initialSosAlerts);
  const [crowdZones] = useState(initialCrowdZones);

  // Global SOS Modal triggered from top bar
  const [isGlobalSosOpen, setIsGlobalSosOpen] = useState(false);

  // Handler: Add Vendor & dynamically add facility marker to map
  const handleAddVendor = (newVendor: Vendor) => {
    setVendors((prev) => [newVendor, ...prev]);

    // Create facility marker on map
    const newFacilityMarker: Facility = {
      id: `fac-${newVendor.id}`,
      name: {
        en: newVendor.businessName,
        hi: newVendor.businessName,
        mr: newVendor.businessName,
      },
      type: 'vendor',
      coords: newVendor.coords,
      verified: newVendor.status === 'verified',
      price: {
        en: newVendor.pricingMenu[0]?.price || 'Fair Price',
        hi: newVendor.pricingMenu[0]?.price || 'उचित मूल्य',
        mr: newVendor.pricingMenu[0]?.price || 'वाजवी दर',
      },
      distance: '390 m',
      walkTime: '5 mins',
      crowdLevel: 'low',
      operatingHours: newVendor.isOpen ? 'Open Now' : 'Closed',
      description: {
        en: `Authorized Kumbh vendor offering ${newVendor.categoryLabel.en}. Verified by Nashik Municipal Corp.`,
        hi: `नासिक नगर निगम द्वारा अधिकृत स्टॉल: ${newVendor.categoryLabel.hi}`,
        mr: `नाशिक महानगरपालिकेकडून अधिकृत स्टॉल: ${newVendor.categoryLabel.mr}`,
      },
      contact: '+91 98000 20261',
    };

    setFacilities((prev) => [...prev, newFacilityMarker]);
  };

  // Handler: Toggle Vendor Open/Closed
  const handleUpdateVendorStatus = (id: string, isOpen: boolean) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isOpen } : v))
    );

    // Update corresponding facility
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === `fac-${id}`) {
          return {
            ...f,
            operatingHours: isOpen ? 'Open Now' : 'Closed',
          };
        }
        return f;
      })
    );
  };

  // Handler: Approve Vendor (Admin)
  const handleApproveVendor = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'verified' } : v))
    );

    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === `fac-${id}`) {
          return { ...f, verified: true };
        }
        return f;
      })
    );
  };

  // Handler: Reject Vendor (Admin)
  const handleRejectVendor = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'rejected' } : v))
    );
  };

  // Handler: Add Lost Person Report
  const handleAddLostReport = (report: LostPersonReport) => {
    setLostReports((prev) => [report, ...prev]);
  };

  // Handler: Trigger SOS Alert (adds to live incident log in Admin)
  const handleDispatchSos = (coords: Coordinates, label: string) => {
    const newAlert: SOSAlert = {
      id: `sos-${Date.now()}`,
      timestamp: 'Just now',
      coords,
      locationLabel: label,
      pilgrimName: 'Distress Signal #9914 (Emergency Beacon)',
      status: 'active',
    };
    setSosAlerts((prev) => [newAlert, ...prev]);
  };

  // Handler: Dispatch Team for SOS (Admin)
  const handleDispatchSosTeam = (id: string) => {
    setSosAlerts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'dispatched' } : s))
    );
  };

  // Handler: Resolve SOS (Admin)
  const handleResolveSos = (id: string) => {
    setSosAlerts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'resolved' } : s))
    );
  };

  const activeSosCount = sosAlerts.filter((s) => s.status !== 'resolved').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        setRole={setCurrentRole}
        language={language}
        setLanguage={setLanguage}
        onOpenSos={() => setIsGlobalSosOpen(true)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        activeSosCount={activeSosCount}
      />

      {/* Main View Router based on currentRole */}
      <main className="flex-1">
        {currentRole === 'pilgrim' && (
          <PilgrimView
            facilities={facilities}
            routeData={routeComparisonData}
            crowdZones={crowdZones}
            language={language}
            onAddLostReport={handleAddLostReport}
            onDispatchSos={handleDispatchSos}
            lostReports={lostReports}
          />
        )}

        {currentRole === 'vendor' && (
          <VendorView
            vendors={vendors}
            onAddVendor={handleAddVendor}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            language={language}
          />
        )}

        {currentRole === 'admin' && (
          <AdminView
            vendors={vendors}
            sosAlerts={sosAlerts}
            crowdZones={crowdZones}
            facilities={facilities}
            onApproveVendor={handleApproveVendor}
            onRejectVendor={handleRejectVendor}
            onResolveSos={handleResolveSos}
            onDispatchSosTeam={handleDispatchSosTeam}
            language={language}
          />
        )}
      </main>

      {/* Global SOS Emergency Modal */}
      {isGlobalSosOpen && (
        <SosModal
          onClose={() => setIsGlobalSosOpen(false)}
          language={language}
          onDispatchAlert={handleDispatchSos}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#2D030D] text-amber-200/80 border-t-2 border-amber-500/30 py-6 px-4 mt-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="font-serif font-bold text-sm text-amber-100">
              Smart Pilgrim Platform • Kumbh Mela 2026, Nashik
            </p>
            <p className="text-[11px] text-amber-300/70">
              Self-contained offline-ready interactive prototype for holy Godavari Snan, smart crowd-aware routing & mela administration.
            </p>
          </div>

          {/* Quick Role Switcher in Footer */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-300/60 mr-1">Switch Persona:</span>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentRole('pilgrim');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                currentRole === 'pilgrim' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:text-white bg-white/5'
              }`}
            >
              Pilgrim
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentRole('vendor');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                currentRole === 'vendor' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:text-white bg-white/5'
              }`}
            >
              Vendor
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setCurrentRole('admin');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                currentRole === 'admin' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:text-white bg-white/5'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
