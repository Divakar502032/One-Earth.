
import { BookingRecord, TravelPackage } from '../types';
import { calculateSettlements } from './travelService';

const STORAGE_KEY = 'one_earth_bookings';

export const saveBooking = (pkg: TravelPackage): BookingRecord => {
  const existing = getBookings();
  const settlements = calculateSettlements(pkg);
  
  const newBooking: BookingRecord = {
    id: pkg.booking_payload,
    customerName: "Anonymous Traveler",
    package: pkg,
    timestamp: Date.now(),
    status: 'Pending',
    settlements
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newBooking, ...existing]));
  return newBooking;
};

export const getBookings = (): BookingRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const updateBookingStatus = (id: string, status: BookingRecord['status']): void => {
  const bookings = getBookings();
  const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateSettlementStatus = (bookingId: string, providerName: string, status: 'Settled'): void => {
  const bookings = getBookings();
  const updated = bookings.map(b => {
    if (b.id === bookingId) {
      return {
        ...b,
        settlements: b.settlements?.map(s => 
          s.providerName === providerName ? { ...s, payoutStatus: status } : s
        )
      };
    }
    return b;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
