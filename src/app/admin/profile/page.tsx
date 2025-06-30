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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "O nome de usuário deve ter no mínimo 2 caracteres." }),
  email: z.string().optional(),
  bio: z
    .string()
    .max(300, { message: "A bio pode ter no máximo 300 caracteres." })
    .optional(),
});

export default function EditProfilePage() {
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
      username: "",
      email: "",
      bio: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      form.reset({
        username: data.username,
        email: data.email,
        bio: data.bio || "",
      });
    };

    fetchUser();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: values.username,
          // email: values.email,
          bio: values.bio || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao atualizar perfil");

      toast.success("Perfil atualizado com sucesso!");
      console.log("Perfil atualizado com sucesso:", data.user);
    } catch (err: any) {
      console.error(err.message);
      toast.error(err.message || "Erro ao atualizar perfil");
    }
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
                      <Input
                        placeholder="seuemail@exemplo.com"
                        type="email"
                        disabled
                        {...field}
                      />
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
