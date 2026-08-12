import { formatCurrency } from './settlementAlgorithm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Download expense report as CSV
 */
export function exportToCSV(group, expenses, settlementData, currency) {
  const { balances, simplifiedTransactions } = settlementData;
  let csvContent = 'data:text/csv;charset=utf-8,';

  // 1. Group Header
  csvContent += `Group Name,${group.name}\n`;
  csvContent += `Currency,${currency}\n`;
  csvContent += `Export Date,${new Date().toLocaleDateString()}\n\n`;

  // 2. Member Balances Summary
  csvContent += `MEMBER BALANCES SUMMARY\n`;
  csvContent += `Member Name,Total Paid,Total Owed,Net Balance,Status\n`;

  group.members.forEach(m => {
    const b = balances[m.id] || { paid: 0, owed: 0, net: 0 };
    const status = b.net > 0 ? 'Gets back' : b.net < 0 ? 'Owes' : 'Settled';
    csvContent += `"${m.name}",${b.paid.toFixed(2)},${b.owed.toFixed(2)},${b.net.toFixed(2)},"${status}"\n`;
  });

  csvContent += `\n`;

  // 3. Recommended Minimal Settlement Plan
  csvContent += `OPTIMIZED SETTLEMENT PLAN (MINIMUM TRANSACTIONS)\n`;
  csvContent += `From (Debtor),To (Creditor),Amount to Pay\n`;

  simplifiedTransactions.forEach(t => {
    const fromMember = group.members.find(m => m.id === t.fromMemberId);
    const toMember = group.members.find(m => m.id === t.toMemberId);
    csvContent += `"${fromMember ? fromMember.name : t.fromMemberId}","${toMember ? toMember.name : t.toMemberId}",${t.amount.toFixed(2)}\n`;
  });

  csvContent += `\n`;

  // 4. Expenses Breakdown
  csvContent += `EXPENSE HISTORY\n`;
  csvContent += `Date,Title,Category,Paid By,Amount,Split Mode\n`;

  expenses.forEach(e => {
    let paidByName = 'Unknown';
    if (typeof e.paidBy === 'string') {
      const payer = group.members.find(m => m.id === e.paidBy);
      paidByName = payer ? payer.name : e.paidBy;
    } else if (typeof e.paidBy === 'object') {
      paidByName = Object.entries(e.paidBy)
        .map(([id, amt]) => {
          const m = group.members.find(mem => mem.id === id);
          return `${m ? m.name : id} (${amt})`;
        })
        .join('; ');
    }

    csvContent += `"${e.date}","${e.title.replace(/"/g, '""')}","${e.category}","${paidByName}",${Number(e.amount).toFixed(2)},"${e.splitMode}"\n`;
  });

  // Download Trigger
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${group.name.toLowerCase().replace(/\s+/g, '_')}_settlement_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate PDF Report of Group Ledger
 */
export async function exportToPDF(elementId, fileName = 'expense_settlement_report.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#0B0F19',
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export failed:', err);
    window.print();
  }
}
