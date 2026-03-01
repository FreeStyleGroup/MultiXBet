"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MatchDetail } from "@/lib/types";

interface LineupsProps {
  matchId: string;
}

export function Lineups({ matchId }: LineupsProps) {
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLineups() {
      try {
        const res = await fetch(`/api/matches/${matchId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMatch(data.data);
      } catch {
        console.error("Failed to load lineups");
      } finally {
        setLoading(false);
      }
    }
    fetchLineups();
  }, [matchId]);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!match) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-muted-foreground text-sm">
            Составы пока недоступны
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasLineups =
    (match.homeLineup?.length ?? 0) > 0 ||
    (match.awayLineup?.length ?? 0) > 0;

  if (!hasLineups) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-muted-foreground text-sm">
            Составы ещё не объявлены
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            {match.homeTeam}
            {match.homeFormation && (
              <span className="ml-2 text-muted-foreground font-normal">
                ({match.homeFormation})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {match.homeLineup?.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-accent/50"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs text-muted-foreground font-mono">
                    {player.number}
                  </span>
                  <span>{player.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {player.position}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            {match.awayTeam}
            {match.awayFormation && (
              <span className="ml-2 text-muted-foreground font-normal">
                ({match.awayFormation})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {match.awayLineup?.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-accent/50"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs text-muted-foreground font-mono">
                    {player.number}
                  </span>
                  <span>{player.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {player.position}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
