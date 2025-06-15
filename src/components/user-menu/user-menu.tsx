import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-white">
          iamlaerte
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-neutral-900 text-white"
      >
        <DropdownMenuLabel className="text-white">iamlaerte</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/novo-conteudo" className="w-full">
            + Novo conteúdo
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/meus-conteudos" className="w-full">
            📄 Meus conteúdos
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/editar-perfil" className="w-full">
            ⚙️ Editar perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500 cursor-pointer">
            Deslogar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
