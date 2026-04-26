
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  name: string;
  id: string;
}

function Input({ className = '', type, name, id, autoComplete, placeholder, required, value, onChange, ...props }: InputProps) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      data-slot="input"
      className={`flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all outline-none placeholder:text-muted-foreground/70 focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/20 ${className}`}
      {...props}
    />
  )
}

export default Input;