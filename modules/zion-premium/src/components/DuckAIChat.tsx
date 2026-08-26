import React, { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, X, MessageSquare, Send, Sparkles, Phone, Mail } from "lucide-react";
import { Streamdown } from "streamdown";
import { Lang } from "@/lib/i18n";

interface DuckAIChatProps {
  language?: Lang;
}

export function DuckAIChat({ language = "pt" }: DuckAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: language === "pt"
        ? "Quack! Sou o DUCK CoLab local. Posso orientar sobre beats, mix, stems e comentários por timestamp. Se eu não tiver certeza, vou dizer isso."
        : language === "es"
        ? "¡Quack! Soy DUCK CoLab local. Puedo orientar sobre beats, mezcla, stems y comentarios por timestamp. Si no estoy seguro, lo diré."
        : language === "en"
        ? "Quack! I am DUCK CoLab local. I can guide beats, mixing, stems and timestamp comments. If I am unsure, I will say so."
        : language === "fr"
        ? "Coin-coin ! Je suis le CoLab local de DUCK. Je peux guider les beats, le mix, les stems et les commentaires horodatés."
        : "Quack! Sono il CoLab locale di DUCK. Posso guidare beat, mix, stem e commenti temporizzati.",
    },
  ]);
  const [input, setInput] = useState("");
  const chatMutation = trpc.duckStudio.aiChat.useMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userText = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: userText }];
    setMessages(newMessages);

    try {
      const res = await chatMutation.mutateAsync({
        message: userText,
        language: language || "pt",
        history: newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
      });
      setMessages([...newMessages, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: language === "pt" ? "Quack! Ops, tive um soluço local no estúdio. Tente de novo." : "Quack! Ocorreu uma falha local no estúdio. Tente novamente." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-[#00ff66] text-black p-3.5 rounded-full shadow-2xl hover:bg-[#00e65c] transition-all transform hover:scale-105 flex items-center gap-3 border-2 border-black"
          aria-label="Abrir DUCK CoLab"
        >
          <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center overflow-hidden border border-black/20">
            <img 
              src="/manus-storage/duck_agent_avatar_c5b3621a.png" 
              alt="DUCK CoLab Mascot" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="font-mono text-xs font-bold pr-2 hidden sm:inline text-black">DUCK CoLab</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-700 border-2 border-black rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-600 border-2 border-black rounded-full" />
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[540px] bg-[#070e07] border border-[#152615] rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          <div className="bg-[#0b1c0d] px-5 py-4 border-b border-[#152615] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ff66]/20 border border-[#00ff66]/40 flex items-center justify-center overflow-hidden">
                <img 
                  src="/manus-storage/duck_agent_avatar_c5b3621a.png" 
                  alt="DUCK Mascot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  DUCK CoLab <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                </h4>
                <p className="text-[10px] font-mono text-[#00ff66]">CoLab local · sem treinamento alegado</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href="https://wa.me/5579996026590"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded-lg hover:bg-black/40 transition-colors"
                title="WhatsApp Direct"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:duck-beats@hotmail.com"
                className="text-[#00ff66] hover:text-emerald-300 p-1.5 rounded-lg hover:bg-black/40 transition-colors"
                title="Email Direct"
              >
                <Mail className="w-4 h-4" />
              </a>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-[#00ff66]/20 border border-[#00ff66]/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src="/manus-storage/duck_agent_avatar_c5b3621a.png" alt="Duck" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#00ff66] text-black font-medium rounded-tr-none"
                      : "bg-[#0b1c0d] text-zinc-200 border border-[#152615] rounded-tl-none"
                  }`}
                >
                  <Streamdown>{m.content}</Streamdown>
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> DUCK CoLab afinando frequências...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3.5 border-t border-[#152615] bg-[#050805] flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Digite sua dúvida sobre mix ou beat..."
              className="bg-[#0b1c0d] text-white text-xs border-[#152615] focus:border-[#00ff66] font-mono"
            />
            <Button onClick={handleSend} disabled={chatMutation.isPending} size="icon" className="bg-[#00ff66] text-black hover:bg-[#00e65c] rounded-xl">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
