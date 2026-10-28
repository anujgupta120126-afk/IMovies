import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Star, Calendar } from "lucide-react";
import { movies, shows, theatres, dates } from "@/lib/data";

export const Route = createFileRoute("/movie/$id")({
  loader: ({ params }) => {
    const movie = movies.find((m) => m.id === params.id);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.movie.title} — Tickets | IMovies` : "Movie | IMovies";
    const d = loaderData?.movie.description ?? "Book tickets on IMovies.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: MoviePage,
});

function MoviePage() {
  const { movie } = Route.useLoaderData();
  const [date, setDate] = useState(dates[0]);
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={movie.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-sm" />
        <div className="absolute inset-0 bg-fade" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row">
          <img src={movie.poster} alt={movie.title} className="w-56 rounded-lg shadow-glow" />
          <div className="animate-in fade-in duration-500">
            <h1 className="text-6xl">{movie.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-gold"><Star className="h-4 w-4 fill-current" />{movie.rating}/10</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{movie.duration}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(movie.release).toDateString()}</span>
              <span>{movie.language}</span><span>{movie.genre.join(", ")}</span>
            </div>
            <p className="mt-4 max-w-xl">{movie.description}</p>
            <p className="mt-4 text-sm text-muted-foreground">Cast: <span className="text-foreground">{movie.cast.join(", ")}</span></p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {dates.map((d) => {
            const dt = new Date(d);
            return (
              <button key={d} onClick={() => setDate(d)} className={`min-w-16 rounded-md border px-3 py-2 text-center text-sm transition ${d === date ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>
                <div className="text-xs uppercase">{dt.toLocaleDateString("en", { weekday: "short" })}</div>
                <div className="text-lg font-bold">{dt.getDate()}</div>
              </button>
            );
          })}
        </div>
        <div className="space-y-4">
          {theatres.map((t) => {
            const ts = shows.filter((s) => s.movieId === movie.id && s.theatreId === t.id && s.date === date);
            return (
              <div key={t.id} className="rounded-lg border bg-card p-4">
                <div className="font-semibold">{t.name}</div>
                <div className="mb-3 text-xs text-muted-foreground">{t.city}</div>
                <div className="flex flex-wrap gap-2">
                  {ts.map((s) => (
                    <Link key={s.id} to="/book/$showId" params={{ showId: s.id }} className="rounded-md border border-primary/60 px-4 py-2 text-sm text-primary transition hover:bg-primary hover:text-primary-foreground">
                      {s.time} <span className="text-xs opacity-70">₹{s.price}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
