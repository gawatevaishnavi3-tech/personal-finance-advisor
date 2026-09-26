/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Plus, Layers, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { SCENARIOS } from './data/scenarios';
import { PersonaScenario, ExpenseItem, IncomeItem, SavingsGoal } from './types';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AIBudgetPlanner } from './components/AIBudgetPlanner';
import { ExpenseIncomeTracker } from './components/ExpenseIncomeTracker';
import { SavingsEmergencyPlanner } from './components/SavingsEmergencyPlanner';
import { MonthlyReportView } from './components/MonthlyReportView';
import { AdvisorBotDrawer } from './components/AdvisorBotDrawer';
import { PredictiveInvestments } from './components/PredictiveInvestments';
import { TechnicalArchitectureModal } from './components/TechnicalArchitectureModal';
import { AddTransactionModal } from './components/AddTransactionModal';

export default function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('salaried-professional');
  const currentScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currency, setCurrency] = useState<string>('$');
  const [month, setMonth] = useState<string>('September 2026');

  // Active ledger state per scenario (stored in memory and localStorage)
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(`expenses_${selectedScenarioId}`);
    return saved ? JSON.parse(saved) : currentScenario.expenses;
  });

  const [incomeStreams, setIncomeStreams] = useState<IncomeItem[]>(() => {
    const saved = localStorage.getItem(`income_${selectedScenarioId}`);
    return saved ? JSON.parse(saved) : currentScenario.incomeStreams;
  });

  const [budgets, setBudgets] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`budgets_${selectedScenarioId}`);
    return saved ? JSON.parse(saved) : currentScenario.budgets;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(`goals_${selectedScenarioId}`);
    return saved ? JSON.parse(saved) : currentScenario.goals;
  });

  // Modal and drawer controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'expense' | 'income'>('expense');
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // When scenario changes, update state
  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const newSc = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

    const savedExp = localStorage.getItem(`expenses_${scenarioId}`);
    setExpenses(savedExp ? JSON.parse(savedExp) : newSc.expenses);

    const savedInc = localStorage.getItem(`income_${scenarioId}`);
    setIncomeStreams(savedInc ? JSON.parse(savedInc) : newSc.incomeStreams);

    const savedBud = localStorage.getItem(`budgets_${scenarioId}`);
    setBudgets(savedBud ? JSON.parse(savedBud) : newSc.budgets);

    const savedGoals = localStorage.getItem(`goals_${scenarioId}`);
    setGoals(savedGoals ? JSON.parse(savedGoals) : newSc.goals);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`expenses_${selectedScenarioId}`, JSON.stringify(expenses));
  }, [expenses, selectedScenarioId]);

  useEffect(() => {
    localStorage.setItem(`income_${selectedScenarioId}`, JSON.stringify(incomeStreams));
  }, [incomeStreams, selectedScenarioId]);

  useEffect(() => {
    localStorage.setItem(`budgets_${selectedScenarioId}`, JSON.stringify(budgets));
  }, [budgets, selectedScenarioId]);

  useEffect(() => {
    localStorage.setItem(`goals_${selectedScenarioId}`, JSON.stringify(goals));
  }, [goals, selectedScenarioId]);

  // Handlers
  const handleAddExpense = (newExp: Omit<ExpenseItem, 'id'>) => {
    const item: ExpenseItem = {
      ...newExp,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [item, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddIncome = (newInc: Omit<IncomeItem, 'id'>) => {
    const item: IncomeItem = {
      ...newInc,
      id: `inc-${Date.now()}`,
    };
    setIncomeStreams((prev) => [item, ...prev]);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomeStreams((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateBudgets = (newBudgets: Record<string, number>) => {
    setBudgets(newBudgets);
  };

  const handleUpdateGoals = (newGoals: SavingsGoal[]) => {
    setGoals(newGoals);
  };

  const openAddModal = (type: 'expense' | 'income') => {
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        scenarios={SCENARIOS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenAddModal={openAddModal}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        onOpenChat={() => setActiveTab('chat')}
        aiEngineStatus="online"
        month={month}
        setMonth={setMonth}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            scenario={currentScenario}
            expenses={expenses}
            incomeStreams={incomeStreams}
            budgets={budgets}
            goals={goals}
            currency={currency}
            onNavigateTab={setActiveTab}
            onOpenAddModal={openAddModal}
            onOpenChat={() => setActiveTab('chat')}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'budget' && (
          <AIBudgetPlanner
            scenario={currentScenario}
            incomeStreams={incomeStreams}
            expenses={expenses}
            budgets={budgets}
            onUpdateBudgets={handleUpdateBudgets}
            goals={goals}
            currency={currency}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'tracker' && (
          <ExpenseIncomeTracker
            expenses={expenses}
            incomeStreams={incomeStreams}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
            currency={currency}
            onOpenAddModal={openAddModal}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsEmergencyPlanner
            scenario={currentScenario}
            goals={goals}
            onUpdateGoals={handleUpdateGoals}
            expenses={expenses}
            incomeStreams={incomeStreams}
            currency={currency}
          />
        )}

        {activeTab === 'investments' && (
          <PredictiveInvestments
            scenario={currentScenario}
            expenses={expenses}
            incomeStreams={incomeStreams}
            goals={goals}
            currency={currency}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'report' && (
          <MonthlyReportView
            scenario={currentScenario}
            expenses={expenses}
            incomeStreams={incomeStreams}
            budgets={budgets}
            goals={goals}
            currency={currency}
            month={month}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <AdvisorBotDrawer
              scenario={currentScenario}
              expenses={expenses}
              incomeStreams={incomeStreams}
              goals={goals}
              currency={currency}
              isDrawer={false}
            />
          </div>
        )}
      </main>

      {/* Floating Advisor Bot Trigger Button (visible when not on chat tab) */}
      {activeTab !== 'chat' && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-3.5 text-slate-950 font-bold shadow-2xl shadow-emerald-500/30 hover:scale-105 transition group"
            title="Chat with Personal Finance Advisor Bot"
          >
            <Bot className="h-6 w-6" />
            <span className="hidden sm:inline text-xs font-extrabold pr-1">Ask Advisor Bot</span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal Overlay */}
      {isFloatingChatOpen && activeTab !== 'chat' && (
        <div className="fixed bottom-20 right-6 z-40 w-full max-w-md animate-in slide-in-from-bottom-5 duration-200">
          <AdvisorBotDrawer
            scenario={currentScenario}
            expenses={expenses}
            incomeStreams={incomeStreams}
            goals={goals}
            currency={currency}
            isDrawer={true}
            onClose={() => setIsFloatingChatOpen(false)}
          />
        </div>
      )}

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType={addModalType}
        onAddExpense={handleAddExpense}
        onAddIncome={handleAddIncome}
        currency={currency}
      />

      <TechnicalArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Personal Finance Advisor Bot</span>
            <span>•</span>
            <span>AI-Driven Financial Planning &amp; Budget Optimization</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hover:text-emerald-400 transition"
            >
              System Specs (8 Epics • 15 Tasks)
            </button>
            <span>•</span>
            <span className="text-emerald-500 font-mono">Gemini 3.8 Flash Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
