"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PredictionBadge } from "@/components/prediction-badge";
import { TeamStats } from "@/components/team-stats";
import { InjuriesList } from "@/components/injuries-list";
import { Lineups } from "@/components/lineups";
import type {
  Match,
  GlickoPrediction,
  LastGamesStats,
  Injury,
  BookmakerOdds,
} from "@/lib/types";

interface MatchDetailProps {
  matchId: string;
  match: Match;
}

interface StatsData {
  glicko: GlickoPrediction | null;
  stats: LastGamesStats | null;
  summary: string | null;
  injuries: Injury[] | null;
}

export function MatchDetail({ matchId, match }: MatchDetailProps) {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [odds, setOdds] = useState<BookmakerOdds[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, oddsRes] = await Promise.allSettled([
          fetch(`/api/stats/${matchId}`).then((r) => r.json()),
          fetch(`/api/odds/${matchId}`).then((r) => r.json()),
        ]);

        if (statsRes.status === "fulfilled") {
          setStatsData(statsRes.value.data);
        }
        if (oddsRes.status === "fulfilled") {
          setOdds(oddsRes.value.data);
        }
      } catch {
        console.error("Failed to load match data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [matchId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const glicko = statsData?.glicko;
  const drawProb = glicko
    ? Math.max(
        0,
        1 -
          glicko.glicko.homeWinProbability -
          glicko.glicko.awayWinProbability
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Match header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-lg font-bold">{match.homeTeam}</p>
              {glicko && (
                <p className="text-xs text-muted-foreground mt-1">
                  Rating: {Math.round(glicko.glicko.homeRating)}
                </p>
              )}
            </div>
            <div className="text-center px-6">
              <p className="text-xs text-muted-foreground mb-1">
                {match.league}
              </p>
              <p className="text-2xl font-bold font-mono">
                {match.homeScore ?? "—"} : {match.awayScore ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(match.startTime).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold">{match.awayTeam}</p>
              {glicko && (
                <p className="text-xs text-muted-foreground mt-1">
                  Rating: {Math.round(glicko.glicko.awayRating)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="prediction">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="prediction">Прогноз</TabsTrigger>
          <TabsTrigger value="stats">Статистика</TabsTrigger>
          <TabsTrigger value="analysis">Анализ</TabsTrigger>
          <TabsTrigger value="lineups">Составы</TabsTrigger>
          <TabsTrigger value="odds">Коэфф.</TabsTrigger>
        </TabsList>

        {/* Prediction tab */}
        <TabsContent value="prediction">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Прогноз (Glicko 2 + xG)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {glicko ? (
                <>
                  <div className="space-y-3">
                    <ProbabilityBar
                      label={`Победа ${match.homeTeam}`}
                      probability={glicko.glicko.homeWinProbability}
                      type="1"
                    />
                    <ProbabilityBar
                      label="Ничья"
                      probability={drawProb}
                      type="X"
                    />
                    <ProbabilityBar
                      label={`Победа ${match.awayTeam}`}
                      probability={glicko.glicko.awayWinProbability}
                      type="2"
                    />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">xG хозяев</p>
                      <p className="text-xl font-bold font-mono text-emerald-400">
                        {glicko.glicko.homeXg.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">xG гостей</p>
                      <p className="text-xl font-bold font-mono text-emerald-400">
                        {glicko.glicko.awayXg.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Данные Glicko 2 недоступны для этого матча
                </p>
              )}
            </CardContent>
          </Card>

          {/* Injuries */}
          {statsData?.injuries && statsData.injuries.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Травмы и дисквалификации</CardTitle>
              </CardHeader>
              <CardContent>
                <InjuriesList injuries={statsData.injuries} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Stats tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Статистика последних матчей
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsData?.stats ? (
                <TeamStats stats={statsData.stats} />
              ) : (
                <p className="text-muted-foreground text-sm">
                  Статистика недоступна
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis tab */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Текстовый анализ</CardTitle>
            </CardHeader>
            <CardContent>
              {statsData?.summary ? (
                <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-sm">
                  {statsData.summary}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Анализ недоступен
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lineups tab */}
        <TabsContent value="lineups">
          <Lineups matchId={matchId} />
        </TabsContent>

        {/* Odds tab */}
        <TabsContent value="odds">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Коэффициенты букмекеров (1X2)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {odds && odds.length > 0 ? (
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground px-2 pb-2">
                    <span>Букмекер</span>
                    <span className="text-center">1</span>
                    <span className="text-center">X</span>
                    <span className="text-center">2</span>
                  </div>
                  {odds.map((bm) => {
                    const market1x2 = bm.markets?.find(
                      (m) =>
                        m.name?.toLowerCase().includes("1x2") ||
                        m.name?.toLowerCase().includes("result")
                    );
                    if (!market1x2) return null;
                    return (
                      <div
                        key={bm.bookmakerId}
                        className="grid grid-cols-4 gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
                      >
                        <span className="truncate">{bm.bookmaker}</span>
                        {market1x2.values.slice(0, 3).map((v, i) => (
                          <span
                            key={i}
                            className="text-center font-mono text-xs"
                          >
                            {v.value.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Коэффициенты недоступны
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProbabilityBar({
  label,
  probability,
  type,
}: {
  label: string;
  probability: number;
  type: "1" | "X" | "2";
}) {
  const percent = Math.round(probability * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
          <PredictionBadge probability={probability} size="md" />
        </div>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
