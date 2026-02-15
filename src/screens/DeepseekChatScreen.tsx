"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  Sparkles,
  User,
  Copy,
  Check,
  AlertCircle
} from "lucide-react";
import { IconButton } from "../components/ui";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// Приветственное сообщение от Deepseek
const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Здравствуйте! Я Deepseek — ваш ИИ-ассистент. Задайте мне любой вопрос, и я с удовольствием помогу!",
  timestamp: new Date()
};

export default function DeepseekChatScreen({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Фокус на поле ввода при загрузке
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Обработчик свайпа вправо
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Проверяем, что свайп был преимущественно горизонтальным
    const isHorizontalSwipe = Math.abs(info.offset.x) > Math.abs(info.offset.y) * 2;
    
    // Если свайпнули вправо больше чем на 100px и это был горизонтальный свайп
    if (isHorizontalSwipe && info.offset.x > 100) {
      onBack();
    }
  };

  // Отправка сообщения в Deepseek API
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Не удалось получить ответ от Deepseek. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Копирование текста сообщения
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-50 flex flex-col">
      {/* Шапка - всегда видна */}
      <div className="sticky top-0 z-20 bg-white border-b border-zinc-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Sparkles size={16} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="font-semibold text-zinc-900">GPT Помощник</h1>
              <p className="text-xs text-zinc-500">Powered by Deepseek</p>
            </div>
          </div>
        </div>
      </div>

      {/* Контейнер для свайпа и сообщений */}
      <motion.div 
        className="flex-1 overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        dragPropagation={false}
        dragMomentum={false}
      >
        {/* Сообщения с вертикальным скроллом */}
        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Аватар */}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user"
                          ? "bg-zinc-200"
                          : "bg-emerald-100"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User size={14} className="text-zinc-600" />
                      ) : (
                        <Sparkles size={14} className="text-emerald-600" />
                      )}
                    </div>

                    {/* Сообщение */}
                    <div className="relative group">
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm ${
                          message.role === "user"
                            ? "bg-zinc-900 text-white"
                            : "bg-white border border-zinc-200 text-zinc-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        
                        {/* Время и кнопка копирования */}
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className={`text-[10px] ${message.role === "user" ? "text-zinc-400" : "text-zinc-400"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => handleCopy(message.content, message.id)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                              message.role === "user" ? "text-zinc-400 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"
                            }`}
                          >
                            {copiedId === message.id ? (
                              <Check size={12} className="text-green-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Индикатор печатания */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-2 max-w-[80%]">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-emerald-600" />
                  </div>
                  <div className="bg-white border border-zinc-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Ошибка */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </motion.div>

      {/* Поле ввода */}
      <div className="bg-white border-t border-zinc-200 px-4 py-3 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Спросите у Deepseek..."
            className="flex-1 h-11 px-4 bg-zinc-100 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            disabled={isLoading}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-11 w-11 bg-emerald-600 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-zinc-300 hover:bg-emerald-700 transition-colors"
          >
            <Send size={18} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}