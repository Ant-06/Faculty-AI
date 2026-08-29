import React from "react";
import { Loader2, Inbox } from "lucide-react";

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <Loader2 className="animate-spin mb-3" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/60">
      <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
        <Inbox size={20} />
      </div>
      <h3 className="font-display font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3">
      {message}
    </div>
  );
}

export function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    brand: "bg-brand-50 text-brand-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return <span className={`badge ${tones[tone] || tones.slate}`}>{children}</span>;
}

export function ProgressBar({ value }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}


// Adds a subtle character-by-character entrance animation without changing
// the text content. It is intended for the authentication screens only.
export function useLetterReveal(ref, delay = 22) {
  React.useEffect(() => {
    const root = ref?.current;
    if (!root || root.dataset.letterRevealReady === "true") return;
    root.dataset.letterRevealReady = "true";

    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue?.trim()) continue;
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(parent.tagName)) continue;
      nodes.push(node);
    }

    let index = 0;
    nodes.forEach((textNode) => {
      const text = textNode.nodeValue;
      const fragment = document.createDocumentFragment();
      [...text].forEach((char) => {
        const span = document.createElement("span");
        span.className = "auth-letter";
        span.style.animationDelay = `${index * delay}ms`;
        span.textContent = char;
        fragment.appendChild(span);
        index += 1;
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }, [ref, delay]);
}
