
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

export interface SettlementRecord {
  providerName: string;
  amount: number;
  currency: string;
  payoutStatus: 'Pending' | 'Settled';
  bankAccount?: string;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  package: TravelPackage;
  timestamp: number;
  status: 'Pending' | 'Confirmed' | 'Fulfilled';
  settlements?: SettlementRecord[];
}

export type BudgetProfile = 'Budget' | 'Luxury' | 'Mid-Range';
export type AppView = 'traveler' | 'provider';
export type PaymentMethod = 'upi' | 'debit' | 'credit';

export interface PaymentDetails {
  method: PaymentMethod;
  bank?: string;
  vpa?: string;
  cardNumber?: string;
}

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
] as const;

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]['code'];
