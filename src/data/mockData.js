export const INITIAL_GROUPS = [
  {
    id: 'grp-tokyo-2026',
    name: 'Tokyo Summer Trip 2026 🗼',
    currency: 'USD',
    createdAt: '2026-07-15',
    members: [
      { id: 'mem-1', name: 'Alice Chen', avatar: '👩🏻‍💻', color: '#6366F1' },
      { id: 'mem-2', name: 'Bob Smith', avatar: '👨🏼‍🌾', color: '#10B981' },
      { id: 'mem-3', name: 'Charlie Kim', avatar: '👨🏻‍🎨', color: '#F59E0B' },
      { id: 'mem-4', name: 'Diana Prince', avatar: '👩🏽‍🚀', color: '#EC4899' },
      { id: 'mem-5', name: 'Evan Wright', avatar: '👨🏼‍💻', color: '#8B5CF6' }
    ],
    expenses: [
      {
        id: 'exp-1',
        title: 'Shinjuku Luxury Airbnb 🏠',
        category: 'Stay',
        amount: 1250.00,
        paidBy: 'mem-1', // Alice paid $1250
        splitMode: 'equal',
        date: '2026-08-01',
        notes: '4 Nights stay for all 5 members'
      },
      {
        id: 'exp-2',
        title: 'Shinkansen Bullet Train to Kyoto 🚅',
        category: 'Transport',
        amount: 680.00,
        paidBy: 'mem-2', // Bob paid $680
        splitMode: 'equal',
        date: '2026-08-03',
        notes: 'Reserved seats Tokyo to Kyoto round-trip'
      },
      {
        id: 'exp-3',
        title: 'Omakase Sushi Dinner 🍣',
        category: 'Food',
        amount: 450.00,
        paidBy: 'mem-3', // Charlie paid $450
        splitMode: 'percentage',
        splits: {
          'mem-1': 25,
          'mem-2': 25,
          'mem-3': 20,
          'mem-4': 15,
          'mem-5': 15
        },
        date: '2026-08-04',
        notes: 'Ginza Michelin star dining'
      },
      {
        id: 'exp-4',
        title: 'TeamLab Planets Tickets 🎨',
        category: 'Entertainment',
        amount: 160.00,
        paidBy: 'mem-4', // Diana paid $160
        splitMode: 'exact',
        splits: {
          'mem-1': 32.00,
          'mem-2': 32.00,
          'mem-3': 32.00,
          'mem-4': 32.00,
          'mem-5': 32.00
        },
        date: '2026-08-05'
      },
      {
        id: 'exp-5',
        title: 'Universal Studios Japan Passes 🎟️',
        category: 'Entertainment',
        amount: 380.00,
        paidBy: 'mem-5', // Evan paid $380
        splitMode: 'shares',
        splits: {
          'mem-1': 1,
          'mem-2': 1,
          'mem-3': 1,
          'mem-4': 1,
          'mem-5': 1
        },
        date: '2026-08-06'
      },
      {
        id: 'exp-6',
        title: 'Pocket Wi-Fi & eSIMs 📶',
        category: 'Utilities',
        amount: 90.00,
        paidBy: 'mem-1', // Alice paid $90
        splitMode: 'equal',
        date: '2026-08-02'
      }
    ],
    settlements: [
      {
        id: 'set-1',
        fromMemberId: 'mem-3',
        toMemberId: 'mem-1',
        amount: 100.00,
        date: '2026-08-07',
        notes: 'Partial settlement from Charlie to Alice'
      }
    ]
  },
  {
    id: 'grp-flat-4b',
    name: 'Apartment Roommates Flat 4B 🏠',
    currency: 'USD',
    createdAt: '2026-06-01',
    members: [
      { id: 'flat-1', name: 'Alex Johnson', avatar: '👨🏼', color: '#3B82F6' },
      { id: 'flat-2', name: 'Sarah Connor', avatar: '👩🏼', color: '#10B981' },
      { id: 'flat-3', name: 'Marcus Vance', avatar: '👨🏽', color: '#F59E0B' }
    ],
    expenses: [
      {
        id: 'flat-exp-1',
        title: 'Monthly Electric & Gas Bill ⚡',
        category: 'Utilities',
        amount: 240.00,
        paidBy: 'flat-1',
        splitMode: 'equal',
        date: '2026-08-01'
      },
      {
        id: 'flat-exp-2',
        title: 'High-Speed Fiber Internet 🌐',
        category: 'Utilities',
        amount: 90.00,
        paidBy: 'flat-2',
        splitMode: 'equal',
        date: '2026-08-02'
      },
      {
        id: 'flat-exp-3',
        title: 'Groceries & Bulk Cleaning Supplies 🛒',
        category: 'Food',
        amount: 180.00,
        paidBy: 'flat-3',
        splitMode: 'equal',
        date: '2026-08-05'
      }
    ],
    settlements: []
  }
];

export const CATEGORIES = [
  { name: 'Food', icon: 'Utensils', color: '#10B981' },
  { name: 'Stay', icon: 'Home', color: '#6366F1' },
  { name: 'Transport', icon: 'Car', color: '#06B6D4' },
  { name: 'Entertainment', icon: 'Film', color: '#EC4899' },
  { name: 'Utilities', icon: 'Zap', color: '#F59E0B' },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#8B5CF6' },
  { name: 'Others', icon: 'Grid', color: '#9CA3AF' }
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'LKR'];
