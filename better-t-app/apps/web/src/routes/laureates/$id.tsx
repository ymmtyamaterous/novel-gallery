import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { MetadataChip } from "@/components/metadata-chip";
import { authClient } from "@/lib/auth-client";
import { orpc, client } from "@/utils/orpc";

export const Route = createFileRoute("/laureates/$id")({
  component: LaureateDetailComponent,
});

const CATEGORY_LABEL: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  medicine: "Medicine",
  literature: "Literature",
  peace: "Peace",
  economics: "Economics",
};

function LaureateDetailComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { data: laureate, isLoading } = useQuery(
    orpc.laureates.get.queryOptions({ input: { id } }),
  );

  const { data: favorites } = useQuery({
    ...orpc.favorites.list.queryOptions(),
    enabled: !!session?.user,
  });

  const isFavorited = favorites?.items.some(
    (f) => f.targetType === "laureate" && f.targetId === id,
  );
  const favId = favorites?.items.find(
    (f) => f.targetType === "laureate" && f.targetId === id,
  )?.id;

  const addFav = useMutation({
    mutationFn: () => client.favorites.add({ targetType: "laureate", targetId: id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });
  const removeFav = useMutation({
    mutationFn: (favId: string) => client.favorites.remove({ id: favId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const handleFavorite = () => {
    if (!session?.user) {
      navigate({ to: "/login" });
      return;
    }
    if (isFavorited && favId) {
      removeFav.mutate(favId);
    } else {
      addFav.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted w-48" />
          <div className="h-10 bg-muted w-80" />
          <div className="h-40 bg-muted w-full" />
        </div>
      </div>
    );
  }

  if (!laureate) {
    return (
      <div className="mx-auto max-w-[1280px] px-8 py-12 text-center text-muted-foreground">
        Laureate not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-12 max-md:px-5">
      {/* パンくず */}
      <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
        <Link to="/laureates" className="hover:text-foreground transition-colors">
          Laureates
        </Link>
        <span>›</span>
        <span className="text-foreground">{laureate.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
        {/* サイドバー */}
        <aside className="space-y-6">
          {/* 肖像写真 */}
          <div className="aspect-[3/4] bg-muted overflow-hidden">
            {laureate.imageUrl ? (
              <img
                src={laureate.imageUrl}
                alt={laureate.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-serif text-6xl text-muted-foreground">
                  {laureate.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* メタデータ */}
          <dl className="space-y-3 text-sm">
            {laureate.nationality && (
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                  Nationality
                </dt>
                <dd className="mt-0.5 text-foreground">{laureate.nationality}</dd>
              </div>
            )}
            {laureate.birthDate && (
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                  Born
                </dt>
                <dd className="mt-0.5 text-foreground">{laureate.birthDate}</dd>
              </div>
            )}
            {laureate.deathDate && (
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                  Died
                </dt>
                <dd className="mt-0.5 text-foreground">{laureate.deathDate}</dd>
              </div>
            )}
          </dl>

          {/* お気に入りボタン */}
          <button
            type="button"
            onClick={handleFavorite}
            disabled={addFav.isPending || removeFav.isPending}
            className={`flex w-full items-center justify-center gap-2 border px-4 py-3 text-sm font-medium transition-colors ${
              isFavorited
                ? "border-gold bg-[#ffd07d22] text-gold"
                : "border-border hover:border-gold hover:text-gold"
            } disabled:opacity-50`}
          >
            {isFavorited ? (
              <>
                <BookmarkCheck size={16} />
                Saved
              </>
            ) : (
              <>
                <Bookmark size={16} />
                Save to Collection
              </>
            )}
          </button>
        </aside>

        {/* メインコンテンツ */}
        <div className="space-y-10">
          {/* 氏名・部門 */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {laureate.prizes.map((p) => (
                <MetadataChip
                  key={p.id}
                  label={`${CATEGORY_LABEL[p.category] ?? p.category} ${p.year}`}
                />
              ))}
            </div>
            <h1 className="font-serif text-[40px] leading-[48px] text-foreground">
              {laureate.name}
            </h1>
            {laureate.nameJa && (
              <p className="mt-1 text-lg text-muted-foreground">{laureate.nameJa}</p>
            )}
          </div>

          {/* 略歴 */}
          {laureate.biography && (
            <section>
              <h2 className="font-serif text-[24px] leading-[32px] mb-4 text-foreground">
                Biography
              </h2>
              <p className="text-[18px] leading-[28px] text-muted-foreground">
                {laureate.biography}
              </p>
            </section>
          )}

          {/* 受賞歴タイムライン */}
          {laureate.prizes.length > 0 && (
            <section>
              <h2 className="font-serif text-[24px] leading-[32px] mb-6 text-foreground">
                Nobel Prize Awards
              </h2>
              <div className="relative pl-6 border-l-2 border-[#ffd07d] space-y-8">
                {laureate.prizes.map((prize) => (
                  <div key={prize.id} className="relative">
                    {/* タイムラインノード */}
                    <div className="absolute -left-[25px] top-1 h-3 w-3 rounded-full bg-[#7a580f]" />
                    <Link
                      to="/prizes/$id"
                      params={{ id: prize.id }}
                      className="group"
                    >
                      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gold">
                        {prize.year} · {CATEGORY_LABEL[prize.category] ?? prize.category}
                      </p>
                      {prize.motivation && (
                        <p className="mt-1 text-[16px] leading-[24px] text-muted-foreground group-hover:text-foreground transition-colors">
                          {prize.motivation}
                        </p>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
