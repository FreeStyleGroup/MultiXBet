import type { Match, Express, ExpressEvent } from "./types";
import { getGlickoPredictions } from "./sstats-api";
import { buildMatchPrediction, predictionLabel } from "./predictions";
import {
  EXPRESS_MIN_EVENTS,
  EXPRESS_MAX_EVENTS,
  MIN_CONFIDENCE_THRESHOLD,
} from "@/config/constants";

/**
 * Build an express (accumulator) from today's matches.
 *
 * Algorithm:
 * 1. Get Glicko 2 predictions for all matches
 * 2. Build predictions with value analysis
 * 3. Filter by minimum confidence threshold
 * 4. Sort by confidence (descending)
 * 5. Take top 5-7 events
 * 6. Calculate total odds
 */
export async function buildExpress(matches: Match[]): Promise<Express> {
  if (matches.length === 0) {
    return {
      events: [],
      totalOdds: 0,
      avgConfidence: 0,
      createdAt: new Date().toISOString(),
    };
  }

  // Get predictions for all matches
  const matchIds = matches.map((m) => String(m.id));
  const predictions = await getGlickoPredictions(matchIds);

  // Build scored events
  const events: ExpressEvent[] = [];

  for (const match of matches) {
    const glicko = predictions.get(String(match.id));
    if (!glicko) continue;

    const prediction = buildMatchPrediction(match, glicko);

    // Skip low confidence or missing odds
    if (prediction.confidence < MIN_CONFIDENCE_THRESHOLD) continue;
    if (prediction.bestBetOdds <= 1) continue;

    events.push({
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      startTime: match.startTime,
      prediction: prediction.bestBet,
      predictionLabel: predictionLabel(prediction.bestBet),
      probability: prediction.bestBetProbability,
      odds: prediction.bestBetOdds,
      confidence: prediction.confidence,
      value: prediction.value,
    });
  }

  // Sort by confidence (highest first)
  events.sort((a, b) => b.confidence - a.confidence);

  // Take top events (5-7)
  const maxEvents = Math.min(events.length, EXPRESS_MAX_EVENTS);
  const selectedEvents = events.slice(
    0,
    Math.max(Math.min(maxEvents, EXPRESS_MAX_EVENTS), EXPRESS_MIN_EVENTS)
  );

  // Calculate total odds (product)
  const totalOdds = selectedEvents.reduce((acc, e) => acc * e.odds, 1);

  // Average confidence
  const avgConfidence =
    selectedEvents.length > 0
      ? selectedEvents.reduce((acc, e) => acc + e.confidence, 0) /
        selectedEvents.length
      : 0;

  return {
    events: selectedEvents,
    totalOdds: Math.round(totalOdds * 100) / 100,
    avgConfidence: Math.round(avgConfidence * 100) / 100,
    createdAt: new Date().toISOString(),
  };
}
