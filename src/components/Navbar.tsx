import React, { useState } from 'react';
import {
  Wallet,
  Sparkles,
  Bot,
  Layers,
  PlusCircle,
  ChevronDown,
  Globe,
  FileText,
  Calendar,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { PersonaScenario } from '../types';
import { CURRENCIES, formatCurrency } from '../utils/formatters';

interface NavbarProps {
  currentScenario: PersonaScenario;
  onSelectScenario: (scenarioId: string) => void;
  scenarios: PersonaScenario[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onOpenArchitecture: () => void;
  onOpenChat: () => void;
  aiEngineStatus: 'online' | 'ready';
  month: string;
  setMonth: (month: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScenario,
  onSelectScenario,
  scenarios,
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenAddModal,
  onOpenArchitecture,
  onOpenChat,
  aiEngineStatus,
  month,
  setMonth,
}) => {
  const [showScenarioDropdown, setShowScenarioDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'budget', label: 'AI Budget Planner', icon: Sparkles },
    { id: 'tracker', label: 'Income & Expenses', icon: Layers },
    { id: 'savings', label: 'Savings & Emergency Fund', icon: Wallet },
    { id: 'investments', label: 'Predictive & Investments', icon: TrendingUp },
    { id: 'report', label: 'Monthly Report', icon: FileText },
    { id: 'chat', label: 'Advisor Bot', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top utility row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">AI Engine:</span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              Gemini 3.8 Flash Active
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400 pl-3 border-l border-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Period:</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Select Financial Period"
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="September 2026">September 2026 (Current)</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="October 2026 (Forecast)">October 2026 (Forecast)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1 rounded bg-slate-900 px-2 py-1 text-slate-300 hover:text-white border border-slate-800 transition"
              title="Change Currency"
            >
              <Globe className="h-3 w-3 text-slate-400" />
              <span>{currency}</span>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-1 w-44 rounded-lg border border-slate-800 bg-slate-900 p-1 shadow-xl z-50">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.symbol);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs rounded hover:bg-slate-800 transition ${
                      currency === c.symbol ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-400">{c.symbol} ({c.code})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Architecture & Epics link */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 rounded bg-indigo-500/10 px-2.5 py-1 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition font-medium"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            <span>Blueprint & Epics (8)</span>
          </button>
        </div>
      </div>

      {/* Main branding & navigation bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Bot className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition">
                  Personal Finance Advisor Bot
                </h1>
                <span className="hidden sm:inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700">
                  AI-Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intelligent Budgeting • Spending Insights • Financial Planning
              </p>
            </div>
          </div>

          {/* Scenario Selector Dropdown */}
          <div className="relative ml-2 sm:ml-4">
            <button
              onClick={() => setShowScenarioDropdown(!showScenarioDropdown)}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition shadow-sm"
            >
              <span className="text-base">{currentScenario.avatar}</span>
              <div className="text-left hidden md:block">
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Active Scenario</div>
                <div className="text-xs font-semibold text-white">{currentScenario.title}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
            </button>

            {showScenarioDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Simulation Scenario
                </div>
                <div className="mt-1 space-y-1">
                  {scenarios.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        onSelectScenario(sc.id);
                        setShowScenarioDropdown(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition ${
                        currentScenario.id === sc.id
                          ? 'bg-emerald-500/10 border border-emerald-500/30'
                          : 'hover:bg-slate-800/70 border border-transparent'
                      }`}
                    >
                      <span className="text-xl mt-0.5">{sc.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${currentScenario.id === sc.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {sc.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatCurrency(sc.monthlyIncome, currency)}/mo
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {sc.tagline}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition"
          >
            <PlusCircle className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden sm:inline">Log</span> Expense
          </button>

          <button
            onClick={() => onOpenAddModal('income')}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Add</span> Income
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Ask Advisor Bot</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="mx-auto flex max-w-7xl overflow-x-auto px-4 scrollbar-none border-t border-slate-900">
        <div className="flex space-x-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
