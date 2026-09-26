import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: !!apiKey,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// AI Advisor Chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], financialContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const contextSummary = financialContext
      ? `
Current User Financial Snapshot:
- Monthly Income: $${financialContext.totalIncome?.toFixed(2) || '0.00'}
- Total Expenses Logged: $${financialContext.totalExpenses?.toFixed(2) || '0.00'}
- Current Net Savings: $${(financialContext.totalIncome - financialContext.totalExpenses)?.toFixed(2) || '0.00'}
- Savings Rate: ${financialContext.savingsRate || '0%'}
- Active Scenario / Persona: ${financialContext.persona || 'Custom User'}
- Top Spending Categories: ${JSON.stringify(financialContext.topCategories || [])}
- Savings Goals: ${JSON.stringify(financialContext.goals || [])}
- Recent Alert: ${financialContext.activeAlert || 'None'}
`
      : 'No financial context provided.';

    if (ai) {
      try {
        const systemInstruction = `You are the Personal Finance Advisor Bot, a world-class certified financial planner (CFP), behavioral economist, and empathetic money coach.
Your job is to help users take total control of their personal finances with clarity, confidence, and mathematical accuracy.

Guidelines:
1. Always ground your advice in the user's specific financial snapshot provided above.
2. Provide concrete numbers, percentage rules (e.g., 50/30/20 rule, emergency fund multiples, debt-to-income benchmarks), and realistic actionable next steps.
3. Be encouraging, pragmatic, and non-judgmental. If they are overspending, clearly identify the leaks and offer painless reduction tactics.
4. Format responses cleanly with concise bullet points, bold key metrics, and structured sections where helpful.
5. Never ask the user for sensitive private credentials or bank passwords.`;

        // Format history for context
        const formattedHistory = history.slice(-6).map((h: { sender: string; text: string }) => {
          return `${h.sender === 'user' ? 'User' : 'Advisor'}: ${h.text}`;
        }).join('\n');

        const prompt = `${contextSummary}\n\nChat Conversation History:\n${formattedHistory}\n\nUser Question: ${message}\n\nAdvisor Response:`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || "I've analyzed your financial situation. Let's focus on balancing your immediate cash flow while building your emergency reserve.";
        res.json({ reply, source: 'gemini-3.8-flash' });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini chat API error, falling back to heuristic engine:', geminiError?.message || geminiError);
      }
    }

    // Heuristic intelligent financial response if Gemini API key is missing or errored
    const fallbackReply = generateFallbackChatResponse(message, financialContext);
    res.json({ reply: fallbackReply, source: 'expert-heuristic-engine' });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// AI Budget Generation endpoint
app.post('/api/gemini/generate-budget', async (req, res) => {
  try {
    const { income, expenses, currentBudgets, persona, goals } = req.body;

    const totalIncome = Number(income) || 4000;
    const expenseList = Array.isArray(expenses) ? expenses : [];

    if (ai) {
      try {
        const prompt = `Analyze this personal finance data and generate an optimized monthly budget plan:
Monthly Income: $${totalIncome}
Persona: ${persona || 'Salaried Professional'}
Existing Logged Expenses: ${JSON.stringify(expenseList.slice(0, 30))}
Current Category Allocations: ${JSON.stringify(currentBudgets || {})}
Savings Goals: ${JSON.stringify(goals || [])}

Return a valid JSON object matching this schema:
{
  "monthlyIncome": number,
  "recommendedSavings": number,
  "savingsTargetPercentage": number,
  "budgetBreakdown": [
    {
      "category": string,
      "allocatedAmount": number,
      "percentageOfIncome": number,
      "priority": "Needs" | "Wants" | "Savings",
      "rationale": string
    }
  ],
  "spendingWarnings": [string],
  "actionableSavingsHacks": [
    {
      "title": string,
      "potentialMonthlySavings": number,
      "difficulty": "Easy" | "Moderate" | "High",
      "action": string
    }
  ],
  "executiveSummary": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are an AI financial planning engine. Generate realistic, mathematically coherent budget plans aligned with the 50/30/20 framework adjusted for the persona.',
          },
        });

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);
        res.json({ plan: parsed, source: 'gemini-3.8-flash' });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini budget generation error, using rule-based generator:', geminiError?.message || geminiError);
      }
    }

    // Heuristic rule-based budget generator
    const fallbackBudget = generateFallbackBudgetPlan(totalIncome, expenseList, persona, goals);
    res.json({ plan: fallbackBudget, source: 'rule-based-engine' });
  } catch (error: any) {
    console.error('Budget generator error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate budget' });
  }
});

// AI Monthly Summary Report endpoint
app.post('/api/gemini/monthly-report', async (req, res) => {
  try {
    const { month, income, expenses, budgets, persona, goals } = req.body;

    const totalIncome = Number(income) || 4500;
    const totalExpenses = (expenses || []).reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

    if (ai) {
      try {
        const prompt = `Generate a comprehensive monthly financial performance report:
Month: ${month || 'Current Month'}
Persona / Profile: ${persona || 'General Individual'}
Total Monthly Income: $${totalIncome}
Total Logged Expenses: $${totalExpenses}
Net Savings Achieved: $${netSavings} (${savingsRate}%)
Expenses by category: ${JSON.stringify(expenses || [])}
Budget targets: ${JSON.stringify(budgets || {})}
Savings goals: ${JSON.stringify(goals || [])}

Return a valid JSON object:
{
  "financialHealthScore": number, // 0 to 100
  "healthGrade": string, // "A+", "A", "B+", "B", "C", "D"
  "executiveOverview": string,
  "topOverspendingCategories": [
    {
      "category": string,
      "spent": number,
      "budgeted": number,
      "variance": number,
      "percentageOver": number,
      "insight": string
    }
  ],
  "savingsAchievements": [string],
  "financialHealthDimensions": {
    "savingsRateScore": number, // 0-100
    "budgetAdherenceScore": number, // 0-100
    "emergencyBufferMonths": number,
    "discretionaryDiscipline": number // 0-100
  },
  "nextMonthStrategicGoals": [
    {
      "goal": string,
      "targetAmount": number,
      "impact": string
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are the Personal Finance Advisor Bot reporting system. Provide a structured, insightful financial health audit with quantifiable metrics.',
          },
        });

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);
        res.json({ report: parsed, source: 'gemini-3.8-flash' });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini report error, using fallback report:', geminiError?.message || geminiError);
      }
    }

    const fallbackReport = generateFallbackMonthlyReport(month, totalIncome, expenses, budgets, persona, goals);
    res.json({ report: fallbackReport, source: 'rule-based-engine' });
  } catch (error: any) {
    console.error('Monthly report error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate monthly report' });
  }
});

