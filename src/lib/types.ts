// SStats API response wrapper
export interface ApiResponse<T> {
  status: number;
  data: T;
  count: number;
  offset: number;
  totalCount: number;
}

// Match (game) from /Games/list
export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number | null;
  awayScore: number | null;
  status: number;
  statusText: string;
  startTime: string;
  league: string;
  leagueId: number;
  country: string;
  season: string;
  round: string;
  venue: string;
  homeOdd: number | null;
  drawOdd: number | null;
  awayOdd: number | null;
}

// Full match details from /Games/{id}
export interface MatchDetail extends Match {
  homeLineup: Player[];
  awayLineup: Player[];
  homeFormation: string;
  awayFormation: string;
  events: MatchEvent[];
  statistics: MatchStatistic[];
  referee: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  rating: number | null;
}

export interface MatchEvent {
  minute: number;
  type: string;
  team: "home" | "away";
  player: string;
  assistPlayer: string | null;
  detail: string;
}

export interface MatchStatistic {
  name: string;
  homeValue: string;
  awayValue: string;
}

// Glicko 2 prediction from /Games/glicko/{id}
export interface GlickoPrediction {
  fixture: Match;
  glicko: {
    homeRating: number;
    homeRd: number;
    awayRating: number;
    awayRd: number;
    homeXg: number;
    awayXg: number;
    homeWinProbability: number;
    awayWinProbability: number;
    homeVolatility: number;
    awayVolatility: number;
    updated: string;
  };
}

// Odds from /Odds/{gameId}
export interface BookmakerOdds {
  bookmaker: string;
  bookmakerId: number;
  markets: OddsMarket[];
}

export interface OddsMarket {
  name: string;
  values: OddsValue[];
}

export interface OddsValue {
  name: string;
  value: number;
  handicap?: string;
}

// Injury from /Games/injuries
export interface Injury {
  player: string;
  playerId: number;
  team: string;
  teamId: number;
  type: string;
  reason: string;
  date: string;
}

// Last games stats from /Games/last-games-stats
export interface LastGamesStats {
  homeTeam: TeamStats;
  awayTeam: TeamStats;
}

export interface TeamStats {
  team: string;
  teamId: number;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  avgGoalsScored: number;
  avgGoalsConceded: number;
  avgPossession: number;
  avgShots: number;
  avgShotsOnTarget: number;
  avgCorners: number;
  avgFouls: number;
  avgYellowCards: number;
  cleanSheets: number;
  bttsCount: number;
  over25Count: number;
  over15Count: number;
}

// Express (accumulator) types
export interface ExpressEvent {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  prediction: "1" | "X" | "2";
  predictionLabel: string;
  probability: number;
  odds: number;
  confidence: number;
  value: number;
}

export interface Express {
  events: ExpressEvent[];
  totalOdds: number;
  avgConfidence: number;
  createdAt: string;
}

// Prediction for a single match
export interface MatchPrediction {
  matchId: number;
  homeWin: number;
  draw: number;
  awayWin: number;
  bestBet: "1" | "X" | "2";
  bestBetProbability: number;
  bestBetOdds: number;
  value: number;
  confidence: number;
  homeXg: number;
  awayXg: number;
}
