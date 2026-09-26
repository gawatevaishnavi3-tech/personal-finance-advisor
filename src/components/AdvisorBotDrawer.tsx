import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Trash2,
  CheckCircle,
  TrendingUp,
  X,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, PersonaScenario, ExpenseItem, IncomeItem, SavingsGoal } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AdvisorBotDrawerProps {
  scenario: PersonaScenario;
  expenses: ExpenseItem[];
  incomeStreams: IncomeItem[];
  goals: SavingsGoal[];
  currency: string;
  isDrawer?: boolean;
  onClose?: () => void;
}

export const AdvisorBotDrawer: React.FC<AdvisorBotDrawerProps> = ({
  scenario,
  expenses,
  incomeStreams,
  goals,
  currency,
  isDrawer = false,
  onClose,
}) => {
  const totalIncome = incomeStreams.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

  const defaultMessages: ChatMessage[] = [
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${scenario.name}! I'm your Personal Finance Advisor Bot powered by Gemini 3.8 Flash.

I have synchronized with your live ledger for **${scenario.title}**:
- **Monthly Inflow**: ${formatCurrency(totalIncome, currency)}
- **Logged Outflow**: ${formatCurrency(totalExpenses, currency)}
- **Current Savings Achieved**: ${formatCurrency(netSavings, currency)} (${savingsRate}% savings rate)
- **Top Priority Goal**: ${goals[0]?.title || 'Emergency Buffer'}

How can I help you optimize your cash flow, eliminate budget leaks, or accelerate your savings today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash',
      suggestions: [
        'How can I save $250 more this month?',
        'Audit my dining and entertainment spending',
        'Should I build my emergency fund or invest?',
        'Analyze my budget according to the 50/30/20 rule',
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`finance_chat_${scenario.id}`);
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(`finance_chat_${scenario.id}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, scenario.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Find top categories
      const catTotals: Record<string, number> = {};
      expenses.forEach((e) => {
        catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
      });
      const topCategories = Object.entries(catTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([cat, amt]) => ({ category: cat, spent: amt }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          financialContext: {
            totalIncome,
            totalExpenses,
            savingsRate: `${savingsRate}%`,
            persona: scenario.title,
            topCategories,
            goals: goals.map((g) => ({ title: g.title, target: g.targetAmount, current: g.currentAmount })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'I analyzed your query. Let us focus on maintaining consistent cash flow discipline.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash',
        suggestions: [
          'What is my single biggest spending leak?',
          'Give me a 3-step action plan for next week',
        ],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: `Based on your current numbers ($${totalIncome.toLocaleString()} income, $${totalExpenses.toLocaleString()} expenses):
- Your active savings rate is **${savingsRate}%**.
- Your top expense category is **${expenses[0]?.category || 'Housing'}**.
- Recommended focus: Maintain your 3-6 month emergency runway while keeping non-essential discretionary wants below 30% of take-home pay.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'expert-heuristic-engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(defaultMessages);
    localStorage.removeItem(`finance_chat_${scenario.id}`);
  };

  return (
    <div className={`flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md overflow-hidden ${
      isDrawer ? 'h-full max-h-[85vh]' : 'h-[750px]'
    }`}>
      {/* Drawer / Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Bot className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Personal Finance Advisor Bot</h3>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Context-Aware Certified Financial Planner &amp; Money Strategist
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition"
            title="Reset conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {isDrawer && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Financial Context Tag */}
      <div className="bg-slate-950/90 px-5 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>Inflow: <strong className="text-emerald-400">{formatCurrency(totalIncome, currency)}</strong></span>
          <span>•</span>
          <span>Outflow: <strong className="text-rose-400">{formatCurrency(totalExpenses, currency)}</strong></span>
          <span>•</span>
          <span>Saved: <strong className="text-white">{savingsRate}%</strong></span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">Scenario: {scenario.title}</span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex items-start gap-2.5 max-w-[85%] ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 shadow-sm space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none leading-relaxed'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400/80 pt-1 border-t border-slate-800/40">
                  <span>{msg.timestamp}</span>
                  {msg.source && (
                    <span className="text-[9px] font-mono text-emerald-400/80">
                      {msg.source}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions Chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                {msg.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition text-left flex items-center gap-1"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-slate-400 pl-2">
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
            <span>Personal Finance Advisor Bot is thinking and analyzing ledger...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask about your ${scenario.title} finances, savings hacks, debt, or budgets...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition disabled:opacity-40 shrink-0 shadow-md shadow-emerald-500/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
