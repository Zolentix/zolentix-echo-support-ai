import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {},
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const messages = await Promise.all(
    conversation.messages.map(async (m) => {
      let sourceArticleTitle = null;
      if (m.sourceArticleId) {
        const article = await prisma.article.findUnique({
          where: { id: m.sourceArticleId },
        });
        sourceArticleTitle = article?.title || null;
      }
      return {
        id: m.id,
        role: m.role,
        content: m.content,
        sourceArticleId: m.sourceArticleId,
        sourceArticleTitle,
        createdAt: m.createdAt.toISOString(),
      };
    })
  );

  return NextResponse.json({
    ...conversation,
    messages,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status } = body;

  const conversation = await prisma.conversation.update({
    where: { id: params.id },
    data: { status },
  });

  if (status === "resolved") {
    await prisma.analyticsEvent.create({
      data: {
        type: "resolved",
        metadata: JSON.stringify({ conversationId: params.id }),
      },
    });
  }

  return NextResponse.json(conversation);
}
