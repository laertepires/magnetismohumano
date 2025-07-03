"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  post: {
    title: string;
    slug: string;
  };
}

export default function MyCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token } = useAuthStore();

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Tem certeza que deseja deletar este comentário?"
    );
    if (!confirm) return;

    if (!token) {
      toast.error("Não autorizado.");
      return;
    }

    try {
      const res = await fetch(`/api/comments/me/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao deletar.");
      }

      toast.success("Comentário deletado com sucesso.");
      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro desconhecido");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Você precisa estar logado.");
      router.push("/login");
      return;
    }

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comments/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Erro ao buscar comentários.");
        }

        const data = await res.json();
        setComments(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Ocorreu um erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meus Comentários</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <p>Carregando...</p>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground">
              Você ainda não comentou em nenhuma publicação.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-md p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {comment.post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Em{" "}
                      <Link
                        href={`/post/${comment.post.slug}`}
                        className="underline text-blue-600"
                      >
                        {comment.post.slug}
                      </Link>{" "}
                      •{" "}
                      {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/admin/my-comments/${comment.id}`} passHref>
                      <button className="text-sm border rounded px-3 py-1 hover:bg-neutral-100 transition">
                        Editar
                      </button>
                    </Link>
                    <button
                      className="text-sm border border-red-500 text-red-500 rounded px-3 py-1 hover:bg-red-100 transition"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
