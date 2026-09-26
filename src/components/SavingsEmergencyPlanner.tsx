import React, { useState } from 'react';
import {
  ShieldCheck,
  Target,
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { SavingsGoal, ExpenseItem, IncomeItem, PersonaScenario } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SavingsEmergencyPlannerProps {
  scenario: PersonaScenario;
  goals: SavingsGoal[];
  onUpdateGoals: (newGoals: SavingsGoal[]) => void;
  expenses: ExpenseItem[];
  incomeStreams: IncomeItem[];
  currency: string;
}

export const SavingsEmergencyPlanner: React.FC<SavingsEmergencyPlannerProps> = ({
  scenario,
  goals,
  onUpdateGoals,
  expenses,
  incomeStreams,
  currency,
}) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newContribution, setNewContribution] = useState('');
  const [newDate, setNewDate] = useState('2027-06-30');
  const [newCategory, setNewCategory] = useState<SavingsGoal['category']>('Emergency Fund');

  // Compute monthly essential expenses (Needs)
  const essentialExpenses = expenses
    .filter((e) => e.priority === 'Needs')
    .reduce((acc, e) => acc + e.amount, 0);

  const baselineMonthly = essentialExpenses > 0 ? essentialExpenses : 2400;
  const threeMonthRunway = baselineMonthly * 3;
  const sixMonthRunway = baselineMonthly * 6;

  // Emergency Fund Goal lookup
  const emergencyGoal = goals.find((g) => g.category === 'Emergency Fund');
  const currentEmergencyAmount = emergencyGoal ? emergencyGoal.currentAmount : 8000;
  const monthsCovered = (currentEmergencyAmount / (baselineMonthly || 1)).toFixed(1);

  // Quick contribute to a goal
  const handleContribute = (goalId: string, addAmount: number) => {
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: Math.min(g.targetAmount, g.currentAmount + addAmount),
        };
      }
      return g;
    });
    onUpdateGoals(updated);
  };

  // Add new goal
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;

    const newGoalObj: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle,
      targetAmount: parseFloat(newTarget),
      currentAmount: parseFloat(newCurrent) || 0,
      monthlyContribution: parseFloat(newContribution) || 100,
      targetDate: newDate,
      category: newCategory,
      icon: newCategory === 'Emergency Fund' ? '🛡️' : newCategory === 'Travel' ? '✈️' : newCategory === 'Gadget / Tech' ? '💻' : '🎯',
      color: '#10b981',
    };

    onUpdateGoals([...goals, newGoalObj]);
    setNewTitle('');
    setNewTarget('');
    setNewCurrent('');
    setNewContribution('');
    setShowAddGoal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section with Emergency Fund calculator */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Emergency Fund &amp; Savings Engine</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Your financial defense shield. CFP guidelines recommend 3 to 6 months of essential living expenses
              banked in liquid, high-yield cash before aggressive investing.
            </p>
          </div>

          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add New Savings Goal</span>
          </button>
        </div>

        {/* Emergency Fund Calculations Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">Monthly Essential Needs</div>
            <div className="text-lg font-mono font-bold text-white">
              {formatCurrency(baselineMonthly, currency)}
            </div>
            <div className="text-[10px] text-slate-500">Rent, Food, Utilities &amp; Commute</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">3-Month Baseline Target</div>
            <div className="text-lg font-mono font-bold text-indigo-400">
              {formatCurrency(threeMonthRunway, currency)}
            </div>
            <div className="text-[10px] text-slate-500">Minimum safety threshold</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">6-Month Resilient Target</div>
            <div className="text-lg font-mono font-bold text-emerald-400">
              {formatCurrency(sixMonthRunway, currency)}
            </div>
            <div className="text-[10px] text-slate-500">Ideal security for {scenario.title}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">Current Runway Banked</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-mono font-bold text-emerald-400">{monthsCovered}</span>
              <span className="text-xs text-slate-400">Months</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              {parseFloat(monthsCovered) >= 3 ? '✓ Target Met' : '⚠ Buffer Building in Progress'}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Goal Modal / Form */}
      {showAddGoal && (
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Create a New Targeted Savings Goal
            </h3>
            <button
              onClick={() => setShowAddGoal(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateGoal} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Goal Title</label>
              <input
                type="text"
                required
                placeholder="e.g. New Coding Laptop, Down Payment"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Amount ({currency})</label>
              <input
                type="number"
                required
                placeholder="e.g. 5000"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Currently Saved ({currency})</label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={newCurrent}
                onChange={(e) => setNewCurrent(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Monthly Deposit ({currency})</label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={newContribution}
                onChange={(e) => setNewContribution(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Completion Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Travel">Travel &amp; Vacation</option>
                <option value="Gadget / Tech">Gadget / Tech</option>
                <option value="Education">Education</option>
                <option value="Home">Home &amp; Real Estate</option>
                <option value="Retirement">Retirement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const monthsLeft = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : 0;

          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {goal.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{goal.category}</span>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400">{pct}%</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-white font-semibold">{formatCurrency(goal.currentAmount, currency)}</span>
                    <span>Target: {formatCurrency(goal.targetAmount, currency)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-slate-800/80">
                  <div className="p-2 rounded-lg bg-slate-950/40">
                    <span className="text-slate-500 block">Monthly Rate</span>
                    <span className="font-mono text-slate-300 font-semibold">
                      +{formatCurrency(goal.monthlyContribution, currency)}/mo
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/40">
                    <span className="text-slate-500 block">Estimated Finish</span>
                    <span className="font-mono text-slate-300 font-semibold">
                      {monthsLeft > 0 ? `${monthsLeft} mos (${goal.targetDate})` : 'Completed!'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick simulation deposit buttons */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Simulate Cash Inflow:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleContribute(goal.id, 50)}
                    className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-semibold border border-slate-700 transition text-center"
                  >
                    +50
                  </button>
                  <button
                    onClick={() => handleContribute(goal.id, 100)}
                    className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-semibold border border-slate-700 transition text-center"
                  >
                    +100
                  </button>
                  <button
                    onClick={() => handleContribute(goal.id, 250)}
                    className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs font-semibold border border-slate-700 transition text-center"
                  >
                    +250
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
