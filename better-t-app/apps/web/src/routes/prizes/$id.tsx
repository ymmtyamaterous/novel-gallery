import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { GalleryCard } from "@/components/gallery-card";
import { MetadataChip } from "@/components/metadata-chip";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/prizes/$id")({
  component: PrizeDetailComponent,
});

const CATEGORY_LABEL: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  medicine: "Medicine",
  literature: "Literature",
  peace: "Peace",
  economics: "Economics",
};

function PrizeDetailComponent() {
  const { id } = Route.useParams();

  const { data: prize, isLoading } = useQuery(
    orpc.prizes.get.queryOptions({ input: { id } }),
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-8 py-12 animate-pulse space-y-4">
        <div className="h-6 bg-muted w-48" />
        <div className="h-10 bg-muted w-80" />
        <div className="h-24 bg-muted w-full" />
      </div>
    );
  }

  if (!prize) {
    return (
      <div className="mx-auto max-w-[1280px] px-8 py-12 text-center text-muted-foreground">
        Prize not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-12 max-md:px-5">
      {/* パンくず */}
      <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
        <Link to="/prizes" className="hover:text-foreground transition-colors">
          Prizes
        </Link>
        <span>›</span>
        <span>{prize.year}</span>
        <span>›</span>
        <span className="text-foreground">{CATEGORY_LABEL[prize.category] ?? prize.category}</span>
      </nav>

      {/* 賞ヘッダー */}
      <div className="mb-12 max-w-3xl">
        <MetadataChip label={CATEGORY_LABEL[prize.category] ?? prize.category} />
        <h1 className="font-serif text-[40px] leading-[48px] mt-3 text-foreground">
          {prize.year} Nobel Prize in {CATEGORY_LABEL[prize.category] ?? prize.category}
        </h1>
        {prize.motivation && (
          <p className="mt-4 text-[18px] leading-[28px] text-muted-foreground">
            {prize.motivation}
          </p>
        )}
      </div>

      {/* 受賞者セクション */}
      <section>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold mb-6">
          Laureates
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {prize.laureates.map((laureate) => (
            <div key={laureate.id}>
              <GalleryCard
                id={laureate.id}
                name={laureate.name}
                nationality={laureate.nationality}
                imageUrl={laureate.imageUrl}
                prizes={[{ year: prize.year, category: prize.category }]}
              />
              {laureate.motivation && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 px-1">
                  {laureate.motivation}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
