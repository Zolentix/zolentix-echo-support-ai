import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req.headers);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalConversations,
    activeConversations,
    resolvedConversations,
    handedOffConversations,
    totalMessages,
    totalArticles,
    recentEvents,
  ] = await Promise.all([
    prisma.conversation.count(),
    prisma.conversation.count({ where: { status: "active" } }),
    prisma.conversation.count({ where: { status: "resolved" } }),
    prisma.conversation.count({ where: { status: "handed-off" } }),
    prisma.message.count(),
    prisma.article.count(),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const questionsToday = await prisma.analyticsEvent.count({
    where: {
      type: "question",
      createdAt: { gte: todayStart },
    },
  });

  const totalQuestions = recentEvents.filter(
    (e) => e.type === "question"
  ).length;
  const deflections = recentEvents.filter(
    (e) => e.type === "deflection"
  ).length;
  const deflectionRate =
    totalQuestions > 0
      ? Math.round((deflections / totalQuestions) * 100)
      : 0;

  return NextResponse.json({
    totalConversations,
    activeConversations,
    resolvedConversations,
    handedOffConversations,
    totalMessages,
    totalArticles,
    questionsToday,
    deflectionRate,
    recentEvents: recentEvents.slice(0, 20).map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}
