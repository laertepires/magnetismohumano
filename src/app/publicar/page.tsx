"use client";

import { useState } from "react";
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
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Editor from "@/components/ui/editor";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

// Schema de validação
const formSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter no mínimo 3 caracteres." }),
  source: z.string().min(3, { message: "A fonte deve ter no mínimo 3 caracteres." }),
  content: z.string().min(10, { message: "O conteúdo deve ter no mínimo 10 caracteres." }),
});

export default function Publicar() {
  const [content, setContent] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      source: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = { ...values, content };
    console.log(data);
    // Aqui você pode fazer a chamada para sua API de publicação
  }

  return (
    <div className="min-h-screen flex items-center  px-4">
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
            <FormItem>
              <FormLabel>Corpo da publicação</FormLabel>
              <div className="border border-input rounded-md">
                <SimpleEditor />
              </div>
              {content.length < 10 && (
                <FormMessage>O conteúdo deve ter no mínimo 10 caracteres.</FormMessage>
              )}
            </FormItem>

            <Button type="submit" className="w-full">
              Publicar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
