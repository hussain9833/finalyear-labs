import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

/** Styled native <select>: accessible, mobile-friendly picker, works without JS in GET forms. */
export function NativeSelect({
  name,
  label,
  options,
  placeholder,
  defaultValue,
  required,
  hideLabel = false,
  error,
  className,
  id,
}: {
  name: string;
  label: string;
  options: readonly Option[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  hideLabel?: boolean;
  error?: string;
  className?: string;
  id?: string;
}) {
  const selectId = id ?? `sel-${name}`;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={selectId} className={cn("text-sm font-medium", hideLabel && "sr-only")}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className="h-12 w-full appearance-none rounded-xl border border-input bg-background pr-10 pl-3.5 text-base outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive md:text-sm"
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
