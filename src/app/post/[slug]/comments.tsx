"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comentários</h2>

      <div className="flex gap-4">
        <Button onClick={() => setShowEditorForPost(!showEditorForPost)}>
          {showEditorForPost ? "Cancelar" : "Comentar"}
        </Button>
      </div>

      {showEditorForPost && (
        <div className="mt-4 border rounded-md p-4">
          <SimpleEditor />
        </div>
      )}

      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <div className="border rounded-md p-4">
            <div className="flex justify-between">
              <span className="text-sm font-semibold">{comment.author}</span>
              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
            </div>
            <p className="mt-2">{comment.content}</p>

            <div className="mt-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setShowEditorForComment(showEditorForComment === comment.id ? null : comment.id)
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
  );
}
