
export interface Accommodation {
  name: string;
  price_per_night: number;
}

export interface Transport {
  flight: string;
  local_cab: string;
}

export interface ItineraryDay {
  day: number;
  activities: string[];
}

export interface TravelPackage {
  destination: string;
  total_estimated_price: number;
  currency: string;
  accommodation: Accommodation;
  transport: Transport;
  itinerary: ItineraryDay[];
  booking_payload: string;
}

export type BudgetProfile = 'Budget' | 'Luxury' | 'Mid-Range';
