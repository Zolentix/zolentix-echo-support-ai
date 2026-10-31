export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sourceArticleId?: string | null;
  sourceArticleTitle?: string | null;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  sessionId: string;
  status: "active" | "resolved" | "handed-off";
  visitorName: string | null;
  visitorEmail: string | null;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalConversations: number;
  activeConversations: number;
  resolvedConversations: number;
  handedOffConversations: number;
  totalMessages: number;
  totalArticles: number;
  questionsToday: number;
  deflectionRate: number;
  recentEvents: AnalyticsEvent[];
}

export interface AnalyticsEvent {
  id: string;
  type: string;
  metadata: string | null;
  createdAt: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  visitorName?: string;
  visitorEmail?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  suggestedQuestions: string[];
}
