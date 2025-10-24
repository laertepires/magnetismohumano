import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import parse from "html-react-parser";
import Comments from "./comments";
import Link from "next/link";
import ShareButton from "@/components/ui/share-buttom";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getPlainText = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildDescription = (content: string) => {
  const text = getPlainText(content);

  if (text.length <= 160) {
    return text;
  }

  return `${text.slice(0, 157)}...`;
};

export async function generateMetadata(
  props: PostPageProps
): Promise<Metadata> {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, deleted: false },
    select: {
      title: true,
      slug: true,
      content: true,
    },
  });

  if (!post) {
    return {
      title: "Post não encontrado",
      description: "O conteúdo que você procura pode ter sido removido.",
    };
  }

  const description = buildDescription(post.content);
  const canonicalPath = `/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: `https://www.magnetizandoonline.com.br${canonicalPath}`,
      title: post.title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, deleted: false },
    include: {
      author: { select: { username: true } },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            <span>
              Publicado por {post.author.username} em{" "}
              {new Date(post.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </CardHeader>

        <CardContent className="prose prose-neutral dark:prose-invert">
          {/* <div dangerouslySetInnerHTML={{ __html: post.content }} /> */}
          <div className="card-content">{parse(post.content)}</div>
          <Separator className="my-6" />
          {post.source.trim().length > 0 && (
            <p>
              <strong>Fonte: </strong>
              <Link
                href={post.source}
                target="_blank"
                className="text-blue-500 underline"
                style={{ textDecoration: "underline !important" }}
                rel="noreferrer"
              >
                {post.source}
              </Link>
            </p>
          )}

          <div className="mt-6 flex gap-4">
            <Link href="/" className="btn mt-2">
              <span className="border px-4 py-2 rounded-md">Voltar</span>
            </Link>
            <div>
              <ShareButton />
            </div>
          </div>
        </CardContent>
      </Card>

      <Comments postId={post.id} />
    </div>
  );
}
