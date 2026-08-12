import React from 'react';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, User } from 'lucide-react';
import { formatCurrency } from '../utils/settlementAlgorithm';

export default function MemberLedger({ members, balances, currency, onSelectMember }) {
  const maxPaid = Math.max(...Object.values(balances).map(b => b.paid), 1);

  return (
    <div className="glass-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            Group Member Ledger
          </h2>
          <p className="text-xs text-slate-400">
            Individual member contributions, owed shares, and net balance standing
          </p>
        </div>
        <span className="badge badge-indigo text-xs">{members.length} Members</span>
      </div>

      <div className="grid-3">
        {members.map(member => {
          const b = balances[member.id] || { paid: 0, owed: 0, net: 0 };
          const isCreditor = b.net > 0.01;
          const isDebtor = b.net < -0.01;

          return (
            <div 
              key={member.id}
              onClick={() => onSelectMember && onSelectMember(member.id)}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
            >
              {/* Member Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-md"
                    style={{ backgroundColor: `${member.color || '#6366F1'}25`, border: `2px solid ${member.color || '#6366F1'}` }}
                  >
                    {member.avatar || member.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {member.name}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Paid: {formatCurrency(b.paid, currency)}
                    </span>
                  </div>
                </div>

                {/* Net Badge */}
                <div>
                  {isCreditor && (
                    <span className="badge badge-emerald text-xs flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      +{formatCurrency(b.net, currency)}
                    </span>
                  )}
                  {isDebtor && (
                    <span className="badge badge-rose text-xs flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      {formatCurrency(b.net, currency)}
                    </span>
                  )}
                  {!isCreditor && !isDebtor && (
                    <span className="badge badge-indigo text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Settled
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar of Payment Share */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, Math.max(8, (b.paid / maxPaid) * 100))}%`,
                    backgroundColor: member.color || '#6366F1'
                  }}
                />
              </div>

              {/* Share details */}
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mt-1">
                <span>Owed Share: <strong className="text-slate-300 font-semibold">{formatCurrency(b.owed, currency)}</strong></span>
                <span className="font-semibold text-slate-300 shrink-0">
                  {isCreditor ? 'Gets back' : isDebtor ? 'Needs to pay' : 'All good'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
