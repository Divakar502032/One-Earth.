
import { BookingRecord, TravelPackage } from '../types';

const STORAGE_KEY = 'one_earth_bookings';

export const saveBooking = (pkg: TravelPackage): BookingRecord => {
  const existing = getBookings();
  const newBooking: BookingRecord = {
    id: pkg.booking_payload,
    customerName: "Anonymous Traveler", // In a real app, this would be the logged-in user
    package: pkg,
    timestamp: Date.now(),
    status: 'Pending'
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
