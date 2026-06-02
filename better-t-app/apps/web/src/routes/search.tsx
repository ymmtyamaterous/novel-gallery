import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

import { GalleryCard } from "@/components/gallery-card";
import { MetadataChip } from "@/components/metadata-chip";
import { RefinedSearch } from "@/components/refined-search";
import { orpc } from "@/utils/orpc";

const searchSchema = z.object({
  q: z.string().default(""),
  tab: z.enum(["laureates", "prizes"]).default("laureates"),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchComponent,
});

const CATEGORY_LABEL: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  medicine: "Medicine",
  literature: "Literature",
  peace: "Peace",
  economics: "Economics",
};

function SearchComponent() {
  const { q, tab } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });

  const laureatesQuery = useQuery({
    ...orpc.laureates.list.queryOptions({ input: { query: q, pageSize: 20, page: 1 } }),
    enabled: !!q && tab === "laureates",
  });

  const prizesQuery = useQuery({
    ...orpc.prizes.list.queryOptions({ input: { pageSize: 20, page: 1 } }),
    enabled: !!q && tab === "prizes",
  });

  // prizes の場合は motivation / laureate 名でフィルタ（クライアントサイド）
  const filteredPrizes = prizesQuery.data?.items.filter((p) => {
    const lower = q.toLowerCase();
    return (
      p.motivation?.toLowerCase().includes(lower) ||
      p.laureates.some((l) => l.name.toLowerCase().includes(lower))
    );
  });

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-12 max-md:px-5">
      {/* 検索バー */}
      <div className="mb-10">
        <RefinedSearch
          defaultValue={q}
          onSearch={(query) => navigate({ search: { q: query, tab } })}
        />
      </div>

      {q ? (
        <>
          {/* タブ */}
          <div className="flex gap-0 mb-8 border-b border-border">
            {(["laureates", "prizes"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => navigate({ search: { q, tab: t } })}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${
                  tab === t
                    ? "border-gold text-gold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {t === "laureates" && laureatesQuery.data && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({laureatesQuery.data.total})
                  </span>
                )}
                {t === "prizes" && filteredPrizes && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({filteredPrizes.length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 検索結果 */}
          {tab === "laureates" && (
            <>
              {laureatesQuery.isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
                  ))}
                </div>
              ) : laureatesQuery.data?.items.length === 0 ? (
                <p className="text-muted-foreground">No laureates found for "{q}".</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {laureatesQuery.data?.items.map((l) => (
                    <GalleryCard
                      key={l.id}
                      id={l.id}
                      name={l.name}
                      nationality={l.nationality}
                      imageUrl={l.imageUrl}
                      prizes={l.prizes}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "prizes" && (
            <>
              {prizesQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse" />
                  ))}
                </div>
              ) : (filteredPrizes?.length ?? 0) === 0 ? (
                <p className="text-muted-foreground">No prizes found for "{q}".</p>
              ) : (
                <div className="divide-y divide-border">
                  {filteredPrizes?.map((prize) => (
                    <a
                      key={prize.id}
                      href={`/prizes/${prize.id}`}
                      className="flex items-start gap-6 py-6 hover:bg-muted/50 transition-colors -mx-2 px-2 block"
                    >
                      <div className="min-w-[60px]">
                        <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold">
                          {prize.year}
                        </span>
                      </div>
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
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">Enter a search term to find laureates or prizes.</p>
        </div>
      )}
    </div>
  );
}
