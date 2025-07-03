import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { generateUniqueSlug } from "@/lib/generateUniqueSlug";

interface IUser {
  id: string;
  username: string;
  email: string;
}

// ✅ Schema de validação
const postSchema = z.object({
  title: z.string().min(3),
  source: z.string().min(3),
  content: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = verifyToken(token) as IUser;

  if (!user) {
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const validated = postSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { title, source, content } = validated.data;
    const slug = await generateUniqueSlug(title);

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 204 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        source,
        content,
        authorId: user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error || "Erro interno" }, { status: 500 });
  }
}
