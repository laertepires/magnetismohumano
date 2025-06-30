import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { commentId: string };
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Erro ao encontrar usuario" },
        { status: 400 }
      );
    }

    const commentId = params.commentId;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId, deleted: false },
    });

    if (!comment || comment.authorId !== user.id) {
      return NextResponse.json(
        { error: "Comentário não encontrado ou acesso negado." },
        { status: 204 }
      );
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        deleted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);
    return NextResponse.json(
      { error: "Erro ao deletar comentário." },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest, { params }: Params) {
  try {
    console.log("Buscando comentário:", params.commentId);
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: params.commentId,
        authorId: decoded.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comentário não encontrado." }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Erro ao buscar comentário:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}