# 🚀 Smart Expense Splitter & Settlement Minimizer

> A modern, high-performance web application designed to track shared group expenses, split costs flexibly, and calculate the minimum number of transactions required to settle all debts using a greedy graph simplification algorithm.

![SplitSmart Preview](https://img.shields.io/badge/Status-Active-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React_%7C_Vite_%7C_Custom_CSS-indigo?style=for-the-badge)

---

## ✨ Key Features

- 🧮 **Greedy Debt Simplification Engine**: Reduces $N(N-1)$ potential pairwise debt payments down to at most $N-1$ minimum payments (achieving up to **60%+ reduction in total payments**).
- 🕸️ **Interactive Node-Link Graph Visualizer**: Visual directed graph rendering group members as circular nodes connected by animated money flow arrows with transfer amounts.
- ⚖️ **Flexible Split Modes**:
  - **Equal (=)**: Equal distribution with penny remainder balancing.
  - **Exact Amounts ($)**: Itemized per-member amounts with live sum validation.
  - **Percentage (%)**: Percentage per member totaling 100%.
  - **Shares (Ratio)**: Weighted share unit allocation.
- 📊 **Visual Ledgers & Analytics**: Member balance cards, category spending donut charts, and member contribution progress bars.
- 📄 **Export & Summary Reports**: One-click CSV downloads for expense logs & settlement plans, plus print-ready PDF export.
- 📁 **Multiple Groups & Demo Presets**: Switch between multiple groups with local storage persistence and pre-loaded trip & roommate demo datasets.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Modern Glassmorphism CSS Design System (Custom CSS Variables, animations, fluid layouts)
- **Icons**: Lucide React
- **Exports**: `jspdf`, `html2canvas`, CSV Generator
- **Celebration**: `canvas-confetti`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/smart-expense-splitter.git
   cd smart-expense-splitter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📜 How the Settlement Minimizer Works

1. **Net Balance Calculation**:
   For each member $i$, net balance is computed:
   $$\text{Net}_i = \text{Total Paid}_i - \text{Total Owed}_i$$
2. **Greedy Transaction Reduction**:
   - Members are split into **Debtors** ($\text{Net} < 0$) and **Creditors** ($\text{Net} > 0$).
   - Debtors are sorted by max debt, and Creditors by max credit.
   - Greedily settle $\min(\text{debt}, \text{credit})$ iteratively until all balances drop to $0$.

---

## 📄 License

MIT License.
