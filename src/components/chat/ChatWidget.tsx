"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Minus, Send } from "lucide-react";
import { ZLogo } from "@/components/ui/ZLogo";
import type { ChatMessage } from "@/types";

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-7 h-7 rounded-full echo-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
        <MessageSquare className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-echo-surface-hover rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-echo-text-muted typing-dot" />
          <div className="w-2 h-2 rounded-full bg-echo-text-muted typing-dot" />
          <div className="w-2 h-2 rounded-full bg-echo-text-muted typing-dot" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center animate-fade-in">
        <div className="bg-echo-warning/10 text-echo-warning text-xs px-3 py-1.5 rounded-full">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full echo-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageSquare className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className="max-w-[80%] space-y-1">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-echo-primary text-white rounded-tr-sm"
              : "bg-echo-surface-hover text-echo-text rounded-tl-sm"
          }`}
        >
          {msg.content}
        </div>
        {msg.sourceArticleTitle && (
          <div className="text-[11px] text-echo-text-muted px-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-echo-accent inline-block" />
            Source: {msg.sourceArticleTitle}
          </div>
        )}
      </div>
    </div>
  );
}

function generateSessionId() {
  return "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What features do you offer?",
    "How do I get started?",
    "What are your pricing plans?",
  ]);
  const [sessionId] = useState(generateSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open && !minimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, minimized]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setInput("");
      setSuggestions([]);

      const userMsg: ChatMessage = {
        id: "u_" + Date.now(),
        role: "user",
        content: text.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, message: text.trim() }),
        });
        const data = await res.json();
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
        if (data.suggestedQuestions?.length) {
          setSuggestions(data.suggestedQuestions);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: "err_" + Date.now(),
            role: "assistant",
            content:
              "Sorry, I'm having trouble connecting. Please try again in a moment.",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full echo-gradient shadow-lg shadow-echo-primary/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <button
          onClick={() => setMinimized(false)}
          className="echo-card shadow-2xl shadow-black/40 flex items-center gap-3 px-4 py-3 hover:bg-echo-surface-hover transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full echo-gradient flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-echo-text">Echo Support</p>
            <p className="text-xs text-echo-text-muted">
              {messages.length} messages
            </p>
          </div>
          <X
            className="w-4 h-4 text-echo-text-muted hover:text-echo-text ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="w-[380px] max-h-[600px] echo-card shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-echo-border bg-echo-surface">
          <div className="flex items-center gap-3">
            <ZLogo size={24} />
            <div>
              <p className="text-sm font-display font-semibold text-echo-text">
                Echo Support
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-echo-success" />
                <span className="text-[11px] text-echo-text-muted">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              className="p-1.5 rounded-md hover:bg-echo-surface-hover text-echo-text-muted hover:text-echo-text transition-colors"
              aria-label="Minimize"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-echo-surface-hover text-echo-text-muted hover:text-echo-text transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full echo-gradient flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <p className="font-display font-semibold text-echo-text mb-1">
                Hi there!
              </p>
              <p className="text-echo-text-secondary text-sm">
                Ask me anything about our product.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-echo-border text-echo-text-secondary hover:text-echo-text hover:border-echo-primary/50 hover:bg-echo-primary/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-echo-border bg-echo-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-echo-base border border-echo-border rounded-lg px-3 py-2.5 text-sm text-echo-text placeholder-echo-text-muted focus:outline-none focus:border-echo-primary/50 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-lg echo-gradient text-white disabled:opacity-30 hover:opacity-90 transition-opacity"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[10px] text-echo-text-muted mt-2">
            Powered by Echo &middot; Zolentix
          </p>
        </div>
      </div>
    </div>
  );
}
