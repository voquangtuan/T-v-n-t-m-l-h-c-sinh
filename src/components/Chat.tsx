import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, AlertCircle } from 'lucide-react';
import { chatWithAI, analyzePsychology, AnalysisResult } from '../services/gemini';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
  analysis?: AnalysisResult;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Analyze psychology in background or for specific messages
      // For now, we analyze every user message to track mood
      const analysis = await analyzePsychology(userMessage);
      
      // Save analysis to localStorage for dashboard
      const history = JSON.parse(localStorage.getItem('mood_history') || '[]');
      history.push({
        date: new Date().toISOString(),
        ...analysis
      });
      localStorage.setItem('mood_history', JSON.stringify(history));

      const aiResponse = await chatWithAI(userMessage, messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })));

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: aiResponse,
        analysis: analysis.isAbnormal ? analysis : undefined
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Xin lỗi, mình gặp chút trục trặc kỹ thuật. Bạn có thể thử lại sau ít phút được không?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-sm border border-brand-olive/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-bottom border-brand-olive/10 bg-brand-olive/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-olive flex items-center justify-center text-white">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg">Tâm An</h3>
          <p className="text-xs text-brand-olive/60">Luôn lắng nghe bạn</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-cream/20">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <p className="text-brand-olive/60 italic font-serif text-lg">
              "Chào bạn, mình là Tâm An. Hôm nay của bạn thế nào? Có điều gì làm bạn bận lòng không?"
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex flex-col gap-2",
            msg.role === 'user' ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm",
              msg.role === 'user' 
                ? "bg-brand-olive text-white rounded-tr-none" 
                : "bg-white border border-brand-olive/10 rounded-tl-none shadow-sm"
            )}>
              <div className="markdown-body">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
            
            {msg.analysis && msg.analysis.isAbnormal && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-2 rounded-lg text-xs border border-red-100 max-w-[80%]">
                <AlertCircle size={14} />
                <span>Phát hiện dấu hiệu bất thường: {msg.analysis.summary}</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-brand-olive/40 italic text-sm">
            <Loader2 className="animate-spin" size={16} />
            <span>Tâm An đang suy nghĩ...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-brand-olive/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Chia sẻ với Tâm An..."
            className="flex-1 bg-brand-cream/50 border border-brand-olive/10 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive/20 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-brand-olive text-white flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
