import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify"; // você pode usar o slugify do npm ou criar o seu

export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}