// Heuristic fallback generator for chat
function generateFallbackChatResponse(message: string, context: any): string {
  const query = message.toLowerCase();
  const income = context?.totalIncome || 4500;
  const expenses = context?.totalExpenses || 3200;
  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  if (query.includes('save') || query.includes('cut') || query.includes('reduce')) {
    return `Based on your current numbers ($${income.toLocaleString()} income and $${expenses.toLocaleString()} expenses, a **${savingsRate}%** savings rate), here are 3 immediate optimization levers:
1. **Audit Recurring Subscriptions**: Review streaming services and unused software licenses to free up $30–$75/month instantly.
2. **Cap Dining Out & Takeout**: Eating out usually accounts for 15-22% of discretionary spending. Preparing 2 more meals at home weekly saves approx $160/month.
3. **The 48-Hour Discretionary Rule**: Place any non-essential purchase over $50 in a 48-hour cooling period to curb impulse spending.`;
  }

  if (query.includes('emergency') || query.includes('buffer') || query.includes('rainy day')) {
    const monthlyEssentialSpend = Math.round(expenses * 0.7);
    const threeMonthTarget = monthlyEssentialSpend * 3;
    const sixMonthTarget = monthlyEssentialSpend * 6;
    return `Building an emergency fund is your greatest financial safety net!
- **Estimated Essential Monthly Expenses**: $${monthlyEssentialSpend.toLocaleString()}
- **3-Month Baseline Buffer**: $${threeMonthTarget.toLocaleString()}
- **6-Month Complete Resilience Target**: $${sixMonthTarget.toLocaleString()}

**Recommendation**: Set up an automated recurring transfer of $${Math.max(150, Math.round(savings * 0.4)).toLocaleString()}/month into a dedicated high-yield savings account (HYSA) on the day your paycheck lands.`;
  }

  if (query.includes('50/30/20') || query.includes('rule') || query.includes('budget')) {
    const needs = Math.round(income * 0.5);
    const wants = Math.round(income * 0.3);
    const targetSavings = Math.round(income * 0.2);
    return `Here is how the golden **50/30/20 Rule** maps to your monthly income of **$${income.toLocaleString()}**:
- **50% Needs ($${needs.toLocaleString()})**: Housing, essential groceries, utilities, commuting, insurance, minimum debt obligations.
- **30% Wants ($${wants.toLocaleString()})**: Dining out, entertainment, hobbies, travel, shopping.
- **20% Savings & Debt Acceleration ($${targetSavings.toLocaleString()})**: Emergency fund, retirement accounts (401k/IRA), index funds, extra debt payoff.

Currently, you are saving **$${savings.toLocaleString()} (${savingsRate}%)** this month!`;
  }

  if (query.includes('freelance') || query.includes('variable') || query.includes('irregular')) {
    return `Managing variable freelance income requires the **Baseline Buffer Strategy**:
1. **Live off your Lowest Baseline Month**: Calculate your leanest monthly earnings over the last 6 months. Formulate your baseline living budget strictly around that amount.
2. **Create a "Paycheck Smoothing" Account**: In high-earning months (e.g., $6,000+), route the surplus into a holding account rather than inflating lifestyle.
3. **Withhold 25-30% for Taxes Immediately**: Always keep estimated quarterly tax liabilities separated in a sub-account.`;
  }

  if (query.includes('student') || query.includes('college') || query.includes('allowance')) {
    return `For students managing a tight allowance:
1. **Digital Textbooks & Library Reserves**: Avoid buying new retail textbooks; opt for digital rentals, campus libraries, or open-source equivalents to save $200–$400 per term.
2. **Student Discounts**: Never pay full price for Spotify, Apple, Amazon Prime, transit passes, or local cafes.
3. **Meal Planning**: Limit takeout runs to once or twice a week; batch cook simple staple meals to protect your food budget.`;
  }

  return `Here is a high-level assessment of your current financial position:
- **Monthly Net Cash Flow**: +$${savings.toLocaleString()} surplus
- **Current Savings Rate**: ${savingsRate}% (Healthy target is 20%+)
- **Primary Focus**: Maintain strict category caps on discretionary wants while keeping fixed commitments under 50% of your gross take-home pay.

Feel free to ask me for specific category breakdowns, debt payoff strategies, or tips to reach your savings goals faster!`;
}

