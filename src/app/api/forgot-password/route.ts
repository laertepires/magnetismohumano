import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { addMinutes } from "date-fns";
import { sendResetPasswordEmail } from "@/lib/mail";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "Se o e-mail existir, enviaremos instruções." });
    }

    const token = uuidv4();
    const expires = addMinutes(new Date(), 30); // expira em 30 minutos

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: expires,
      },
    });

    // Aqui você enviaria o e-mail com o link, ex:
    // https://seusite.com/reset-password?token=abc123
    // Exemplo apenas de retorno para testes:
    await sendResetPasswordEmail(user.email, token);
    return NextResponse.json({
      message: "Token de recuperação gerado.",
      resetLink: `${process.env.URL_SITE}/reset-password?token=${token}`,
    });
  } catch (error) {
    console.error("Erro ao gerar token de recuperação:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
