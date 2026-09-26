import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart,
  Shield,
  Zap,
  Sparkles,
  DollarSign,
  AlertCircle,
  Clock,
  ArrowUpRight,
  PieChart,
  Percent,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { PersonaScenario, ExpenseItem, IncomeItem, SavingsGoal } from '../types';
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../utils/formatters';

interface PredictiveInvestmentsProps {
  scenario: PersonaScenario;
  expenses: ExpenseItem[];
  incomeStreams: IncomeItem[];
  goals: SavingsGoal[];
  currency: string;
  onOpenChat: () => void;
}

export const PredictiveInvestments: React.FC<PredictiveInvestmentsProps> = ({
  scenario,
  expenses,
  incomeStreams,
  goals,
  currency,
  onOpenChat,
}) => {
  const totalIncome = incomeStreams.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const netSavings = totalIncome - totalExpenses;

  // Compound interest simulation state
  const [initialInvestment, setInitialInvestment] = useState<number>(scenario.monthlyIncome * 2);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(Math.max(100, Math.round(netSavings * 0.5)));
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(8); // 8% avg index fund
  const [timeHorizonYears, setTimeHorizonYears] = useState<number>(10);

  // Calculate compound interest
  const months = timeHorizonYears * 12;
  const monthlyRate = annualReturnRate / 100 / 12;
  let futureValue = initialInvestment * Math.pow(1 + monthlyRate, months);
  for (let m = 1; m <= months; m++) {
    futureValue += monthlyContribution * Math.pow(1 + monthlyRate, months - m);
  }
  const totalPrincipal = initialInvestment + monthlyContribution * months;
  const totalCompoundInterest = Math.max(0, futureValue - totalPrincipal);

  // Subscriptions detection
  const subscriptionExpenses = expenses.filter(
    (e) => e.isRecurring || e.category === 'Subscriptions & Digital'
  );
  const monthlySubscriptionDrain = subscriptionExpenses.reduce((acc, e) => acc + e.amount, 0);
  const annualSubscriptionDrain = monthlySubscriptionDrain * 12;

  // Predictive end-of-month trajectory
  const daysInMonth = 30;
  const currentDay = 26; // Late in current month
  const dailyBurnRate = currentDay > 0 ? totalExpenses / currentDay : 0;
  const projectedMonthEndSpend = Math.round(totalExpenses + dailyBurnRate * (daysInMonth - currentDay));
  const projectedMonthEndSavings = totalIncome - projectedMonthEndSpend;

  // Scenario-specific investment recommendations
  const getAssetAllocation = () => {
    switch (scenario.id) {
      case 'college-student':
        return {
          title: 'Student Capital Preservation & Starter Roth IRA',
          profile: 'Conservative & Liquid Focus',
          breakdown: [
            { asset: 'High-Yield Savings (HYSA 4.5% APY)', pct: 75, desc: 'Immediate liquidity for tuition & textbooks', color: 'bg-emerald-400' },
            { asset: 'Broad S&P 500 ETF (VOO/IVV)', pct: 20, desc: 'Tax-advantaged Roth IRA compounding', color: 'bg-indigo-400' },
            { asset: 'Emergency Cash Reserves', pct: 5, desc: 'On-campus incidentals', color: 'bg-cyan-400' },
          ],
          aiAdvice: 'At this stage, protecting against high-interest student debt and retaining liquid emergency reserves takes priority over aggressive stock picking. Maximize high-yield savings for short-term goals.',
        };
      case 'freelancer-variable':
        return {
          title: 'Variable Income Buffer & Solo 401(k) / SEP-IRA',
          profile: 'Stability Shield & Self-Employed Retirement',
          breakdown: [
            { asset: 'Liquid 6-Month Income Buffer (HYSA)', pct: 45, desc: 'Protects against low-billing drought months', color: 'bg-cyan-400' },
            { asset: 'Total Market Index Funds (VTI / VXUS)', pct: 35, desc: 'Tax-deferred wealth building in SEP-IRA', color: 'bg-indigo-400' },
            { asset: 'Quarterly Tax Escrow Account', pct: 20, desc: 'Dedicated reserve for estimated taxes', color: 'bg-amber-400' },
          ],
          aiAdvice: 'Because monthly billings fluctuate between $3,500 and $7,200, isolate your quarterly tax obligations first and maintain a 6-month cash cushion before expanding illiquid assets.',
        };
      case 'household-manager':
        return {
          title: 'Family Balanced Growth & 529 College Investment',
          profile: 'Multi-Goal Family Security',
          breakdown: [
            { asset: 'Total Stock Market Index Funds', pct: 40, desc: 'Core long-term family retirement wealth', color: 'bg-indigo-400' },
            { asset: '529 State Tax-Advantaged College Plan', pct: 30, desc: 'Target-date funds for child educational tuition', color: 'bg-purple-400' },
            { asset: 'Family Emergency Reserve (HYSA)', pct: 20, desc: 'Home maintenance & medical buffer', color: 'bg-emerald-400' },
            { asset: 'Intermediate Treasury Bonds', pct: 10, desc: 'Volatility dampener & fixed income', color: 'bg-blue-400' },
          ],
          aiAdvice: 'With two dependents and substantial household overhead, automate monthly 529 plan contributions alongside your workplace 401(k) match to lock in education tax benefits.',
        };
      case 'salaried-professional':
      default:
        return {
          title: 'Optimized Wealth Accumulation (Core & Explore)',
          profile: 'Aggressive Capital Growth',
          breakdown: [
            { asset: 'S&P 500 / Total US Stock Index (VOO/VTI)', pct: 55, desc: 'Low-cost broad market compounding engine', color: 'bg-indigo-400' },
            { asset: 'International Developed & Emerging (VXUS)', pct: 20, desc: 'Global geographic diversification', color: 'bg-cyan-400' },
            { asset: 'High-Yield Emergency Cash (HYSA)', pct: 15, desc: '6-month living expenses buffer', color: 'bg-emerald-400' },
            { asset: 'High-Conviction Sector / Growth', pct: 10, desc: 'Tech & innovation satellite sleeve', color: 'bg-violet-400' },
          ],
          aiAdvice: 'Your predictable corporate income provides strong baseline stability. Maximize your employer retirement match (e.g. 401k/HSA), then direct your $1,770 monthly surplus into low-cost index ETFs.',
        };
    }
  };

  const assetPlan = getAssetAllocation();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-white">
                Predictive Spending Analytics &amp; Investment Suggestions
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Future-facing financial modeling: run end-of-month velocity forecasts, audit recurring subscription leakages,
              and explore tailored investment asset allocation strategies for {scenario.title}.
            </p>
          </div>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition shadow-md shadow-indigo-500/20 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Consult Advisor on Portfolio</span>
          </button>
        </div>

        {/* Predictive Run-rate Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Current Daily Burn Rate</span>
            <span className="text-base font-mono font-bold text-white mt-0.5 block">
              {formatCurrency(dailyBurnRate, currency)} <span className="text-xs font-normal text-slate-400">/ day</span>
            </span>
            <span className="text-[10px] text-slate-400">Across {expenses.length} transactions</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Projected Month-End Outflow</span>
            <span className="text-base font-mono font-bold text-rose-400 mt-0.5 block">
              {formatCurrency(projectedMonthEndSpend, currency)}
            </span>
            <span className="text-[10px] text-slate-400">
              {projectedMonthEndSpend > totalIncome ? '⚠ Projected Deficit' : '✓ Safe under monthly income'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Forecasted Net Savings</span>
            <span className="text-base font-mono font-bold text-emerald-400 mt-0.5 block">
              +{formatCurrency(Math.max(0, projectedMonthEndSavings), currency)}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Estimated {totalIncome > 0 ? ((projectedMonthEndSavings / totalIncome) * 100).toFixed(1) : 0}% savings rate
            </span>
          </div>
        </div>
      </div>

      {/* Asset Allocation & Investment Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Asset Allocation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="h-4 w-4 text-emerald-400" />
                Tailored Asset Allocation ({scenario.title})
              </h3>
              <p className="text-xs text-slate-400">{assetPlan.profile}</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
              AI Optimized
            </span>
          </div>

          {/* Allocation Visual Bar */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              {assetPlan.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.color} transition-all duration-500`}
                  style={{ width: `${item.pct}%` }}
                  title={`${item.asset}: ${item.pct}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {assetPlan.breakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.asset}</span>
                    <span className="font-mono font-bold text-emerald-400">{item.pct}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Advisor Note */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Strategic Advisor Rationale:
            </span>
            <p className="leading-relaxed">{assetPlan.aiAdvice}</p>
          </div>
        </div>

        {/* Subscription Leakage Audit */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" />
                Subscription Leak Audit
              </h3>
              <p className="text-xs text-slate-400">Automated recurring cost drain</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Monthly Recurring Drain</span>
                <span className="text-base font-mono font-bold text-rose-400">
                  {formatCurrency(monthlySubscriptionDrain, currency)}/mo
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Annual Drain</span>
                <span className="text-sm font-mono font-bold text-white">
                  {formatCurrency(annualSubscriptionDrain, currency)}/yr
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Detected Recurring Micro-charges:
              </span>
              <div className="space-y-1.5">
                {subscriptionExpenses.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 truncate max-w-[150px]">{sub.title}</span>
                    <span className="font-mono text-rose-400 font-semibold">
                      -{formatCurrency(sub.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              💡 Canceling 1 dormant streaming or SaaS service recovers ~
              <strong className="text-emerald-400">{formatCurrency(35, currency)}/mo</strong> into your emergency fund.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Compound Wealth Simulator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <LineChart className="h-4 w-4 text-emerald-400" />
              Long-Term Wealth Compounding Engine
            </h3>
            <p className="text-xs text-slate-400">
              Simulate exponential compounding over 5 to 30 years using disciplined monthly savings deposits.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Projected Total Wealth</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">
              {formatCurrency(Math.round(futureValue), currency)}
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Initial Seed Capital</span>
              <span className="font-mono font-bold text-emerald-400">{formatCurrency(initialInvestment, currency)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(parseInt(e.target.value, 10))}
              aria-label="Initial Seed Capital"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Monthly Contribution</span>
              <span className="font-mono font-bold text-emerald-400">+{formatCurrency(monthlyContribution, currency)}/mo</span>
            </div>
            <input
              type="range"
              min="25"
              max="3000"
              step="25"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(parseInt(e.target.value, 10))}
              aria-label="Monthly Contribution"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Expected Annual Return</span>
              <span className="font-mono font-bold text-indigo-400">{annualReturnRate}% / yr</span>
            </div>
            <input
              type="range"
              min="3"
              max="14"
              step="0.5"
              value={annualReturnRate}
              onChange={(e) => setAnnualReturnRate(parseFloat(e.target.value))}
              aria-label="Expected Annual Return"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Time Horizon</span>
              <span className="font-mono font-bold text-cyan-400">{timeHorizonYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={timeHorizonYears}
              onChange={(e) => setTimeHorizonYears(parseInt(e.target.value, 10))}
              aria-label="Time Horizon in Years"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Wealth Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-xs block">Your Principal Deposited</span>
            <span className="text-lg font-mono font-bold text-white">
              {formatCurrency(totalPrincipal, currency)}
            </span>
            <span className="text-[11px] text-slate-400">Total out-of-pocket savings</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-xs block">Compound Growth Generated</span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              +{formatCurrency(Math.round(totalCompoundInterest), currency)}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {(totalPrincipal > 0 ? (totalCompoundInterest / totalPrincipal) * 100 : 0).toFixed(0)}% growth multiplier
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-xs block">Total Portfolio Value</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {formatCurrency(Math.round(futureValue), currency)}
            </span>
            <span className="text-[11px] text-slate-400">After {timeHorizonYears} years at {annualReturnRate}% APY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
