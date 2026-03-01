import { Badge } from "@/components/ui/badge";
import type { Injury } from "@/lib/types";

interface InjuriesListProps {
  injuries: Injury[];
}

export function InjuriesList({ injuries }: InjuriesListProps) {
  if (injuries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Нет данных о травмах</p>
    );
  }

  return (
    <div className="space-y-1">
      {injuries.map((injury, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/50"
        >
          <div>
            <p className="text-sm font-medium">{injury.player}</p>
            <p className="text-xs text-muted-foreground">{injury.team}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-red-600/20 text-red-400 border-red-600/30 text-xs"
            >
              {injury.type || injury.reason}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
