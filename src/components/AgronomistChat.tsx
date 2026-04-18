import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, User, Bot, Loader2 } from "lucide-react";
import { AnalysisResult } from "../types";
import { chatWithAgronomist } from "../services/gemini";
import { cn } from "../lib/utils";

interface ChatProps {
  result: AnalysisResult;
  forceOpen?: boolean;
  onClose?: () => void;
}

interface Message {
  role: "user" | "model";
  text: string;
}

export const AgronomistChat = ({ result, forceOpen = false, onClose }: ChatProps) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const closeChat = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: `Hello! I'm your AI Agronomist. I've analyzed your crop and found ${result.disease_name}. Do you have any questions about the treatment?` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    try {
      const responseText = await chatWithAgronomist(result, messages.slice(1), userMsg);
      setMessages(prev => [...prev, { role: "model", text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", text: "Sorry, I'm having trouble responding right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-editorial-emerald text-bg-deep rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-transform z-50 focus:outline-none"
          >
            <MessageSquare className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[340px] md:w-[400px] h-[500px] max-h-[80vh] glass rounded-2xl flex flex-col overflow-hidden z-50 border border-editorial-emerald/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-editorial-emerald/20 flex items-center justify-center text-editorial-emerald">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-widest uppercase">Ask AI Agronomist</h3>
                  <div className="text-[10px] text-editorial-emerald flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-editorial-emerald animate-pulse"></span>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={closeChat}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "flex items-start gap-3 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1",
                    msg.role === "user" ? "bg-white/20" : "bg-editorial-emerald/20 text-editorial-emerald"
                  )}>
                    {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-white/10 text-white rounded-tr-sm" 
                      : "bg-black/40 text-white/90 border border-white/5 rounded-tl-sm"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3 mr-auto max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-editorial-emerald/20 flex items-center justify-center shrink-0 mt-1 text-editorial-emerald">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 rounded-tl-sm flex items-center gap-1.5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-editorial-emerald rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-editorial-emerald rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-editorial-emerald rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black/20 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about the crop..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:border-editorial-emerald/50 focus:bg-white/10 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-editorial-emerald text-bg-deep rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
