import type { GlickoPrediction, Match, MatchPrediction } from "./types";

/**
 * Calculate implied probability from decimal odds.
 * E.g., odds 2.0 → 50%, odds 1.5 → 66.7%
 */
export function impliedProbability(odds: number): number {
  if (odds <= 1) return 1;
  return 1 / odds;
}

/**
 * Calculate value: how much the real probability exceeds the bookmaker's implied probability.
 * Positive value = the bet has value (edge over bookmaker).
 */
export function calculateValue(
  realProbability: number,
  odds: number
): number {
  const implied = impliedProbability(odds);
  return realProbability - implied;
}

/**
 * Calculate confidence score (0-1) combining probability and value.
 * Higher probability + positive value = higher confidence.
 */
export function calculateConfidence(
  probability: number,
  value: number
): number {
  // Base confidence is the probability itself
  // Boost by value (capped at +0.15 bonus)
  const valueBonus = Math.max(0, Math.min(value * 0.5, 0.15));
  return Math.min(probability + valueBonus, 0.99);
}

/**
 * Build a prediction for a match using Glicko 2 data and odds.
 */
export function buildMatchPrediction(
  match: Match,
  glicko: GlickoPrediction
): MatchPrediction {
  const homeWin = glicko.glicko.homeWinProbability;
  const awayWin = glicko.glicko.awayWinProbability;
  const draw = Math.max(0, 1 - homeWin - awayWin);

  // Determine best bet
  const outcomes: Array<{
    bet: "1" | "X" | "2";
    probability: number;
    odds: number;
  }> = [
    { bet: "1", probability: homeWin, odds: match.homeOdd ?? 0 },
    { bet: "X", probability: draw, odds: match.drawOdd ?? 0 },
    { bet: "2", probability: awayWin, odds: match.awayOdd ?? 0 },
  ];

  // Find the outcome with the best value (probability vs odds)
  let bestOutcome = outcomes[0];
  let bestValue = -Infinity;

  for (const outcome of outcomes) {
    if (outcome.odds <= 1) continue;
    const value = calculateValue(outcome.probability, outcome.odds);
    if (value > bestValue) {
      bestValue = value;
      bestOutcome = outcome;
    }
  }

  const value = bestOutcome.odds > 1
    ? calculateValue(bestOutcome.probability, bestOutcome.odds)
    : 0;

  const confidence = calculateConfidence(bestOutcome.probability, value);

  return {
    matchId: match.id,
    homeWin,
    draw,
    awayWin,
    bestBet: bestOutcome.bet,
    bestBetProbability: bestOutcome.probability,
    bestBetOdds: bestOutcome.odds,
    value,
    confidence,
    homeXg: glicko.glicko.homeXg,
    awayXg: glicko.glicko.awayXg,
  };
}

/**
 * Format prediction label.
 */
export function predictionLabel(bet: "1" | "X" | "2"): string {
  switch (bet) {
    case "1":
      return "Победа хозяев";
    case "X":
      return "Ничья";
    case "2":
      return "Победа гостей";
  }
}
