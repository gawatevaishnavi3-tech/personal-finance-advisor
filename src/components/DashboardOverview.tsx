import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Target,
  Sparkles,
  Bot,
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { PersonaScenario, ExpenseItem, IncomeItem, SavingsGoal } from '../types';
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../utils/formatters';

interface DashboardOverviewProps {
  scenario: PersonaScenario;
  expenses: ExpenseItem[];
  incomeStreams: IncomeItem[];
  budgets: Record<string, number>;
  goals: SavingsGoal[];
  currency: string;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onOpenChat: () => void;
  onDeleteExpense: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  scenario,
  expenses,
  incomeStreams,
  budgets,
  goals,
  currency,
  onNavigateTab,
  onOpenAddModal,
  onOpenChat,
  onDeleteExpense,
}) => {
  // Calculations
  const totalIncome = incomeStreams.reduce((acc, inc) => acc + (Number(inc.amount) || 0), 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Needs vs Wants vs Savings breakdown
  const needsSpent = expenses
    .filter((e) => e.priority === 'Needs')
    .reduce((acc, e) => acc + e.amount, 0);
  const wantsSpent = expenses
    .filter((e) => e.priority === 'Wants')
    .reduce((acc, e) => acc + e.amount, 0);

  const needsPct = totalIncome > 0 ? Math.round((needsSpent / totalIncome) * 100) : 0;
  const wantsPct = totalIncome > 0 ? Math.round((wantsSpent / totalIncome) * 100) : 0;
  const savingsPct = Math.max(0, Math.round(savingsRate));

  // Category totals
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  }

  // Find top overspending categories
  const overspentCategories = Object.entries(categoryTotals)
    .filter(([cat, spent]) => {
      const budget = budgets[cat] || 0;
      return budget > 0 && spent > budget;
    })
    .map(([cat, spent]) => ({
      category: cat,
      spent,
      budget: budgets[cat] || 0,
      overrun: spent - (budgets[cat] || 0),
      percentageOver: Math.round(((spent - (budgets[cat] || 0)) / (budgets[cat] || 1)) * 100),
    }))
    .sort((a, b) => b.overrun - a.overrun);

  // Health Score Calculation
  let healthScore = 75;
  if (savingsRate >= 25) healthScore += 15;
  else if (savingsRate >= 15) healthScore += 8;
  else if (savingsRate < 5) healthScore -= 18;

  if (overspentCategories.length === 0) healthScore += 10;
  else healthScore -= overspentCategories.length * 5;

  if (totalExpenses < totalIncome) healthScore += 5;
  else healthScore -= 25;

  healthScore = Math.min(99, Math.max(25, healthScore));

  let healthGrade = 'B+';
  let healthBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  if (healthScore >= 90) {
    healthGrade = 'A+';
    healthBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (healthScore >= 80) {
    healthGrade = 'A';
    healthBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (healthScore >= 70) {
    healthGrade = 'B';
    healthBadgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  } else if (healthScore >= 55) {
    healthGrade = 'C';
    healthBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else {
    healthGrade = 'D';
    healthBadgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  // Calculate Emergency Fund months
  const monthlyEssentialBurn = needsSpent > 0 ? needsSpent : totalExpenses * 0.7;
  const emergencyGoal = goals.find((g) => g.category === 'Emergency Fund');
  const currentEmergencyCash = emergencyGoal ? emergencyGoal.currentAmount : netSavings * 3;
  const emergencyRunwayMonths = monthlyEssentialBurn > 0 ? (currentEmergencyCash / monthlyEssentialBurn).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Persona Context Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-5 shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700 text-3xl shadow-inner">
              {scenario.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  {scenario.badge}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-medium">{scenario.name}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {scenario.tagline}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {scenario.scenarioStory}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => onNavigateTab('budget')}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>AI Budget Plan</span>
            </button>
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Ask Advisor</span>
            </button>
          </div>
        </div>

        {/* Challenge & AI Strategy bar */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-amber-300 bg-amber-500/5 px-3 py-2 rounded-lg border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <span className="font-semibold text-amber-400">Core Challenge: </span>
              <span className="text-slate-300">{scenario.keyChallenge}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/5 px-3 py-2 rounded-lg border border-emerald-500/20">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <span className="font-semibold text-emerald-400">AI Recommendation: </span>
              <span className="text-slate-300">{scenario.aiStrategy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Monthly Inflow</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
              {formatCurrency(totalIncome, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span className="font-medium text-emerald-400">{incomeStreams.length} stream{incomeStreams.length === 1 ? '' : 's'}</span>
              <span>•</span>
              <span className="truncate">{incomeStreams[0]?.source || 'Primary Salary'}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Recurring auto-deposit</span>
            <button
              onClick={() => onOpenAddModal('income')}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Spent</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
              {formatCurrency(totalExpenses, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              <span className={`font-semibold ${totalExpenses > totalIncome ? 'text-rose-400' : 'text-slate-300'}`}>
                {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0}%
              </span>
              <span>of monthly income</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <span>{expenses.length} transactions logged</span>
            <button
              onClick={() => onOpenAddModal('expense')}
              className="text-rose-400 hover:text-rose-300 font-medium"
            >
              + Log
            </button>
          </div>
        </div>

        {/* Net Savings Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Net Monthly Savings</span>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${netSavings >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-2xl font-bold font-mono tracking-tight ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netSavings, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                savingsRate >= 20 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {savingsRate.toFixed(1)}% savings rate
              </span>
              <span className="text-slate-400 text-[11px]">{savingsRate >= 20 ? 'Target achieved' : 'Target: 20%'}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Buffer pace: healthy</span>
            <button
              onClick={() => onNavigateTab('savings')}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View Goals
            </button>
          </div>
        </div>

        {/* Financial Health Score Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Financial Health</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-white">{healthScore}</span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${healthBadgeColor}`}>
              Grade {healthGrade}
            </span>
          </div>
          <div className="mt-2">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  healthScore >= 80 ? 'bg-emerald-400' : healthScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Emergency: {emergencyRunwayMonths} mo</span>
            <button
              onClick={() => onNavigateTab('report')}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Full Audit
            </button>
          </div>
        </div>
      </div>

      {/* Active Overspending Warning Callout */}
      {overspentCategories.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                <span>Budget Overrun Alert</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300 font-bold">
                  {overspentCategories.length} categor{overspentCategories.length === 1 ? 'y' : 'ies'} exceeding limit
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <span className="font-semibold text-white">{overspentCategories[0].category}</span> is{' '}
                <span className="text-rose-400 font-mono font-semibold">
                  +{formatCurrency(overspentCategories[0].overrun, currency)} ({overspentCategories[0].percentageOver}%)
                </span>{' '}
                over its planned budget of {formatCurrency(overspentCategories[0].budget, currency)}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('budget')}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition shrink-0"
          >
            Adjust Budget
          </button>
        </div>
      )}

      {/* Middle Section: 50/30/20 Rule Breakdown & Category Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 50/30/20 Visual Framework */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <PieChart className="h-4 w-4 text-emerald-400" />
                  50 / 30 / 20 Framework
                </h3>
                <p className="text-xs text-slate-400">Needs vs Wants vs Savings</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {savingsPct}% saved
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-indigo-500 transition-all duration-500"
                style={{ width: `${Math.min(100, needsPct)}%` }}
                title={`Needs: ${needsPct}%`}
              />
              <div
                className="bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.min(100 - needsPct, wantsPct)}%` }}
                title={`Wants: ${wantsPct}%`}
              />
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100 - needsPct - wantsPct, savingsPct)}%` }}
                title={`Savings: ${savingsPct}%`}
              />
            </div>

            {/* Legend with comparison to standard */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                  <div>
                    <div className="text-xs font-semibold text-white">Needs (Housing, Food, Utilities)</div>
                    <div className="text-[11px] text-slate-400">Target: 50% | Actual: {needsPct}%</div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-semibold text-slate-200">
                  {formatCurrency(needsSpent, currency)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <div>
                    <div className="text-xs font-semibold text-white">Wants (Dining, Events, Fun)</div>
                    <div className="text-[11px] text-slate-400">Target: 30% | Actual: {wantsPct}%</div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-semibold text-slate-200">
                  {formatCurrency(wantsSpent, currency)}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <div>
                    <div className="text-xs font-semibold text-white">Savings & Debt Buffer</div>
                    <div className="text-[11px] text-slate-400">Target: 20% | Actual: {savingsPct}%</div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs font-semibold text-emerald-400">
                  {formatCurrency(netSavings, currency)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('budget')}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Explore AI Budget Allocation</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Category Budget Utilization Bars */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Target className="h-4 w-4 text-emerald-400" />
                Category Budget Utilization
              </h3>
              <p className="text-xs text-slate-400">Monthly actual spend vs allocated ceiling</p>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Edit Budgets
            </button>
          </div>

          <div className="space-y-3.5">
            {Object.entries(budgets)
              .filter(([cat]) => cat !== 'Savings & Investments')
              .slice(0, 6)
              .map(([cat, limit]) => {
                const spent = categoryTotals[cat] || 0;
                const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const isOver = spent > limit;
                const color = getCategoryColor(cat);

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span>{getCategoryEmoji(cat)}</span>
                        <span className="font-medium text-slate-200">{cat}</span>
                        {isOver && (
                          <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-rose-400 border border-rose-500/30">
                            +{pct - 100}% over
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className={isOver ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                          {formatCurrency(spent, currency)}
                        </span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">{formatCurrency(limit, currency)}</span>
                        <span className="text-slate-500 w-10 text-right">({pct}%)</span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : pct > 85 ? 'bg-amber-400' : color.bar
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Showing top 6 priority categories</span>
            <button
              onClick={() => onNavigateTab('tracker')}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All in Tracker &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Savings Goals Preview & Recent Ledger Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Goals Runway */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Savings & Safety Net
              </h3>
              <p className="text-xs text-slate-400">Active savings milestones</p>
            </div>
            <button
              onClick={() => onNavigateTab('savings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{goal.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-white">{goal.title}</div>
                        <div className="text-[10px] text-slate-400">Target: {goal.targetDate}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{pct}%</span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{formatCurrency(goal.currentAmount, currency)}</span>
                    <span className="text-slate-500">goal: {formatCurrency(goal.targetAmount, currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-400" />
                Recent Daily Transactions
              </h3>
              <p className="text-xs text-slate-400">Latest expenses logged across categories</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAddModal('expense')}
                className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-xs text-slate-200 border border-slate-700 transition"
              >
                <Plus className="h-3 w-3 text-emerald-400" />
                <span>Log Expense</span>
              </button>
              <button
                onClick={() => onNavigateTab('tracker')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                View Ledger
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {expenses.slice(0, 5).map((exp) => {
              const color = getCategoryColor(exp.category);
              return (
                <div key={exp.id} className="py-2.5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCategoryEmoji(exp.category)}</span>
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white transition">
                        {exp.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className={`px-1.5 py-0.2 rounded border text-[9px] ${color.border} ${color.text} ${color.bg}`}>
                          {exp.category}
                        </span>
                        <span>{exp.date}</span>
                        <span>•</span>
                        <span>{exp.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      -{formatCurrency(exp.amount, currency)}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs transition p-1"
                      title="Delete transaction"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {expenses.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No transactions logged yet. Click &quot;Log Expense&quot; to begin!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
