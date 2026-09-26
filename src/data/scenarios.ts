import { PersonaScenario, EpicItem, StoryTask } from '../types';

export const SCENARIOS: PersonaScenario[] = [
  {
    id: 'salaried-professional',
    scenarioNumber: 1,
    name: 'Alex Rivera',
    title: 'Salaried Professional',
    tagline: 'Predictable corporate income seeking to curb lifestyle creep and maximize investments.',
    badge: 'Scenario 1: Salaried Professional',
    avatar: '💼',
    monthlyIncome: 5200,
    incomeStreams: [
      {
        id: 'inc-1',
        source: 'Senior Product Marketing Salary',
        amount: 5000,
        date: '2026-09-01',
        category: 'Salary',
        isRecurring: true,
        frequency: 'Monthly',
      },
      {
        id: 'inc-2',
        source: 'Index Fund Dividends',
        amount: 200,
        date: '2026-09-15',
        category: 'Investments',
        isRecurring: true,
        frequency: 'Monthly',
      },
    ],
    budgets: {
      'Rent & Housing': 1600,
      'Food & Groceries': 550,
      'Dining Out & Takeout': 300,
      'Transportation': 220,
      'Utilities & Bills': 180,
      'Entertainment & Leisure': 200,
      'Healthcare & Wellness': 100,
      'Subscriptions & Digital': 50,
      'Shopping & Personal': 250,
      'Savings & Investments': 1750,
    },
    expenses: [
      { id: 'exp-101', title: 'Apartment Lease & Building Fee', amount: 1600, category: 'Rent & Housing', date: '2026-09-01', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-102', title: 'Whole Foods Bi-Weekly Grocery', amount: 280, category: 'Food & Groceries', date: '2026-09-03', paymentMethod: 'Credit Card', priority: 'Needs' },
      { id: 'exp-103', title: 'Trader Joe\'s Pantry Restock', amount: 195, category: 'Food & Groceries', date: '2026-09-12', paymentMethod: 'Credit Card', priority: 'Needs' },
      { id: 'exp-104', title: 'Artisan Grocery & Butcher', amount: 175, category: 'Food & Groceries', date: '2026-09-21', paymentMethod: 'Debit Card', priority: 'Needs' },
      { id: 'exp-105', title: 'Subway & Train Monthly Pass', amount: 130, category: 'Transportation', date: '2026-09-02', paymentMethod: 'Credit Card', priority: 'Needs', isRecurring: true },
      { id: 'exp-106', title: 'Uber Rides Weekend Night Out', amount: 90, category: 'Transportation', date: '2026-09-14', paymentMethod: 'Credit Card', priority: 'Wants' },
      { id: 'exp-107', title: 'Upscale Steakhouse Dinner with Team', amount: 240, category: 'Dining Out & Takeout', date: '2026-09-06', paymentMethod: 'Credit Card', priority: 'Wants', notes: 'Team celebration' },
      { id: 'exp-108', title: 'Weekend Brunch & Craft Cocktails', amount: 145, category: 'Dining Out & Takeout', date: '2026-09-13', paymentMethod: 'Credit Card', priority: 'Wants' },
      { id: 'exp-109', title: 'Mid-week DoorDash Food Deliveries', amount: 135, category: 'Dining Out & Takeout', date: '2026-09-18', paymentMethod: 'Credit Card', priority: 'Wants' },
      { id: 'exp-110', title: 'Concert Tickets & Lounge Pass', amount: 220, category: 'Entertainment & Leisure', date: '2026-09-10', paymentMethod: 'Credit Card', priority: 'Wants' },
      { id: 'exp-111', title: 'Steam Video Games & DLCs', amount: 85, category: 'Entertainment & Leisure', date: '2026-09-22', paymentMethod: 'Credit Card', priority: 'Wants' },
      { id: 'exp-112', title: 'Fiber Internet & Electric Utility', amount: 180, category: 'Utilities & Bills', date: '2026-09-05', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-113', title: 'Gym & Crossfit Membership', amount: 95, category: 'Healthcare & Wellness', date: '2026-09-01', paymentMethod: 'Credit Card', priority: 'Needs', isRecurring: true },
      { id: 'exp-114', title: 'Netflix, Spotify & NYT Bundles', amount: 65, category: 'Subscriptions & Digital', date: '2026-09-08', paymentMethod: 'Credit Card', priority: 'Wants', isRecurring: true },
    ],
    goals: [
      {
        id: 'goal-1',
        title: '6-Month Emergency Fund',
        targetAmount: 18000,
        currentAmount: 12400,
        monthlyContribution: 600,
        targetDate: '2027-04-30',
        category: 'Emergency Fund',
        icon: '🛡️',
        color: '#10b981',
      },
      {
        id: 'goal-2',
        title: 'Tokyo Japan Autumn Vacation',
        targetAmount: 4200,
        currentAmount: 2600,
        monthlyContribution: 400,
        targetDate: '2026-11-15',
        category: 'Travel',
        icon: '✈️',
        color: '#3b82f6',
      },
      {
        id: 'goal-3',
        title: 'Vanguard Index Fund Accumulation',
        targetAmount: 25000,
        currentAmount: 16500,
        monthlyContribution: 750,
        targetDate: '2027-12-31',
        category: 'Retirement',
        icon: '📈',
        color: '#8b5cf6',
      },
    ],
    scenarioStory: 'Alex earns a stable $5,200 monthly salary. However, lifestyle creep in fine dining ($520) and weekend events ($305) is eating into savings capacity.',
    keyChallenge: 'Overspending in dining out & entertainment by 42% over baseline budget targets.',
    aiStrategy: 'Enforce the 50/30/20 rule: Cap dining out at $300/mo, channel $220 in recovered leaks directly into the emergency fund.',
  },
  {
    id: 'college-student',
    scenarioNumber: 2,
    name: 'Maya Chen',
    title: 'College Student',
    tagline: 'Undergraduate student balancing a strict $850 monthly allowance, textbooks, and campus lifestyle.',
    badge: 'Scenario 2: College Student',
    avatar: '🎓',
    monthlyIncome: 850,
    incomeStreams: [
      {
        id: 'inc-201',
        source: 'Parental Monthly Allowance',
        amount: 500,
        date: '2026-09-01',
        category: 'Allowance',
        isRecurring: true,
        frequency: 'Monthly',
      },
      {
        id: 'inc-202',
        source: 'Campus Library Work-Study',
        amount: 350,
        date: '2026-09-15',
        category: 'Side Gig',
        isRecurring: true,
        frequency: 'Monthly',
      },
    ],
    budgets: {
      'Rent & Housing': 380,
      'Food & Groceries': 200,
      'Dining Out & Takeout': 60,
      'Transportation': 40,
      'Education & Learning': 60,
      'Entertainment & Leisure': 35,
      'Subscriptions & Digital': 15,
      'Miscellaneous': 30,
      'Savings & Investments': 30,
    },
    expenses: [
      { id: 'exp-201', title: 'Shared Off-Campus Dorm / Room Rent', amount: 380, category: 'Rent & Housing', date: '2026-09-01', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-202', title: 'Aldi Cheap Grocery & Oatmeal Haul', amount: 95, category: 'Food & Groceries', date: '2026-09-04', paymentMethod: 'Debit Card', priority: 'Needs' },
      { id: 'exp-203', title: 'Campus Co-op Groceries & Eggs', amount: 80, category: 'Food & Groceries', date: '2026-09-16', paymentMethod: 'Debit Card', priority: 'Needs' },
      { id: 'exp-204', title: 'Calculus III & Data Structures Textbooks', amount: 75, category: 'Education & Learning', date: '2026-09-03', paymentMethod: 'Debit Card', priority: 'Needs' },
      { id: 'exp-205', title: 'Brown Sugar Boba & Matcha Latte Runs', amount: 55, category: 'Dining Out & Takeout', date: '2026-09-09', paymentMethod: 'Digital Wallet', priority: 'Wants' },
      { id: 'exp-206', title: 'Late Night Dorm Pizza Order with Roommates', amount: 48, category: 'Dining Out & Takeout', date: '2026-09-17', paymentMethod: 'Digital Wallet', priority: 'Wants' },
      { id: 'exp-207', title: 'City Bus & Campus Shuttle Student Pass', amount: 35, category: 'Transportation', date: '2026-09-02', paymentMethod: 'Debit Card', priority: 'Needs', isRecurring: true },
      { id: 'exp-208', title: 'Student Spotify & Hulu Bundle', amount: 6, category: 'Subscriptions & Digital', date: '2026-09-10', paymentMethod: 'Debit Card', priority: 'Wants', isRecurring: true },
      { id: 'exp-209', title: 'Campus Cinema Night & Popcorn', amount: 18, category: 'Entertainment & Leisure', date: '2026-09-19', paymentMethod: 'Cash', priority: 'Wants' },
      { id: 'exp-210', title: 'Laundromat Coins & Detergent Pods', amount: 22, category: 'Miscellaneous', date: '2026-09-23', paymentMethod: 'Cash', priority: 'Needs' },
    ],
    goals: [
      {
        id: 'goal-201',
        title: 'Emergency Student Cushion',
        targetAmount: 1000,
        currentAmount: 380,
        monthlyContribution: 35,
        targetDate: '2027-05-31',
        category: 'Emergency Fund',
        icon: '🛡️',
        color: '#10b981',
      },
      {
        id: 'goal-202',
        title: 'Refurbished M3 Coding Laptop',
        targetAmount: 1100,
        currentAmount: 490,
        monthlyContribution: 50,
        targetDate: '2027-01-15',
        category: 'Gadget / Tech',
        icon: '💻',
        color: '#6366f1',
      },
    ],
    scenarioStory: 'Maya manages a lean $850/mo allowance. Even a $40 unexpected expense risks an overdraft without careful micro-budgeting.',
    keyChallenge: 'Very tight discretionary margin; frequent $6 boba drinks and late-night pizza strain the end of the month.',
    aiStrategy: 'Micro-allocation: Use free library textbook reserves, batch brew tea at dorm, protect $35/mo emergency cushion.',
  },
  {
    id: 'freelancer-variable',
    scenarioNumber: 3,
    name: 'David Patel',
    title: 'Freelance Design Engineer',
    tagline: 'Variable monthly cash flow with irregular client invoices, software costs, and self-employment taxes.',
    badge: 'Scenario 3: Freelancer with Variable Income',
    avatar: '⚡',
    monthlyIncome: 6250,
    incomeStreams: [
      {
        id: 'inc-301',
        source: 'Fintech Startup UI/UX Retainer',
        amount: 3200,
        date: '2026-09-02',
        category: 'Freelance',
        isRecurring: true,
        frequency: 'Monthly',
      },
      {
        id: 'inc-302',
        source: 'E-Commerce Redesign Milestone',
        amount: 2100,
        date: '2026-09-14',
        category: 'Freelance',
        isRecurring: false,
        frequency: 'One-time',
      },
      {
        id: 'inc-303',
        source: 'Design System Advisory Hourly',
        amount: 950,
        date: '2026-09-24',
        category: 'Freelance',
        isRecurring: false,
        frequency: 'One-time',
      },
    ],
    budgets: {
      'Rent & Housing': 1450,
      'Food & Groceries': 500,
      'Transportation': 120,
      'Utilities & Bills': 160,
      'Subscriptions & Digital': 210,
      'Dining Out & Takeout': 250,
      'Entertainment & Leisure': 150,
      'Healthcare & Wellness': 360,
      'Savings & Investments': 2200,
      'Miscellaneous': 150,
    },
    expenses: [
      { id: 'exp-301', title: 'Studio Loft Rent', amount: 1450, category: 'Rent & Housing', date: '2026-09-01', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-302', title: 'Private Freelancer Health Insurance', amount: 360, category: 'Healthcare & Wellness', date: '2026-09-02', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-303', title: 'WeWork Hot Desk & Coworking', amount: 250, category: 'Subscriptions & Digital', date: '2026-09-03', paymentMethod: 'Credit Card', priority: 'Needs', isRecurring: true },
      { id: 'exp-304', title: 'Figma Organization & Adobe Suite', amount: 115, category: 'Subscriptions & Digital', date: '2026-09-07', paymentMethod: 'Credit Card', priority: 'Needs', isRecurring: true },
      { id: 'exp-305', title: 'AWS Cloud Hosting & Vercel Pro', amount: 65, category: 'Subscriptions & Digital', date: '2026-09-08', paymentMethod: 'Credit Card', priority: 'Needs', isRecurring: true },
      { id: 'exp-306', title: 'Trader Joe\'s & Local Farmers Market', amount: 480, category: 'Food & Groceries', date: '2026-09-11', paymentMethod: 'Debit Card', priority: 'Needs' },
      { id: 'exp-307', title: 'Electric, Heat & Gigabit Internet', amount: 175, category: 'Utilities & Bills', date: '2026-09-05', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-308', title: 'Coffee Meetings with Prospective Clients', amount: 130, category: 'Dining Out & Takeout', date: '2026-09-15', paymentMethod: 'Credit Card', priority: 'Wants', notes: 'Client prospecting' },
      { id: 'exp-309', title: 'Weekend Dinners with Friends', amount: 180, category: 'Dining Out & Takeout', date: '2026-09-20', paymentMethod: 'Credit Card', priority: 'Wants' },
      { id: 'exp-310', title: 'Quarterly Estimated Tax Reserve Transfer', amount: 1500, category: 'Savings & Investments', date: '2026-09-15', paymentMethod: 'Bank Transfer', priority: 'Needs', notes: 'Federal & State tax escrow' },
    ],
    goals: [
      {
        id: 'goal-301',
        title: '6-Month Income Smoothing Buffer',
        targetAmount: 22000,
        currentAmount: 13500,
        monthlyContribution: 800,
        targetDate: '2027-03-31',
        category: 'Emergency Fund',
        icon: '🌊',
        color: '#0ea5e9',
      },
      {
        id: 'goal-302',
        title: 'Studio Hardware M4 Max Workstation',
        targetAmount: 3200,
        currentAmount: 2100,
        monthlyContribution: 350,
        targetDate: '2026-12-15',
        category: 'Gadget / Tech',
        icon: '🖥️',
        color: '#f59e0b',
      },
    ],
    scenarioStory: 'David’s monthly income swings between $3,500 and $7,200. He needs a baseline budget and tax segregation to stay protected.',
    keyChallenge: 'Fluctuating income dates, quarterly tax obligations, and danger of overcommitting in peak earnings months.',
    aiStrategy: 'Paycheck Smoothing: Base lifestyle spend strictly on $3,800 floor; dump windfalls into 6-month buffer and tax escrow.',
  },
  {
    id: 'household-manager',
    scenarioNumber: 4,
    name: 'Sarah & Mark Jenkins',
    title: 'Household Financial Managers',
    tagline: 'Coordinating joint family income, mortgage, childcare, and healthcare for a family of four.',
    badge: 'Scenario 4: Household Manager',
    avatar: '🏡',
    monthlyIncome: 8600,
    incomeStreams: [
      {
        id: 'inc-401',
        source: 'Sarah - Nurse Practitioner Salary',
        amount: 5400,
        date: '2026-09-01',
        category: 'Salary',
        isRecurring: true,
        frequency: 'Monthly',
      },
      {
        id: 'inc-402',
        source: 'Mark - High School Teacher Salary',
        amount: 3200,
        date: '2026-09-01',
        category: 'Salary',
        isRecurring: true,
        frequency: 'Monthly',
      },
    ],
    budgets: {
      'Rent & Housing': 2300,
      'Food & Groceries': 1300,
      'Education & Learning': 850,
      'Healthcare & Wellness': 500,
      'Utilities & Bills': 450,
      'Transportation': 420,
      'Dining Out & Takeout': 350,
      'Entertainment & Leisure': 250,
      'Subscriptions & Digital': 80,
      'Savings & Investments': 2000,
      'Miscellaneous': 200,
    },
    expenses: [
      { id: 'exp-401', title: 'Suburban Home Mortgage & Escrow', amount: 2300, category: 'Rent & Housing', date: '2026-09-01', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-402', title: 'Costco Wholesale Bulk Family Run', amount: 580, category: 'Food & Groceries', date: '2026-09-04', paymentMethod: 'Credit Card', priority: 'Needs' },
      { id: 'exp-403', title: 'Safeway Weekly Produce & Meats', amount: 460, category: 'Food & Groceries', date: '2026-09-12', paymentMethod: 'Credit Card', priority: 'Needs' },
      { id: 'exp-404', title: 'Local Bakery & Dairy Restock', amount: 290, category: 'Food & Groceries', date: '2026-09-20', paymentMethod: 'Debit Card', priority: 'Needs' },
      { id: 'exp-405', title: 'After-School Care & Youth Soccer Club', amount: 820, category: 'Education & Learning', date: '2026-09-03', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-406', title: 'Family Health Insurance Co-pays & Pediatrician', amount: 480, category: 'Healthcare & Wellness', date: '2026-09-10', paymentMethod: 'Credit Card', priority: 'Needs' },
      { id: 'exp-407', title: 'Dual Car Gas & Mini-van Maintenance', amount: 390, category: 'Transportation', date: '2026-09-15', paymentMethod: 'Credit Card', priority: 'Needs' },
      { id: 'exp-408', title: 'Home Electricity, Water & Fiber WiFi', amount: 430, category: 'Utilities & Bills', date: '2026-09-06', paymentMethod: 'Bank Transfer', priority: 'Needs', isRecurring: true },
      { id: 'exp-409', title: 'Family Pizza Night & Saturday Diners', amount: 340, category: 'Dining Out & Takeout', date: '2026-09-18', paymentMethod: 'Credit Card', priority: 'Wants' },
      { id: 'exp-410', title: 'Science Museum Family Membership & Outing', amount: 190, category: 'Entertainment & Leisure', date: '2026-09-21', paymentMethod: 'Credit Card', priority: 'Wants' },
    ],
    goals: [
      {
        id: 'goal-401',
        title: 'Kids 529 College Investment Fund',
        targetAmount: 50000,
        currentAmount: 29400,
        monthlyContribution: 800,
        targetDate: '2030-08-31',
        category: 'Education',
        icon: '🎓',
        color: '#8b5cf6',
      },
      {
        id: 'goal-402',
        title: 'Household Emergency Reserve (6 Mo)',
        targetAmount: 35000,
        currentAmount: 23500,
        monthlyContribution: 700,
        targetDate: '2027-08-31',
        category: 'Emergency Fund',
        icon: '🛡️',
        color: '#10b981',
      },
    ],
    scenarioStory: 'Sarah & Mark oversee $8,600 in joint earnings. Rising bulk grocery costs ($1,330) and education expenses require careful family budget coordination.',
    keyChallenge: 'Coordinating two income streams across heavy fixed family commitments ($6,500+ baseline burn rate).',
    aiStrategy: 'Consolidated category tracking: Meal plan Costco staples to shave $200/mo, automate 529 and emergency deposits on payday.',
  },
];

// Epics (8) & Tasks (15) as specified in project requirements
export const EPICS: EpicItem[] = [
  {
    id: 'epic-1',
    epicCode: 'EPIC-01',
    title: 'Income Management & Stream Classification',
    description: 'Track single and multiple income streams, recurring schedules, and variable freelance inflows.',
    status: 'Completed',
    tasksCount: 2,
    completedTasks: 2,
    tags: ['Backend', 'Data Modeling', 'Income'],
  },
  {
    id: 'epic-2',
    epicCode: 'EPIC-02',
    title: 'Daily & Weekly Expense Categorization Engine',
    description: 'Granular multi-category expense logging, payment method auditing, and recurring expense tags.',
    status: 'Completed',
    tasksCount: 2,
    completedTasks: 2,
    tags: ['Expenses', 'Categorization', 'Validation'],
  },
  {
    id: 'epic-3',
    epicCode: 'EPIC-03',
    title: 'AI Budget Plan Generator (50/30/20 & Zero-Based)',
    description: 'Dynamic budget recommendations powered by Gemini 3.8 Flash, tailored to income baseline and persona.',
    status: 'Completed',
    tasksCount: 2,
    completedTasks: 2,
    tags: ['GeminiAI', 'AI Engine', 'Budgeting'],
  },
  {
    id: 'epic-4',
    epicCode: 'EPIC-04',
    title: 'Savings & Emergency Fund Tracking System',
    description: '3-6 month essential expense buffer calculator, multi-goal progress bars, and target deadline simulators.',
    status: 'Completed',
    tasksCount: 2,
    completedTasks: 2,
    tags: ['Savings', 'Emergency Fund', 'Calculations'],
  },
  {
    id: 'epic-5',
    epicCode: 'EPIC-05',
    title: 'Structured Monthly Financial Reporting & Auditing',
    description: 'Executive monthly summary reports with income vs expenses breakdown, category variance, and health scores.',
    status: 'Completed',
    tasksCount: 2,
    completedTasks: 2,
    tags: ['Reporting', 'Analytics', 'Variance'],
  },
  {
    id: 'epic-6',
    epicCode: 'EPIC-06',
    title: 'Conversational Personal Finance Advisor Bot',
    description: 'Interactive natural language CFP assistant offering live money coaching grounded in user ledger data.',
    status: 'Completed',
    tasksCount: 2,
    completedTasks: 2,
    tags: ['Chatbot', 'CFP Coach', 'GeminiAI'],
  },
  {
    id: 'epic-7',
    epicCode: 'EPIC-07',
    title: 'Multi-Persona Scenario Simulation Architecture',
    description: 'One-click simulation of Salaried Professional, College Student, Freelancer, and Household Manager personas.',
    status: 'Completed',
    tasksCount: 2,
    completedTasks: 2,
    tags: ['Scenarios', 'Simulation', 'Personas'],
  },
  {
    id: 'epic-8',
    epicCode: 'EPIC-08',
    title: 'Financial Health Scoring & Anomaly Detection',
    description: 'Real-time financial health algorithm (0-100), overspending alerts, and predictive cash flow indicators.',
    status: 'Completed',
    tasksCount: 1,
    completedTasks: 1,
    tags: ['Health Score', 'Algorithms', 'Alerts'],
  },
];

export const STORIES_AND_TASKS: StoryTask[] = [
  {
    id: 'task-1',
    epicCode: 'EPIC-01',
    taskCode: 'TASK-101',
    title: 'Develop Income Data Model & Multiple Stream Logging',
    description: 'Support recording fixed salaries, variable hourly wages, allowances, side hustles, and investment dividends.',
    status: 'Done',
    priority: 'Critical',
    technicalSpec: 'SQLAlchemy / SQLite schema with Income(id, source, amount, frequency, date, is_recurring). Express API /api/income.',
    acceptanceCriteria: [
      'Allows adding single or multiple income items with custom dates.',
      'Supports frequency types: Monthly, Bi-weekly, Weekly, One-time.',
      'Calculates aggregate net monthly income automatically.',
    ],
  },
  {
    id: 'task-2',
    epicCode: 'EPIC-01',
    taskCode: 'TASK-102',
    title: 'Variable Income Smoothing & Fluctuation Tracking',
    description: 'Compute 6-month trailing average for freelance workers with irregular client payouts.',
    status: 'Done',
    priority: 'High',
    technicalSpec: 'Smoothing algorithm calculating leanest month, peak month, and conservative baseline cash flow.',
    acceptanceCriteria: [
      'Highlights months with reduced saving capacity.',
      'Calculates minimum safe baseline spending floor.',
    ],
  },
  {
    id: 'task-3',
    epicCode: 'EPIC-02',
    taskCode: 'TASK-201',
    title: 'Categorized Expense Entry with Payment Method Mapping',
    description: 'Log daily and weekly expenditures across Housing, Groceries, Dining, Transport, Utilities, and Entertainment.',
    status: 'Done',
    priority: 'Critical',
    technicalSpec: 'Expense schema with validation for amount > 0, category assignment, priority (Needs vs Wants), and date parsing.',
    acceptanceCriteria: [
      'Immediate real-time recalculation of total spend and remaining budget.',
      'Filterable by category, date range, and payment method.',
    ],
  },
  {
    id: 'task-4',
    epicCode: 'EPIC-02',
    taskCode: 'TASK-202',
    title: 'Recurring Subscription & Auto-Debit Detection',
    description: 'Flag recurring micro-transactions such as streaming services and software licenses.',
    status: 'Done',
    priority: 'Medium',
    technicalSpec: 'Recurring flag tracker with automated monthly commitment rollup.',
    acceptanceCriteria: [
      'Visual badge for recurring items.',
      'Subscription audit card highlighting total monthly recurring burden.',
    ],
  },
  {
    id: 'task-5',
    epicCode: 'EPIC-03',
    taskCode: 'TASK-301',
    title: 'Gemini 3.8 Flash AI Budget Plan Generation Engine',
    description: 'Analyze user income, logged expenses, and active persona to generate tailored budget category caps.',
    status: 'Done',
    priority: 'Critical',
    technicalSpec: 'Backend endpoint POST /api/gemini/generate-budget invoking GoogleGenAI SDK with structured JSON response.',
    acceptanceCriteria: [
      'Generates category recommendations following 50/30/20 principles.',
      'Detects overspending categories and produces concrete savings hacks.',
      'Gracefully falls back to heuristic engine if API key is not configured.',
    ],
  },
  {
    id: 'task-6',
    epicCode: 'EPIC-03',
    taskCode: 'TASK-302',
    title: 'Interactive Category Budget Sliders & Real-Time Variance',
    description: 'Allow users to tweak budget limits with immediate visual feedback on surplus or deficit.',
    status: 'Done',
    priority: 'High',
    technicalSpec: 'Stateful allocation component maintaining total income ceiling and percentage allocations.',
    acceptanceCriteria: [
      'Dynamic color indicators (green = under budget, amber = approaching, red = exceeded).',
      'Surplus updates dynamically as sliders move.',
    ],
  },
  {
    id: 'task-7',
    epicCode: 'EPIC-04',
    taskCode: 'TASK-401',
    title: 'Emergency Fund Buffer Multiplier Calculator',
    description: 'Calculate 3-month and 6-month essential living expense targets and calculate current months covered.',
    status: 'Done',
    priority: 'High',
    technicalSpec: 'Evaluates essential "Needs" expense sum and projects emergency runway in months.',
    acceptanceCriteria: [
      'Displays months of runway currently banked.',
      'Provides status badge (e.g. "3.4 Months Covered - Healthy").',
    ],
  },
  {
    id: 'task-8',
    epicCode: 'EPIC-04',
    taskCode: 'TASK-402',
    title: 'Multi-Goal Savings Tracker with Milestone Progress Bars',
    description: 'Track multiple saving goals (Tech, Travel, Home, College Fund) with automated completion date forecasting.',
    status: 'Done',
    priority: 'High',
    technicalSpec: 'Linear projection calculation based on target amount, current amount, and monthly deposit rate.',
    acceptanceCriteria: [
      'Target date and months remaining calculated dynamically.',
      'One-click deposit simulator to test accelerated timelines.',
    ],
  },
  {
    id: 'task-9',
    epicCode: 'EPIC-05',
    taskCode: 'TASK-501',
    title: 'Consolidated Monthly Financial Report Generator',
    description: 'Produce an executive monthly report comparing income vs expenses, savings achieved, and overruns.',
    status: 'Done',
    priority: 'Critical',
    technicalSpec: 'POST /api/gemini/monthly-report producing executive synthesis, grade (A to D), and next month strategic goals.',
    acceptanceCriteria: [
      'Highlights top 3 overspending categories with percentage overrun.',
      'Identifies key savings milestones attained.',
      'Print-ready and exportable layout.',
    ],
  },
  {
    id: 'task-10',
    epicCode: 'EPIC-05',
    taskCode: 'TASK-502',
    title: 'Category-Level Spending Variance & Heatmap Analysis',
    description: 'Visual comparison between planned budget vs actual spend per category.',
    status: 'Done',
    priority: 'Medium',
    technicalSpec: 'Variance math: (actual - budgeted) / budgeted * 100 with delta pill badges.',
    acceptanceCriteria: [
      'Visual breakdown bars with percentage fill.',
      'Positive and negative variance pills clearly distinguished.',
    ],
  },
  {
    id: 'task-11',
    epicCode: 'EPIC-06',
    taskCode: 'TASK-601',
    title: 'Conversational Personal Finance Advisor Bot Interface',
    description: 'Interactive chat interface powered by Gemini 3.8 Flash with system prompt acting as a Certified Financial Planner.',
    status: 'Done',
    priority: 'Critical',
    technicalSpec: 'POST /api/gemini/chat with conversation history, live ledger context injection, and CFP system instructions.',
    acceptanceCriteria: [
      'Grounds recommendations in user live income, spend, and goals.',
      'Interactive quick-question prompt chips for fast coaching.',
      'Clear markdown formatting with bold metrics and bulleted action steps.',
    ],
  },
  {
    id: 'task-12',
    epicCode: 'EPIC-06',
    taskCode: 'TASK-602',
    title: 'Contextual Financial Ledger Injection to Chat Engine',
    description: 'Pass live income, expenses, top categories, and savings rate to LLM prompt without exposing PII.',
    status: 'Done',
    priority: 'High',
    technicalSpec: 'Server-side sanitizer building structured financial metadata header for AI reasoning.',
    acceptanceCriteria: [
      'LLM replies cite the user exact numbers (e.g. "$5,200 income, $3,430 expenses").',
      'Provides context-specific math when user asks "Can I afford X?".',
    ],
  },
  {
    id: 'task-13',
    epicCode: 'EPIC-07',
    taskCode: 'TASK-701',
    title: 'Pre-Packaged 4-Scenario Dataset & Persona Switcher',
    description: 'Instant 1-click loading of Salaried Professional, College Student, Freelancer, and Household Manager scenarios.',
    status: 'Done',
    priority: 'Critical',
    technicalSpec: 'Scenario state loader populating state, localStorage, and resetting active ledger.',
    acceptanceCriteria: [
      'Switching persona instantly updates all cards, charts, budgets, and transactions.',
      'Maintains custom transaction addition support on top of any scenario.',
    ],
  },
  {
    id: 'task-14',
    epicCode: 'EPIC-07',
    taskCode: 'TASK-702',
    title: 'Scenario Story & Tactical Challenge Card Display',
    description: 'Display persona background narrative, key challenge, and AI strategic focus at the top of the workspace.',
    status: 'Done',
    priority: 'Medium',
    technicalSpec: 'Persona banner component with avatar, challenge callout, and AI recommendation tag.',
    acceptanceCriteria: [
      'Explains why this persona represents unique budgeting dynamics.',
    ],
  },
  {
    id: 'task-15',
    epicCode: 'EPIC-08',
    taskCode: 'TASK-801',
    title: 'Comprehensive Financial Health Scoring Engine',
    description: 'Holistic health score (0-100) aggregating Savings Rate (40%), Budget Discipline (30%), and Emergency Buffer (30%).',
    status: 'Done',
    priority: 'High',
    technicalSpec: 'Weighted composite scoring formula mapping to letter grades (A+, A, B+, B, C, D) and actionable alert triggers.',
    acceptanceCriteria: [
      'Circular or gauge health score widget with color states.',
      'Trigger active alert notifications when spending exceeds critical thresholds.',
    ],
  },
];

export const TECHNICAL_ARCHITECTURE_SPECS = {
  systemOverview: 'The Personal Finance Advisor Bot utilizes a scalable full-stack architecture combining a robust backend service with an AI analysis engine and an interactive React client to automate personal budget generation and financial planning.',
  flaskSqlalchemyBlueprint: `
# Flask & SQLAlchemy Backend Architecture Blueprint
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///personal_finance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    scenario_type = db.Column(db.String(50), default='Salaried Professional')
    monthly_income = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    incomes = db.relationship('Income', backref='user', lazy=True, cascade='all, delete-orphan')
    expenses = db.relationship('Expense', backref='user', lazy=True, cascade='all, delete-orphan')
    budgets = db.relationship('Budget', backref='user', lazy=True, cascade='all, delete-orphan')
    savings_goals = db.relationship('SavingsGoal', backref='user', lazy=True, cascade='all, delete-orphan')

class Income(db.Model):
    __tablename__ = 'incomes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    source = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    is_recurring = db.Column(db.Boolean, default=False)
    frequency = db.Column(db.String(30), default='Monthly')

class Expense(db.Model):
    __tablename__ = 'expenses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(50), default='Credit Card')
    priority = db.Column(db.String(20), default='Needs') # Needs vs Wants
    is_recurring = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text, nullable=True)

class Budget(db.Model):
    __tablename__ = 'budgets'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    budget_limit = db.Column(db.Float, nullable=False)
    month = db.Column(db.String(20), nullable=False)

class SavingsGoal(db.Model):
    __tablename__ = 'savings_goals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0.0)
    monthly_contribution = db.Column(db.Float, default=0.0)
    target_date = db.Column(db.Date, nullable=True)
`,
  hardwareRequirements: {
    processor: 'Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or equivalent',
    ram: 'Minimum 8 GB (Recommended: 16 GB for multitasking and AWS Labs usage)',
    storage: '256 GB SSD (or 500 GB HDD minimum)',
    internet: 'Stable high-speed internet connection (minimum 10 Mbps, recommended 20 Mbps for AWS Labs and deployments)',
  },
  softwareRequirements: {
    operatingSystem: 'Windows 10 / 11, macOS (Monterey or later), or Linux (Ubuntu 20.04+)',
    browser: 'Latest version of Google Chrome, Mozilla Firefox, or Microsoft Edge',
    ide: 'Visual Studio Code (recommended) or any preferred IDE',
    versionControl: 'Git (latest version installed and configured)',
    additionalTools: 'Python (version 3.8 or above), AWS CLI (latest version), Node.js (18+), SQLite 3',
  },
  skillsRequired: [
    { name: 'Python', role: 'Backend API, ORM data modelling, and financial analytics scripting' },
    { name: 'GeminiAI', role: 'Generative AI financial advisory, prompt engineering, budget synthesis' },
    { name: 'Flask (Web Framework)', role: 'RESTful API routing, request validation, authentication middleware' },
    { name: 'SQLite', role: 'Relational ACID transaction persistence for ledgers and user records' },
    { name: 'JavaScript / TypeScript', role: 'Reactive SPA user interface, interactive charts, real-time client state' },
  ],
};
