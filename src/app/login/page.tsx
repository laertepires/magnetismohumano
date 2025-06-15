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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  keepConnected: z.boolean().optional(),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      keepConnected: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Aqui você pode fazer a chamada para sua API de login
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
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

            {/* Campo Senha */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite sua senha" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Manter Conectado */}
            <FormField
              control={form.control}
              name="keepConnected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!m-0">Manter conectado</FormLabel>
                </FormItem>
              )}
            />

            {/* Esqueci minha senha */}
            <div className="flex justify-end">
              <Link
                href="/recuperar-senha"
                className="text-sm text-primary hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            {/* Botão */}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
