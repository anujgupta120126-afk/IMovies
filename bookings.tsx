import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { movies, shows, theatres } from "@/lib/data";
import { useBookings, canCancel, cancelBooking } from "@/lib/bookings";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings | IMovies" },
      { name: "description", content: "View and manage your movie ticket bookings." },
      { property: "og:title", content: "My Bookings | IMovies" },
      { property: "og:description", content: "View and manage your movie ticket bookings." },
    ],
  }),
  component: Bookings,
});

function Bookings() {
  const list = useBookings();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-5xl">My bookings</h1>
      <p className="mb-6 text-sm text-muted-foreground">Cancel up to 2 hours before showtime for a full refund.</p>
      {list.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet. <Link to="/" className="text-primary underline">Browse movies</Link></p>
      ) : (
        <div className="space-y-4">
          {list.map((b) => {
            const m = movies.find((x) => x.id === b.movieId); const s = shows.find((x) => x.id === b.showId);
            const t = theatres.find((x) => x.id === s?.theatreId);
            return (
              <div key={b.id} className={`flex gap-4 rounded-lg border bg-card p-4 ${b.status === "cancelled" ? "opacity-50" : ""}`}>
                {m && <img src={m.poster} alt={m.title} loading="lazy" className="w-20 rounded object-cover" />}
                <div className="flex-1 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-2xl">{m?.title}</h2>
                    <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${b.status === "confirmed" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{b.status}</span>
                  </div>
                  <p className="text-muted-foreground">{t?.name} · {new Date(b.showAt).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</p>
                  <p>Seats {b.seats.join(", ")} · ₹{b.total}</p>
                  <p className="text-xs text-muted-foreground">Booking ID {b.id}</p>
                  {canCancel(b) && (
                    <button onClick={() => { cancelBooking(b.id); toast.success("Booking cancelled. Refund initiated."); }}
                      className="mt-2 text-xs font-semibold text-primary hover:underline">Cancel booking</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
