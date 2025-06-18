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

export function Header() {
  const ifLogged = false; // 🔥 Troque para false para testar o estado não logado

  return (
    <header className="w-full border-b border-border bg-neutral-900 text-white fixed z-50 left-0">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-neutral-300">
            Magnetismo Humano
          </Link>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4">
          {ifLogged ? (
            // 🔥 Menu do usuário (logado)
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  iamlaerte
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-neutral-900">
                <DropdownMenuLabel className="text-white">
                  iamlaerte
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <div className="text-white hover:text-neutral-900">
                    <Link href="/publicar" className="w-full">
                      + Novo conteúdo
                    </Link>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <div className="text-white hover:text-neutral-900">
                    <Link
                      href="/admin"
                      className="w-full hover:text-neutral-900"
                    >
                      📄 Meus conteúdos
                    </Link>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <div className="text-white hover:text-neutral-900">
                    <Link
                      href="/admin/profile"
                      className="w-full hover:text-neutral-900"
                    >
                      ⚙️ Editar perfil
                    </Link>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-500 cursor-pointer">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-white hover:text-neutral-900"
              >
                <Link href="/cadastre-se">Cadastre-se</Link>
              </Button>

              <Button className="bg-white text-black hover:bg-neutral-200">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
