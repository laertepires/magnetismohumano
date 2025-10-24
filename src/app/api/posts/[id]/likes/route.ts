import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { LIKE_COOKIE_NAME, likeCookieOptions } from "@/lib/likes";

async function getPost(id: string) {
  return prisma.post.findFirst({
    where: { id, deleted: false },
    select: { id: true },
  });
}

async function getLikesCount(postId: string) {
  return prisma.postLike.count({
    where: { postId },
  });
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const post = await getPost(id);

  if (!post) {
    return NextResponse.json(
      { error: "Post não encontrado" },
      { status: 404 }
    );
  }

  const identifier = req.cookies.get(LIKE_COOKIE_NAME)?.value;
  const [likesCount, existingLike] = await Promise.all([
    getLikesCount(id),
    identifier
      ? prisma.postLike.findUnique({
          where: {
            postId_userIdentifier: {
              postId: id,
              userIdentifier: identifier,
            },
          },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  return NextResponse.json({
    likesCount,
    liked: Boolean(existingLike),
  });
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const post = await getPost(id);

  if (!post) {
    return NextResponse.json(
      { error: "Post não encontrado" },
      { status: 404 }
    );
  }

  let identifier = req.cookies.get(LIKE_COOKIE_NAME)?.value ?? null;
  const isNewIdentifier = !identifier;

  if (!identifier) {
    identifier = randomUUID();
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userIdentifier: {
        postId: id,
        userIdentifier: identifier,
      },
    },
    select: { id: true },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: { id: existingLike.id },
    });
  } else {
    await prisma.postLike.create({
      data: {
        postId: id,
        userIdentifier: identifier,
      },
    });
  }

  const likesCount = await getLikesCount(id);

  const response = NextResponse.json({
    likesCount,
    liked: !existingLike,
  });

  if (isNewIdentifier && identifier) {
    response.cookies.set({
      name: LIKE_COOKIE_NAME,
      value: identifier,
      ...likeCookieOptions,
    });
  }

  return response;
}
