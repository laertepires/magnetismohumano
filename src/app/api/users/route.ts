import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });

  return NextResponse.json(users);
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 🔥 10 salt rounds

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        bio: "",
      },
    });

    return NextResponse.json({ id: user.id, username: user.username, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}