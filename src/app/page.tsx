import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchParams {
  searchParams: Promise<{
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 10;

export default async function Home(props: SearchParams) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count(),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  if (currentPage > totalPages && totalPages !== 0) {
    notFound();
  }

  return (
    <div className="min-h-screen flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="space-y-6 w-full py-10">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhuma publicação encontrada.
            </p>
          ) : (
            posts.map((post, index) => (
              <a
                href={`/post/${post.slug}`}
                key={post.id}
                className="block border rounded-md p-4 bg-white hover:bg-neutral-100 transition"
              >
                <h2 className="text-lg font-semibold mb-1">
                  {skip + index + 1}. {post.title}
                </h2>
                <div className="text-sm text-muted-foreground">
                  <span className="pr-2">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  ·
                  <span className="pl-2">
                    {post._count.comments} comentário
                    {post._count.comments === 1 ? "" : "s"}
                  </span>
                </div>
              </a>
            ))
          )}

          {/* 🔥 Paginação */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={`/?page=${currentPage - 1}`}>
                      Anterior
                    </PaginationPrevious>
                  </PaginationItem>
                )}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/?page=${currentPage + 1}`}>
                      Próximo
                    </PaginationNext>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
