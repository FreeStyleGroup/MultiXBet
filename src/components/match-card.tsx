"use client";

import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { PredictionBadge } from "@/components/prediction-badge";
import { GlowingCard } from "@/components/glowing-card";
import type { Match } from "@/lib/types";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const time = new Date(match.startTime).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const bestOdd = Math.min(
    match.homeOdd ?? 99,
    match.drawOdd ?? 99,
    match.awayOdd ?? 99
  );
  const bestProb = bestOdd > 1 ? 1 / bestOdd : 0;

  return (
    <Link href={`/match/${match.id}`}>
      <GlowingCard
        spread={30}
        proximity={48}
        borderWidth={1}
        className="transition-transform hover:scale-[1.01]"
      >
        <CardContent className="flex items-center gap-4 py-3 px-4">
          <div className="text-sm font-mono text-muted-foreground w-12 shrink-0 text-center">
            {time}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{match.homeTeam}</p>
            <p className="text-sm text-muted-foreground truncate">
              {match.awayTeam}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="grid grid-cols-3 gap-1 text-center">
              <OddCell label="1" value={match.homeOdd} />
              <OddCell label="X" value={match.drawOdd} />
              <OddCell label="2" value={match.awayOdd} />
            </div>
            {bestProb > 0 && <PredictionBadge probability={bestProb} />}
          </div>
        </CardContent>
      </GlowingCard>
    </Link>
  );
}

function OddCell({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="w-12">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xs font-mono">{value ? value.toFixed(2) : "—"}</p>
    </div>
  );
}
