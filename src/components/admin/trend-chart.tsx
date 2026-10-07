"use client";

import { useState } from "react";

/** Single-series daily bar chart: one hue, recessive axis, per-bar hover/focus tooltip, table fallback. */
export function TrendChart({ data, label = "WhatsApp clicks" }: { data: { date: string; count: number }[]; label?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  if (!data.length) return <p className="py-10 text-center text-sm text-muted-foreground">No data in this range.</p>;

  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const tickEvery = Math.max(1, Math.ceil(data.length / 6));

  return (
    <figure>
      <figcaption className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">
          {label}: <span className="font-medium text-foreground tabular-nums">{total.toLocaleString("en-IN")}</span> total · peak {max}
        </span>
        <button type="button" onClick={() => setShowTable((s) => !s)} className="text-xs font-medium text-primary hover:underline">
          {showTable ? "Show chart" : "Show table"}
        </button>
      </figcaption>

      {showTable ? (
        <div className="max-h-72 overflow-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 text-right font-medium">{label}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-t border-border">
                  <td className="px-3 py-1.5">{fmt(d.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <div className="flex h-48 items-end gap-[2px] border-b border-border" role="list" aria-label={`${label} per day`}>
            {data.map((d, i) => (
              <div
                key={d.date}
                role="listitem"
                tabIndex={0}
                aria-label={`${fmt(d.date)}: ${d.count}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group relative flex h-full flex-1 items-end outline-none"
              >
                <div
                  className="w-full rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-80 group-focus-visible:ring-2 group-focus-visible:ring-ring"
                  style={{ height: d.count ? `${Math.max(3, (d.count / max) * 100)}%` : "0%" }}
                />
              </div>
            ))}
          </div>
          {active !== null && data[active] && (
            <div
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
              style={{ left: `${((active + 0.5) / data.length) * 100}%` }}
            >
              <span className="text-muted-foreground">{fmt(data[active].date)}</span>{" "}
              <span className="font-semibold tabular-nums">{data[active].count}</span>
            </div>
          )}
          <div className="mt-1.5 flex text-[0.7rem] text-muted-foreground" aria-hidden>
            {data.map((d, i) => (
              <span key={d.date} className="flex-1 text-center">
                {i % tickEvery === 0 ? fmt(d.date) : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </figure>
  );
}
