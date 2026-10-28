import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { movies, theatres, shows, dates } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IMovies — Book Movie Tickets" },
      { name: "description", content: "Discover movies, pick showtimes and seats, and book tickets in seconds." },
      { property: "og:title", content: "IMovies — Book Movie Tickets" },
      { property: "og:description", content: "Discover movies, pick showtimes and seats, and book tickets in seconds." },
    ],
  }),
  component: Home,
});

const sel = "rounded-md border border-input bg-card px-3 py-2 text-sm";

function Home() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [lang, setLang] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const genres = [...new Set(movies.flatMap((m) => m.genre))];
  const langs = [...new Set(movies.map((m) => m.language))];
  const cities = [...new Set(theatres.map((t) => t.city))];

  const list = useMemo(() => movies.filter((m) => {
    if (q && !m.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (genre && !m.genre.includes(genre)) return false;
    if (lang && m.language !== lang) return false;
    if (city || date) {
      const ok = shows.some((s) => s.movieId === m.id && (!date || s.date === date) &&
        (!city || theatres.find((t) => t.id === s.theatreId)?.city === city));
      if (!ok) return false;
    }
    return true;
  }), [q, genre, lang, city, date]);

  const hero = movies[0]!;
  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={hero.poster} alt={hero.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-fade" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Now showing</p>
          <h1 className="text-6xl md:text-8xl">{hero.title}</h1>
          <p className="mt-2 max-w-lg text-muted-foreground">{hero.description}</p>
          <Link to="/movie/$id" params={{ id: hero.id }} className="mt-6 w-fit rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:brightness-110">
            Book tickets
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search movies" className={`${sel} w-full pl-9`} />
          </div>
          <select className={sel} value={genre} onChange={(e) => setGenre(e.target.value)}><option value="">All genres</option>{genres.map((g) => <option key={g}>{g}</option>)}</select>
          <select className={sel} value={lang} onChange={(e) => setLang(e.target.value)}><option value="">All languages</option>{langs.map((g) => <option key={g}>{g}</option>)}</select>
          <select className={sel} value={city} onChange={(e) => setCity(e.target.value)}><option value="">All cities</option>{cities.map((g) => <option key={g}>{g}</option>)}</select>
          <select className={sel} value={date} onChange={(e) => setDate(e.target.value)}><option value="">Any date</option>{dates.map((d) => <option key={d} value={d}>{new Date(d).toDateString()}</option>)}</select>
        </div>
        <h2 className="mb-4 text-4xl">Recommended movies</h2>
        {list.length === 0 ? <p className="text-muted-foreground">No movies match your filters.</p> : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {list.map((m) => (
              <Link key={m.id} to="/movie/$id" params={{ id: m.id }} className="group">
                <div className="overflow-hidden rounded-lg">
                  <img src={m.poster} alt={m.title} loading="lazy" width={672} height={992} className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-gold"><Star className="h-4 w-4 fill-current" />{m.rating}/10</div>
                <h3 className="text-2xl">{m.title}</h3>
                <p className="text-xs text-muted-foreground">{m.genre.join(" / ")} · {m.language}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
