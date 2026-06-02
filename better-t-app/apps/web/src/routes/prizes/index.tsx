import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import z from "zod";

import { MetadataChip } from "@/components/metadata-chip";
import { orpc } from "@/utils/orpc";

const searchSchema = z.object({
  category: z.string().optional(),
  year: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
});

export const Route = createFileRoute("/prizes/")({
  validateSearch: searchSchema,
  component: PrizesComponent,
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

const CATEGORY_LABEL: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  medicine: "Medicine",
  literature: "Literature",
  peace: "Peace",
  economics: "Economics",
};

function PrizesComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/prizes/" });

  const { data, isLoading } = useQuery(
    orpc.prizes.list.queryOptions({
      input: {
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
        <p className="text-[11px] font-semibold tracking-[0.1em] text-gold uppercase mb-1">
          Archive
        </p>
        <h1 className="font-serif text-[32px] leading-[40px] text-foreground">Nobel Prizes</h1>
      </div>

      {/* フィルターバー */}
      <div className="flex flex-wrap gap-3 mb-6">
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

        <select
          value={search.year ?? ""}
          onChange={(e) =>
            updateSearch({ year: e.target.value ? Number(e.target.value) : undefined })
          }
          className="border border-border bg-card px-3 py-2 text-sm outline-none focus:border-gold transition-colors"
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {search.category && (
          <button
            type="button"
            onClick={() => updateSearch({ category: undefined })}
            className="flex items-center gap-1 bg-muted px-2 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase"
          >
            {search.category} <X size={10} />
          </button>
        )}
        {search.year && (
          <button
            type="button"
            onClick={() => updateSearch({ year: undefined })}
            className="flex items-center gap-1 bg-muted px-2 py-1 text-[11px] font-semibold tracking-[0.1em] uppercase"
          >
            {search.year} <X size={10} />
          </button>
        )}
      </div>

      {/* 件数 */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-6">
          {data?.total ?? 0} prize{data?.total !== 1 ? "s" : ""}
        </p>
      )}

      {/* Exhibition リスト */}
      {isLoading ? (
        <div className="space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse mb-1" />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No prizes found.</div>
      ) : (
        <div className="divide-y divide-border">
          {data?.items.map((prize) => (
            <Link
              key={prize.id}
              to="/prizes/$id"
              params={{ id: prize.id }}
              className="group flex items-start gap-6 py-6 hover:bg-muted/50 transition-colors -mx-2 px-2"
            >
              {/* 年 */}
              <div className="min-w-[60px]">
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold">
                  {prize.year}
                </span>
              </div>

              {/* 部門・受賞者 */}
              <div className="flex-1 min-w-0">
                <MetadataChip label={CATEGORY_LABEL[prize.category] ?? prize.category} />
                <p className="mt-2 text-base font-medium text-foreground">
                  {prize.laureates.map((l) => l.name).join(", ")}
                </p>
                {prize.motivation && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {prize.motivation}
                  </p>
                )}
              </div>

              <span className="text-muted-foreground group-hover:text-foreground transition-colors text-lg leading-none mt-1">
                →
              </span>
            </Link>
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
