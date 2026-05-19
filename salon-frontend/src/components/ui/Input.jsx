export default function Input({
  label,
  error,
  id,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full h-11 px-4 rounded-xl border text-sm transition-colors
          bg-white dark:bg-zinc-800
          border-zinc-200 dark:border-zinc-700
          text-zinc-900 dark:text-zinc-100
          placeholder:text-zinc-400 dark:placeholder:text-zinc-500
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
          ${error ? 'border-red-400 focus:ring-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
