import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Droplets,
  HeartPulse,
  Utensils,
  Coffee,
  HelpCircle,
  Home,
  Car
} from 'lucide-react';
import { Facility, FacilityType, CrowdZone, RouteData, Coordinates, Language } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface CustomMapProps {
  facilities: Facility[];
  selectedCategory: FacilityType | 'all';
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
  showRoutes: boolean;
  routeData: RouteData;
  activeRouteType: 'both' | 'direct' | 'crowd_aware';
  setActiveRouteType: (type: 'both' | 'direct' | 'crowd_aware') => void;
  crowdZones: CrowdZone[];
  showCrowdOverlay: boolean;
  setShowCrowdOverlay: (show: boolean) => void;
  // Pin drop mode for lost person or vendor registration
  pinDropMode?: 'lost_person' | 'vendor' | null;
  onPinDropped?: (coords: Coordinates) => void;
  pinnedCoords?: Coordinates | null;
  language: Language;
}

export const CustomMap: React.FC<CustomMapProps> = ({
  facilities,
  selectedCategory,
  selectedFacility,
  onSelectFacility,
  showRoutes,
  routeData,
  activeRouteType,
  setActiveRouteType,
  crowdZones,
  showCrowdOverlay,
  setShowCrowdOverlay,
  pinDropMode = null,
  onPinDropped,
  pinnedCoords,
  language,
}) => {
  const t = translations[language];
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Zoom controls
  const handleZoomIn = () => {
    soundFx.playClick();
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    soundFx.playClick();
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.8));
  };

  const handleResetZoom = () => {
    soundFx.playClick();
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // only main left click
    if (pinDropMode) return; // pin drop has priority
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Pin Drop handler
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pinDropMode || !onPinDropped || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert screen coordinates into 1000 x 650 SVG coordinate space
    const scaleX = 1000 / (rect.width * zoomLevel);
    const scaleY = 650 / (rect.height * zoomLevel);

    const relativeX = (clientX - panOffset.x * (rect.width / 1000)) * scaleX;
    const relativeY = (clientY - panOffset.y * (rect.height / 650)) * scaleY;

    const boundedX = Math.max(50, Math.min(950, Math.round(relativeX)));
    const boundedY = Math.max(50, Math.min(600, Math.round(relativeY)));

    // Approximate sector calculation based on X coordinates
    let sectorName = 'Sector 1 (Sacred Ghats)';
    if (boundedX < 300) sectorName = 'Sector 3 (Sadhu Gram & Encampments)';
    else if (boundedX > 700) sectorName = 'Sector 4 (Tapovan Sector)';
    else if (boundedY < 250) sectorName = 'Sector 2 (Panchavati Temple Core)';
    else if (boundedX > 550) sectorName = 'Sector 5 (Outer Transport Zone)';

    soundFx.playSuccess();
    onPinDropped({
      x: boundedX,
      y: boundedY,
      sector: sectorName,
      geoLabel: `${boundedX}, ${boundedY}`,
    });
  };

  // Filter facilities
  const filteredFacilities = facilities.filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.type === selectedCategory;
  });

  // Icon helper
  const getMarkerIcon = (type: FacilityType) => {
    switch (type) {
      case 'ghat':
        return <Droplets className="w-3.5 h-3.5 text-white" />;
      case 'medical':
        return <HeartPulse className="w-3.5 h-3.5 text-white" />;
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-white" />;
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-white" />;
      case 'toilet':
        return <HelpCircle className="w-3.5 h-3.5 text-white" />;
      case 'lodging':
        return <Home className="w-3.5 h-3.5 text-white" />;
      case 'parking':
        return <Car className="w-3.5 h-3.5 text-white" />;
      case 'vendor':
        return <Coffee className="w-3.5 h-3.5 text-white" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-white" />;
    }
  };

  const getMarkerColor = (type: FacilityType) => {
    switch (type) {
      case 'ghat':
        return '#881337'; // Deep Maroon
      case 'medical':
        return '#DC2626'; // Bright Emergency Red
      case 'food':
        return '#D97706'; // Warm Amber/Gold
      case 'water':
        return '#0284C7'; // Godavari Blue
      case 'toilet':
        return '#4F46E5'; // Indigo
      case 'lodging':
        return '#7C3AED'; // Royal Purple
      case 'parking':
        return '#475569'; // Slate
      case 'vendor':
        return '#EA580C'; // Saffron Orange
      default:
        return '#F59E0B';
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-500/30 bg-[#FAF7F2] shadow-xl select-none">
      {/* Map Header Status & Mode Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#2D030D]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wider font-serif">
            Nashik Kumbh Mela 2026 Visual Map
          </span>
          <span className="text-[11px] text-amber-100/60 hidden sm:inline">• Godavari Basin</span>
        </div>

        {/* Pin Drop Mode Alert Banner */}
        {pinDropMode && (
          <div className="pointer-events-auto bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 animate-bounce border border-amber-300">
            <MapPin className="w-4 h-4 text-slate-950" />
            <span>
              {pinDropMode === 'lost_person'
                ? 'Click on the map to pin where person was last seen!'
                : 'Click on the map to set your stall location!'}
            </span>
          </div>
        )}

        {/* Map Control Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-amber-200">
          <button
            id="map-crowd-toggle"
            onClick={() => {
              soundFx.playClick();
              setShowCrowdOverlay(!showCrowdOverlay);
            }}
            title="Toggle Crowd Density Zones"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showCrowdOverlay
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {showCrowdOverlay ? <Eye className="w-3.5 h-3.5 text-amber-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">Crowd Zones</span>
          </button>

          <button
            id="map-zoom-in"
            onClick={handleZoomIn}
            title={t.zoomIn}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            id="map-zoom-out"
            onClick={handleZoomOut}
            title={t.zoomOut}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            id="map-reset-zoom"
            onClick={handleResetZoom}
            title={t.resetView}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full h-[420px] sm:h-[520px] md:h-[580px] overflow-hidden relative cursor-grab active:cursor-grabbing">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 650"
          className={`w-full h-full object-cover transition-transform duration-75 ${
            pinDropMode ? 'cursor-crosshair' : ''
          }`}
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: 'center center',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleSvgClick}
        >
          <defs>
            {/* Godavari River Gradient */}
            <linearGradient id="godavariGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.9" />
            </linearGradient>

            {/* Sacred Ground Texture */}
            <pattern id="sacredGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2D9C8" strokeWidth="0.6" strokeDasharray="2,2" />
            </pattern>

            {/* Crowd Surge Danger Pattern */}
            <pattern id="crowdStripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#DC2626" strokeWidth="4" strokeOpacity="0.45" />
            </pattern>

            {/* Glowing route filters */}
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10B981" floodOpacity="0.9" />
            </filter>
            <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#EF4444" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Soil & Mela Grounds */}
          <rect x="0" y="0" width="1000" height="650" fill="#F8F5EE" />
          <rect x="0" y="0" width="1000" height="650" fill="url(#sacredGrid)" />

          {/* Sector Areas - Stylized polygons */}
          {/* Sector 3: Sadhu Gram (West) */}
          <path
            d="M 20 280 L 260 260 L 290 580 L 30 620 Z"
            fill="#FEF3C7"
            fillOpacity="0.45"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text x="70" y="560" fill="#92400E" fontSize="13" fontWeight="700" fontFamily="serif">
            SECTOR 3: SADHU GRAM (AKHADA ENCAMPMENT)
          </text>

          {/* Sector 2: Panchavati Temple District (North) */}
          <path
            d="M 330 40 L 700 50 L 640 220 L 320 210 Z"
            fill="#FEE2E2"
            fillOpacity="0.4"
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text x="360" y="80" fill="#991B1B" fontSize="13" fontWeight="700" fontFamily="serif">
            SECTOR 2: PANCHAVATI (KALARAM & SITA GUFA)
          </text>

          {/* Sector 4: Tapovan Grove (East) */}
          <path
            d="M 710 80 L 980 90 L 970 480 L 730 420 Z"
            fill="#DCFCE7"
            fillOpacity="0.45"
            stroke="#16A34A"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text x="760" y="120" fill="#166534" fontSize="13" fontWeight="700" fontFamily="serif">
            SECTOR 4: TAPOVAN (RISHI GROVE & SANGAM)
          </text>

          {/* Main Godavari River Flow */}
          <path
            d="M -30 180 C 230 150, 360 270, 500 320 C 660 380, 820 300, 1030 350 L 1030 460 C 820 400, 640 480, 480 410 C 340 360, 200 240, -30 270 Z"
            fill="url(#godavariGrad)"
            stroke="#0284C7"
            strokeWidth="2.5"
          />

          {/* Godavari Water Ripples */}
          <path
            d="M 80 205 Q 160 215 240 200"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 400 325 Q 460 340 530 350"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 700 370 Q 770 360 850 350"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Godavari River Name Label in River */}
          <text
            x="640"
            y="410"
            fill="#E0F2FE"
            fontSize="15"
            fontWeight="bold"
            fontFamily="serif"
            letterSpacing="2"
            opacity="0.9"
            transform="rotate(8 640 410)"
          >
            ~ SACRED GODAVARI RIVER (दक्षीण गंगा) ~
          </text>

          {/* Holy Ghat Steps & Terraces */}
          {/* Ramkund Stepped Ghat */}
          <g transform="translate(460, 280)">
            <rect x="0" y="0" width="55" height="35" rx="4" fill="#881337" stroke="#FDE68A" strokeWidth="2" />
            <line x1="6" y1="8" x2="49" y2="8" stroke="#FDE68A" strokeWidth="1.5" />
            <line x1="6" y1="17" x2="49" y2="17" stroke="#FDE68A" strokeWidth="1.5" />
            <line x1="6" y1="26" x2="49" y2="26" stroke="#FDE68A" strokeWidth="1.5" />
            <text x="27" y="-6" textAnchor="middle" fill="#78122B" fontSize="12" fontWeight="800" fontFamily="serif">
              RAMKUND GHAT
            </text>
          </g>

          {/* Historic Bridge Crossing Ahilyabai Holkar Bridge */}
          <g transform="translate(540, 310) rotate(25)">
            <rect x="0" y="0" width="18" height="110" rx="3" fill="#64748B" stroke="#334155" strokeWidth="2" />
            <line x1="9" y1="0" x2="9" y2="110" stroke="#F8FAFC" strokeWidth="2" strokeDasharray="6,4" />
            <text x="25" y="55" fill="#334155" fontSize="10" fontWeight="bold">
              Ahilyabai Bridge
            </text>
          </g>

          {/* Historic North Promenade Pathway */}
          <path
            d="M 120 150 C 260 110, 420 130, 560 180 C 650 220, 720 250, 780 260"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="1,1"
          />

          {/* High Density Crowd Zones (Simulated Surge Overlays) */}
          {showCrowdOverlay &&
            crowdZones.map((zone) => (
              <g key={zone.id}>
                {/* Danger pulsing circle */}
                <circle
                  cx={zone.centerX}
                  cy={zone.centerY}
                  r={zone.radius}
                  fill="url(#crowdStripes)"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
                <circle
                  cx={zone.centerX}
                  cy={zone.centerY}
                  r={zone.radius + 6}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                  opacity="0.8"
                />
                {/* Warning Badge on Crowd Zone */}
                <g transform={`translate(${zone.centerX - 65}, ${zone.centerY - zone.radius - 20})`}>
                  <rect x="0" y="0" width="130" height="24" rx="12" fill="#7F1D1D" stroke="#F87171" strokeWidth="1.5" />
                  <text x="65" y="16" textAnchor="middle" fill="#FEF2F2" fontSize="10" fontWeight="bold">
                    ⚠️ {zone.densityPercentage}% Crowd Surge Hold
                  </text>
                </g>
              </g>
            ))}

          {/* Visual Route Paths Comparison (Direct vs Crowd-Aware) */}
          {showRoutes && (
            <g>
              {/* Direct Route (Amber/Crimson, passes through bottleneck) */}
              {(activeRouteType === 'both' || activeRouteType === 'direct') && (
                <g>
                  <path
                    d={routeData.directPath}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="5"
                    strokeDasharray="8,6"
                    strokeLinecap="round"
                    filter="url(#crimsonGlow)"
                    className="animate-pulse"
                  />
                  {/* Choke Point Stoppage Indicator */}
                  <g transform="translate(455, 300)">
                    <circle cx="0" cy="0" r="10" fill="#991B1B" stroke="#FEE2E2" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                      !
                    </text>
                  </g>
                </g>
              )}

              {/* Crowd-Aware Route (Emerald/Cyan, loops north promenade safely avoiding congestion) */}
              {(activeRouteType === 'both' || activeRouteType === 'crowd_aware') && (
                <g>
                  {/* Wide glow under-path */}
                  <path
                    d={routeData.crowdAwarePath}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                  />
                  {/* Active bright dashed animated route */}
                  <path
                    d={routeData.crowdAwarePath}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="5"
                    strokeDasharray="10,6"
                    strokeLinecap="round"
                    filter="url(#emeraldGlow)"
                  />
                  {/* Recommended Badge Along Path */}
                  <g transform="translate(370, 110)">
                    <rect x="0" y="0" width="160" height="22" rx="11" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
                    <text x="80" y="15" textAnchor="middle" fill="#ECFDF5" fontSize="10" fontWeight="bold">
                      ✓ Police Safe Route (15 Min)
                    </text>
                  </g>
                </g>
              )}

              {/* Start Point Marker (P1 Parking) */}
              <g transform="translate(120, 150)">
                <circle cx="0" cy="0" r="14" fill="#047857" stroke="#ECFDF5" strokeWidth="3" />
                <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
                <text x="0" y="28" textAnchor="middle" fill="#064E3B" fontSize="11" fontWeight="bold">
                  Start: Parking P1
                </text>
              </g>

              {/* Destination Point Marker (Ramkund Main Ghat) */}
              <g transform="translate(480, 310)">
                <circle cx="0" cy="0" r="16" fill="#B91C1C" stroke="#FEF2F2" strokeWidth="3" className="animate-ping" />
                <circle cx="0" cy="0" r="14" fill="#881337" stroke="#FDE68A" strokeWidth="2.5" />
                <text x="0" y="5" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="bold">
                  🎯
                </text>
                <text x="0" y="32" textAnchor="middle" fill="#78122B" fontSize="11" fontWeight="bold">
                  Destination: Ramkund
                </text>
              </g>
            </g>
          )}

          {/* Interactive Facility Markers */}
          {filteredFacilities.map((facility) => {
            const isSelected = selectedFacility?.id === facility.id;
            const isHovered = hoveredFacility?.id === facility.id;
            const markerColor = getMarkerColor(facility.type);

            return (
              <g
                key={facility.id}
                id={`marker-${facility.id}`}
                transform={`translate(${facility.coords.x}, ${facility.coords.y})`}
                className="cursor-pointer transition-transform duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  onSelectFacility(facility);
                }}
                onMouseEnter={() => setHoveredFacility(facility)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                {/* Pulsing ring on selected */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="22"
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="3"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Outer shadow base */}
                <ellipse cx="0" cy="8" rx="8" ry="4" fill="#000000" fillOpacity="0.25" />

                {/* Marker Body Pin */}
                <path
                  d="M 0 -22 C -11 -22 -14 -11 0 5 C 14 -11 11 -22 0 -22 Z"
                  fill={markerColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                  transform={isSelected || isHovered ? 'scale(1.2) translate(0, -3)' : ''}
                />

                {/* Center Circle inside pin */}
                <circle
                  cx="0"
                  cy={isSelected || isHovered ? -14 : -11}
                  r="5"
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                />

                {/* Verified mini check badge */}
                {facility.verified && (
                  <circle
                    cx="7"
                    cy="-22"
                    r="4"
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                )}

                {/* Marker Floating Label on hover or select */}
                {(isHovered || isSelected) && (
                  <g transform="translate(0, -34)">
                    <rect
                      x="-70"
                      y="-18"
                      width="140"
                      height="24"
                      rx="6"
                      fill="#1E293B"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                    />
                    <text
                      x="0"
                      y="-2"
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="10"
                      fontWeight="bold"
                      className="truncate"
                    >
                      {facility.name[language]}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Pinned Coordinates (For Lost Person or Vendor Registration) */}
          {pinnedCoords && (
            <g transform={`translate(${pinnedCoords.x}, ${pinnedCoords.y})`}>
              <circle cx="0" cy="0" r="28" fill="#F59E0B" fillOpacity="0.2" className="animate-ping" />
              <path
                d="M 0 -28 C -14 -28 -18 -14 0 8 C 18 -14 14 -28 0 -28 Z"
                fill="#EA580C"
                stroke="#FEF3C7"
                strokeWidth="3"
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
              />
              <circle cx="0" cy="-14" r="6" fill="#FEF3C7" />
              <g transform="translate(0, -42)">
                <rect x="-65" y="-18" width="130" height="22" rx="11" fill="#7C2D12" stroke="#FDBA74" strokeWidth="1.5" />
                <text x="0" y="-3" textAnchor="middle" fill="#FFEDD5" fontSize="10" fontWeight="bold">
                  📍 Pinned Spot
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Route Switcher Floating Overlay HUD (When Routes Active) */}
      {showRoutes && (
        <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500 text-white shadow-md">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>{t.compareRoutes}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  AI Crowd Analysis Active
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                P1 Outer Parking → Ramkund Sacred Snan Ghat
              </p>
            </div>
          </div>

          {/* Route Option Tabs */}
          <div className="flex items-center gap-2">
            {/* Direct Route Pill */}
            <button
              id="route-btn-direct"
              onClick={() => {
                soundFx.playClick();
                setActiveRouteType(activeRouteType === 'direct' ? 'both' : 'direct');
              }}
              className={`flex-1 md:flex-none p-2 rounded-xl border text-left text-xs transition-all ${
                activeRouteType === 'direct' || activeRouteType === 'both'
                  ? 'bg-rose-50 border-red-400 text-rose-950 shadow-sm'
                  : 'bg-white/70 border-slate-200 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 font-bold">
                <span className="flex items-center gap-1 text-red-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  {t.directRoute}
                </span>
                <span className="text-[11px] text-red-600">{routeData.directDistance}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-red-700 font-semibold">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>{routeData.directTime} • 92% Density Choke</span>
              </div>
            </button>

            {/* Crowd-Aware Route Pill */}
            <button
              id="route-btn-crowd-aware"
              onClick={() => {
                soundFx.playClick();
                setActiveRouteType(activeRouteType === 'crowd_aware' ? 'both' : 'crowd_aware');
              }}
              className={`flex-1 md:flex-none p-2 rounded-xl border-2 text-left text-xs transition-all ${
                activeRouteType === 'crowd_aware' || activeRouteType === 'both'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-400/30'
                  : 'bg-white/70 border-slate-200 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 font-bold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {t.crowdAwareRoute}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">{routeData.crowdAwareDistance}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-emerald-700 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{routeData.crowdAwareTime} • Safe & Smooth Flow</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
