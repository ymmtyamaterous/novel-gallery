import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useRef, useState } from "react";

interface RefinedSearchProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function RefinedSearch({
  defaultValue = "",
  placeholder = "Search laureates, fields, or motivations…",
  onSearch,
}: RefinedSearchProps) {
  const [value, setValue] = useState(defaultValue);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (onSearch) {
      onSearch(value.trim());
    } else {
      navigate({ to: "/search", search: { q: value.trim() } });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="flex items-center border border-border bg-card focus-within:border-gold transition-colors">
        <span className="pl-4 text-muted-foreground">
          <Search size={18} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-3 font-serif text-base text-foreground placeholder:text-muted-foreground outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className="pr-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </form>
  );
}
