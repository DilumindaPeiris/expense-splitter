import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  Download, 
  RefreshCw, 
  DollarSign, 
  FileSpreadsheet, 
  FileText,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { CURRENCIES } from '../data/mockData';

export default function Header({ 
  groups, 
  activeGroupId, 
  onSelectGroup, 
  onOpenAddExpense, 
  onOpenNewGroup,
  onOpenEditGroup,
  currency, 
  onChangeCurrency, 
  onExportCSV, 
  onExportPDF, 
  onResetDemo 
}) {
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="glass-card mb-6 p-4 border-b border-glass sticky top-2 z-40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Group Selector */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                SplitSmart
              </h1>
              <span className="badge badge-indigo text-xs">Minimizer Engine</span>
            </div>

            {/* Group Switcher Dropdown */}
            <div className="flex items-center gap-2 mt-0.5">
              <select 
                value={activeGroupId} 
                onChange={(e) => onSelectGroup(e.target.value)}
                className="bg-transparent text-sm font-semibold text-indigo-300 hover:text-white cursor-pointer outline-none border-none py-0.5 pr-2"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.name} ({g.members.length} members)
                  </option>
                ))}
              </select>
              <button 
                onClick={onOpenEditGroup}
                title="Edit Group & Members"
                className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1">
            <DollarSign className="w-4 h-4 text-emerald-400 mr-1" />
            <select 
              value={currency} 
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 cursor-pointer outline-none border-none"
            >
              {CURRENCIES.map(curr => (
                <option key={curr} value={curr} className="bg-slate-900 text-white">
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* New Group Button */}
          <button 
            onClick={onOpenNewGroup}
            className="btn btn-secondary text-xs px-3 py-2"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>New Group</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn btn-secondary text-xs px-3 py-2"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export</span>
            </button>
            
            {showExportMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 glass-card border border-slate-700 bg-slate-900/95 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button 
                  onClick={() => { setShowExportMenu(false); onExportCSV(); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Download CSV Summary</span>
                </button>
                <button 
                  onClick={() => { setShowExportMenu(false); onExportPDF(); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>Export PDF Report</span>
                </button>
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <button 
            onClick={onResetDemo}
            title="Reset to sample demo data"
            className="btn btn-secondary text-xs p-2"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </button>

          {/* Add Expense Primary Button */}
          <button 
            onClick={onOpenAddExpense}
            className="btn btn-primary text-sm px-4 py-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>

        </div>
      </div>
    </header>
  );
}
