import React from 'react';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../utils/settlementAlgorithm';
import { CATEGORIES } from '../data/mockData';

export default function AnalyticsCharts({ group, settlementData, currency }) {
  const expenses = group.expenses || [];
  const members = group.members || [];
  const { balances } = settlementData;

  // 1. Group expenses by Category
  const categoryTotals = {};
  let totalSpend = 0;

  expenses.forEach(e => {
    const amt = Number(e.amount) || 0;
    totalSpend += amt;
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + amt;
  });

  // Calculate angles for donut chart
  let cumulativeAngle = 0;
  const donutSlices = Object.entries(categoryTotals).map(([catName, amt]) => {
    const catObj = CATEGORIES.find(c => c.name === catName) || { color: '#9CA3AF' };
    const percentage = totalSpend > 0 ? (amt / totalSpend) * 100 : 0;
    const angle = totalSpend > 0 ? (amt / totalSpend) * 360 : 0;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    return {
      catName,
      amt,
      percentage,
      color: catObj.color,
      startAngle,
      angle
    };
  });

  // Helper to describe SVG arc path
  const getArcPath = (cx, cy, r, startAngle, endAngle) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="grid-2 mb-6">
      
      {/* Category Spending Donut Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-400" />
            Spending by Category
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            {formatCurrency(totalSpend, currency)} Total
          </span>
        </div>

        {totalSpend === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">No expenses recorded yet.</div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6">
            
            {/* SVG Donut */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {donutSlices.map((slice, idx) => (
                  <path
                    key={slice.catName || idx}
                    d={getArcPath(50, 50, 42, slice.startAngle, slice.startAngle + slice.angle)}
                    fill={slice.color}
                    className="hover:opacity-85 transition-opacity cursor-pointer"
                  />
                ))}
                {/* Inner cutout for Donut */}
                <circle cx="50" cy="50" r="26" fill="#0D1424" />
              </svg>
              <div className="absolute text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Total</div>
                <div className="text-xs font-black text-white">{formatCurrency(totalSpend, currency)}</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2 min-w-[160px]">
              {donutSlices.map(slice => (
                <div key={slice.catName} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
                    <span className="text-slate-300 font-medium">{slice.catName}</span>
                  </div>
                  <div className="text-right font-semibold text-white">
                    {slice.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* Member Contribution Breakdown */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Member Spending Share
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Comparison</span>
        </div>

        {totalSpend === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">No data available.</div>
        ) : (
          <div className="space-y-3">
            {members.map(m => {
              const b = balances[m.id] || { paid: 0, owed: 0 };
              const paidPct = totalSpend > 0 ? (b.paid / totalSpend) * 100 : 0;
              const owedPct = totalSpend > 0 ? (b.owed / totalSpend) * 100 : 0;

              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{m.name}</span>
                    <span className="text-slate-400">
                      Paid <strong className="text-emerald-400">{formatCurrency(b.paid, currency)}</strong> | Share <strong className="text-indigo-400">{formatCurrency(b.owed, currency)}</strong>
                    </span>
                  </div>

                  {/* Dual Bar: Green for Paid, Indigo for Owed Share */}
                  <div className="flex h-2 bg-slate-900 rounded-full overflow-hidden gap-0.5">
                    <div 
                      className="h-full bg-emerald-500 rounded-l-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, paidPct)}%` }} 
                      title={`Paid ${paidPct.toFixed(1)}%`}
                    />
                    <div 
                      className="h-full bg-indigo-500 rounded-r-full transition-all duration-500 opacity-60" 
                      style={{ width: `${Math.min(100, owedPct)}%` }} 
                      title={`Share ${owedPct.toFixed(1)}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
