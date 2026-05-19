export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-700 focus:ring-primary shadow-md hover:shadow-lg dark:bg-primary dark:hover:bg-primary-700',
    secondary:
      'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
    outline:
      'border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-300 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-md',
    ghost:
      'bg-transparent text-zinc-600 hover:bg-zinc-100 focus:ring-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800',
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-5 text-sm gap-2',
    lg: 'h-12 px-7 text-base gap-2',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
