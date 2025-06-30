"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { toast } from "sonner";
import parse from "html-react-parser";
import { useAuthStore } from "@/store/useAuthStore";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
  replies: Comment[];
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditorForComment, setShowEditorForComment] = useState<
    string | null
  >(null);
  const [showEditorForPost, setShowEditorForPost] = useState(false);
  const [editorContent, setEditorContent] = useState<string>("");
  const { token } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${postId}`);
      if (!res.ok) throw new Error("Erro ao carregar comentários");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      toast.error("Erro ao carregar comentários");
    }
  };

  const handleSubmit = async (parentId?: string) => {
    if (!token) {
      toast.error("Você precisa estar logado para comentar.");
      return;
    }

    if (editorContent.trim().length < 3) {
      toast.error("O comentário é muito curto.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editorContent,
          postId,
          parentId: parentId || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao comentar");
      }

      toast.success("Comentário enviado.");
      setEditorContent("");
      setShowEditorForPost(false);
      setShowEditorForComment(null);
      fetchComments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderComments = (comments: Comment[], isReply = false) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className={`border rounded-md p-4 ${isReply ? "ml-6" : ""}`}
      >
        <div className="flex justify-between">
          <span className="text-sm font-semibold">
            {comment.author.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
        <p className="mt-2">{parse(comment.content)}</p>

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
            <SimpleEditor
              content={editorContent}
              setContent={setEditorContent}
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => handleSubmit(comment.id)}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Responder"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEditorForComment(null)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {comment?.replies?.length > 0 && renderComments(comment.replies, true)}
      </div>
    ));
  };

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
          <SimpleEditor content={editorContent} setContent={setEditorContent} />
          <div className="flex gap-2 mt-2">
            <Button onClick={() => handleSubmit()} disabled={loading}>
              {loading ? "Enviando..." : "Publicar"}
            </Button>
            <Button variant="ghost" onClick={() => setShowEditorForPost(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {comments.length === 0 ? (
        <p className="text-muted-foreground">Nenhum comentário ainda.</p>
      ) : (
        renderComments(comments)
      )}
    </div>
  );
}
