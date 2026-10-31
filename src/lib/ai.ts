import { prisma } from "./db";

interface AIResponse {
  content: string;
  sourceArticleId: string | null;
  sourceArticleTitle: string | null;
  confidence: number;
  suggestedQuestions: string[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreArticle(
  article: { id: string; title: string; content: string; category: string },
  queryTokens: string[]
): number {
  const titleTokens = tokenize(article.title);
  const contentTokens = tokenize(article.content);
  let score = 0;
  for (const qt of queryTokens) {
    for (const tt of titleTokens) {
      if (tt.includes(qt) || qt.includes(tt)) score += 3;
    }
    for (const ct of contentTokens) {
      if (ct.includes(qt) || qt.includes(ct)) score += 1;
    }
    if (article.category.toLowerCase().includes(qt)) score += 2;
  }
  return score;
}

function extractAnswer(content: string, queryTokens: string[]): string {
  const sentences = content.split(/(?<=[.!?])\s+/);
  const scored = sentences.map((s) => {
    const sTokens = tokenize(s);
    let score = 0;
    for (const qt of queryTokens) {
      for (const st of sTokens) {
        if (st.includes(qt) || qt.includes(st)) score++;
      }
    }
    return { sentence: s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3).filter((s) => s.score > 0);
  if (top.length === 0) {
    return sentences.slice(0, 2).join(" ");
  }
  return top.map((s) => s.sentence).join(" ");
}

const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))/i,
];
const THANKS_PATTERNS = [/^(thanks|thank\s*you|thx|ty|appreciate)/i];
const HANDOFF_PATTERNS = [
  /speak.*(human|agent|person|someone)/i,
  /talk.*(human|agent|person|someone)/i,
  /real\s*(human|person)/i,
  /transfer/i,
  /escalat/i,
];

const SUGGESTED_QUESTIONS_POOL = [
  "How do I get started?",
  "What pricing plans do you offer?",
  "How do I reset my password?",
  "Can I integrate with other tools?",
  "What's your uptime guarantee?",
  "How do I contact support?",
  "Do you offer a free trial?",
  "How do I upgrade my plan?",
];

function pickSuggestions(exclude: string): string[] {
  const excludeTokens = tokenize(exclude);
  const filtered = SUGGESTED_QUESTIONS_POOL.filter((q) => {
    const qTokens = tokenize(q);
    return !qTokens.some((qt) => excludeTokens.includes(qt));
  });
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export async function generateResponse(
  message: string,
  _conversationHistory: { role: string; content: string }[]
): Promise<AIResponse> {
  // --- Check for real AI provider ---
  if (process.env.AI_PROVIDER_URL && process.env.AI_API_KEY) {
    return callExternalAI(message, _conversationHistory);
  }

  // --- Mock AI responder ---
  if (GREETING_PATTERNS.some((p) => p.test(message))) {
    return {
      content:
        "Hello! Welcome to Acme SaaS support. I'm Echo, your AI assistant. How can I help you today? You can ask me about our features, pricing, account setup, or any technical questions.",
      sourceArticleId: null,
      sourceArticleTitle: null,
      confidence: 1,
      suggestedQuestions: [
        "What features do you offer?",
        "How do I get started?",
        "What pricing plans are available?",
      ],
    };
  }

  if (THANKS_PATTERNS.some((p) => p.test(message))) {
    return {
      content:
        "You're welcome! Is there anything else I can help you with? I'm here to assist you anytime.",
      sourceArticleId: null,
      sourceArticleTitle: null,
      confidence: 1,
      suggestedQuestions: pickSuggestions(message),
    };
  }

  if (HANDOFF_PATTERNS.some((p) => p.test(message))) {
    return {
      content:
        "I understand you'd like to speak with a human agent. Let me connect you with our support team. A team member will be with you shortly. In the meantime, is there anything specific you'd like me to note for them?",
      sourceArticleId: null,
      sourceArticleTitle: null,
      confidence: 1,
      suggestedQuestions: [],
    };
  }

  const queryTokens = tokenize(message);

  const articles = await prisma.article.findMany({
    where: { published: true },
  });

  const scored = articles
    .map((a) => ({ article: a, score: scoreArticle(a, queryTokens) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0 && scored[0].score >= 2) {
    const best = scored[0].article;
    const answer = extractAnswer(best.content, queryTokens);
    const confidence = Math.min(scored[0].score / 10, 0.95);

    return {
      content: answer,
      sourceArticleId: best.id,
      sourceArticleTitle: best.title,
      confidence,
      suggestedQuestions: pickSuggestions(message),
    };
  }

  await prisma.analyticsEvent.create({
    data: {
      type: "deflection",
      metadata: JSON.stringify({ query: message.slice(0, 200) }),
    },
  });

  return {
    content:
      "I'm not sure I have the right answer for that question. Let me flag this for our team so they can get back to you. In the meantime, you can try rephrasing your question, or I can connect you with a human agent if you'd prefer.",
    sourceArticleId: null,
    sourceArticleTitle: null,
    confidence: 0,
    suggestedQuestions: [
      "Can I speak to a human?",
      ...pickSuggestions(message).slice(0, 2),
    ],
  };
}

async function callExternalAI(
  message: string,
  history: { role: string; content: string }[]
): Promise<AIResponse> {
  const articles = await prisma.article.findMany({ where: { published: true } });
  const kbContext = articles
    .map((a) => `[${a.title}]: ${a.content.slice(0, 500)}`)
    .join("\n\n");

  const systemPrompt = `You are Echo, a helpful customer support AI for Acme SaaS. Answer using only the knowledge base below. If you can't find the answer, say so and offer to connect with a human.

Knowledge Base:
${kbContext}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  try {
    const res = await fetch(process.env.AI_PROVIDER_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages,
        max_tokens: 500,
        temperature: 0.3,
      }),
    });
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "I encountered an error processing your request.";

    return {
      content,
      sourceArticleId: null,
      sourceArticleTitle: null,
      confidence: 0.8,
      suggestedQuestions: pickSuggestions(message),
    };
  } catch {
    return {
      content: "I'm having trouble connecting to my AI backend. Let me try to help with what I know.",
      sourceArticleId: null,
      sourceArticleTitle: null,
      confidence: 0,
      suggestedQuestions: pickSuggestions(message),
    };
  }
}
