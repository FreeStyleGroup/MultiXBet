import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PredictionBadgeProps {
  probability: number;
  label?: string;
  size?: "sm" | "md";
}

export function PredictionBadge({
  probability,
  label,
  size = "sm",
}: PredictionBadgeProps) {
  const percent = Math.round(probability * 100);

  const colorClass =
    percent >= 70
      ? "bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
      : percent >= 55
        ? "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
        : "bg-red-600/20 text-red-400 border-red-600/30";

  return (
    <Badge
      variant="outline"
      className={cn(
        colorClass,
        size === "md" && "px-3 py-1 text-sm",
        size === "sm" && "px-2 py-0.5 text-xs"
      )}
    >
      {label && <span className="mr-1">{label}</span>}
      {percent}%
    </Badge>
  );
}
