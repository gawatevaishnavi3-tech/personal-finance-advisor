import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingDown,
  Shield,
  Bot,
} from 'lucide-react';
import { PersonaScenario, ExpenseItem, IncomeItem, SavingsGoal, AIBudgetPlanResponse } from '../types';
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../utils/formatters';

interface AIBudgetPlannerProps {
  scenario: PersonaScenario;
  incomeStreams: IncomeItem[];
  expenses: ExpenseItem[];
  budgets: Record<string, number>;
  onUpdateBudgets: (newBudgets: Record<string, number>) => void;
  goals: SavingsGoal[];
  currency: string;
  onOpenChat: () => void;
}

export const AIBudgetPlanner: React.FC<AIBudgetPlannerProps> = ({
  scenario,
  incomeStreams,
  expenses,
  budgets,
  onUpdateBudgets,
  goals,
  currency,
  onOpenChat,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'50-30-20' | 'zero-based' | 'student-lean' | 'freelancer-buffer'>('50-30-20');
  const [aiPlan, setAiPlan] = useState<AIBudgetPlanResponse | null>(null);
  const [localBudgets, setLocalBudgets] = useState<Record<string, number>>(budgets);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalIncome = incomeStreams.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const totalAllocated = Object.values(localBudgets).reduce((acc, b) => acc + (Number(b) || 0), 0);
  const unallocatedSurplus = totalIncome - totalAllocated;

  // Handle budget slider change
  const handleSliderChange = (category: string, value: number) => {
    setLocalBudgets((prev) => ({
      ...prev,
      [category]: value,
    }));
    setSavedSuccess(false);
  };

  // Save changes to parent state
  const handleApplyBudgets = () => {
    onUpdateBudgets(localBudgets);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Call Gemini API on backend to generate a budget plan
  const handleGenerateAIBudget = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/generate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: totalIncome,
          expenses,
          currentBudgets: budgets,
          persona: scenario.title,
          goals,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate budget');
      }

      const data = await response.json();
      if (data.plan) {
        setAiPlan(data.plan);

        // Convert breakdown into local budget map
        const newMap: Record<string, number> = {};
        for (const item of data.plan.budgetBreakdown) {
          newMap[item.category] = item.allocatedAmount;
        }
        setLocalBudgets(newMap);
      }
    } catch (err) {
      console.error('Error generating AI budget:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with generation CTA */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-white">AI-Powered Budget Generator</h2>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Analyzes your monthly take-home cash flow of{' '}
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(totalIncome, currency)}</span>,
              detects spending leaks across recent transactions, and constructs a customized allocation aligned with your financial scenario.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateAIBudget}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate AI Budget Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Budget Strategy selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2 font-medium">Framework Strategy:</span>
          {[
            { id: '50-30-20', label: '50/30/20 Rule (Standard)' },
            { id: 'zero-based', label: 'Zero-Based Allocation' },
            { id: 'student-lean', label: 'Student Lean Margin' },
            { id: 'freelancer-buffer', label: 'Freelancer Variable Buffer' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedModel === m.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Analysis Summary if generated */}
      {aiPlan && (
        <div className="space-y-4">
          {/* Executive Overview banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Advisor Executive Assessment
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {aiPlan.executiveSummary}
                </p>
                <div className="flex items-center gap-4 pt-2 text-xs font-mono">
                  <span className="text-slate-400">
                    Target Monthly Savings:{' '}
                    <strong className="text-emerald-400">{formatCurrency(aiPlan.recommendedSavings, currency)}</strong>
                  </span>
                  <span className="text-slate-400">
                    Savings Quota:{' '}
                    <strong className="text-emerald-400">{aiPlan.savingsTargetPercentage}%</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Savings Hacks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiPlan.actionableSavingsHacks.map((hack, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    {hack.title}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      hack.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : hack.difficulty === 'Moderate'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {hack.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{hack.action}</p>
                <div className="pt-2 text-xs font-mono text-emerald-400 font-semibold border-t border-slate-800 flex items-center justify-between">
                  <span>Potential Monthly Recovery:</span>
                  <span>+{formatCurrency(hack.potentialMonthlySavings, currency)}/mo</span>
                </div>
              </div>
            ))}
          </div>

          {/* Warnings if any */}
          {aiPlan.spendingWarnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>AI Spending Warning Flags</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-6 list-disc">
                {aiPlan.spendingWarnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Interactive Budget Allocations & Sliders */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              Interactive Category Allocations
            </h3>
            <p className="text-xs text-slate-400">
              Fine-tune monthly spending limits. Total monthly income is{' '}
              <strong className="text-white font-mono">{formatCurrency(totalIncome, currency)}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Unallocated Surplus</div>
              <div
                className={`text-sm font-mono font-bold ${
                  unallocatedSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(unallocatedSurplus, currency)}
              </div>
            </div>

            <button
              onClick={handleApplyBudgets}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Active Budgets</span>
              )}
            </button>
          </div>
        </div>

        {/* Category Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {Object.entries(localBudgets).map(([category, amount]) => {
            const pctOfIncome = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
            const color = getCategoryColor(category);
            const actualSpent = expenses
              .filter((e) => e.category === category)
              .reduce((acc, e) => acc + e.amount, 0);
            const isOverspent = actualSpent > amount;

            return (
              <div key={category} className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getCategoryEmoji(category)}</span>
                    <span className="font-semibold text-slate-200">{category}</span>
                    {isOverspent && (
                      <span className="text-[10px] text-rose-400 font-semibold px-1 rounded bg-rose-500/10 border border-rose-500/30">
                        Over by {formatCurrency(actualSpent - amount, currency)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs text-slate-400 font-semibold">
                      {pctOfIncome}% of income
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      {formatCurrency(amount, currency)}
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max={Math.max(totalIncome, 3000)}
                  step="25"
                  value={amount}
                  onChange={(e) => handleSliderChange(category, parseInt(e.target.value, 10))}
                  aria-label={`Budget limit for ${category}`}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                {/* Actual vs Budget Indicator */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Actual logged: {formatCurrency(actualSpent, currency)}</span>
                  <span>Cap: {formatCurrency(amount, currency)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Chat */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Bot className="h-4 w-4 text-emerald-400" />
            <span>Need personalized recommendations on optimizing individual line items?</span>
          </div>
          <button
            onClick={onOpenChat}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Ask Advisor Bot for a Custom Reduction Strategy</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
