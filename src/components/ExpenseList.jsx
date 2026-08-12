import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Utensils,
  Home,
  Car,
  Film,
  Zap,
  ShoppingBag,
  Grid
} from 'lucide-react';
import { formatCurrency, calculateExpenseSplits } from '../utils/settlementAlgorithm';
import { CATEGORIES } from '../data/mockData';

export default function ExpenseList({ 
  group, 
  expenses, 
  currency, 
  onEditExpense, 
  onDeleteExpense 
}) {
  const members = group.members || [];
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const categoryIcons = {
    Food: Utensils,
    Stay: Home,
    Transport: Car,
    Entertainment: Film,
    Utilities: Zap,
    Shopping: ShoppingBag,
    Others: Grid
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCat === 'ALL' || e.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const getPayerName = (paidBy) => {
    if (typeof paidBy === 'string') {
      const m = members.find(mem => mem.id === paidBy);
      return m ? m.name : paidBy;
    }
    if (typeof paidBy === 'object' && paidBy !== null) {
      return Object.entries(paidBy)
        .map(([id, amt]) => {
          const m = members.find(mem => mem.id === id);
          return `${m ? m.name : id} (${formatCurrency(amt, currency)})`;
        })
        .join(', ');
    }
    return 'Unknown';
  };

  return (
    <div className="glass-card p-5 mb-6">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            Expense History & Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Search, filter, and inspect detailed itemized expense splits
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search bar */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 w-44">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer border-none"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Expenses Table / List */}
      {filteredExpenses.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl">
          No expenses match the current filter or search criteria.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredExpenses.map((exp) => {
            const isExpanded = expandedId === exp.id;
            const IconComp = categoryIcons[exp.category] || Grid;
            const catObj = CATEGORIES.find(c => c.name === exp.category) || { color: '#6366F1' };
            const splitAmounts = calculateExpenseSplits(exp, members);

            return (
              <div 
                key={exp.id} 
                className="rounded-xl bg-slate-900/60 border border-slate-800/90 overflow-hidden transition-all hover:border-slate-700"
              >
                {/* Main Row */}
                <div 
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex items-center gap-3">
                    {/* Category Icon */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: `${catObj.color}25`, border: `1.5px solid ${catObj.color}` }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: catObj.color }} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                        <span 
                          className="badge text-[10px] py-0.5 px-2"
                          style={{ backgroundColor: `${catObj.color}20`, color: catObj.color, border: `1px solid ${catObj.color}40` }}
                        >
                          {exp.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span>Paid by <strong className="text-indigo-300">{getPayerName(exp.paidBy)}</strong></span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3" /> {exp.date}
                        </span>
                        <span className="uppercase text-[10px] font-semibold text-slate-400">
                          Mode: {exp.splitMode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-black text-white">
                        {formatCurrency(exp.amount, currency)}
                      </div>
                    </div>

                    <div className="text-slate-500 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="bg-slate-950/80 p-4 border-t border-slate-800/80 animate-fadeIn">
                    
                    {exp.notes && (
                      <div className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 mb-3">
                        <strong className="text-slate-400">Notes: </strong>{exp.notes}
                      </div>
                    )}

                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Member Split Breakdown
                    </h4>

                    <div className="grid-3 mb-4">
                      {members.map(m => {
                        const share = splitAmounts[m.id] || 0;
                        return (
                          <div key={m.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
                            <span className="text-slate-300 font-medium">{m.name}</span>
                            <span className="font-bold text-white">{formatCurrency(share, currency)}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditExpense(exp); }}
                        className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 text-indigo-300"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteExpense(exp.id); }}
                        className="btn btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
