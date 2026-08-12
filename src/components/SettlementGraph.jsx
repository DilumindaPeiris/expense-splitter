import React, { useState } from 'react';
import { Network, Sparkles, Layers } from 'lucide-react';
import { formatCurrency } from '../utils/settlementAlgorithm';

export default function SettlementGraph({ members, settlementData, currency }) {
  const { simplifiedTransactions, unsimplifiedTransactions, savingsPercent } = settlementData;
  const [showUnsimplified, setShowUnsimplified] = useState(false);
  const [activeNode, setActiveNode] = useState(null);

  const transactions = showUnsimplified ? unsimplifiedTransactions : simplifiedTransactions;

  // Position nodes in a circular layout
  const width = 640;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 130;

  const nodePositions = {};
  members.forEach((m, idx) => {
    const angle = (idx / members.length) * 2 * Math.PI - Math.PI / 2;
    nodePositions[m.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      member: m
    };
  });

  return (
    <div className="glass-card p-5 mb-6 border-indigo-500/20">
      
      {/* Graph Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            Interactive Settlement Graph Visualizer
          </h2>
          <p className="text-xs text-slate-400">
            Directed money flows representing minimum required transfers between members
          </p>
        </div>

        {/* Graph Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setShowUnsimplified(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              !showUnsimplified 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimized ({simplifiedTransactions.length})</span>
          </button>
          
          <button
            onClick={() => setShowUnsimplified(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showUnsimplified 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Direct Raw ({unsimplifiedTransactions.length})</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto bg-slate-950/70 rounded-2xl border border-slate-800/80 p-2 flex justify-center">
        
        {transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span>All group debts are completely settled! Zero transactions required. 🎉</span>
          </div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[640px] h-auto select-none">
            
            <defs>
              {/* Arrowhead marker definition */}
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="24"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#818CF8" />
              </marker>

              <marker
                id="arrowhead-highlight"
                markerWidth="10"
                markerHeight="7"
                refX="24"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#34D399" />
              </marker>

              {/* Glowing filters */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Directed Edges (Arrows) */}
            {transactions.map((t, idx) => {
              const fromNode = nodePositions[t.fromMemberId];
              const toNode = nodePositions[t.toMemberId];
              if (!fromNode || !toNode) return null;

              const isHighlighted = activeNode === t.fromMemberId || activeNode === t.toMemberId;

              // Calculate control point for slight curve if multiple lines
              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              // Offset for curve
              const dx = toNode.x - fromNode.x;
              const dy = toNode.y - fromNode.y;
              const norm = Math.sqrt(dx * dx + dy * dy) || 1;
              const curvature = (idx % 2 === 0 ? 1 : -1) * 15;
              const ctrlX = midX - (dy / norm) * curvature;
              const ctrlY = midY + (dx / norm) * curvature;

              const pathString = `M ${fromNode.x} ${fromNode.y} Q ${ctrlX} ${ctrlY} ${toNode.x} ${toNode.y}`;

              return (
                <g key={t.id || idx} className="transition-all duration-300">
                  
                  {/* Outer Glow path */}
                  <path
                    d={pathString}
                    fill="none"
                    stroke={isHighlighted ? '#10B981' : '#6366F1'}
                    strokeWidth={isHighlighted ? 3 : 2}
                    strokeOpacity={activeNode ? (isHighlighted ? 0.9 : 0.15) : 0.5}
                    markerEnd={isHighlighted ? "url(#arrowhead-highlight)" : "url(#arrowhead)"}
                    filter={isHighlighted ? "url(#glow)" : undefined}
                  />

                  {/* Transfer Amount Badge on Midpoint */}
                  <g transform={`translate(${ctrlX}, ${ctrlY})`}>
                    <rect
                      x="-38"
                      y="-11"
                      width="76"
                      height="22"
                      rx="11"
                      fill="#0F172A"
                      stroke={isHighlighted ? '#34D399' : '#6366F1'}
                      strokeWidth="1.5"
                      strokeOpacity={activeNode ? (isHighlighted ? 1 : 0.2) : 0.7}
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isHighlighted ? '#34D399' : '#E0E7FF'}
                      fontSize="10"
                      fontWeight="700"
                    >
                      {formatCurrency(t.amount, currency)}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Member Nodes */}
            {Object.entries(nodePositions).map(([id, pos]) => {
              const { member, x, y } = pos;
              const isSelected = activeNode === id;
              const netBalance = settlementData.balances[id]?.net || 0;

              return (
                <g 
                  key={id} 
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={() => setActiveNode(activeNode === id ? null : id)}
                >
                  {/* Halo glow */}
                  <circle
                    r="24"
                    fill={member.color || '#6366F1'}
                    fillOpacity={isSelected ? 0.4 : 0.15}
                    stroke={isSelected ? '#34D399' : (member.color || '#6366F1')}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all duration-300"
                  />

                  {/* Avatar circle */}
                  <circle
                    r="18"
                    fill="#1E293B"
                    stroke="#0F172A"
                    strokeWidth="2"
                  />

                  {/* Avatar Emoji / Icon */}
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fontSize="16"
                  >
                    {member.avatar || member.name[0]}
                  </text>

                  {/* Member Name Label */}
                  <text
                    x="0"
                    y="36"
                    textAnchor="middle"
                    fill="#F3F4F6"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {member.name}
                  </text>

                  {/* Net Balance Subtext */}
                  <text
                    x="0"
                    y="48"
                    textAnchor="middle"
                    fill={netBalance > 0 ? '#34D399' : netBalance < 0 ? '#FB7185' : '#9CA3AF'}
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    {netBalance > 0 ? `+${formatCurrency(netBalance, currency)}` : formatCurrency(netBalance, currency)}
                  </text>
                </g>
              );
            })}

          </svg>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 px-1">
        <span>Tip: Click any member node to highlight their payment routes.</span>
        {!showUnsimplified && (
          <span className="text-emerald-400 font-semibold">
            ✨ {savingsPercent}% transaction efficiency reduction applied
          </span>
        )}
      </div>

    </div>
  );
}
