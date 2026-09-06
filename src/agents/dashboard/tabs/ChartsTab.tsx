// Tab 4 — Charts: line, bar, pie/donut, area and a heatmap.
import { Fragment } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardData } from "../select";
import { CHART_TITLES } from "../config";
import { useT } from "@/lib/content-store";

const AXIS = { stroke: "var(--muted-foreground)", fontSize: 11 } as const;
const PIE_COLORS = [
  "var(--primary)",
  "var(--signal)",
  "color-mix(in oklch, var(--primary) 55%, transparent)",
  "color-mix(in oklch, var(--signal) 55%, transparent)",
  "var(--muted-foreground)",
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card/70 p-5">
      <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em]">{title}</h3>
      <div className="mt-4 h-64">{children}</div>
    </section>
  );
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function ChartsTab({ charts }: { charts: DashboardData["charts"] }) {
  const t = useT();
  const { trend: TREND, regionBars: REGION_BARS, exceptionMix: EXCEPTION_MIX, heatmap: HEATMAP, hours: HOURS, days: DAYS } = charts;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title={t("dashboard.chart.trend", CHART_TITLES["trend"]!)}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" {...AXIS} />
            <YAxis domain={["auto", "auto"]} {...AXIS} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="onTime"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title={t("dashboard.chart.region", CHART_TITLES["region"]!)}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={REGION_BARS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="region" {...AXIS} />
            <YAxis domain={[80, 100]} {...AXIS} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="onTime" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title={t("dashboard.chart.mix", CHART_TITLES["mix"]!)}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={EXCEPTION_MIX}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {EXCEPTION_MIX.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title={t("dashboard.chart.cost", CHART_TITLES["cost"]!)}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" {...AXIS} />
            <YAxis domain={["auto", "auto"]} {...AXIS} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="var(--signal)"
              fill="color-mix(in oklch, var(--signal) 18%, transparent)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <section className="rounded-xl border border-border bg-card/70 p-5 lg:col-span-2">
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em]">
          {t("dashboard.chart.heatmap", CHART_TITLES["heatmap"]!)}
        </h3>
        <div className="mt-5 overflow-x-auto">
          <div className="inline-block min-w-full">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `4rem repeat(${HOURS.length}, minmax(2.5rem, 1fr))` }}
            >
              <div />
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="text-center font-mono text-[10px] text-muted-foreground"
                >
                  {h}:00
                </div>
              ))}
              {DAYS.map((d) => (
                <Fragment key={d}>
                  <div
                    className="flex items-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {d}
                  </div>
                  {HOURS.map((h) => {
                    const cell = HEATMAP.find((c) => c.day === d && c.hour === h)!;
                    return (
                      <div
                        key={`${d}-${h}`}
                        title={`${d} ${h}:00 — ${cell.value}`}
                        className="grid h-9 place-items-center rounded-sm font-mono text-[10px] text-foreground/80"
                        style={{
                          background: `color-mix(in oklch, var(--primary) ${Math.round(cell.value * 0.8 + 5)}%, transparent)`,
                        }}
                      >
                        {cell.value}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
