"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  createdAt: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Você precisa estar logado.");
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
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Minhas publicações</CardTitle>
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
                      <Link href={`/post/${post.id}`}>Visualizar</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/edit/${post.id}`}>Editar</Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      Excluir
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
