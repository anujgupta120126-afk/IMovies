import { useEffect, useState } from "react";

export type Booking = {
  id: string; showId: string; movieId: string; seats: string[]; total: number;
  status: "confirmed" | "cancelled"; createdAt: string; showAt: string;
};
const KEY = "imovies-bookings";

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function save(b: Booking[]) { localStorage.setItem(KEY, JSON.stringify(b)); window.dispatchEvent(new Event("bookings")); }

export function addBooking(b: Booking) { save([b, ...loadBookings()]); }

/** Cancellation allowed until 2 hours before showtime. */
export function canCancel(b: Booking, now = new Date()) {
  return b.status === "confirmed" && new Date(b.showAt).getTime() - now.getTime() > 2 * 3600_000;
}
export function cancelBooking(id: string) {
  save(loadBookings().map((b) => (b.id === id && canCancel(b) ? { ...b, status: "cancelled" } : b)));
}
export function takenSeats(showId: string) {
  return loadBookings().filter((b) => b.showId === showId && b.status === "confirmed").flatMap((b) => b.seats);
}

export function useBookings() {
  const [list, setList] = useState<Booking[]>([]);
  useEffect(() => {
    const f = () => setList(loadBookings()); f();
    window.addEventListener("bookings", f); return () => window.removeEventListener("bookings", f);
  }, []);
  return list;
}
