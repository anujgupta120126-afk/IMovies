import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { movies, shows, theatres, ROWS, COLS, PREMIUM_ROWS, seatPrice, presetBooked, CONVENIENCE_FEE } from "@/lib/data";
import { addBooking, takenSeats } from "@/lib/bookings";

export const Route = createFileRoute("/book/$showId")({
  loader: ({ params }) => {
    const show = shows.find((s) => s.id === params.showId);
    if (!show) throw notFound();
    return { show, movie: movies.find((m) => m.id === show.movieId)!, theatre: theatres.find((t) => t.id === show.theatreId)! };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `Select seats — ${loaderData.movie.title} | IMovies` : "Select seats | IMovies";
    return { meta: [{ title: t }, { name: "description", content: "Pick your seats and checkout." }, { property: "og:title", content: t }, { property: "og:description", content: "Pick your seats and checkout." }] };
  },
  component: BookPage,
});

const MAX = 10;

function BookPage() {
  const { show, movie, theatre } = Route.useLoaderData();
  const navigate = useNavigate();
  const [booked, setBooked] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [paying, setPaying] = useState(false);
  useEffect(() => { setBooked([...presetBooked(show.id), ...takenSeats(show.id)]); }, [show.id]);

  const toggle = (s: string) => {
    if (booked.includes(s)) return;
    setPicked((p) => p.includes(s) ? p.filter((x) => x !== s) : p.length >= MAX ? (toast.error(`Max ${MAX} seats per booking`), p) : [...p, s]);
  };
  const subtotal = picked.reduce((a, s) => a + seatPrice(show.price, s), 0);
  const fee = picked.length ? CONVENIENCE_FEE : 0;

  const pay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1200));
    const clash = picked.filter((s) => takenSeats(show.id).includes(s));
    if (clash.length) { setPaying(false); toast.error(`Seats ${clash.join(", ")} were just taken`); return; }
    const id = "IMV" + Date.now().toString(36).toUpperCase();
    addBooking({ id, showId: show.id, movieId: movie.id, seats: picked, total: subtotal + fee, status: "confirmed", createdAt: new Date().toISOString(), showAt: `${show.date}T${show.time}:00` });
    toast.success(`Booking confirmed! ID ${id}`);
    navigate({ to: "/bookings" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-5xl">{movie.title}</h1>
      <p className="text-sm text-muted-foreground">{theatre.name}, {theatre.city} · {new Date(show.date).toDateString()} · {show.time}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-lg border bg-card p-6">
          <div className="mx-auto mb-10 h-8 w-3/4 screen-curve" />
          <p className="-mt-8 mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">Screen this way</p>
          <div className="mx-auto w-fit space-y-2">
            {ROWS.map((r) => (
              <div key={r} className={`flex items-center gap-1.5 ${r === PREMIUM_ROWS[0] ? "mt-6" : ""}`}>
                <span className="w-5 text-xs text-muted-foreground">{r}</span>
                {Array.from({ length: COLS }, (_, i) => {
                  const s = `${r}${i + 1}`; const b = booked.includes(s); const p = picked.includes(s);
                  return (
                    <button key={s} aria-label={`Seat ${s}`} disabled={b} onClick={() => toggle(s)}
                      className={`h-7 w-7 rounded-t-md text-[10px] transition ${i === 5 ? "mr-5" : ""} ${b ? "cursor-not-allowed bg-seat-booked text-muted-foreground/30" : p ? "bg-primary text-primary-foreground shadow-glow" : `bg-seat hover:bg-primary/50 ${PREMIUM_ROWS.includes(r) ? "ring-1 ring-gold/60" : ""}`}`}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><i className="h-4 w-4 rounded bg-seat" />Available ₹{show.price}</span>
            <span className="flex items-center gap-2"><i className="h-4 w-4 rounded bg-seat ring-1 ring-gold/60" />Premium ₹{show.price + 120}</span>
            <span className="flex items-center gap-2"><i className="h-4 w-4 rounded bg-primary" />Selected</span>
            <span className="flex items-center gap-2"><i className="h-4 w-4 rounded bg-seat-booked" />Booked</span>
          </div>
        </div>
        <aside className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="text-3xl">Booking summary</h2>
          {picked.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Select seats to continue.</p> : (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Seats</span><span>{[...picked].sort().join(", ")}</span></div>
              <div className="flex justify-between"><span>Tickets ({picked.length})</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Convenience fee</span><span>₹{fee}</span></div>
              <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>₹{subtotal + fee}</span></div>
            </div>
          )}
          <button disabled={!picked.length || paying} onClick={pay}
            className="mt-5 w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none">
            {paying ? "Processing payment…" : `Pay ₹${subtotal + fee}`}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">Demo checkout — no real payment taken.</p>
        </aside>
      </div>
    </div>
  );
}
