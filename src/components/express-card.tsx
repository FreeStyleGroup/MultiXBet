"use client";

import { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PredictionBadge } from "@/components/prediction-badge";
import { GlowingCard } from "@/components/glowing-card";
import type { Express } from "@/lib/types";

export function ExpressCard() {
  const [express, setExpress] = useState<Express | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExpress() {
      try {
        const res = await fetch("/api/predictions");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExpress(data.data);
      } catch {
        setError("Не удалось загрузить экспресс");
      } finally {
        setLoading(false);
      }
    }
    fetchExpress();
  }, []);

  if (loading) {
    return (
      <GlowingCard spread={60} proximity={80} borderWidth={2}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </GlowingCard>
    );
  }

  if (error || !express || express.events.length === 0) {
    return (
      <GlowingCard>
        <CardHeader>
          <CardTitle className="text-lg">Экспресс дня</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || "Нет подходящих событий для экспресса сегодня"}
          </p>
        </CardContent>
      </GlowingCard>
    );
  }

  return (
    <GlowingCard spread={60} proximity={80} borderWidth={2}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-950/30 to-transparent pointer-events-none" />
      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Экспресс дня</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-600/30 bg-emerald-600/20 text-emerald-400"
            >
              {express.events.length} событий
            </Badge>
            <Badge className="bg-emerald-600 text-white">
              x{express.totalOdds.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-0 relative">
        {express.events.map((event, index) => (
          <div key={event.matchId}>
            {index > 0 && <Separator className="my-2" />}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground truncate">
                    {event.league}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.startTime).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm font-medium truncate">
                  {event.homeTeam} — {event.awayTeam}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {event.predictionLabel}
                  </p>
                  <p className="text-sm font-mono font-semibold text-emerald-400">
                    {event.odds.toFixed(2)}
                  </p>
                </div>
                <PredictionBadge probability={event.confidence} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </GlowingCard>
  );
}
