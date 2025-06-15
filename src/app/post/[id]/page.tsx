"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function Page() {
  const [showEditorForPost, setShowEditorForPost] = useState(false);
  const [showEditorForComment, setShowEditorForComment] = useState<number | null>(null);

  const comments = [
    {
      id: 1,
      author: "tuboi",
      content:
        "Não sei como você faz a seleção, mas poderia ter um filtro por quais áreas tem interesse em receber.",
      createdAt: "22 horas atrás",
      replies: [],
    },
  ];

  return (
    <div className="container mx-auto max-w-3xl py-10 space-y-8">
      {/* Post */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Receba vagas de tecnologia todos os dias em seu email!
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <span>1 min de leitura • 1 dia atrás • Publicado por joadantas</span>
          </div>
        </CardHeader>

        <CardContent className="prose prose-neutral dark:prose-invert">
          <div>
            <p>
              Pessoal, eu desenvolvi esse site{" "}
              <a
                href="https://www.vaguinhas.com.br/"
                target="_blank"
                className="text-blue-500 underline"
              >
                https://www.vaguinhas.com.br/
              </a>{" "}
              que ajuda quem quer achar vagas te mandando email com vagas todos os dias!
            </p>
            <p>
              É só cadastrar o email no site e informar a senioridade, e é grátis! 😊 Espero
              que possa ajudar quem estiver procurando por vagas.
            </p>
          </div>
          <Separator className="my-6" />
          <p>
            <strong>Fonte: </strong>
            <a
              href="https://www.vaguinhas.com.br/"
              target="_blank"
              className="text-blue-500 underline"
              rel="noreferrer"
            >
              https://www.vaguinhas.com.br/
            </a>
          </p>

          <div className="mt-6 flex gap-4">
            <Button variant="outline">Voltar</Button>
            <Button onClick={() => setShowEditorForPost(!showEditorForPost)}>
              {showEditorForPost ? "Cancelar" : "Comentar"}
            </Button>
          </div>

          {showEditorForPost && (
            <div className="mt-6 border rounded-md p-4">
              <SimpleEditor />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comentários */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Comentários</h2>

        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex justify-between">
                <span className="text-sm font-semibold">{comment.author}</span>
                <span className="text-xs text-muted-foreground">
                  {comment.createdAt}
                </span>
              </div>
              <p className="mt-2">{comment.content}</p>

              <div className="mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setShowEditorForComment(
                      showEditorForComment === comment.id ? null : comment.id
                    )
                  }
                >
                  {showEditorForComment === comment.id ? "Cancelar" : "Responder"}
                </Button>
              </div>

              {showEditorForComment === comment.id && (
                <div className="mt-4 border rounded-md p-4">
                  <SimpleEditor />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
