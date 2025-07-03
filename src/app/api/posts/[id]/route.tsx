import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";
import { slugify } from "@/lib/slugify";

interface IUser {
  id: string;
  username: string;
  email: string;
}

const postSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter no mínimo 3 caracteres." }),
  source: z.string().optional(),
  content: z.string().min(10, { message: "O conteúdo deve ter no mínimo 10 caracteres." }),
});

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = verifyToken(token) as IUser;

  if (!user) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
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

    // 🔐 Verifica se o post é do usuário
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    if (post.authorId !== user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    
    const slug = slugify(validated.data.title);
    // 🔥 Atualiza o post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: validated.data.title,
        slug,
        source: validated.data.source,
        content: validated.data.content,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Erro ao editar post:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const user = verifyToken(token) as IUser;

  if (!user) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    if (post.authorId !== user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await verifyToken(token) as IUser;
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post || post.authorId !== user.id) {
      return NextResponse.json({ error: "Post não encontrado ou sem permissão" }, { status: 204 });
    }

    await prisma.post.update({
      where: { id: params.id },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
