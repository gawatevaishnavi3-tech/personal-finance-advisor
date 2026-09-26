import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Trash2,
  Download,
  Calendar,
  CreditCard,
  Tag,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  Coffee,
  ShoppingBag,
  Car,
  Utensils,
} from 'lucide-react';
import { ExpenseItem, IncomeItem, ExpenseCategory, PaymentMethod } from '../types';
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../utils/formatters';

interface ExpenseIncomeTrackerProps {
  expenses: ExpenseItem[];
  incomeStreams: IncomeItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  currency: string;
  onOpenAddModal: (type: 'expense' | 'income') => void;
}

export const ExpenseIncomeTracker: React.FC<ExpenseIncomeTrackerProps> = ({
  expenses,
  incomeStreams,
  onAddExpense,
  onDeleteExpense,
  onAddIncome,
  onDeleteIncome,
  currency,
  onOpenAddModal,
}) => {
  const [activeView, setActiveView] = useState<'expenses' | 'income'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Quick preset logger
  const handleQuickPreset = (title: string, amount: number, category: ExpenseCategory) => {
    onAddExpense({
      title,
      amount,
      category,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      priority: category === 'Food & Groceries' || category === 'Transportation' ? 'Needs' : 'Wants',
    });
  };

  // Filtered expenses
  const filteredExpenses = expenses
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
      const matchesMethod = selectedPaymentMethod === 'all' || e.paymentMethod === selectedPaymentMethod;
      return matchesSearch && matchesCategory && matchesMethod;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      return a.amount - b.amount;
    });

  // Filtered incomes
  const filteredIncomes = incomeStreams.filter((inc) =>
    inc.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Totals
  const totalExpenseAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalIncomeAmount = filteredIncomes.reduce((acc, i) => acc + i.amount, 0);

  // CSV export
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeView === 'expenses') {
      csvContent += 'ID,Date,Title,Category,Amount,Payment Method,Priority,Recurring\n';
      filteredExpenses.forEach((e) => {
        csvContent += `"${e.id}","${e.date}","${e.title}","${e.category}",${e.amount},"${e.paymentMethod}","${e.priority}","${e.isRecurring ? 'Yes' : 'No'}"\n`;
      });
    } else {
      csvContent += 'ID,Date,Source,Category,Amount,Frequency,Recurring\n';
      filteredIncomes.forEach((i) => {
        csvContent += `"${i.id}","${i.date}","${i.source}","${i.category}",${i.amount},"${i.frequency}","${i.isRecurring ? 'Yes' : 'No'}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeView}-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header & Switcher */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              Financial Ledger &amp; Cash Flow Records
            </h2>
            <p className="text-xs text-slate-400">
              Manage incoming revenue streams and granular categorized daily transactions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* View Switcher */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setActiveView('expenses')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeView === 'expenses'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Expenses ({expenses.length})</span>
              </button>
              <button
                onClick={() => setActiveView('income')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeView === 'income'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="h-3.5 w-3.5" />
                <span>Income ({incomeStreams.length})</span>
              </button>
            </div>

            <button
              onClick={() => onOpenAddModal(activeView === 'expenses' ? 'expense' : 'income')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>{activeView === 'expenses' ? 'Log Expense' : 'Add Income'}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Bar (for fast daily expense logging) */}
        {activeView === 'expenses' && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              ⚡ 1-Click Fast Presets:
            </span>
            {[
              { title: 'Morning Espresso & Pastry', amount: 5.5, cat: 'Dining Out & Takeout', icon: Coffee },
              { title: 'Supermarket Groceries', amount: 45.0, cat: 'Food & Groceries', icon: ShoppingBag },
              { title: 'Gasoline & Vehicle Fuel', amount: 35.0, cat: 'Transportation', icon: Car },
              { title: 'Quick Casual Lunch', amount: 14.0, cat: 'Dining Out & Takeout', icon: Utensils },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPreset(p.title, p.amount, p.cat as ExpenseCategory)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 hover:border-emerald-500/40 transition"
              >
                <p.icon className="h-3 w-3 text-emerald-400" />
                <span>{p.title}</span>
                <span className="font-mono text-emerald-400 font-bold">{formatCurrency(p.amount, currency)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${activeView} by keyword, notes, source...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {activeView === 'expenses' && (
            <>
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter expenses by category"
                className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                <option value="Rent & Housing">Rent & Housing</option>
                <option value="Food & Groceries">Food & Groceries</option>
                <option value="Dining Out & Takeout">Dining Out & Takeout</option>
                <option value="Transportation">Transportation</option>
                <option value="Utilities & Bills">Utilities & Bills</option>
                <option value="Entertainment & Leisure">Entertainment & Leisure</option>
                <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                <option value="Education & Learning">Education & Learning</option>
                <option value="Subscriptions & Digital">Subscriptions & Digital</option>
                <option value="Savings & Investments">Savings & Investments</option>
              </select>

              {/* Payment Method Filter */}
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                aria-label="Filter expenses by payment method"
                className="hidden sm:block rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Payment Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Digital Wallet">Digital Wallet</option>
              </select>
            </>
          )}

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort transactions"
            className="rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="date-desc">Newest Date</option>
            <option value="date-asc">Oldest Date</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 transition"
        >
          <Download className="h-3.5 w-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Main Ledger Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        {activeView === 'expenses' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Transaction / Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredExpenses.map((exp) => {
                  const color = getCategoryColor(exp.category);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{getCategoryEmoji(exp.category)}</span>
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-white">
                              {exp.title}
                            </div>
                            {exp.notes && (
                              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                                {exp.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${color.bg} ${color.text} ${color.border}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            exp.priority === 'Needs'
                              ? 'text-indigo-400 bg-indigo-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          {exp.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {exp.date}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-3 w-3 text-slate-500" />
                          <span>{exp.paymentMethod}</span>
                          {exp.isRecurring && (
                            <span className="rounded bg-slate-800 text-[9px] px-1 text-slate-400 font-mono">
                              auto
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-400 whitespace-nowrap">
                        -{formatCurrency(exp.amount, currency)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="text-slate-500 hover:text-rose-400 transition p-1"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredExpenses.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-500">
                No matching expense records found. Try adjusting your search query or filters.
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Income Source</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Deposit Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIncomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition group">
                    <td className="py-3 px-4 font-semibold text-slate-200 group-hover:text-white">
                      {inc.source}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inc.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <span>{inc.frequency}</span>
                      {inc.isRecurring && (
                        <span className="ml-1.5 rounded bg-emerald-500/10 text-[9px] px-1 text-emerald-400 font-mono">
                          Recurring
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {inc.date}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                      +{formatCurrency(inc.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteIncome(inc.id)}
                        className="text-slate-500 hover:text-rose-400 transition p-1"
                        title="Delete income stream"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredIncomes.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-500">
                No income streams logged yet. Click &quot;Add Income&quot; to register your inflows.
              </div>
            )}
          </div>
        )}

        {/* Ledger Bottom Summary Bar */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{activeView === 'expenses' ? filteredExpenses.length : filteredIncomes.length}</strong> records
          </div>
          <div className="font-mono">
            Filtered Total:{' '}
            <strong className={activeView === 'expenses' ? 'text-rose-400' : 'text-emerald-400'}>
              {formatCurrency(activeView === 'expenses' ? totalExpenseAmount : totalIncomeAmount, currency)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
