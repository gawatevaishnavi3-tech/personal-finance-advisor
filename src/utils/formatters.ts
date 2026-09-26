import { ExpenseCategory } from '../types';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export function formatCurrency(amount: number, symbol = '$'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return `${symbol}0.00`;
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

export function getCategoryColor(category: string): { bg: string; text: string; border: string; bar: string } {
  switch (category) {
    case 'Rent & Housing':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', bar: 'bg-indigo-500' };
    case 'Food & Groceries':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', bar: 'bg-emerald-500' };
    case 'Dining Out & Takeout':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', bar: 'bg-amber-500' };
    case 'Transportation':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', bar: 'bg-cyan-500' };
    case 'Utilities & Bills':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', bar: 'bg-blue-500' };
    case 'Entertainment & Leisure':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', bar: 'bg-purple-500' };
    case 'Healthcare & Wellness':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', bar: 'bg-rose-500' };
    case 'Education & Learning':
      return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', bar: 'bg-teal-500' };
    case 'Subscriptions & Digital':
      return { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', bar: 'bg-pink-500' };
    case 'Savings & Investments':
      return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', bar: 'bg-emerald-400' };
    case 'Shopping & Personal':
      return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', bar: 'bg-orange-500' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', bar: 'bg-slate-500' };
  }
}

export function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'Rent & Housing': return '🏠';
    case 'Food & Groceries': return '🛒';
    case 'Dining Out & Takeout': return '🍜';
    case 'Transportation': return '🚗';
    case 'Utilities & Bills': return '⚡';
    case 'Entertainment & Leisure': return '🎟️';
    case 'Healthcare & Wellness': return '🩺';
    case 'Education & Learning': return '📚';
    case 'Subscriptions & Digital': return '📱';
    case 'Savings & Investments': return '💰';
    case 'Shopping & Personal': return '🛍️';
    default: return '📦';
  }
}
