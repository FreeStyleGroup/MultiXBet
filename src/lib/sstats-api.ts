import { SSTATS_API_URL, SSTATS_API_KEY, CACHE_REVALIDATE_SECONDS } from "@/config/constants";
import type {
  Match,
  MatchDetail,
  GlickoPrediction,
  BookmakerOdds,
  Injury,
  LastGamesStats,
} from "./types";

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  ...(SSTATS_API_KEY ? { Authorization: `Bearer ${SSTATS_API_KEY}` } : {}),
};

async function fetchApi<T>(
  path: string,
  params?: Record<string, string>,
  revalidate = CACHE_REVALIDATE_SECONDS
): Promise<T> {
  const url = new URL(path, SSTATS_API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`SStats API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRawMatch(raw: any): Match {
  // Extract 1X2 odds from the odds array
  let homeOdd: number | null = null;
  let drawOdd: number | null = null;
  let awayOdd: number | null = null;

  if (Array.isArray(raw.odds)) {
    // Market ID 1 is typically 1X2
    const market1x2 = raw.odds.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: any) => m.marketId === 1 || (m.marketName && m.marketName.includes("1X2"))
    );
    if (market1x2?.odds) {
      for (const odd of market1x2.odds) {
        const name = (odd.name || "").toLowerCase();
        if (name === "home" || name === "1") homeOdd = odd.value;
        else if (name === "draw" || name === "x") drawOdd = odd.value;
        else if (name === "away" || name === "2") awayOdd = odd.value;
      }
    }
  }

  return {
    id: raw.id,
    homeTeam: raw.homeTeam?.name ?? "Unknown",
    awayTeam: raw.awayTeam?.name ?? "Unknown",
    homeTeamId: raw.homeTeam?.id ?? 0,
    awayTeamId: raw.awayTeam?.id ?? 0,
    homeScore: raw.homeResult ?? null,
    awayScore: raw.awayResult ?? null,
    status: raw.status ?? 0,
    statusText: raw.statusName ?? "",
    startTime: raw.date ?? "",
    league: raw.season?.league?.name ?? "",
    leagueId: raw.season?.league?.id ?? 0,
    country: raw.season?.league?.country?.name ?? "",
    season: raw.season?.year ? String(raw.season.year) : "",
    round: raw.roundName ?? "",
    venue: raw.venue ?? "",
    homeOdd,
    drawOdd,
    awayOdd,
  };
}

// Get today's matches
export async function getTodayMatches(): Promise<Match[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>("/Games/list", {
    today: "true",
  });
  const rawList = response.data ?? response ?? [];
  if (!Array.isArray(rawList)) return [];
  return rawList.map(mapRawMatch);
}

// Get upcoming matches
export async function getUpcomingMatches(): Promise<Match[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>("/Games/list", {
    today: "true",
    upcoming: "true",
  });
  const rawList = response.data ?? response ?? [];
  if (!Array.isArray(rawList)) return [];
  return rawList.map(mapRawMatch);
}

// Get full match details
export async function getMatchDetail(id: string): Promise<MatchDetail> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>(`/Games/${id}`);
  const raw = response.data ?? response;
  const base = mapRawMatch(raw);

  return {
    ...base,
    homeLineup: Array.isArray(raw.homeLineup) ? raw.homeLineup : [],
    awayLineup: Array.isArray(raw.awayLineup) ? raw.awayLineup : [],
    homeFormation: raw.homeFormation ?? "",
    awayFormation: raw.awayFormation ?? "",
    events: Array.isArray(raw.events) ? raw.events : [],
    statistics: Array.isArray(raw.statistics) ? raw.statistics : [],
    referee: typeof raw.referee === "string" ? raw.referee : raw.referee?.name ?? "",
  };
}

// Get Glicko 2 predictions
export async function getGlickoPrediction(
  id: string
): Promise<GlickoPrediction> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>(
    `/Games/glicko/${id}`,
    undefined,
    600
  );
  const raw = response.data ?? response;

  return {
    fixture: mapRawMatch(raw.fixture ?? raw),
    glicko: {
      homeRating: raw.glicko?.homeRating ?? raw.homeRating ?? 0,
      homeRd: raw.glicko?.homeRd ?? raw.homeRd ?? 0,
      awayRating: raw.glicko?.awayRating ?? raw.awayRating ?? 0,
      awayRd: raw.glicko?.awayRd ?? raw.awayRd ?? 0,
      homeXg: raw.glicko?.homeXg ?? raw.homeXg ?? 0,
      awayXg: raw.glicko?.awayXg ?? raw.awayXg ?? 0,
      homeWinProbability: raw.glicko?.homeWinProbability ?? raw.homeWinProbability ?? 0,
      awayWinProbability: raw.glicko?.awayWinProbability ?? raw.awayWinProbability ?? 0,
      homeVolatility: raw.glicko?.homeVolatility ?? raw.homeVolatility ?? 0,
      awayVolatility: raw.glicko?.awayVolatility ?? raw.awayVolatility ?? 0,
      updated: raw.glicko?.updated ?? raw.updated ?? "",
    },
  };
}

// Get odds for a match
export async function getMatchOdds(
  gameId: string
): Promise<BookmakerOdds[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>(
    `/Odds/${gameId}`
  );
  const rawList = response.data ?? response ?? [];
  if (!Array.isArray(rawList)) return [];
  return rawList;
}

// Get injuries for a match
export async function getMatchInjuries(gameId: string): Promise<Injury[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>("/Games/injuries", {
    gameId,
  });
  const rawList = response.data ?? response ?? [];
  if (!Array.isArray(rawList)) return [];
  return rawList;
}

// Get last games stats
export async function getLastGamesStats(
  gameId: string,
  limit = 10
): Promise<LastGamesStats> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>(
    "/Games/last-games-stats",
    {
      gameId,
      limit: String(limit),
    }
  );
  return response.data ?? response;
}

// Get text summary
export async function getTextSummary(gameId: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await fetchApi<any>("/Games/text-summary", {
    id: gameId,
    limit: "25",
  });
  return response.data ?? "";
}

// Batch: get glicko for multiple matches (for express building)
export async function getGlickoPredictions(
  ids: string[]
): Promise<Map<string, GlickoPrediction>> {
  const results = new Map<string, GlickoPrediction>();
  const promises = ids.map(async (id) => {
    try {
      const prediction = await getGlickoPrediction(id);
      results.set(id, prediction);
    } catch {
      // skip matches without predictions
    }
  });
  await Promise.all(promises);
  return results;
}
