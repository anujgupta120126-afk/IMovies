import { Link } from "@tanstack/react-router";
import { Ticket } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-3xl tracking-wider">
          <span className="text-primary">I</span>Movies
        </Link>
        <Link to="/bookings" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          activeProps={{ className: "text-foreground" }}>
          <Ticket className="h-4 w-4" /> My bookings
        </Link>
      </div>
    </header>
  );
}
