import { Link } from "@tanstack/react-router";

interface PrizeSummary {
  year: number;
  category: string;
}

interface GalleryCardProps {
  id: string;
  name: string;
  nationality?: string | null;
  imageUrl?: string | null;
  prizes: PrizeSummary[];
}

const CATEGORY_LABEL: Record<string, string> = {
  physics: "PHYSICS",
  chemistry: "CHEMISTRY",
  medicine: "MEDICINE",
  literature: "LITERATURE",
  peace: "PEACE",
  economics: "ECONOMICS",
};

export function GalleryCard({ id, name, nationality, imageUrl, prizes }: GalleryCardProps) {
  const firstPrize = prizes[0];

  return (
    <Link
      to="/laureates/$id"
      params={{ id }}
      className="group block border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(122,88,15,0.15)]"
    >
      {/* 肖像写真エリア */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="font-serif text-4xl text-muted-foreground select-none">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* カード情報 */}
      <div className="p-4 space-y-1">
        {/* 部門ラベル */}
        {firstPrize && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.1em] text-gold uppercase">
              {CATEGORY_LABEL[firstPrize.category] ?? firstPrize.category.toUpperCase()}
            </span>
            <span className="text-[11px] font-semibold tracking-[0.1em] text-gold">
              {firstPrize.year}
            </span>
          </div>
        )}

        {/* 氏名 */}
        <h3 className="font-serif text-xl leading-snug text-foreground">
          {name}
        </h3>

        {/* 国籍 */}
        {nationality && (
          <p className="text-[13px] text-muted-foreground">{nationality}</p>
        )}
      </div>
    </Link>
  );
}
