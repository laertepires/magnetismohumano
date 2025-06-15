"use client";

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
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
});

export default function FargotPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Aqui você pode fazer a chamada para sua API de recuperação de senha
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="space-y-4 mb-6 text-center">
          <h1 className="text-2xl font-bold">Esqueci minha senha</h1>
          <p className="text-sm text-muted-foreground">
            Informe seu e-mail e enviaremos instruções para redefinir sua senha.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seuemail@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão */}
            <Button type="submit" className="w-full">
              Enviar instruções
            </Button>
          </form>
        </Form>

        {/* Voltar para login */}
        <div className="flex justify-center mt-4">
          <Link
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}
