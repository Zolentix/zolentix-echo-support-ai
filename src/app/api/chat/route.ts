import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message, visitorName, visitorEmail } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "sessionId and message are required" },
        { status: 400 }
      );
    }

    let conversation = await prisma.conversation.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          sessionId,
          visitorName: visitorName || null,
          visitorEmail: visitorEmail || null,
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }

    if (conversation.status === "handed-off") {
      return NextResponse.json({
        message: {
          id: "handoff",
          role: "system",
          content:
            "Your conversation has been transferred to a human agent. They'll be with you shortly.",
          createdAt: new Date().toISOString(),
        },
        suggestedQuestions: [],
      });
    }

    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        type: "question",
        metadata: JSON.stringify({
          conversationId: conversation.id,
          query: message.slice(0, 200),
        }),
      },
    });

    const history = conversation.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const aiResult = await generateResponse(message, history);

    if (
      aiResult.content.includes("connect you with our support team") ||
      aiResult.content.includes("speak with a human")
    ) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { status: "handed-off" },
      });
      await prisma.analyticsEvent.create({
        data: {
          type: "handoff",
          metadata: JSON.stringify({ conversationId: conversation.id }),
        },
      });
    }

    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: aiResult.content,
        sourceArticleId: aiResult.sourceArticleId,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      message: {
        id: assistantMessage.id,
        role: "assistant",
        content: aiResult.content,
        sourceArticleId: aiResult.sourceArticleId,
        sourceArticleTitle: aiResult.sourceArticleTitle,
        createdAt: assistantMessage.createdAt.toISOString(),
      },
      userMessage: {
        id: userMessage.id,
        role: "user",
        content: message,
        createdAt: userMessage.createdAt.toISOString(),
      },
      suggestedQuestions: aiResult.suggestedQuestions,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
