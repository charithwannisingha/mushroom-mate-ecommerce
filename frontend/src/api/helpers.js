// ============================================================
// උපකාරක ශ්‍රිත (helper functions)
// ============================================================

// රුපියල් ආකෘතියට හැරවීම (format LKR currency)
export const lkr = (n) =>
  'Rs. ' + Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// දිනය ආකෘතිගත කිරීම (format date)
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

// නිෂ්පාදන කාණ්ඩ (product categories)
export const CATEGORIES = ['All', 'Oyster', 'Button', 'Shiitake', 'Spawn', 'Equipment']

// ඇණවුම් තත්ත්ව වර්ණ (order status colors)
export const STATUS_STYLES = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
}
