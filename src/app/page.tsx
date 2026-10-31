"use client";

import { ZLogo } from "@/components/ui/ZLogo";
import { ChatWidget } from "@/components/chat/ChatWidget";
import {
  MessageSquare,
  Brain,
  ShieldCheck,
  Zap,
  BookOpen,
  BarChart3,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Smart Conversations",
    desc: "AI-powered responses grounded in your knowledge base. Every answer cites its source.",
  },
  {
    icon: Brain,
    title: "Knowledge-First",
    desc: "Upload docs, FAQs, and guides. Echo learns your business and answers accurately.",
  },
  {
    icon: ShieldCheck,
    title: "Human Handoff",
    desc: "When the bot isn't sure, it hands off to your team. No customer left behind.",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    desc: "Embed a single script tag. Works on any website, any framework.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base Manager",
    desc: "Create, edit, and organize articles. Categories keep your docs structured.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track questions, deflection rates, and unanswered queries. Know what your users need.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-echo-base">
      {/* Nav */}
      <nav className="border-b border-echo-border/50 bg-echo-base/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ZLogo size={28} />
            <span className="font-display font-semibold text-lg text-echo-text">
              Echo
            </span>
            <span className="text-echo-text-muted text-sm hidden sm:block">
              by Zolentix
            </span>
          </div>
          <a
            href="/admin/login"
            className="echo-btn-ghost text-sm"
          >
            Admin Console
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-echo-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-echo-primary/5 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-echo-primary/10 border border-echo-primary/20 text-echo-primary-bright text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Support
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            <span className="echo-gradient-text">Customer support</span>
            <br />
            that never sleeps
          </h1>
          <p className="text-echo-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Echo is an AI chatbot that answers customer questions using your
            knowledge base. Deploy in minutes. Resolve issues 24/7. Hand off
            to humans when needed.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/admin" className="echo-btn-primary text-base px-6 py-3">
              Open Admin Console
            </a>
            <a href="#features" className="echo-btn-secondary text-base px-6 py-3">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold mb-4">
            Everything you need for AI support
          </h2>
          <p className="text-echo-text-secondary max-w-lg mx-auto">
            From knowledge management to analytics, Echo gives you the tools
            to deliver exceptional automated support.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="echo-card p-6 hover:border-echo-border-bright transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg echo-gradient flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-echo-text-secondary text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Embed CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="echo-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-echo-primary/5 to-echo-accent/5" />
          <div className="relative">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Try Echo right now
            </h2>
            <p className="text-echo-text-secondary mb-6 max-w-lg mx-auto">
              Click the chat bubble in the bottom-right corner to see Echo in
              action. Ask it anything about our demo SaaS product.
            </p>
            <div className="inline-block echo-card p-4 text-left max-w-md w-full">
              <p className="text-echo-text-muted text-xs font-mono mb-2">
                Embed on your site:
              </p>
              <code className="text-echo-accent text-sm break-all">
                {`<script src="https://echo.zolentix.com/widget.js"></script>`}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-echo-border/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-echo-text-muted text-sm">
          <div className="flex items-center gap-2">
            <ZLogo size={20} />
            <span>Echo by Zolentix</span>
          </div>
          <span>Portfolio Project #2</span>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
