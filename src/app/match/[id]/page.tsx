import { getMatchDetail } from "@/lib/sstats-api";
import { MatchDetail } from "@/components/match-detail";
import Link from "next/link";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;

  let match;
  try {
    match = await getMatchDetail(id);
  } catch {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Матч не найден</p>
        <Link href="/" className="text-sm text-emerald-400 hover:underline mt-2 inline-block">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; Назад к матчам
      </Link>
      <MatchDetail matchId={id} match={match} />
    </div>
  );
}
