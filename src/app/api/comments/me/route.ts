import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
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

    const comments = await prisma.comment.findMany({
      where: { authorId: user.id, deleted: false },
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar comentários." },
      { status: 500 }
    );
  }
}
