import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const comments = await prisma.comment.findMany();
  console.log(comments);
}

main();