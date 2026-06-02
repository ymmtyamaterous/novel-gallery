import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1280px] px-8 py-12 max-md:px-5">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* ブランド */}
          <div className="space-y-2">
            <p className="font-serif text-lg text-foreground">Nobel Laureate Archive</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Exploring a century of human achievement through the lens of the Nobel Prize.
            </p>
          </div>

          {/* ナビ */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            <Link
              to="/laureates"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Laureates
            </Link>
            <Link
              to="/prizes"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Prizes
            </Link>
            <a
              href="https://www.nobelprize.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Nobel Prize Official ↗
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nobel Laureate Archive. Data sourced from{" "}
            <a
              href="https://api.nobelprize.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Nobel Prize API
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
