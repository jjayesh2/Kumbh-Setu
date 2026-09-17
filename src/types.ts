export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'pilgrim' | 'vendor' | 'admin';

export type FacilityType =
  | 'ghat'
  | 'medical'
  | 'food'
  | 'water'
  | 'toilet'
  | 'lodging'
  | 'parking'
  | 'vendor';

export interface Coordinates {
  x: number; // 0 - 1000 on SVG visual canvas
  y: number; // 0 - 650 on SVG visual canvas
  sector?: string;
  geoLabel?: string;
}

export interface Facility {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  type: FacilityType;
  coords: Coordinates;
  verified: boolean;
  price: {
    en: string;
    hi: string;
    mr: string;
  };
  distance: string; // e.g. "250m"
  walkTime: string; // e.g. "3 mins"
  crowdLevel: 'low' | 'moderate' | 'high' | 'critical';
  operatingHours: string;
  description: {
    en: string;
    hi: string;
    mr: string;
  };
  contact?: string;
  iconName?: string;
}

export interface CrowdZone {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  centerX: number;
  centerY: number;
  radius: number;
  densityPercentage: number; // e.g. 92%
  status: 'moderate' | 'congested' | 'surge';
}

export interface RouteData {
  directPath: string; // SVG path d attribute
  directDistance: string;
  directTime: string;
  directCrowdStatus: 'high_congestion' | 'moderate';
  directDescription: {
    en: string;
    hi: string;
    mr: string;
  };
  crowdAwarePath: string; // SVG path d attribute
  crowdAwareDistance: string;
  crowdAwareTime: string;
  crowdAwareStatus: 'recommended' | 'low_congestion';
  crowdAwareDescription: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface Vendor {
  id: string;
  businessName: string;
  category: 'food' | 'puja' | 'handicraft' | 'cloakroom' | 'health';
  categoryLabel: {
    en: string;
    hi: string;
    mr: string;
  };
  coords: Coordinates;
  sector: string;
  pricingMenu: { item: string; price: string }[];
  photoUrl: string;
  certificateUrl?: string;
  ocrExtractedData?: {
    licenseNo: string;
    holderName: string;
    authority: string;
    sanitationRating: string;
    validity: string;
  };
  status: 'pending' | 'verified' | 'rejected';
  isOpen: boolean;
  rating: number;
  submittedAt: string;
}

export interface LostPersonReport {
  id: string;
  personName: string;
  age: number;
  gender: string;
  contactNumber: string;
  description: string;
  photoUrl: string;
  lastSeenCoords: Coordinates;
  lastSeenLocationName: string;
  reportedAt: string;
  status: 'broadcasted' | 'located';
}

export interface SOSAlert {
  id: string;
  timestamp: string;
  coords: Coordinates;
  locationLabel: string;
  pilgrimName?: string;
  status: 'active' | 'dispatched' | 'resolved';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'open_map' | 'route' | 'sos' | 'filter';
    payload?: any;
    label: string;
  };
}
