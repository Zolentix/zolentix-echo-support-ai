"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/admin-auth";
import type { AnalyticsSummary } from "@/types";
import {
  MessageSquare,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Users,
  CheckCircle,
  PhoneForwarded,
  HelpCircle,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="echo-card p-5 flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-echo-text-muted text-sm">{label}</p>
        <p className="text-2xl font-display font-bold text-echo-text mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/admin/analytics");
        const data = await res.json();
        setStats(data);
      } catch {
        // handled by apiFetch redirect
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-echo-text">
            Dashboard
          </h1>
          <p className="text-echo-text-secondary text-sm mt-1">
            Loading analytics...
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="echo-card p-5 h-24 animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const eventTypeMap: Record<string, { label: string; color: string }> = {
    question: { label: "Question asked", color: "text-echo-primary-bright" },
    deflection: { label: "Unanswered", color: "text-echo-warning" },
    handoff: { label: "Human handoff", color: "text-echo-accent" },
    resolved: { label: "Resolved", color: "text-echo-success" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-echo-text">
          Dashboard
        </h1>
        <p className="text-echo-text-secondary text-sm mt-1">
          Overview of your Echo support system
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MessageSquare}
          label="Total Conversations"
          value={stats.totalConversations}
          color="bg-echo-primary/10 text-echo-primary-bright"
        />
        <StatCard
          icon={Users}
          label="Active Now"
          value={stats.activeConversations}
          color="bg-echo-success/10 text-echo-success"
        />
        <StatCard
          icon={BookOpen}
          label="KB Articles"
          value={stats.totalArticles}
          color="bg-echo-accent/10 text-echo-accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Questions Today"
          value={stats.questionsToday}
          color="bg-echo-warning/10 text-echo-warning"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="echo-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-echo-success" />
            <span className="text-sm text-echo-text-secondary">Resolved</span>
          </div>
          <p className="text-3xl font-display font-bold text-echo-text">
            {stats.resolvedConversations}
          </p>
        </div>
        <div className="echo-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <PhoneForwarded className="w-4 h-4 text-echo-warning" />
            <span className="text-sm text-echo-text-secondary">Handed Off</span>
          </div>
          <p className="text-3xl font-display font-bold text-echo-text">
            {stats.handedOffConversations}
          </p>
        </div>
        <div className="echo-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-echo-danger" />
            <span className="text-sm text-echo-text-secondary">
              Deflection Rate
            </span>
          </div>
          <p className="text-3xl font-display font-bold text-echo-text">
            {stats.deflectionRate}%
          </p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="echo-card overflow-hidden">
        <div className="px-5 py-4 border-b border-echo-border">
          <h2 className="font-display font-semibold text-echo-text">
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-echo-border">
          {stats.recentEvents.length === 0 && (
            <div className="px-5 py-8 text-center text-echo-text-muted text-sm">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No activity yet. Try asking Echo a question!
            </div>
          )}
          {stats.recentEvents.map((event) => {
            const info = eventTypeMap[event.type] || {
              label: event.type,
              color: "text-echo-text-muted",
            };
            let detail = "";
            try {
              const meta = event.metadata ? JSON.parse(event.metadata) : {};
              detail = meta.query || "";
            } catch {
              /* ignore */
            }
            return (
              <div
                key={event.id}
                className="px-5 py-3 flex items-center gap-3 hover:bg-echo-surface-hover transition-colors"
              >
                <span
                  className={`text-xs font-medium ${info.color} whitespace-nowrap`}
                >
                  {info.label}
                </span>
                {detail && (
                  <span className="text-sm text-echo-text-secondary truncate">
                    {detail}
                  </span>
                )}
                <span className="text-xs text-echo-text-muted ml-auto whitespace-nowrap">
                  {new Date(event.createdAt).toLocaleTimeString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
