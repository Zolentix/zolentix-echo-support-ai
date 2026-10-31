"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/admin-auth";
import type { Article } from "@/types";
import {
  Search,
  Plus,
  BookOpen,
  Edit3,
  Trash2,
  X,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

const CATEGORIES = [
  "general",
  "getting-started",
  "billing",
  "integrations",
  "security",
  "troubleshooting",
  "features",
  "api",
];

function ArticleModal({
  article,
  onClose,
  onSave,
}: {
  article: Article | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [category, setCategory] = useState(article?.category || "general");
  const [published, setPublished] = useState(article?.published ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);

    try {
      if (article) {
        await apiFetch(`/api/admin/articles/${article.id}`, {
          method: "PUT",
          body: JSON.stringify({ title, content, category, published }),
        });
      } else {
        await apiFetch("/api/admin/articles", {
          method: "POST",
          body: JSON.stringify({ title, content, category }),
        });
      }
      onSave();
      onClose();
    } catch {
      /* handled */
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="echo-card w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-echo-border">
          <h2 className="font-display font-semibold text-echo-text">
            {article ? "Edit Article" : "New Article"}
          </h2>
          <button onClick={onClose} className="text-echo-text-muted hover:text-echo-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-sm text-echo-text-secondary mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="echo-input"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-echo-text-secondary mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="echo-input appearance-none pr-9"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-echo-text-muted pointer-events-none" />
              </div>
            </div>
            {article && (
              <div className="flex items-end">
                <button
                  onClick={() => setPublished(!published)}
                  className={`echo-btn-secondary flex items-center gap-2 ${
                    published ? "text-echo-success" : "text-echo-text-muted"
                  }`}
                >
                  {published ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  {published ? "Published" : "Draft"}
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-echo-text-secondary mb-1.5">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Article content... The AI will use this to answer customer questions."
              rows={12}
              className="echo-input resize-y font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-echo-border">
          <button onClick={onClose} className="echo-btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
            className="echo-btn-primary flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Article"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalArticle, setModalArticle] = useState<Article | null | undefined>(undefined);

  const loadArticles = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (search) params.set("search", search);
      const res = await apiFetch(`/api/admin/articles?${params}`);
      const data = await res.json();
      setArticles(data);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  async function deleteArticle(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await apiFetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    loadArticles();
  }

  const categoryColors: Record<string, string> = {
    general: "bg-echo-text-muted/10 text-echo-text-muted",
    "getting-started": "bg-echo-success/10 text-echo-success",
    billing: "bg-echo-warning/10 text-echo-warning",
    integrations: "bg-echo-accent/10 text-echo-accent",
    security: "bg-echo-danger/10 text-echo-danger",
    troubleshooting: "bg-echo-warning/10 text-echo-warning",
    features: "bg-echo-primary/10 text-echo-primary-bright",
    api: "bg-echo-accent/10 text-echo-accent-dim",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-echo-text">
            Knowledge Base
          </h1>
          <p className="text-echo-text-secondary text-sm mt-1">
            Manage articles that Echo uses to answer questions
          </p>
        </div>
        <button
          onClick={() => setModalArticle(null)}
          className="echo-btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-echo-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="echo-input pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="echo-input appearance-none pr-9 min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-echo-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Articles */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="echo-card p-5 h-24 animate-shimmer" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="echo-card p-12 text-center text-echo-text-muted">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No articles found</p>
          <p className="text-sm mt-1">
            Add your first knowledge base article to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="echo-card p-5 hover:border-echo-border-bright transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-medium text-echo-text truncate">
                      {article.title}
                    </h3>
                    <span
                      className={`echo-badge ${categoryColors[article.category] || categoryColors.general}`}
                    >
                      {article.category}
                    </span>
                    {!article.published && (
                      <span className="echo-badge bg-echo-text-muted/10 text-echo-text-muted">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-echo-text-secondary line-clamp-2">
                    {article.content}
                  </p>
                  <p className="text-[11px] text-echo-text-muted mt-2">
                    Updated {new Date(article.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModalArticle(article)}
                    className="p-2 rounded-lg hover:bg-echo-surface-hover text-echo-text-muted hover:text-echo-text transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="p-2 rounded-lg hover:bg-echo-danger/10 text-echo-text-muted hover:text-echo-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalArticle !== undefined && (
        <ArticleModal
          article={modalArticle}
          onClose={() => setModalArticle(undefined)}
          onSave={loadArticles}
        />
      )}
    </div>
  );
}
