import { SSTATS_API_URL, SSTATS_API_KEY, CACHE_REVALIDATE_SECONDS } from "@/config/constants";
import type {
  ApiResponse,
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

// Get today's matches
export async function getTodayMatches(): Promise<Match[]> {
  const response = await fetchApi<ApiResponse<Match[]>>("/Games/list", {
    today: "true",
  });
  return response.data ?? [];
}

// Get upcoming matches
export async function getUpcomingMatches(): Promise<Match[]> {
  const response = await fetchApi<ApiResponse<Match[]>>("/Games/list", {
    today: "true",
    upcoming: "true",
  });
  return response.data ?? [];
}

// Get full match details
export async function getMatchDetail(id: string): Promise<MatchDetail> {
  const response = await fetchApi<ApiResponse<MatchDetail>>(`/Games/${id}`);
  return response.data;
}

// Get Glicko 2 predictions
export async function getGlickoPrediction(
  id: string
): Promise<GlickoPrediction> {
  const response = await fetchApi<ApiResponse<GlickoPrediction>>(
    `/Games/glicko/${id}`,
    undefined,
    600 // cache 10 min for predictions
  );
  return response.data;
}

// Get odds for a match
export async function getMatchOdds(
  gameId: string
): Promise<BookmakerOdds[]> {
  const response = await fetchApi<ApiResponse<BookmakerOdds[]>>(
    `/Odds/${gameId}`
  );
  return response.data ?? [];
}

// Get injuries for a match
export async function getMatchInjuries(gameId: string): Promise<Injury[]> {
  const response = await fetchApi<ApiResponse<Injury[]>>("/Games/injuries", {
    gameId,
  });
  return response.data ?? [];
}

// Get last games stats
export async function getLastGamesStats(
  gameId: string,
  limit = 10
): Promise<LastGamesStats> {
  const response = await fetchApi<ApiResponse<LastGamesStats>>(
    "/Games/last-games-stats",
    {
      gameId,
      limit: String(limit),
    }
  );
  return response.data;
}

// Get text summary
export async function getTextSummary(gameId: string): Promise<string> {
  const response = await fetchApi<ApiResponse<string>>("/Games/text-summary", {
    id: gameId,
    limit: "25",
  });
  return response.data;
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
