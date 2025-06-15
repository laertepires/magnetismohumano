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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(2, { message: "O nome de usuário deve ter no mínimo 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  bio: z.string().max(300, { message: "A bio pode ter no máximo 300 caracteres." }).optional(),
});

export default function EditProfilePage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "iamlaerte",
      email: "laerte@email.com",
      bio: "Desenvolvedor apaixonado por magnetismo humano, Next.js e TypeScript.",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Dados enviados:", values);
    // Aqui você pode enviar os dados para sua API, banco de dados, etc.
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Editar Perfil</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome de usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
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

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Fale um pouco sobre você..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botão */}
              <Button type="submit" className="w-full">
                Salvar alterações
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
