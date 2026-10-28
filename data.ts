import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";

export type Movie = {
  id: string; title: string; poster: string; genre: string[]; language: string;
  rating: number; duration: string; release: string; cast: string[]; description: string;
};
export type Theatre = { id: string; name: string; city: string };
export type Show = { id: string; movieId: string; theatreId: string; date: string; time: string; price: number };

export const movies: Movie[] = [
  { id: "red-horizon", title: "Red Horizon", poster: p1, genre: ["Sci-Fi", "Adventure"], language: "English", rating: 8.6, duration: "2h 28m", release: "2026-10-02", cast: ["Ava Stone", "Leo Hart", "Mira Kapoor"], description: "A lone astronaut stranded on a crimson world races against a dying sun to send one final message home." },
  { id: "monsoon-city", title: "Monsoon City", poster: p2, genre: ["Action", "Thriller"], language: "Hindi", rating: 8.1, duration: "2h 41m", release: "2026-10-16", cast: ["Arjun Rao", "Sana Mehta", "Vikram Das"], description: "One rain-soaked night in Mumbai, a disgraced cop has twelve hours to stop a war between syndicates." },
  { id: "golden-hour", title: "Golden Hour", poster: p3, genre: ["Romance", "Drama"], language: "Tamil", rating: 7.8, duration: "2h 12m", release: "2026-09-25", cast: ["Priya Nair", "Karthik S"], description: "Two strangers meet every evening at sunset on the same hill — until one of them stops coming." },
  { id: "blood-moon-manor", title: "Blood Moon Manor", poster: p4, genre: ["Horror"], language: "English", rating: 7.2, duration: "1h 54m", release: "2026-10-23", cast: ["Noah Black", "Eve Lin"], description: "A family inherits a fog-bound mansion where the doors only open under a red moon." },
];

export const theatres: Theatre[] = [
  { id: "pvr-phoenix", name: "PVR Phoenix", city: "Mumbai" },
  { id: "inox-nehru", name: "INOX Nehru Place", city: "Delhi" },
  { id: "cinepolis-forum", name: "Cinépolis Forum", city: "Bengaluru" },
];

const times = ["10:15", "13:30", "17:00", "21:15"];
export const dates = Array.from({ length: 5 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10);
});

export const shows: Show[] = movies.flatMap((m, mi) =>
  theatres.flatMap((t, ti) => dates.flatMap((d) => times.slice((mi + ti) % 2).map((time) => ({
    id: `${m.id}_${t.id}_${d}_${time.replace(":", "")}`, movieId: m.id, theatreId: t.id, date: d, time,
    price: 180 + ti * 40,
  })))));

export const ROWS = "ABCDEFGHIJ".split("");
export const COLS = 12;
export const PREMIUM_ROWS = ["I", "J"];
export const seatPrice = (base: number, seat: string) => (PREMIUM_ROWS.includes(seat[0] ?? "") ? base + 120 : base);
export const CONVENIENCE_FEE = 30;

/** Deterministic "already booked by others" seats per show (sample data). */
export function presetBooked(showId: string): string[] {
  let h = 0; for (const c of showId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const out: string[] = [];
  ROWS.forEach((r) => { for (let c = 1; c <= COLS; c++) { h = (h * 1103515245 + 12345) >>> 0; if (h % 7 === 0) out.push(`${r}${c}`); } });
  return out;
}
