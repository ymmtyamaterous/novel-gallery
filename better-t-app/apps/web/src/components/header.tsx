import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import UserMenu from "./user-menu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-[#f4f3f1] border-b border-border"
          : "bg-background"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-4 max-md:px-5">
        {/* ロゴ */}
        <Link to="/" className="font-serif text-xl font-normal tracking-tight text-foreground">
          Nobel Laureate Archive
        </Link>

        {/* ナビ */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/laureates"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Laureates
          </Link>
          <Link
            to="/prizes"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Prizes
          </Link>
        </nav>

        {/* 右側 */}
        <div className="flex items-center gap-4">
          <Link
            to="/search"
            search={{ q: "" }}
            aria-label="Search"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search size={18} />
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

