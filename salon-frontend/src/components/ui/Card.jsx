export function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`
        bg-white dark:bg-zinc-900
        border border-zinc-100 dark:border-zinc-800
        rounded-2xl shadow-sm
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}
