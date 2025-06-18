"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// 🔥 Simulando dados vindos de uma API ou banco
const posts = [
  {
    id: "1",
    title: "Receba vagas de tecnologia todos os dias em seu email!",
    createdAt: "2024-06-15",
  },
  {
    id: "2",
    title: "O que é Magnetismo Humano e como ele pode ajudar?",
    createdAt: "2024-06-14",
  },
  {
    id: "3",
    title: "Dicas práticas para desenvolver sua sensibilidade magnética",
    createdAt: "2024-06-10",
  },
];

export default function MyPostsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Minhas publicações</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">You have not created any posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border rounded-md p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Published on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/post/${post.id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/edit/${post.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
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
