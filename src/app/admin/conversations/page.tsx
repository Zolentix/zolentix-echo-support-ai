"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/admin-auth";
import type { ConversationSummary, ChatMessage } from "@/types";
import {
  Search,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  PhoneForwarded,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    active: { cls: "echo-badge-active", label: "Active" },
    resolved: { cls: "echo-badge-resolved", label: "Resolved" },
    "handed-off": { cls: "echo-badge-handoff", label: "Handed Off" },
  };
  const info = map[status] || { cls: "echo-badge", label: status };
  return <span className={info.cls}>{info.label}</span>;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [convDetail, setConvDetail] = useState<ConversationSummary | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await apiFetch(`/api/admin/conversations?${params}`);
      const data = await res.json();
      setConversations(data);
    } catch {
      /* redirect handled */
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  async function loadMessages(id: string) {
    setSelectedId(id);
    setLoadingMessages(true);
    try {
      const res = await apiFetch(`/api/admin/conversations/${id}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setConvDetail(data);
    } catch {
      /* handled */
    } finally {
      setLoadingMessages(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    await apiFetch(`/api/admin/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    loadConversations();
    if (convDetail) {
      setConvDetail({ ...convDetail, status: status as ConversationSummary["status"] });
    }
  }

  if (selectedId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSelectedId(null);
              setMessages([]);
            }}
            className="echo-btn-ghost p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-echo-text">
              Conversation
            </h1>
            {convDetail && (
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge status={convDetail.status} />
                <span className="text-echo-text-muted text-sm">
                  {convDetail.visitorName || "Anonymous"} &middot;{" "}
                  {convDetail.messageCount} messages
                </span>
              </div>
            )}
          </div>
          {convDetail && convDetail.status !== "resolved" && (
            <div className="flex gap-2">
              {convDetail.status !== "handed-off" && (
                <button
                  onClick={() => updateStatus(selectedId!, "handed-off")}
                  className="echo-btn-secondary text-sm flex items-center gap-2"
                >
                  <PhoneForwarded className="w-4 h-4" />
                  Hand Off
                </button>
              )}
              <button
                onClick={() => updateStatus(selectedId!, "resolved")}
                className="echo-btn-primary text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Resolve
              </button>
            </div>
          )}
        </div>

        <div className="echo-card overflow-hidden">
          {loadingMessages ? (
            <div className="p-8 text-center text-echo-text-muted">
              Loading messages...
            </div>
          ) : (
            <div className="divide-y divide-echo-border/50 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 ${
                    msg.role === "user"
                      ? "bg-echo-base"
                      : msg.role === "system"
                        ? "bg-echo-warning/5"
                        : "bg-echo-surface"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-medium ${
                        msg.role === "user"
                          ? "text-echo-accent"
                          : msg.role === "system"
                            ? "text-echo-warning"
                            : "text-echo-primary-bright"
                      }`}
                    >
                      {msg.role === "user"
                        ? "Visitor"
                        : msg.role === "system"
                          ? "System"
                          : "Echo AI"}
                    </span>
                    <span className="text-[11px] text-echo-text-muted">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-echo-text leading-relaxed">
                    {msg.content}
                  </p>
                  {msg.sourceArticleTitle && (
                    <p className="text-[11px] text-echo-text-muted mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-echo-accent inline-block" />
                      Source: {msg.sourceArticleTitle}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-echo-text">
          Conversations
        </h1>
        <p className="text-echo-text-secondary text-sm mt-1">
          View and manage all customer conversations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-echo-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="echo-input pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="echo-input appearance-none pr-9 min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="handed-off">Handed Off</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-echo-text-muted pointer-events-none" />
        </div>
      </div>

      {/* List */}
      <div className="echo-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-echo-text-muted">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-echo-text-muted">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No conversations found</p>
          </div>
        ) : (
          <div className="divide-y divide-echo-border">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadMessages(conv.id)}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-echo-surface-hover transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-echo-surface-active flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-echo-text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-echo-text truncate">
                      {conv.visitorName || "Anonymous Visitor"}
                    </span>
                    <StatusBadge status={conv.status} />
                  </div>
                  <p className="text-sm text-echo-text-secondary truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-echo-text-muted">
                    <MessageSquare className="w-3 h-3" />
                    <span className="text-xs">{conv.messageCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-echo-text-muted mt-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
