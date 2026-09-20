import React, { useState, useRef, useEffect } from 'react';
import { useCasino } from '../context/CasinoContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Users,
  Trophy,
  Flame,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LiveChatSidebar: React.FC = () => {
  const {
    isChatOpen,
    toggleChat,
    chatMessages,
    sendChatMessage,
    onlineUsersCount,
    userProfile,
  } = useCasino();

  const [inputMessage, setInputMessage] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'wins' | 'ai'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickPrompt = (promptText: string) => {
    sendChatMessage(promptText);
  };

  const filteredMessages = chatMessages.filter((msg) => {
    if (filterMode === 'wins') return msg.isWinAnnouncement;
    if (filterMode === 'ai') return msg.isAiHost;
    return true;
  });

  return (
    <>
      {/* Floating Chat Trigger Pill when Collapsed */}
      {!isChatOpen && (
        <button
          id="floating-live-chat-pill"
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-amber-400/40 text-white font-mono text-xs font-bold shadow-2xl shadow-black/80 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xl group"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>VIP Live Chat</span>
          <span className="px-2 py-0.5 rounded-full bg-black/60 text-slate-300 border border-white/10 text-[10px]">
            {onlineUsersCount} online
          </span>
        </button>
      )}

      {/* Slide-Over Live Chat Sidebar */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 z-50 bg-[#070B14]/98 border-l border-amber-400/30 backdrop-blur-2xl shadow-2xl flex flex-col text-left"
          >
            {/* Chat Top Header */}
            <div className="p-4 border-b border-white/10 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-600 to-amber-700 flex items-center justify-center text-black font-black text-sm shadow-md">
                    <Crown className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#070B14] rounded-full" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-luxury font-black text-sm text-white tracking-wide">
                      AETHERIUS VIP LOUNGE
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{onlineUsersCount} VIPs Online</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">AI Concierge Active</span>
                  </p>
                </div>
              </div>

              <button
                id="close-chat-sidebar-btn"
                onClick={toggleChat}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Host Greeting Banner */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-blue-950/60 to-purple-950/60 border-b border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="text-slate-200 font-medium">
                  Host: <span className="text-blue-300 font-bold">Layla Al-Aetherius 🤖</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">EN / AR Concierge</span>
            </div>

            {/* Chat Filter Tabs */}
            <div className="flex border-b border-white/10 bg-black/40 px-3 pt-1.5 gap-1 text-[11px] font-mono">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-t-lg transition cursor-pointer font-bold ${
                  filterMode === 'all'
                    ? 'bg-white/10 text-amber-300 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Messages
              </button>
              <button
                onClick={() => setFilterMode('wins')}
                className={`px-3 py-1.5 rounded-t-lg transition cursor-pointer font-bold flex items-center gap-1 ${
                  filterMode === 'wins'
                    ? 'bg-white/10 text-amber-300 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Wins Only</span>
              </button>
              <button
                onClick={() => setFilterMode('ai')}
                className={`px-3 py-1.5 rounded-t-lg transition cursor-pointer font-bold flex items-center gap-1 ${
                  filterMode === 'ai'
                    ? 'bg-white/10 text-blue-300 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3 h-3 text-blue-400" />
                <span>AI Host Tips</span>
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
              {filteredMessages.map((msg) => {
                const isUser = msg.sender === userProfile.username;
                const isArabic = msg.language === 'ar' || (msg.language === 'both' && /[\u0600-\u06FF]/.test(msg.text));

                // High Roller Win Banner
                if (msg.isWinAnnouncement && msg.winDetails) {
                  return (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-400/50 shadow-lg shadow-amber-500/5 text-center space-y-1 my-2"
                    >
                      <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>HIGH-ROLLER MULTIPLIER HIT</span>
                      </div>
                      <p className="text-xs text-white font-medium">{msg.text}</p>
                      <div className="flex items-center justify-center gap-3 pt-1 text-[11px] font-mono">
                        <span className="text-emerald-400 font-bold">+${msg.winDetails.amount.toLocaleString()} USDT</span>
                        <span className="px-2 py-0.5 rounded bg-black/40 text-amber-400 border border-amber-400/30">
                          {msg.winDetails.multiplier}
                        </span>
                      </div>
                    </div>
                  );
                }

                // AI Concierge Host Message
                if (msg.isAiHost) {
                  return (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-blue-400/40 shadow-md space-y-1.5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={msg.avatar}
                            alt={msg.sender}
                            className="w-6 h-6 rounded-full object-cover border border-blue-400"
                          />
                          <span className="text-xs font-bold text-blue-300 font-mono">{msg.sender}</span>
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-mono font-bold">
                            AI VIP CONCIERGE
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                      </div>

                      <p
                        className={`text-xs text-slate-200 leading-relaxed ${
                          isArabic ? 'text-right font-sans' : 'font-sans'
                        }`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        {msg.text}
                      </p>
                    </div>
                  );
                }

                // Standard Player Message
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2">
                      {msg.avatar && (
                        <img
                          src={msg.avatar}
                          alt={msg.sender}
                          className="w-5 h-5 rounded-md object-cover border border-white/20"
                        />
                      )}
                      <span className="text-xs font-bold text-slate-200 font-mono">{msg.sender}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-amber-400 font-mono">
                        {msg.vipTier}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        isUser
                          ? 'bg-amber-400 text-black font-medium rounded-tr-none'
                          : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                      } ${isArabic ? 'text-right' : ''}`}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Interactive Prompt Suggestions */}
            <div className="px-3 py-2 bg-slate-950/90 border-t border-white/5 overflow-x-auto scrollbar-none flex gap-1.5">
              <button
                onClick={() => handleQuickPrompt('How fast is the instant withdrawal?')}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono transition whitespace-nowrap cursor-pointer border border-white/10"
              >
                ⚡ Instant Cashout Speed?
              </button>
              <button
                onClick={() => handleQuickPrompt('كيف يعمل برنامج الـ 25% RevShare؟')}
                className="px-2.5 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-[11px] font-sans transition whitespace-nowrap cursor-pointer border border-amber-400/30"
                dir="rtl"
              >
                💎 كيف يعمل الـ 25% RevShare؟
              </button>
              <button
                onClick={() => handleQuickPrompt('Is this Provably Fair SHA-256?')}
                className="px-2.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-mono transition whitespace-nowrap cursor-pointer border border-blue-500/30"
              >
                🛡️ Provably Fair Check
              </button>
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-white/10 bg-slate-950/90 flex items-center gap-2"
            >
              <input
                id="live-chat-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message high-rollers or ask Layla AI..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition font-sans"
              />
              <button
                id="live-chat-send-btn"
                type="submit"
                disabled={!inputMessage.trim()}
                className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                  inputMessage.trim()
                    ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
