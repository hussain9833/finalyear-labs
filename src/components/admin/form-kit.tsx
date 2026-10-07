"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small controlled-form primitives for the admin CMS. */

export const inputCls =
  "w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive";

export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </header>
      <div className="grid gap-4 p-5">{children}</div>
    </section>
  );
}

type FieldProps = { label: string; error?: string; hint?: React.ReactNode; className?: string; id: string; counter?: { value: number; max: number; ideal?: number } };

function FieldShell({ label, error, hint, className, id, counter, children }: FieldProps & { children: React.ReactNode }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {counter && (
          <span className={cn("text-xs tabular-nums", counter.value > counter.max ? "text-destructive" : counter.ideal && counter.value > counter.ideal ? "text-warning" : "text-muted-foreground")}>
            {counter.value}/{counter.ideal ?? counter.max}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p id={`${id}-err`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function Text({
  label,
  value,
  onChange,
  error,
  hint,
  className,
  id,
  type = "text",
  placeholder,
  maxLength,
  idealLength,
}: Omit<FieldProps, "counter"> & {
  value: string | number | undefined;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  idealLength?: number;
}) {
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      className={className}
      id={id}
      counter={maxLength && type === "text" ? { value: String(value ?? "").length, max: maxLength, ideal: idealLength } : undefined}
    >
      <input
        id={id}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputCls, "h-11")}
      />
    </FieldShell>
  );
}

export function Area({
  label,
  value,
  onChange,
  error,
  hint,
  className,
  id,
  rows = 4,
  placeholder,
  maxLength,
  idealLength,
}: Omit<FieldProps, "counter"> & { value: string | undefined; onChange: (v: string) => void; rows?: number; placeholder?: string; maxLength?: number; idealLength?: number }) {
  return (
    <FieldShell label={label} error={error} hint={hint} className={className} id={id} counter={maxLength ? { value: (value ?? "").length, max: maxLength, ideal: idealLength } : undefined}>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={cn(inputCls, "py-2.5")}
      />
    </FieldShell>
  );
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  id,
  error,
  className,
  placeholder,
}: Omit<FieldProps, "counter" | "hint"> & { value: T | ""; onChange: (v: T) => void; options: readonly { value: T; label: string }[]; placeholder?: string }) {
  return (
    <FieldShell label={label} error={error} className={className} id={id}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={cn(inputCls, "h-11")} aria-invalid={error ? true : undefined}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function Toggle({ label, checked, onChange, hint, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string; disabled?: boolean }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3", disabled && "cursor-not-allowed opacity-60")}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-4 accent-[var(--primary)]" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

/** One item per line ⇄ string[]. */
export function Lines({ label, value, onChange, id, hint, rows = 4, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; id: string; hint?: string; rows?: number; placeholder?: string }) {
  return (
    <Area
      id={id}
      label={label}
      rows={rows}
      hint={hint ?? "One per line"}
      placeholder={placeholder}
      value={value.join("\n")}
      onChange={(v) => onChange(v.split("\n").map((s) => s.trimStart()))}
    />
  );
}

/** Comma-separated ⇄ string[]. */
export function Tags({ label, value, onChange, id, hint, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; id: string; hint?: string; placeholder?: string }) {
  return (
    <Text
      id={id}
      label={label}
      hint={hint ?? "Comma-separated"}
      placeholder={placeholder}
      value={value.join(", ")}
      onChange={(v) => onChange(v.split(",").map((s) => s.trimStart()))}
    />
  );
}

export function CheckboxGroup({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <label key={o.value} className={cn("inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm", on ? "border-primary bg-primary/10" : "border-border")}>
              <input type="checkbox" className="size-3.5 accent-[var(--primary)]" checked={on} onChange={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])} />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Repeating list of objects with add / remove / reorder. */
export function Repeater<T>({
  label,
  items,
  onChange,
  create,
  render,
  addLabel = "Add item",
  max = 50,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  max?: number;
}) {
  const move = (i: number, d: number) => {
    const next = [...items];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x!);
    onChange(next);
  };
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-1 text-sm font-medium">
        {label} <span className="font-normal text-muted-foreground">({items.length})</span>
      </legend>
      {items.map((item, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1">
              <IconBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp className="size-3.5" />
              </IconBtn>
              <IconBtn label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown className="size-3.5" />
              </IconBtn>
              <IconBtn label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                <Trash2 className="size-3.5 text-destructive" />
              </IconBtn>
            </div>
          </div>
          {render(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))), i)}
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, create()])} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-dashed border-border px-4 text-sm font-medium hover:bg-muted">
          <Plus className="size-4" aria-hidden /> {addLabel}
        </button>
      )}
    </fieldset>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="grid size-8 place-items-center rounded-lg hover:bg-background disabled:opacity-30">
      {children}
    </button>
  );
}
