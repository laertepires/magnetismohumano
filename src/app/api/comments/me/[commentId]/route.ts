import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ commentId: string }>;
}

interface IUser {
  id: string;
  username: string;
  email: string;
}

export async function DELETE(req: NextRequest, props: Params) {
  const params = await props.params;
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = verifyToken(token) as IUser;

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


export async function GET(req: NextRequest, props: Params) {
  const params = await props.params;
  try {
    console.log("Buscando comentário:", params.commentId);
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const decoded = verifyToken(token) as IUser;
    if (!decoded) {
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

export async function PUT(req: NextRequest, props: { params: Promise<{ commentId: string }> }) {
  const params = await props.params;
  try {
    const { content } = await req.json();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = verifyToken(token) as IUser;

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment || comment.authorId !== user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    await prisma.comment.update({
      where: { id: params.commentId },
      data: { content },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao atualizar comentário:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
