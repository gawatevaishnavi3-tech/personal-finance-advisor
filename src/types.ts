export type ExpenseCategory =
  | 'Rent & Housing'
  | 'Food & Groceries'
  | 'Dining Out & Takeout'
  | 'Transportation'
  | 'Utilities & Bills'
  | 'Entertainment & Leisure'
  | 'Healthcare & Wellness'
  | 'Education & Learning'
  | 'Subscriptions & Digital'
  | 'Shopping & Personal'
  | 'Savings & Investments'
  | 'Miscellaneous';

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Cash' | 'Digital Wallet';

export interface IncomeItem {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: 'Salary' | 'Freelance' | 'Allowance' | 'Investments' | 'Side Gig' | 'Other';
  isRecurring: boolean;
  frequency: 'Monthly' | 'Bi-weekly' | 'Weekly' | 'One-time';
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: PaymentMethod;
  isRecurring?: boolean;
  notes?: string;
  priority: 'Needs' | 'Wants' | 'Savings';
}

export interface CategoryBudget {
  category: ExpenseCategory;
  limit: number;
  priority: 'Needs' | 'Wants' | 'Savings';
  icon: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  category: 'Emergency Fund' | 'Education' | 'Travel' | 'Gadget / Tech' | 'Home' | 'Retirement' | 'Other';
  icon: string;
  color: string;
}

export interface PersonaScenario {
  id: string;
  scenarioNumber: 1 | 2 | 3 | 4;
  name: string;
  title: string;
  tagline: string;
  badge: string;
  avatar: string;
  monthlyIncome: number;
  incomeStreams: IncomeItem[];
  expenses: ExpenseItem[];
  budgets: Record<string, number>;
  goals: SavingsGoal[];
  scenarioStory: string;
  keyChallenge: string;
  aiStrategy: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: string;
  suggestions?: string[];
}

export interface AIBudgetHack {
  title: string;
  potentialMonthlySavings: number;
  difficulty: 'Easy' | 'Moderate' | 'High';
  action: string;
}

export interface AIBudgetPlanResponse {
  monthlyIncome: number;
  recommendedSavings: number;
  savingsTargetPercentage: number;
  budgetBreakdown: Array<{
    category: string;
    allocatedAmount: number;
    percentageOfIncome: number;
    priority: 'Needs' | 'Wants' | 'Savings';
    rationale: string;
  }>;
  spendingWarnings: string[];
  actionableSavingsHacks: AIBudgetHack[];
  executiveSummary: string;
}

export interface MonthlyReportResponse {
  financialHealthScore: number;
  healthGrade: string;
  executiveOverview: string;
  topOverspendingCategories: Array<{
    category: string;
    spent: number;
    budgeted: number;
    variance: number;
    percentageOver: number;
    insight: string;
  }>;
  savingsAchievements: string[];
  financialHealthDimensions: {
    savingsRateScore: number;
    budgetAdherenceScore: number;
    emergencyBufferMonths: number;
    discretionaryDiscipline: number;
  };
  nextMonthStrategicGoals: Array<{
    goal: string;
    targetAmount: number;
    impact: string;
  }>;
}

export interface EpicItem {
  id: string;
  epicCode: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  tasksCount: number;
  completedTasks: number;
  tags: string[];
}

export interface StoryTask {
  id: string;
  epicCode: string;
  taskCode: string;
  title: string;
  description: string;
  status: 'Done' | 'In Review' | 'Active';
  priority: 'High' | 'Critical' | 'Medium';
  technicalSpec: string;
  acceptanceCriteria: string[];
}
