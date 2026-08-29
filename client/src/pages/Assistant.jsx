import React, { useEffect, useRef, useState } from "react";
import { MessageCircleMore, Send, Sparkles } from "lucide-react";
import api from "../services/api";

const SUGGESTED = [
  "What AI tool should I use to summarize research papers?",
  "How can I use AI to prepare a lecture?",
  "What should I learn this week?",
  "Which AI tool is best for presentations?",
  "Give me a 10-minute AI learning plan.",
];

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI Faculty Assistant. Ask me what to learn, which tool fits a task, or how to save time this week.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage(text) {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages((prev) => [...prev, { role: "user", text: content }]);
    setInput("");
    setSending(true);
    try {
      const res = await api.post("/assistant", { message: content });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <MessageCircleMore size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">AI Faculty Assistant</h1>
          <p className="text-slate-500 text-sm">Ask about tools, lesson planning, or what to learn next.</p>
        </div>
      </div>

      <div className="card flex flex-col h-[65vh] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mr-2">
                  <Sparkles size={15} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mr-2">
                <Sparkles size={15} />
              </div>
              <div className="bg-slate-100 rounded-2xl px-4 py-2.5 text-sm text-slate-400">Thinking...</div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="border-t border-slate-100 p-3 flex gap-2"
        >
          <input
            className="input flex-1"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={sending || !input.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
