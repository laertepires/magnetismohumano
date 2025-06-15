import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-border bg-background fixed">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="text-xl font-bold">
            <Link href="/" className="text-primary hover:text-primary/80">
              Magnetismo Humano
            </Link>
        </div>

        <div className="flex items-center gap-4">

          <Button variant="ghost">
            <Link href="/cadastre-se">Cadastre-se</Link>
          </Button>

          <Button>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
