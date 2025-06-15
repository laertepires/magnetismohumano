import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground mb-6">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>

      <Button className="text-white hover:text-white">
        <Link href="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
}
