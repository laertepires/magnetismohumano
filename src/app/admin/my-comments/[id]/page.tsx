"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import parse from "html-react-parser";

const schema = z.object({
  content: z.string().min(3, "O comentário deve ter pelo menos 3 caracteres."),
});

type FormData = z.infer<typeof schema>;

export default function EditCommentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(`/api/comments/me/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar comentário.");

        const data = await res.json();
        form.setValue("content", data.content || ""); // Parse HTML content to React component
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchComment();
    else {
      toast.error("Você precisa estar logado.");
      router.push("/login");
    }
  }, [id]);

  const onSubmit = async (values: FormData) => {
    try {
      const res = await fetch(`/api/comments/me/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: values.content }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar comentário.");

      toast.success("Comentário atualizado com sucesso!");
      router.push("/admin/my-comments");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return <p className="p-4">Carregando...</p>;

  console.log("Form values:", form.getValues());
  return (
    <div className="container max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Editar Comentário</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="border rounded-md p-4">
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => (
              <SimpleEditor
                key={field.value} // Garante render novo quando valor muda
                content={field.value}
                setContent={field.onChange}
              />
            )}
          />
        </div>

        {form.formState.errors.content && (
          <p className="text-sm text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}

        <Button type="submit" className="w-full">
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
