"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchCard } from "@/components/match-card";
import type { Match } from "@/lib/types";

export function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("/api/matches");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMatches(data.data ?? []);
      } catch {
        console.error("Failed to load matches");
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Нет матчей на сегодня
      </p>
    );
  }

  // Group by league
  const grouped = matches.reduce<Record<string, Match[]>>((acc, match) => {
    const key = `${match.country} — ${match.league}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([league, leagueMatches]) => (
        <div key={league}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
            {league}
          </h3>
          <div className="space-y-1">
            {leagueMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
