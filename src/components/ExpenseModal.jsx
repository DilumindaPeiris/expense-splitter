import React, { useState, useEffect } from 'react';
import { X, Plus, Check, DollarSign, Calculator, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function ExpenseModal({ 
  isOpen, 
  onClose, 
  onSaveExpense, 
  members, 
  initialData, 
  currency 
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || 'Food');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [paidBy, setPaidBy] = useState(initialData?.paidBy || (members[0] ? members[0].id : ''));
  const [splitMode, setSplitMode] = useState(initialData?.splitMode || 'equal');
  const [splits, setSplits] = useState({});

  useEffect(() => {
    setTitle(initialData?.title || '');
    setAmount(initialData?.amount || '');
    setCategory(initialData?.category || 'Food');
    setDate(initialData?.date || new Date().toISOString().split('T')[0]);
    setNotes(initialData?.notes || '');
    setPaidBy(initialData?.paidBy || (members[0] ? members[0].id : ''));
    setSplitMode(initialData?.splitMode || 'equal');
  }, [initialData, isOpen]);

  useEffect(() => {
    if (initialData?.splits) {
      setSplits(initialData.splits);
    } else {
      const initSplits = {};
      members.forEach(m => {
        if (splitMode === 'equal') {
          initSplits[m.id] = true;
        } else if (splitMode === 'exact') {
          initSplits[m.id] = '';
        } else if (splitMode === 'percentage') {
          initSplits[m.id] = (100 / members.length).toFixed(1);
        } else if (splitMode === 'shares') {
          initSplits[m.id] = 1;
        }
      });
      setSplits(initSplits);
    }
  }, [splitMode, isOpen, members, initialData]);

  if (!isOpen) return null;


  const handleSplitChange = (memberId, val) => {
    setSplits(prev => ({
      ...prev,
      [memberId]: val
    }));
  };

  // Validation calculations
  const numAmount = Number(amount) || 0;

  const calculateSum = () => {
    let sum = 0;
    Object.values(splits).forEach(v => {
      sum += Number(v) || 0;
    });
    return Math.round(sum * 100) / 100;
  };

  const currentSum = calculateSum();
  let isValid = true;
  let validationMsg = '';

  if (!title.trim()) {
    isValid = false;
    validationMsg = 'Please enter an expense title.';
  } else if (numAmount <= 0) {
    isValid = false;
    validationMsg = 'Please enter a valid amount greater than 0.';
  } else if (splitMode === 'exact') {
    if (Math.abs(currentSum - numAmount) > 0.05) {
      isValid = false;
      validationMsg = `Exact sum (${currentSum}) must equal total amount (${numAmount}).`;
    }
  } else if (splitMode === 'percentage') {
    if (Math.abs(currentSum - 100) > 0.5) {
      isValid = false;
      validationMsg = `Percentage sum (${currentSum}%) must equal 100%.`;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onSaveExpense({
      id: initialData?.id || `exp-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      category,
      paidBy,
      splitMode,
      splits,
      date,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Edit Expense' : 'Add Shared Expense'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Title & Amount row */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Expense Description</label>
              <input
                type="text"
                placeholder="e.g. Dinner, Shinkansen Tickets, Rent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Amount ({currency})</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input pl-8 font-mono text-lg font-bold"
                  required
                />
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              </div>
            </div>
          </div>

          {/* Paid By & Category */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Paid By</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="form-select"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map(c => (
                  <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Notes */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Details, venue, location..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Split Mode Selector Tabs */}
          <div className="my-5">
            <label className="form-label mb-2 block">Split Mode</label>
            <div className="tabs">
              {[
                { key: 'equal', label: 'Equal (=)' },
                { key: 'exact', label: 'Exact ($)' },
                { key: 'percentage', label: 'Percent (%)' },
                { key: 'shares', label: 'Shares (Ratio)' }
              ].map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setSplitMode(t.key)}
                  className={`tab-btn ${splitMode === t.key ? 'active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabbed Member Share Calculator Inputs */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 mb-5">
            
            {splitMode === 'equal' && (
              <div>
                <p className="text-xs text-slate-400 mb-3">
                  Split equally among all selected members:
                </p>
                <div className="grid-2">
                  {members.map(m => {
                    const isChecked = splits[m.id] !== false;
                    return (
                      <label 
                        key={m.id} 
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isChecked ? 'bg-indigo-500/10 border-indigo-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="text-xs font-semibold">{m.name}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSplitChange(m.id, e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {splitMode === 'exact' && (
              <div>
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="text-slate-400">Specify exact dollar amount for each member:</span>
                  <span className={`font-bold ${Math.abs(currentSum - numAmount) < 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Sum: ${currentSum.toFixed(2)} / ${numAmount.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-slate-300 w-1/3">{m.name}</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={splits[m.id] !== undefined ? splits[m.id] : ''}
                        onChange={(e) => handleSplitChange(m.id, e.target.value)}
                        className="form-input text-right font-mono py-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitMode === 'percentage' && (
              <div>
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="text-slate-400">Specify percentage (%) per member:</span>
                  <span className={`font-bold ${Math.abs(currentSum - 100) < 0.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Total: {currentSum.toFixed(1)}% / 100%
                  </span>
                </div>
                <div className="space-y-2">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-slate-300 w-1/3">{m.name}</span>
                      <div className="flex items-center gap-1 w-1/2">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={splits[m.id] !== undefined ? splits[m.id] : ''}
                          onChange={(e) => handleSplitChange(m.id, e.target.value)}
                          className="form-input text-right font-mono py-1"
                        />
                        <span className="text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitMode === 'shares' && (
              <div>
                <p className="text-xs text-slate-400 mb-3">
                  Assign share weights (e.g., 2 shares vs 1 share):
                </p>
                <div className="space-y-2">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-slate-300 w-1/3">{m.name}</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        placeholder="1"
                        value={splits[m.id] !== undefined ? splits[m.id] : 1}
                        onChange={(e) => handleSplitChange(m.id, e.target.value)}
                        className="form-input text-right font-mono py-1 w-1/2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Validation Warning Alert */}
          {!isValid && validationMsg && (
            <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationMsg}</span>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`btn btn-primary text-xs px-5 ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Expense' : 'Save Expense'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
