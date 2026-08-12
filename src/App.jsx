import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GroupSummary from './components/GroupSummary';
import MemberLedger from './components/MemberLedger';
import SettlementMinimizer from './components/SettlementMinimizer';
import SettlementGraph from './components/SettlementGraph';
import ExpenseList from './components/ExpenseList';
import AnalyticsCharts from './components/AnalyticsCharts';
import ExpenseModal from './components/ExpenseModal';
import GroupModal from './components/GroupModal';

import { INITIAL_GROUPS } from './data/mockData';
import { calculateGroupBalances } from './utils/settlementAlgorithm';
import { exportToCSV, exportToPDF } from './utils/exportUtils';

export default function App() {
  // Load groups from localStorage or use initial presets
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('splitsmart_groups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved groups', e);
      }
    }
    return INITIAL_GROUPS;
  });

  const [activeGroupId, setActiveGroupId] = useState(() => {
    return groups[0] ? groups[0].id : '';
  });

  const [currency, setCurrency] = useState('USD');

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('splitsmart_groups', JSON.stringify(groups));
  }, [groups]);

  // Active Group
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];

  // Recalculate settlement minimization & balances whenever active group changes
  const settlementData = activeGroup 
    ? calculateGroupBalances(activeGroup.members || [], activeGroup.expenses || [], activeGroup.settlements || [])
    : { balances: {}, simplifiedTransactions: [], unsimplifiedTransactions: [], unsimplifiedCount: 0, simplifiedCount: 0, savingsPercent: 0 };

  // Expense Handlers
  const handleSaveExpense = (newExpense) => {
    setGroups(prevGroups => {
      return prevGroups.map(grp => {
        if (grp.id !== activeGroupId) return grp;
        const exists = grp.expenses.some(e => e.id === newExpense.id);
        const updatedExpenses = exists
          ? grp.expenses.map(e => e.id === newExpense.id ? newExpense : e)
          : [newExpense, ...grp.expenses];

        return { ...grp, expenses: updatedExpenses };
      });
    });
  };

  const handleDeleteExpense = (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setGroups(prevGroups => {
      return prevGroups.map(grp => {
        if (grp.id !== activeGroupId) return grp;
        return {
          ...grp,
          expenses: grp.expenses.filter(e => e.id !== expenseId)
        };
      });
    });
  };

  // Settlement Repayments Handlers
  const handleAddSettlement = (settlementRecord) => {
    setGroups(prevGroups => {
      return prevGroups.map(grp => {
        if (grp.id !== activeGroupId) return grp;
        return {
          ...grp,
          settlements: [settlementRecord, ...(grp.settlements || [])]
        };
      });
    });
  };

  const handleDeleteSettlement = (settlementId) => {
    setGroups(prevGroups => {
      return prevGroups.map(grp => {
        if (grp.id !== activeGroupId) return grp;
        return {
          ...grp,
          settlements: (grp.settlements || []).filter(s => s.id !== settlementId)
        };
      });
    });
  };

  // Group Handlers
  const handleSaveGroup = (savedGroup) => {
    setGroups(prevGroups => {
      const exists = prevGroups.some(g => g.id === savedGroup.id);
      if (exists) {
        return prevGroups.map(g => g.id === savedGroup.id ? savedGroup : g);
      }
      return [savedGroup, ...prevGroups];
    });
    setActiveGroupId(savedGroup.id);
  };

  // Reset Demo Data
  const handleResetDemo = () => {
    if (window.confirm('Reset all data to sample demo trip and roommate groups?')) {
      setGroups(INITIAL_GROUPS);
      setActiveGroupId(INITIAL_GROUPS[0].id);
      localStorage.removeItem('splitsmart_groups');
    }
  };

  // Export Handlers
  const handleExportCSV = () => {
    if (activeGroup) {
      exportToCSV(activeGroup, activeGroup.expenses || [], settlementData, currency);
    }
  };

  const handleExportPDF = () => {
    exportToPDF('report-container', `${activeGroup.name.toLowerCase().replace(/\s+/g, '_')}_report.pdf`);
  };

  return (
    <div className="app-container" id="report-container">
      
      {/* Top Header */}
      <Header
        groups={groups}
        activeGroupId={activeGroupId}
        onSelectGroup={setActiveGroupId}
        onOpenAddExpense={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }}
        onOpenNewGroup={() => { setEditingGroup(null); setIsGroupModalOpen(true); }}
        onOpenEditGroup={() => { setEditingGroup(activeGroup); setIsGroupModalOpen(true); }}
        currency={currency}
        onChangeCurrency={setCurrency}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      {activeGroup ? (
        <main>
          {/* Summary Metric Cards */}
          <GroupSummary
            group={activeGroup}
            settlementData={settlementData}
            currency={currency}
          />

          {/* Member Ledger */}
          <MemberLedger
            members={activeGroup.members}
            balances={settlementData.balances}
            currency={currency}
          />

          {/* Greedy Settlement Plan & Interactive Settlement Graph */}
          <div className="grid-2">
            <SettlementMinimizer
              group={activeGroup}
              settlementData={settlementData}
              currency={currency}
              onAddSettlement={handleAddSettlement}
              onDeleteSettlement={handleDeleteSettlement}
            />

            <SettlementGraph
              members={activeGroup.members}
              settlementData={settlementData}
              currency={currency}
            />
          </div>

          {/* Analytics Visual Charts */}
          <AnalyticsCharts
            group={activeGroup}
            settlementData={settlementData}
            currency={currency}
          />

          {/* Detailed Expense History & Ledger */}
          <ExpenseList
            group={activeGroup}
            expenses={activeGroup.expenses || []}
            currency={currency}
            onEditExpense={(exp) => { setEditingExpense(exp); setIsExpenseModalOpen(true); }}
            onDeleteExpense={handleDeleteExpense}
          />
        </main>
      ) : (
        <div className="text-center py-20 text-slate-400">
          No active group selected. Click "New Group" to create one.
        </div>
      )}

      {/* Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => { setIsExpenseModalOpen(false); setEditingExpense(null); }}
        onSaveExpense={handleSaveExpense}
        members={activeGroup ? activeGroup.members : []}
        initialData={editingExpense}
        currency={currency}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => { setIsGroupModalOpen(false); setEditingGroup(null); }}
        onSaveGroup={handleSaveGroup}
        initialGroup={editingGroup}
      />

    </div>
  );
}