// Heuristic fallback budget generator
function generateFallbackBudgetPlan(income: number, expenses: any[], persona?: string, goals?: any[]) {
  const needsRatio = persona === 'College Student' ? 0.6 : persona === 'Household Manager' ? 0.55 : 0.5;
  const wantsRatio = persona === 'College Student' ? 0.25 : persona === 'Household Manager' ? 0.25 : 0.3;
  const savingsRatio = 1 - needsRatio - wantsRatio;

  const recommendedSavings = Math.round(income * savingsRatio);

  const categories = [
    { category: 'Rent & Housing', percentage: 0.32, priority: 'Needs', rationale: 'Core living shelter & basic amenities' },
    { category: 'Food & Groceries', percentage: 0.14, priority: 'Needs', rationale: 'Nutritious home cooking & essential pantry items' },
    { category: 'Utilities & Bills', percentage: 0.07, priority: 'Needs', rationale: 'Electricity, water, internet, and mobile connectivity' },
    { category: 'Transportation', percentage: 0.06, priority: 'Needs', rationale: 'Commute, gas, public transit pass, and maintenance' },
    { category: 'Healthcare & Wellness', percentage: 0.04, priority: 'Needs', rationale: 'Prescriptions, routine care, and emergency health' },
    { category: 'Dining Out & Takeout', percentage: 0.08, priority: 'Wants', rationale: 'Social dining, weekend cafes, and delivery' },
    { category: 'Entertainment & Leisure', percentage: 0.06, priority: 'Wants', rationale: 'Cinema, hobbies, events, and games' },
    { category: 'Subscriptions & Software', percentage: 0.03, priority: 'Wants', rationale: 'Digital streaming, music, cloud storage' },
    { category: 'Savings & Emergency Fund', percentage: savingsRatio, priority: 'Savings', rationale: 'High-yield savings, emergency cushion, and investments' },
  ];

  const budgetBreakdown = categories.map((c) => ({
    category: c.category,
    allocatedAmount: Math.round(income * c.percentage),
    percentageOfIncome: Math.round(c.percentage * 100),
    priority: c.priority as 'Needs' | 'Wants' | 'Savings',
    rationale: c.rationale,
  }));

  return {
    monthlyIncome: income,
    recommendedSavings,
    savingsTargetPercentage: Math.round(savingsRatio * 100),
    budgetBreakdown,
    spendingWarnings: [
      'Dining out & delivery easily creeps up on weekends; keep food delivery under 2 orders weekly.',
      'Check for dormant software subscriptions renewing automatically.',
      persona === 'Freelancer' ? 'Maintain at least 30 days of income buffer in a checking buffer before allocating to long-term lockups.' : 'Ensure monthly rent/housing remains at or below 35% of gross income.'
    ],
    actionableSavingsHacks: [
      {
        title: 'Subscription Rationalization',
        potentialMonthlySavings: Math.round(income * 0.015),
        difficulty: 'Easy',
        action: 'Rotate streaming services one month at a time instead of subscribing to all simultaneously.',
      },
      {
        title: 'Weekly Grocery Meal Prep Batching',
        potentialMonthlySavings: Math.round(income * 0.035),
        difficulty: 'Moderate',
        action: 'Cook large staple dinners on Sunday and Wednesday to eliminate 3 mid-week takeout temptations.',
      },
      {
        title: 'Smart Commute & Transit Optimization',
        potentialMonthlySavings: Math.round(income * 0.02),
        difficulty: 'Easy',
        action: 'Bundle errands and leverage monthly multi-ride transit passes for work commutes.',
      },
    ],
    executiveSummary: `For your ${persona || 'profile'} with $${income.toLocaleString()} monthly income, this budget balances fixed living essentials with a healthy $${recommendedSavings.toLocaleString()} (${Math.round(savingsRatio * 100)}%) automated savings buffer.`,
  };
}

