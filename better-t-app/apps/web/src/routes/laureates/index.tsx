import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import z from "zod";

import { GalleryCard } from "@/components/gallery-card";
import { MetadataChip } from "@/components/metadata-chip";
import { orpc } from "@/utils/orpc";

const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  year: z.coerce.number().optional(),
  nationality: z.string().optional(),
  page: z.coerce.number().default(1),
});

export const Route = createFileRoute("/laureates/")({
  validateSearch: searchSchema,
  component: LaureatesComponent,
});

const CATEGORIES = [
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "medicine", label: "Medicine" },
  { value: "literature", label: "Literature" },
  { value: "peace", label: "Peace" },
  { value: "economics", label: "Economics" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1900 }, (_, i) => CURRENT_YEAR - i);

function LaureatesComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/laureates/" });
  const [queryInput, setQueryInput] = useState(search.query ?? "");

  const { data, isLoading } = useQuery(
    orpc.laureates.list.queryOptions({
      input: {
        query: search.query,
        category: search.category,
        year: search.year,
        page: search.page,
        pageSize: 20,
      },
    }),
  );

  const updateSearch = (updates: Partial<z.infer<typeof searchSchema>>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates, page: 1 }) });
  };

  const totalPages = data ? Math.ceil(data.total / 20) : 0;

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-12 max-md:px-5">
      {/* ページヘッダー */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-gold uppercase mb-1">Archive</p>
        <h1 className="font-serif text-[32px] leading-[40px] text-foreground">Laureates</h1>
      </div>

      {/* フィルターバー */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* テキスト検索 */}
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateSearch({ query: queryInput || undefined });
          }}
          placeholder="Search by name…"
          className="border border-border bg-card px-3 py-2 text-sm outline-none focus:border-gold transition-colors min-w-[200px]"
        />

        {/* 部門 */}
        <select
          value={search.category ?? ""}
          onChange={(e) => updateSearch({ category: e.target.value || undefined })}
          className="border border-border bg-card px-3 py-2 text-sm outline-none focus:border-gold transition-colors"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* 年 */}
        <select
          value={search.year ?? ""}
          onChange={(e) => updateSearch({ year: e.target.value ? Number(e.target.value) : undefined })}
          className="border border-border bg-card px-3 py-2 text-sm outline-none focus:border-gold transition-colors"
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* アクティブフィルターチップ */}
        {search.category && (
          <button
            type="button"
            onClick={() => updateSearch({ category: undefined })}
            className="flex items-center gap-1 bg-muted px-2 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground"
          >
            {search.category} <X size={10} />
          </button>
        )}
        {search.year && (
          <button
            type="button"
            onClick={() => updateSearch({ year: undefined })}
            className="flex items-center gap-1 bg-muted px-2 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground"
          >
            {search.year} <X size={10} />
          </button>
        )}
        {search.query && (
          <button
            type="button"
            onClick={() => { setQueryInput(""); updateSearch({ query: undefined }); }}
            className="flex items-center gap-1 bg-muted px-2 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground"
          >
            "{search.query}" <X size={10} />
          </button>
        )}
      </div>

      {/* 件数 */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-6">
          {data?.total ?? 0} laureate{data?.total !== 1 ? "s" : ""}
        </p>
      )}

      {/* ギャラリーグリッド */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No laureates found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.items.map((laureate) => (
            <GalleryCard
              key={laureate.id}
              id={laureate.id}
              name={laureate.name}
              nationality={laureate.nationality}
              imageUrl={laureate.imageUrl}
              prizes={laureate.prizes}
            />
          ))}
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={search.page <= 1}
            onClick={() => navigate({ search: (prev) => ({ ...prev, page: search.page - 1 }) })}
            className="border border-border px-4 py-2 text-sm disabled:opacity-40 hover:border-gold transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-muted-foreground px-4">
            {search.page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={search.page >= totalPages}
            onClick={() => navigate({ search: (prev) => ({ ...prev, page: search.page + 1 }) })}
            className="border border-border px-4 py-2 text-sm disabled:opacity-40 hover:border-gold transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
