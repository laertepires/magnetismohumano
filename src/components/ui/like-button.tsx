"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initiallyLiked: boolean;
}

export function LikeButton({
  postId,
  initialLikes,
  initiallyLiked,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initiallyLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const previousLiked = liked;
    const previousLikes = likes;
    const nextLiked = !liked;
    const likeDelta = nextLiked ? 1 : -1;

    setLiked(nextLiked);
    setLikes((current) => Math.max(0, current + likeDelta));

    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Não foi possível atualizar sua curtida.");
      }

      const data = (await response.json()) as {
        likesCount: number;
        liked: boolean;
      };

      setLikes(data.likesCount);
      setLiked(data.liked);
    } catch (error) {
      console.error(error);
      setLiked(previousLiked);
      setLikes(previousLikes);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao registrar sua curtida."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const iconFill = liked ? "currentColor" : "none";

  return (
    <Button
      type="button"
      variant={liked ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <Heart className="h-4 w-4" fill={iconFill} />
      <span>{likes}</span>
    </Button>
  );
}
