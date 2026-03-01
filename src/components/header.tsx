import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            MX
          </div>
          <span className="text-lg font-bold tracking-tight">MultiXBet</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Матчи
          </Link>
        </nav>
      </div>
    </header>
  );
}
