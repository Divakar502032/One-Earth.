
export interface Accommodation {
  name: string;
  price_per_night: number;
  cancellation_policy: string;
}

export interface TransportOption {
  mode: 'Flight' | 'Train' | 'Bus' | 'Cab';
  provider: string;
  reference_number: string;
  departure_time: string;
  arrival_time: string;
  origin: string;
  destination: string;
  status: string;
  cancellation_policy: string;
}

export interface ItineraryDay {
  day: number;
  activities: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface LocalEvent {
  title: string;
  description: string;
  location: string;
  date_time: string;
}

export interface TravelPackage {
  destination: string;
  total_estimated_price: number;
  currency: string;
  accommodation: Accommodation;
  transport: TransportOption[];
  itinerary: ItineraryDay[];
  local_events?: LocalEvent[];
  booking_payload: string;
  departure_date: string;
  return_date: string;
  grounding_sources?: GroundingSource[];
}

export interface BookingRecord {
  id: string;
  customerName: string;
  package: TravelPackage;
  timestamp: number;
  status: 'Pending' | 'Confirmed' | 'Fulfilled';
}

export type BudgetProfile = 'Budget' | 'Luxury' | 'Mid-Range';
export type AppView = 'traveler' | 'provider';
