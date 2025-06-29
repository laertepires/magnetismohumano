import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.postId,
        parentId: null, // Apenas comentários raiz
      },
      include: {
        author: { select: { username: true } },
        replies: {
          include: {
            author: { select: { username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}
