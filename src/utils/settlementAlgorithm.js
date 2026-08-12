/**
 * Smart Settlement Minimizer Algorithm
 * Uses a Greedy Net-Balance approach to reduce $N(N-1)$ potential debt payments
 * down to at most $N-1$ minimum required transactions.
 */

export function calculateGroupBalances(members, expenses, settlements = []) {
  // Initialize balance sheet for each member
  const balances = {};
  members.forEach(member => {
    balances[member.id] = {
      member,
      paid: 0,
      owed: 0,
      net: 0
    };
  });

  // Direct pairwise debt matrix: debtsMatrix[debtorId][creditorId] = amount
  const debtsMatrix = {};
  members.forEach(m1 => {
    debtsMatrix[m1.id] = {};
    members.forEach(m2 => {
      debtsMatrix[m1.id][m2.id] = 0;
    });
  });

  // 1. Process Expenses
  expenses.forEach(exp => {
    const totalAmount = Number(exp.amount) || 0;
    if (totalAmount <= 0) return;

    // Determine who paid
    const payers = {};
    if (typeof exp.paidBy === 'string') {
      payers[exp.paidBy] = totalAmount;
    } else if (typeof exp.paidBy === 'object' && exp.paidBy !== null) {
      Object.assign(payers, exp.paidBy);
    }

    // Add paid amounts
    Object.entries(payers).forEach(([payerId, amount]) => {
      if (balances[payerId]) {
        balances[payerId].paid += Number(amount);
      }
    });

    // Calculate splits per member
    const splitAmounts = calculateExpenseSplits(exp, members);

    // Add owed amounts & populate pairwise matrix
    Object.entries(splitAmounts).forEach(([debtorId, shareAmount]) => {
      const shareNum = Number(shareAmount) || 0;
      if (balances[debtorId]) {
        balances[debtorId].owed += shareNum;
      }

      // Record direct pairwise obligation to payers proportionally
      Object.entries(payers).forEach(([payerId, paidAmt]) => {
        if (debtorId !== payerId && totalAmount > 0) {
          const ratio = Number(paidAmt) / totalAmount;
          const directOwed = shareNum * ratio;
          if (debtsMatrix[debtorId] && debtsMatrix[debtorId][payerId] !== undefined) {
            debtsMatrix[debtorId][payerId] += directOwed;
          }
        }
      });
    });
  });

  // 2. Process Settlements (Manual P2P repayments)
  settlements.forEach(s => {
    const amt = Number(s.amount) || 0;
    if (balances[s.fromMemberId]) {
      balances[s.fromMemberId].paid += amt;
    }
    if (balances[s.toMemberId]) {
      balances[s.toMemberId].owed += amt;
    }
    if (debtsMatrix[s.fromMemberId] && debtsMatrix[s.fromMemberId][s.toMemberId] !== undefined) {
      debtsMatrix[s.fromMemberId][s.toMemberId] -= amt;
    }
  });

  // 3. Compute Net Balances
  Object.keys(balances).forEach(id => {
    balances[id].net = Math.round((balances[id].paid - balances[id].owed) * 100) / 100;
    balances[id].paid = Math.round(balances[id].paid * 100) / 100;
    balances[id].owed = Math.round(balances[id].owed * 100) / 100;
  });

  // 4. Compute Raw (Unsimplified) Direct Transactions
  const unsimplifiedTransactions = [];
  const memberIds = members.map(m => m.id);
  
  // Net out pairwise mutual debts (A owes B $50, B owes A $20 -> A owes B $30)
  for (let i = 0; i < memberIds.length; i++) {
    for (let j = i + 1; j < memberIds.length; j++) {
      const m1 = memberIds[i];
      const m2 = memberIds[j];
      const d1 = debtsMatrix[m1][m2] || 0;
      const d2 = debtsMatrix[m2][m1] || 0;

      const netPair = Math.round((d1 - d2) * 100) / 100;
      if (netPair > 0.01) {
        unsimplifiedTransactions.push({
          id: `unsimplified-${m1}-${m2}`,
          fromMemberId: m1,
          toMemberId: m2,
          amount: netPair
        });
      } else if (netPair < -0.01) {
        unsimplifiedTransactions.push({
          id: `unsimplified-${m2}-${m1}`,
          fromMemberId: m2,
          toMemberId: m1,
          amount: Math.abs(netPair)
        });
      }
    }
  }

  // 5. Greedy Settlement Minimizer Algorithm
  const debtors = [];
  const creditors = [];

  Object.values(balances).forEach(b => {
    if (b.net < -0.01) {
      debtors.push({ id: b.member.id, net: b.net });
    } else if (b.net > 0.01) {
      creditors.push({ id: b.member.id, net: b.net });
    }
  });

  // Sort debtors (most negative first) and creditors (most positive first)
  debtors.sort((a, b) => a.net - b.net);
  creditors.sort((a, b) => b.net - a.net);

  const simplifiedTransactions = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const debtAmount = Math.abs(debtor.net);
    const creditAmount = creditor.net;

    const settlementAmount = Math.round(Math.min(debtAmount, creditAmount) * 100) / 100;

    if (settlementAmount > 0) {
      simplifiedTransactions.push({
        id: `settle-${debtor.id}-${creditor.id}-${simplifiedTransactions.length}`,
        fromMemberId: debtor.id,
        toMemberId: creditor.id,
        amount: settlementAmount
      });
    }

    // Adjust balances
    debtor.net += settlementAmount;
    creditor.net -= settlementAmount;

    debtor.net = Math.round(debtor.net * 100) / 100;
    creditor.net = Math.round(creditor.net * 100) / 100;

    if (Math.abs(debtor.net) < 0.01) {
      dIdx++;
    }
    if (Math.abs(creditor.net) < 0.01) {
      cIdx++;
    }
  }

  const unsimplifiedCount = unsimplifiedTransactions.length;
  const simplifiedCount = simplifiedTransactions.length;
  const savingsPercent = unsimplifiedCount > 0
    ? Math.max(0, Math.round(((unsimplifiedCount - simplifiedCount) / unsimplifiedCount) * 100))
    : 0;

  return {
    balances,
    simplifiedTransactions,
    unsimplifiedTransactions,
    unsimplifiedCount,
    simplifiedCount,
    savingsPercent
  };
}

