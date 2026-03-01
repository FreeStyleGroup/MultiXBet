import type { LastGamesStats } from "@/lib/types";

interface TeamStatsProps {
  stats: LastGamesStats;
}

export function TeamStats({ stats }: TeamStatsProps) {
  const { homeTeam, awayTeam } = stats;

  const rows = [
    { label: "Матчей", home: homeTeam.games, away: awayTeam.games },
    { label: "Победы", home: homeTeam.wins, away: awayTeam.wins },
    { label: "Ничьи", home: homeTeam.draws, away: awayTeam.draws },
    { label: "Поражения", home: homeTeam.losses, away: awayTeam.losses },
    {
      label: "Голы забиты",
      home: homeTeam.goalsScored,
      away: awayTeam.goalsScored,
    },
    {
      label: "Голы пропущены",
      home: homeTeam.goalsConceded,
      away: awayTeam.goalsConceded,
    },
    {
      label: "Ср. голы забиты",
      home: homeTeam.avgGoalsScored.toFixed(1),
      away: awayTeam.avgGoalsScored.toFixed(1),
    },
    {
      label: "Ср. голы пропущены",
      home: homeTeam.avgGoalsConceded.toFixed(1),
      away: awayTeam.avgGoalsConceded.toFixed(1),
    },
    {
      label: "Ср. владение (%)",
      home: homeTeam.avgPossession.toFixed(0),
      away: awayTeam.avgPossession.toFixed(0),
    },
    {
      label: "Ср. удары",
      home: homeTeam.avgShots.toFixed(1),
      away: awayTeam.avgShots.toFixed(1),
    },
    {
      label: "Ср. в створ",
      home: homeTeam.avgShotsOnTarget.toFixed(1),
      away: awayTeam.avgShotsOnTarget.toFixed(1),
    },
    {
      label: "Ср. угловые",
      home: homeTeam.avgCorners.toFixed(1),
      away: awayTeam.avgCorners.toFixed(1),
    },
    {
      label: "Сухие матчи",
      home: homeTeam.cleanSheets,
      away: awayTeam.cleanSheets,
    },
    { label: "Обе забьют", home: homeTeam.bttsCount, away: awayTeam.bttsCount },
    {
      label: "Тотал > 2.5",
      home: homeTeam.over25Count,
      away: awayTeam.over25Count,
    },
  ];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground px-2 pb-2 font-semibold">
        <span className="text-left">{homeTeam.team}</span>
        <span className="text-center">Показатель</span>
        <span className="text-right">{awayTeam.team}</span>
      </div>

      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-3 gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
        >
          <span className="text-left font-mono">{row.home}</span>
          <span className="text-center text-xs text-muted-foreground">
            {row.label}
          </span>
          <span className="text-right font-mono">{row.away}</span>
        </div>
      ))}
    </div>
  );
}
