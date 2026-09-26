import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  Award,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { PersonaScenario, ExpenseItem, IncomeItem, SavingsGoal, MonthlyReportResponse } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MonthlyReportViewProps {
  scenario: PersonaScenario;
  expenses: ExpenseItem[];
  incomeStreams: IncomeItem[];
  budgets: Record<string, number>;
  goals: SavingsGoal[];
  currency: string;
  month: string;
  onOpenChat: () => void;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  scenario,
  expenses,
  incomeStreams,
  budgets,
  goals,
  currency,
  month,
  onOpenChat,
}) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<MonthlyReportResponse | null>(null);

  const totalIncome = incomeStreams.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Generate or fetch report
  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/monthly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          income: totalIncome,
          expenses,
          budgets,
          persona: scenario.title,
          goals,
        }),
      });

      if (!res.ok) throw new Error('Report API failed');
      const data = await res.json();
      if (data.report) {
        setReportData(data.report);
      }
    } catch (err) {
      console.error('Failed to generate monthly report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically trigger initial generation if not present
    if (!reportData) {
      generateReport();
    }
  }, [scenario.id, month]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            Monthly Financial Performance Audit Report
          </h2>
          <p className="text-xs text-slate-400">
            Official synthesized statement for <strong className="text-white">{month}</strong> • {scenario.title}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
            <span>Regenerate with Gemini</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {loading && !reportData && (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">Synthesizing Monthly Audit with Gemini 3.8 Flash...</h3>
          <p className="text-xs text-slate-400 mt-1">Auditing line-item transactions, variance, and financial health score.</p>
        </div>
      )}

      {reportData && (
        <div className="space-y-6 print:bg-white print:text-black">
          {/* Executive Header Card */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <Bot className="h-4 w-4" />
                  <span>AI Financial Health Scorecard</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Executive Financial Health Audit: Grade {reportData.healthGrade}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluation across 4 dimensions: Savings Rate, Budget Adherence, Emergency Buffer &amp; Discretionary Discipline.
                </p>
              </div>

              {/* Health Score Badge */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">
                    {reportData.financialHealthScore}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Out of 100</div>
                </div>
                <div className="h-10 w-px bg-slate-800"></div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white">
                    {reportData.healthGrade}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    {reportData.financialHealthScore >= 80 ? 'Robust & Resilient' : 'Moderate Security'}
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Overview Synthesis */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Executive Overview:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                {reportData.executiveOverview}
              </p>
            </div>
          </div>

          {/* 4 Financial Health Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium block">Savings Rate Score</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {reportData.financialHealthDimensions.savingsRateScore} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${reportData.financialHealthDimensions.savingsRateScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block">Actual rate: {savingsRate.toFixed(1)}%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium block">Budget Adherence</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {reportData.financialHealthDimensions.budgetAdherenceScore} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${reportData.financialHealthDimensions.budgetAdherenceScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block">Based on category variances</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium block">Emergency Runway</span>
              <div className="text-xl font-bold font-mono text-indigo-400">
                {reportData.financialHealthDimensions.emergencyBufferMonths} <span className="text-xs text-slate-500">months</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400"
                  style={{ width: `${Math.min(100, (reportData.financialHealthDimensions.emergencyBufferMonths / 6) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block">Target: 3-6 months essential burn</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium block">Discretionary Discipline</span>
              <div className="text-xl font-bold font-mono text-amber-400">
                {reportData.financialHealthDimensions.discretionaryDiscipline} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${reportData.financialHealthDimensions.discretionaryDiscipline}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block">Dining, events &amp; impulse control</span>
            </div>
          </div>

          {/* Overspending Audit & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overspending Leakages */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Category Overruns &amp; Cost Leakages
              </h4>

              {reportData.topOverspendingCategories.length > 0 ? (
                <div className="space-y-3">
                  {reportData.topOverspendingCategories.map((ov, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{ov.category}</span>
                        <span className="font-mono text-rose-400 font-bold">
                          +{formatCurrency(ov.variance, currency)} (+{ov.percentageOver}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Spent: {formatCurrency(ov.spent, currency)}</span>
                        <span>Budget Cap: {formatCurrency(ov.budgeted, currency)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        {ov.insight}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                  ✓ Outstanding discipline! All categories operated strictly within their planned monthly allocations.
                </div>
              )}
            </div>

            {/* Savings Milestones Achieved */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" />
                Savings Milestones &amp; Wins This Month
              </h4>

              <div className="space-y-2.5">
                {reportData.savingsAchievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Net Surplus Banked:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{formatCurrency(netSavings, currency)} ({savingsRate.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Next Month Strategic Goals */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Strategic Financial Targets for Following Month
              </h4>
              <button
                onClick={onOpenChat}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Discuss with Advisor Bot &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportData.nextMonthStrategicGoals.map((sg, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{sg.goal}</span>
                    <span className="font-mono text-emerald-400">
                      {formatCurrency(sg.targetAmount, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{sg.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
