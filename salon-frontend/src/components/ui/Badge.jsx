const statusColors = {
  pending:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
}

export default function Badge({ status, label }) {
  const color = statusColors[status?.toLowerCase()] || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  )
}
