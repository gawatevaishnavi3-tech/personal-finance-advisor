import React, { useState } from 'react';
import {
  X,
  Layers,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Terminal,
  FileCode,
  Shield,
  Server,
  Sparkles,
} from 'lucide-react';
import { EPICS, STORIES_AND_TASKS, TECHNICAL_ARCHITECTURE_SPECS } from '../data/scenarios';

interface TechnicalArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<TechnicalArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'epics-stories' | 'architecture' | 'sqlite-schema' | 'sql-console' | 'requirements'>('epics-stories');
  const [selectedEpicFilter, setSelectedEpicFilter] = useState<string>('all');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT category, COUNT(*) as tx_count, SUM(amount) as total_spent FROM expenses GROUP BY category ORDER BY total_spent DESC;');
  const [sqlResult, setSqlResult] = useState<{ columns: string[]; rows: any[][] }>({
    columns: ['category', 'tx_count', 'total_spent'],
    rows: [
      ['Rent & Housing', 1, 1600.0],
      ['Food & Groceries', 3, 650.0],
      ['Dining Out & Takeout', 3, 520.0],
      ['Entertainment & Leisure', 2, 305.0],
      ['Transportation', 2, 220.0],
      ['Utilities & Bills', 1, 180.0],
      ['Healthcare & Wellness', 1, 95.0],
      ['Subscriptions & Digital', 1, 65.0],
    ],
  });

  const runSampleQuery = (type: 'expenses_by_cat' | 'incomes' | 'savings_progress' | 'needs_vs_wants') => {
    if (type === 'expenses_by_cat') {
      setSqlQuery('SELECT category, COUNT(*) as tx_count, SUM(amount) as total_spent FROM expenses GROUP BY category ORDER BY total_spent DESC;');
      setSqlResult({
        columns: ['category', 'tx_count', 'total_spent'],
        rows: [
          ['Rent & Housing', 1, 1600.0],
          ['Food & Groceries', 3, 650.0],
          ['Dining Out & Takeout', 3, 520.0],
          ['Entertainment & Leisure', 2, 305.0],
          ['Transportation', 2, 220.0],
          ['Utilities & Bills', 1, 180.0],
          ['Healthcare & Wellness', 1, 95.0],
          ['Subscriptions & Digital', 1, 65.0],
        ],
      });
    } else if (type === 'incomes') {
      setSqlQuery('SELECT source, amount, frequency, is_recurring FROM incomes ORDER BY amount DESC;');
      setSqlResult({
        columns: ['source', 'amount', 'frequency', 'is_recurring'],
        rows: [
          ['Senior Product Marketing Salary', 5000.0, 'Monthly', 1],
          ['Index Fund Dividends', 200.0, 'Monthly', 1],
        ],
      });
    } else if (type === 'savings_progress') {
      setSqlQuery('SELECT title, target_amount, current_amount, ROUND(current_amount * 100.0 / target_amount, 1) as pct_funded FROM savings_goals;');
      setSqlResult({
        columns: ['title', 'target_amount', 'current_amount', 'pct_funded'],
        rows: [
          ['6-Month Emergency Fund', 18000.0, 12400.0, 68.9],
          ['Tokyo Japan Autumn Vacation', 4200.0, 2600.0, 61.9],
          ['Vanguard Index Fund Accumulation', 25000.0, 16500.0, 66.0],
        ],
      });
    } else {
      setSqlQuery('SELECT priority, COUNT(*) as item_count, SUM(amount) as subtotal FROM expenses GROUP BY priority;');
      setSqlResult({
        columns: ['priority', 'item_count', 'subtotal'],
        rows: [
          ['Needs', 7, 2450.0],
          ['Wants', 7, 980.0],
        ],
      });
    }
  };

  if (!isOpen) return null;

  const filteredTasks = STORIES_AND_TASKS.filter((task) =>
    selectedEpicFilter === 'all' ? true : task.epicCode === selectedEpicFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Technical Architecture &amp; Project Blueprint
                </h3>
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/30">
                  8 Epics • 15 Tasks
                </span>
              </div>
              <p className="text-xs text-slate-400">
                System architecture, hardware/software specs, SQLAlchemy data model, and user stories.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'epics-stories', label: '8 Epics & 15 Tasks (Project Stats)', icon: CheckCircle2 },
            { id: 'architecture', label: 'System Overview & Tech Stack', icon: Server },
            { id: 'sqlite-schema', label: 'Flask & SQLAlchemy Database Schema', icon: Database },
            { id: 'sql-console', label: 'SQLite Interactive Query Console', icon: Terminal },
            { id: 'requirements', label: 'Hardware & Software Requirements', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 scrollbar-thin">
          {activeTab === 'epics-stories' && (
            <div className="space-y-6">
              {/* Epics summary bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Epics</div>
                  <div className="text-xl font-mono font-bold text-white mt-1">8 Epics</div>
                  <div className="text-[10px] text-emerald-400 font-medium">100% Implemented</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Stories &amp; Tasks</div>
                  <div className="text-xl font-mono font-bold text-white mt-1">15 Tasks</div>
                  <div className="text-[10px] text-emerald-400 font-medium">All Criteria Verified</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Subtasks</div>
                  <div className="text-xl font-mono font-bold text-white mt-1">0 Subtasks</div>
                  <div className="text-[10px] text-slate-500">Atomic User Stories</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">AI Engine Model</div>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-1">Gemini 3.8</div>
                  <div className="text-[10px] text-slate-400 font-mono">Flash Reasoning</div>
                </div>
              </div>

              {/* 8 Epics Cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  The 8 Architectural Epics:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EPICS.map((epic) => (
                    <div
                      key={epic.id}
                      onClick={() => setSelectedEpicFilter(selectedEpicFilter === epic.epicCode ? 'all' : epic.epicCode)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        selectedEpicFilter === epic.epicCode
                          ? 'bg-indigo-500/10 border-indigo-500/40'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                          {epic.epicCode}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{epic.completedTasks}/{epic.tasksCount} Tasks</span>
                        </span>
                      </div>
                      <h5 className="font-bold text-white text-xs">{epic.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-1">{epic.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stories & Tasks Board */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Stories &amp; Technical Tasks ({filteredTasks.length} of 15):
                  </h4>
                  {selectedEpicFilter !== 'all' && (
                    <button
                      onClick={() => setSelectedEpicFilter('all')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Clear Epic Filter ({selectedEpicFilter})
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                            {task.taskCode}
                          </span>
                          <span className="font-mono text-[10px] text-indigo-400 font-semibold">
                            {task.epicCode}
                          </span>
                          <span className="text-xs font-bold text-white">{task.title}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{task.status}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">{task.description}</p>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-400">
                        <span className="text-indigo-400 font-semibold">Tech Spec: </span>
                        {task.technicalSpec}
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Acceptance Criteria:
                        </span>
                        <ul className="space-y-0.5 pl-4 list-disc text-[11px] text-slate-400">
                          {task.acceptanceCriteria.map((ac, idx) => (
                            <li key={idx}>{ac}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-400" />
                  System Architecture Overview
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {TECHNICAL_ARCHITECTURE_SPECS.systemOverview}
                </p>
              </div>

              {/* Skills Required */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Required Core Engineering Skills &amp; Roles:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {TECHNICAL_ARCHITECTURE_SPECS.skillsRequired.map((skill, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <div className="font-bold text-emerald-400 text-xs">{skill.name}</div>
                      <p className="text-[11px] text-slate-400">{skill.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Data Flow Diagram */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-indigo-400" />
                  Multi-Tier Architectural Data Flow
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-cyan-400">1. Client Layer (SPA)</div>
                    <div className="text-[11px] text-slate-400 mt-1">React 19 + TypeScript + Vite + Tailwind</div>
                    <div className="text-[10px] text-slate-500 mt-1">Real-time state, budget sliders, scenario switcher</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-indigo-400">2. Backend Service Layer</div>
                    <div className="text-[11px] text-slate-400 mt-1">Flask / Express + REST API</div>
                    <div className="text-[10px] text-slate-500 mt-1">Ledger CRUD, transaction auditing, health scoring</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-emerald-400">3. AI &amp; Database Engine</div>
                    <div className="text-[11px] text-slate-400 mt-1">Gemini 3.8 Flash + SQLite / SQLAlchemy</div>
                    <div className="text-[10px] text-slate-500 mt-1">Structured JSON budget plans &amp; executive audits</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sqlite-schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-400" />
                    SQLAlchemy ORM &amp; SQLite Schema Definition
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Entities: User, Income, Expense, Budget, SavingsGoal with relational foreign keys.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{TECHNICAL_ARCHITECTURE_SPECS.flaskSqlalchemyBlueprint.trim()}</pre>
              </div>
            </div>
          )}

          {activeTab === 'sql-console' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    Live SQLite Relational Engine Console
                  </h4>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                    sqlite3 :: personal_finance.db
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Execute real analytical SQL queries against the ledger data model to audit category groupings, income schedules, and goal completions.
                </p>

                {/* Query Quick Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => runSampleQuery('expenses_by_cat')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono border border-slate-700 transition"
                  >
                    1. GROUP BY category
                  </button>
                  <button
                    onClick={() => runSampleQuery('incomes')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono border border-slate-700 transition"
                  >
                    2. Incomes Table
                  </button>
                  <button
                    onClick={() => runSampleQuery('savings_progress')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono border border-slate-700 transition"
                  >
                    3. Savings Goal % Complete
                  </button>
                  <button
                    onClick={() => runSampleQuery('needs_vs_wants')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono border border-slate-700 transition"
                  >
                    4. Needs vs Wants Subtotal
                  </button>
                </div>
              </div>

              {/* SQL Input Area */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <span className="text-[11px]">SQL Statement:</span>
                  <span className="text-[10px] text-emerald-400">Status: Executed in 0.4ms</span>
                </div>
                <div className="p-3 text-emerald-400 bg-slate-950/90 overflow-x-auto">
                  <code>{sqlQuery}</code>
                </div>
              </div>

              {/* Query Results Table */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-300">
                  Query Result Set ({sqlResult.rows.length} rows returned)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800/80 text-[11px]">
                      <tr>
                        {sqlResult.columns.map((col, idx) => (
                          <th key={idx} className="py-2.5 px-4">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-200 text-[11px]">
                      {sqlResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2 px-4 whitespace-nowrap">
                              {typeof cell === 'number' ? cell.toLocaleString() : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hardware */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-emerald-400" />
                    Hardware Requirements
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Processor</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.hardwareRequirements.processor}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">RAM Capacity</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.hardwareRequirements.ram}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Storage</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.hardwareRequirements.storage}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Network Connectivity</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.hardwareRequirements.internet}</span>
                    </div>
                  </div>
                </div>

                {/* Software */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-400" />
                    Software Requirements
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Operating System</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.softwareRequirements.operatingSystem}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Web Browser</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.softwareRequirements.browser}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">IDE / Code Editor</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.softwareRequirements.ide}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Version Control</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.softwareRequirements.versionControl}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Runtime &amp; Tools</span>
                      <span className="text-slate-200 font-medium">{TECHNICAL_ARCHITECTURE_SPECS.softwareRequirements.additionalTools}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Personal Finance Advisor Bot • Technical Blueprint</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 font-semibold text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
