import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import { GalleryCard } from "@/components/gallery-card";
import { MetadataChip } from "@/components/metadata-chip";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

const CATEGORY_LABEL: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  medicine: "Medicine",
  literature: "Literature",
  peace: "Peace",
  economics: "Economics",
};

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const [tab, setTab] = useState<"laureates" | "prizes">("laureates");

  const { data: favorites, isLoading } = useQuery(orpc.favorites.list.queryOptions());

  const favLaureates = favorites?.items.filter((f) => f.targetType === "laureate") ?? [];
  const favPrizes = favorites?.items.filter((f) => f.targetType === "prize") ?? [];

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-12 max-md:px-5">
      {/* ページヘッダー */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.1em] text-gold uppercase mb-1">
          My Account
        </p>
        <h1 className="font-serif text-[32px] leading-[40px] text-foreground">My Collection</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome, {session.data?.user.name}
        </p>
      </div>

      {/* タブ */}
      <div className="flex border-b border-border mb-8">
        {(["laureates", "prizes"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${
              tab === t
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
            <span className="ml-2 text-xs text-muted-foreground">
              ({t === "laureates" ? favLaureates.length : favPrizes.length})
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
          ))}
        </div>
      ) : tab === "laureates" ? (
        favLaureates.length === 0 ? (
          <EmptyState
            message="No saved laureates yet."
            cta={{ label: "Browse Laureates", to: "/laureates" }}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favLaureates.map((fav) => {
              const l = fav.laureate;
              if (!l) return null;
              return (
                <GalleryCard
                  key={fav.id}
                  id={l.id}
                  name={l.name}
                  nationality={l.nationality}
                  imageUrl={l.imageUrl}
                  prizes={l.prizes ?? []}
                />
              );
            })}
          </div>
        )
      ) : favPrizes.length === 0 ? (
        <EmptyState
          message="No saved prizes yet."
          cta={{ label: "Browse Prizes", to: "/prizes" }}
        />
      ) : (
        <div className="divide-y divide-border">
          {favPrizes.map((fav) => {
            const p = fav.prize;
            if (!p) return null;
            return (
              <Link
                key={fav.id}
                to="/prizes/$id"
                params={{ id: p.id }}
                className="flex items-start gap-6 py-6 hover:bg-muted/50 transition-colors -mx-2 px-2"
              >
                <div className="min-w-[60px]">
                  <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold">
                    {p.year}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <MetadataChip label={CATEGORY_LABEL[p.category] ?? p.category} />
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.motivation}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  message,
  cta,
}: { message: string; cta: { label: string; to: string } }) {
  return (
    <div className="py-20 text-center text-muted-foreground">
      <p className="mb-4">{message}</p>
      <Link
        to={cta.to}
        className="inline-block border border-border px-6 py-2 text-sm hover:border-gold hover:text-gold transition-colors"
      >
        {cta.label}
      </Link>
    </div>
  );
}
