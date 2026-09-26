import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  CreditCard,
  Calendar,
  Tag,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { ExpenseCategory, PaymentMethod, ExpenseItem, IncomeItem } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType: 'expense' | 'income';
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
  currency: string;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType,
  onAddExpense,
  onAddIncome,
  currency,
}) => {
  const [type, setType] = useState<'expense' | 'income'>(defaultType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Food & Groceries');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');
  const [priority, setPriority] = useState<'Needs' | 'Wants'>('Needs');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'Monthly' | 'Bi-weekly' | 'Weekly' | 'One-time'>('Monthly');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title || isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (type === 'expense') {
      onAddExpense({
        title,
        amount: parsedAmount,
        category: category as ExpenseCategory,
        date,
        paymentMethod,
        priority,
        isRecurring,
        notes: notes.trim() || undefined,
      });
    } else {
      onAddIncome({
        source: title,
        amount: parsedAmount,
        category: category as any,
        date,
        isRecurring,
        frequency,
      });
    }

    // Reset and close
    setTitle('');
    setAmount('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${type === 'expense' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <PlusCircle className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-bold text-white">
              {type === 'expense' ? 'Log New Expense' : 'Record Income Stream'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('Food & Groceries');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Salary');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="h-3.5 w-3.5" />
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Transaction Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {type === 'expense' ? 'Transaction Description / Title' : 'Income Source Name'}
            </label>
            <input
              type="text"
              required
              placeholder={type === 'expense' ? 'e.g. Trader Joe’s Groceries, Electric Bill' : 'e.g. Acme Corp Base Salary, Client Retainer'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {type === 'expense' ? (
                  <>
                    <option value="Rent & Housing">Rent &amp; Housing</option>
                    <option value="Food & Groceries">Food &amp; Groceries</option>
                    <option value="Dining Out & Takeout">Dining Out &amp; Takeout</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Utilities & Bills">Utilities &amp; Bills</option>
                    <option value="Entertainment & Leisure">Entertainment &amp; Leisure</option>
                    <option value="Healthcare & Wellness">Healthcare &amp; Wellness</option>
                    <option value="Education & Learning">Education &amp; Learning</option>
                    <option value="Subscriptions & Digital">Subscriptions &amp; Digital</option>
                    <option value="Savings & Investments">Savings &amp; Investments</option>
                    <option value="Shopping & Personal">Shopping &amp; Personal</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </>
                ) : (
                  <>
                    <option value="Salary">Salary / Wages</option>
                    <option value="Freelance">Freelance / Contract</option>
                    <option value="Allowance">Allowance / Stipend</option>
                    <option value="Investments">Investments / Dividends</option>
                    <option value="Side Gig">Side Gig / Consulting</option>
                    <option value="Other">Other Inflow</option>
                  </>
                )}
              </select>
            </div>

            {type === 'expense' ? (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>
            )}
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority Classification</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('Needs')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                    priority === 'Needs'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Needs (Essential Living)
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('Wants')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                    priority === 'Wants'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Wants (Discretionary Fun)
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="recurring-toggle"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
            />
            <label htmlFor="recurring-toggle" className="text-slate-300 cursor-pointer">
              Mark as recurring auto-debit / auto-inflow every month
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Optional Notes</label>
            <input
              type="text"
              placeholder="e.g. Receipt #4920, shared with roommate"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-xl px-5 py-2 font-bold text-slate-950 transition ${
                type === 'expense' ? 'bg-rose-400 hover:bg-rose-300' : 'bg-emerald-400 hover:bg-emerald-300'
              }`}
            >
              {type === 'expense' ? 'Record Expense' : 'Record Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
