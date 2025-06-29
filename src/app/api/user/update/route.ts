import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(2),
  email: z.string().email().optional(),
  bio: z.string().max(300).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await verifyToken(token);
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { username, email, bio } = parsed.data;

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 204 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { username, email, bio },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
