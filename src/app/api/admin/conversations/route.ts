import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const conversations = await prisma.conversation.findMany({
    where,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  let result = conversations.map((c) => ({
    id: c.id,
    sessionId: c.sessionId,
    status: c.status,
    visitorName: c.visitorName,
    visitorEmail: c.visitorEmail,
    lastMessage: c.messages[0]?.content || "",
    messageCount: c._count.messages,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.visitorName?.toLowerCase().includes(q) ||
        c.visitorEmail?.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }

  return NextResponse.json(result);
}
