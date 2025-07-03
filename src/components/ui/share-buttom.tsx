"use client";

import { toast } from "sonner";

export default function ShareButton() {
  const handleShare = async () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Link copiado para a área de transferência!");
      })
      .catch((err) => {
        console.error("Erro ao copiar o link:", err);
        toast.error("Não foi possível copiar o link.");
      });
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      Compartilhar
    </button>
  );
}