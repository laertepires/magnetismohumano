"use client";

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
import { useAuthStore } from "@/store/useAuthStore";

export function Header() {
  const { isLogged, username, logout } = useAuthStore();
  return (
    <header className="w-full border-b border-border bg-neutral-900 text-white fixed z-50 left-0">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-neutral-300">
            Magnetizando online
          </Link>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4">
          {isLogged ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  {username || "Usuário"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-neutral-900">
                <DropdownMenuLabel className="text-white">
                  {username || "Usuário"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <div className="text-white">
                    <Link href="/admin/publicar" className="w-full">
                      + Novo conteúdo
                    </Link>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <div className="text-white">
                    <Link href="/admin" className="w-full">
                      📄 Meus conteúdos
                    </Link>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <div className="text-white">
                    <Link href="/admin/my-comments" className="w-full">
                       💬 Meus comentários
                    </Link>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <div className="text-white">
                    <Link href="/admin/profile" className="w-full">
                      ⚙️ Editar perfil
                    </Link>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={() => logout()}
                >
                  🚪 Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-white hover:text-neutral-300"
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