/**
 * Calculates exact split amount per member based on split mode
 */
export function calculateExpenseSplits(expense, members) {
  const amount = Number(expense.amount) || 0;
  const splits = expense.splits || {};
  const splitMode = expense.splitMode || 'equal';
  const result = {};

  const activeMembers = members.filter(m => {
    if (splits[m.id] !== undefined && splits[m.id] !== false) return true;
    return splitMode === 'equal'; // default equal includes all
  });

  if (activeMembers.length === 0) return result;

  if (splitMode === 'equal') {
    const perPerson = Math.floor((amount / activeMembers.length) * 100) / 100;
    let remainder = Math.round((amount - perPerson * activeMembers.length) * 100) / 100;

    activeMembers.forEach((m, idx) => {
      let share = perPerson;
      if (idx === 0 && remainder > 0) {
        share = Math.round((share + remainder) * 100) / 100;
      }
      result[m.id] = share;
    });
  } else if (splitMode === 'exact') {
    members.forEach(m => {
      result[m.id] = Number(splits[m.id]) || 0;
    });
  } else if (splitMode === 'percentage') {
    members.forEach(m => {
      const pct = Number(splits[m.id]) || 0;
      result[m.id] = Math.round(((amount * pct) / 100) * 100) / 100;
    });
  } else if (splitMode === 'shares') {
    let totalShares = 0;
    members.forEach(m => {
      totalShares += Number(splits[m.id]) || 0;
    });
    if (totalShares > 0) {
      members.forEach(m => {
        const sh = Number(splits[m.id]) || 0;
        result[m.id] = Math.round(((amount * sh) / totalShares) * 100) / 100;
      });
    }
  }

  return result;
}

/**
 * Formats currency values
 */
export function formatCurrency(amount, currencyCode = 'USD') {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
    CAD: 'CA$',
    AUD: 'A$',
    LKR: 'Rs.'
  };

  const symbol = symbols[currencyCode] || '$';
  const val = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${amount < 0 ? '-' : ''}${symbol}${val}`;
}
