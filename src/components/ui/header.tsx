import { Button } from "@/components/ui/button";
// import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between">
        
        <div className="text-xl font-bold">
          {/* Magnetismo Humano */}
        </div>

        {/* Ações: Login e Cadastro */}
        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}

          <Button variant="ghost">
            Login
          </Button>

          <Button>
            Cadastre-se
          </Button>
        </div>
      </div>
    </header>
  );
}
