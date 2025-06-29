import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ou smtp.mailtrap.io, smtp.ethereal.email, etc.
  port: 587,
  secure: false, // true para 465, false para outros
  auth: {
    user: process.env.SMTP_USER, // email
    pass: process.env.SMTP_PASS, // senha ou app password
  },
});

export async function sendResetPasswordEmail(to: string, token: string) {
  const resetUrl = `${process.env.URL_SITE}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: '"Magnetismo Humano" <no-reply@magnetizandoonline.com.br>',
      to,
      subject: "Redefinição de senha",
      html: `
      <h2 style="margin-bottom: 10px">Redefinir senha</h2>
      <p style="margin-bottom: 10px">Clique no botão abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}" style="margin-bottom: 10px; display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;border-radius:4px;text-decoration:none">Redefinir senha</a>
      <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
    `,
    });
  } catch (error) {
    console.log("Erro ao enviar e-mail de redefinição de senha:", error);
    // throw new Error(
    //   "Não foi possível enviar o e-mail de redefinição de senha."
    // );
  }
}
