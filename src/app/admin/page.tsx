"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface Post {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      toast.error("Você precisa estar logado.");
      router.push("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Erro ao buscar posts.");
        }

        const data = await res.json();
        setPosts(data);
      } catch (error: unknown) {
        // Type guard
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Ocorreu um erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Tem certeza que deseja deletar este post?");
    if (!confirm) return;

    if (!token) {
      toast.error("Não autorizado.");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao deletar.");
      }

      toast.success("Post deletado com sucesso.");
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error: unknown) {
      // Type guard
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro desconhecido");
      }
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meus conteúdos</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <p>Carregando...</p>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground">
              Você ainda não criou nenhuma publicação.
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border rounded-md p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Publicado em{" "}
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/post/${post.slug}`}>Visualizar</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/edit/${post.id}`}>Editar</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      Deletar
                    </Button>
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