// Heuristic fallback monthly report generator
function generateFallbackMonthlyReport(month: string, income: number, expenses: any[], budgets: any, persona?: string, goals?: any[]) {
  const expenseArray = expenses || [];
  const totalExpenses = expenseArray.reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
  const netSavings = Math.max(0, income - totalExpenses);
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

  // Calculate health score
  let healthScore = 70;
  if (savingsRate >= 25) healthScore += 18;
  else if (savingsRate >= 15) healthScore += 10;
  else if (savingsRate < 5) healthScore -= 15;

  if (totalExpenses < income) healthScore += 8;
  else healthScore -= 20;

  healthScore = Math.min(98, Math.max(35, healthScore));

  let grade = 'B';
  if (healthScore >= 90) grade = 'A+';
  else if (healthScore >= 82) grade = 'A';
  else if (healthScore >= 75) grade = 'B+';
  else if (healthScore >= 65) grade = 'B';
  else if (healthScore >= 55) grade = 'C';
  else grade = 'D';

  // Group expenses by category
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenseArray) {
    const cat = exp.category || 'Miscellaneous';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(exp.amount || 0);
  }

  const overspending: any[] = [];
  for (const [cat, spent] of Object.entries(categoryTotals)) {
    const budgeted = budgets?.[cat] || Math.round(income * 0.1);
    if (spent > budgeted) {
      const variance = spent - budgeted;
      const pctOver = Math.round((variance / budgeted) * 100);
      overspending.push({
        category: cat,
        spent,
        budgeted,
        variance,
        percentageOver: pctOver,
        insight: `Exceeded target by $${variance.toFixed(0)} (${pctOver}%). Look for single large transactions or recurring micro-purchases.`,
      });
    }
  }

  return {
    financialHealthScore: healthScore,
    healthGrade: grade,
    executiveOverview: `During ${month || 'this month'}, you generated $${income.toLocaleString()} in income against $${totalExpenses.toLocaleString()} in total expenditures, successfully banking $${netSavings.toLocaleString()} at a ${savingsRate.toFixed(1)}% savings rate. Overall financial discipline remains ${healthScore >= 75 ? 'robust and disciplined' : 'manageable with room for targeted optimization'}.`,
    topOverspendingCategories: overspending.slice(0, 3),
    savingsAchievements: [
      `Maintained a positive net cash flow of +$${netSavings.toLocaleString()}`,
      `Successfully kept fixed baseline obligations within sustainable thresholds`,
      goals?.length ? `Contributed steadily toward target goal: "${goals[0].title}"` : 'Secured positive additions to emergency reserves',
    ],
    financialHealthDimensions: {
      savingsRateScore: Math.min(100, Math.round(savingsRate * 3.5)),
      budgetAdherenceScore: Math.max(40, 100 - overspending.length * 12),
      emergencyBufferMonths: totalExpenses > 0 ? parseFloat((netSavings * 4 / totalExpenses).toFixed(1)) : 2.5,
      discretionaryDiscipline: Math.max(50, 95 - (overspending.find(o => o.category.includes('Dining') || o.category.includes('Entertainment'))?.percentageOver || 0) / 2),
    },
    nextMonthStrategicGoals: [
      {
        goal: 'Reinforce Discretionary Spending Caps',
        targetAmount: Math.round(income * 0.15),
        impact: 'Will reclaim approx $120–$250 in cash flow to funnel directly toward emergency savings.',
      },
      {
        goal: 'Automate Day-1 Paycheck Transfer',
        targetAmount: Math.round(income * 0.2),
        impact: 'Removes manual friction and locks in your 20% savings quota before variable spending occurs.',
      },
      {
        goal: 'Audit Subscriptions & Recurring Utility Tariffs',
        targetAmount: 45,
        impact: 'Generates permanent recurring cost reductions with zero impact on lifestyle quality.',
      },
    ],
  };
}

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Personal Finance Advisor Bot server running on http://0.0.0.0:${PORT}`);
    console.log(`🤖 AI Engine Status: ${apiKey ? 'Gemini 3.8 Flash Online' : 'Heuristic Engine Active'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
