import { cn } from "@better-t-app/ui/lib/utils";

interface MetadataChipProps {
  label: string;
  className?: string;
}

export function MetadataChip({ label, className }: MetadataChipProps) {
  return (
    <span
      className={cn(
        "inline-block bg-muted px-2 py-0.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
