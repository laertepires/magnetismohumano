"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useAuthStore } from "@/store/useAuthStore";

// ✅ Schema de validação
const formSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter no mínimo 3 caracteres." }),
  source: z.string().min(3, { message: "A fonte deve ter no mínimo 3 caracteres." }),
  content: z.string().min(10, { message: "O conteúdo deve ter no mínimo 10 caracteres." }),
});

export default function Publicar() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      toast.error("Você precisa estar logado para publicar.");
      router.push("/login");
    }
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      source: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!token) {
        throw new Error("Não autorizado.");
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao publicar.");
      }

      toast.success("Publicação realizada com sucesso!");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "Erro ao publicar.");
    }
  }

  return (
    <div className="min-h-screen flex items-center px-4">
      <div className="w-full max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título da publicação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fonte */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonte</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a fonte (ex.: livro, site, autor)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Corpo da Publicação */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corpo da publicação</FormLabel>
                  <div className="border border-input rounded-md">
                    <SimpleEditor
                      content={field.value}
                      setContent={field.onChange}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Publicar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
