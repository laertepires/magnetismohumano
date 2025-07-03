import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import parse from 'html-react-parser';
import Comments from "./comments";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
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
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <div>
            {parse(post.content)}
          </div>
          <Separator className="my-6" />
          <p>
            <strong>Fonte: </strong>
            <Link
              href={post.source}
              target="_blank"
              className="text-blue-500 underline"
              rel="noreferrer"
            >
              {post.source}
            </Link>
          </p>

          <div className="mt-6 flex gap-4">
            <Link href="/" className="btn">
              <span className="border px-4 py-2 rounded-md">Voltar</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Comments postId={post.id} />
    </div>
  );
}
