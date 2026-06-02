import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { GalleryCard } from "@/components/gallery-card";
import { RefinedSearch } from "@/components/refined-search";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const CATEGORY_META = [
  { slug: "physics", label: "Physics", labelJa: "物理学", icon: "⚛" },
  { slug: "chemistry", label: "Chemistry", labelJa: "化学", icon: "🧪" },
  { slug: "medicine", label: "Medicine", labelJa: "医学・生理学", icon: "🔬" },
  { slug: "literature", label: "Literature", labelJa: "文学", icon: "📖" },
  { slug: "peace", label: "Peace", labelJa: "平和", icon: "☮" },
  { slug: "economics", label: "Economics", labelJa: "経済学", icon: "📊" },
] as const;

function HomeComponent() {
  const featured = useQuery(
    orpc.laureates.list.queryOptions({ input: { pageSize: 8, page: 1 } }),
  );
  const categories = useQuery(orpc.categories.list.queryOptions());

  return (
    <div>
      {/* ヒーローセクション */}
      <section className="py-[120px] px-8 max-md:py-20 max-md:px-5 text-center bg-background">
        <div className="mx-auto max-w-[800px] space-y-6">
          <h1 className="font-serif text-[64px] leading-[72px] tracking-[-0.02em] text-foreground max-md:text-[40px] max-md:leading-[48px]">
            Celebrating a Century of Human Achievement
          </h1>
          <p className="text-[18px] leading-[28px] text-muted-foreground max-w-lg mx-auto">
            Explore the lives and discoveries of every Nobel Laureate since 1901.
          </p>
          <div className="pt-4">
            <RefinedSearch />
          </div>
        </div>
      </section>

      {/* 注目の受賞者 */}
      <section className="py-20 px-8 max-md:px-5 bg-[#efeeec]">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-gold uppercase mb-1">
                Featured
              </p>
              <h2 className="font-serif text-[32px] leading-[40px] text-foreground">
                Notable Laureates
              </h2>
            </div>
            <Link
              to="/laureates"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2"
            >
              View All →
            </Link>
          </div>

          {featured.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.data?.items.map((laureate) => (
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
        </div>
      </section>

      {/* 部門ナビゲーション */}
      <section className="py-20 px-8 max-md:px-5 bg-background">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-gold uppercase mb-1">
              Explore by Field
            </p>
            <h2 className="font-serif text-[32px] leading-[40px] text-foreground">
              Prize Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORY_META.map((cat) => {
              const count = categories.data?.items.find((c) => c.slug === cat.slug)?.count ?? 0;
              return (
                <Link
                  key={cat.slug}
                  to="/laureates"
                  search={{ category: cat.slug }}
                  className="group flex flex-col items-center justify-center gap-3 border border-border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:border-gold"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold">
                      {cat.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.labelJa}</p>
                    {count > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">{count} prizes</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

