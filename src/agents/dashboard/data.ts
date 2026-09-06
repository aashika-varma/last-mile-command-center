// Dashboard-00 — this agent's OWN sample data. Deterministic (no Math.random),
// so server and client render identically. Swap any of these for real queries.

/** Tiny deterministic PRNG so numbers are stable across renders/SSR. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// TAB 1 — Business report
// ---------------------------------------------------------------------------
export const REPORT = {
  headline: "Delivery performance improved week over week, led by the Midwest.",
  period: "Week 36 · Aug 31 – Sep 6, 2026",
  summary:
    "On-time delivery rose to 94.8% (+1.2 pts) on 12.4M completed orders. Cost per drop fell 3.4% as densification lifted stops-per-hour to 3.42. Southeast remains the drag: a storm corridor pushed exceptions up 11% mid-week before recovery on Friday.",
  kpis: [
    { label: "On-time delivery", value: "94.8%", delta: 1.2, unit: "pts" },
    { label: "Cost per drop", value: "$5.84", delta: -3.4, unit: "%", goodWhenDown: true },
    { label: "Orders delivered", value: "12.4M", delta: 2.8, unit: "%" },
    { label: "Stops per hour", value: "3.42", delta: 4.1, unit: "%" },
    { label: "Exception rate", value: "1.9%", delta: -0.4, unit: "pts", goodWhenDown: true },
    { label: "NPS (delivery)", value: "68", delta: 2, unit: "pts" },
  ],
  sections: [
    {
      title: "What went well",
      bullets: [
        "Midwest on-time hit 96.4%, its best week of the year, after route densification rolled out to 214 stores.",
        "Cost per drop dropped below $6.00 in all regions for the first time this quarter.",
        "Driver utilisation improved to 81.3% with no increase in overtime hours.",
      ],
    },
    {
      title: "What needs attention",
      bullets: [
        "Southeast exceptions spiked to 3.1% Wed–Thu; weather padding was applied 40 minutes late.",
        "Same-day slot fill in the Southwest fell to 88.2% (-2.6 pts) on capacity shortfalls in Phoenix.",
        "Returns pickup completion continues to trail target at 91.5% vs 95% goal.",
      ],
    },
    {
      title: "Next week's focus",
      bullets: [
        "Auto-trigger weather padding from the storm feed rather than the manual dispatcher review.",
        "Add 60 flex slots per day in Phoenix and Tucson through the weekend.",
        "Ship the returns-pickup reminder experiment to 10% of markets.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// TAB 2 — 120+ metrics, grouped by attribute, compared to last week
// ---------------------------------------------------------------------------
export interface MetricRow {
  id: string;
  name: string;
  group: string;
  current: number;
  previous: number;
  unit: string;
  goodWhenDown: boolean;
}

const METRIC_GROUPS: { group: string; unit: string; goodWhenDown: boolean; names: string[] }[] = [
  {
    group: "Delivery Speed",
    unit: "%",
    goodWhenDown: false,
    names: [
      "On-time delivery", "Early delivery rate", "Late delivery rate", "Same-day on-time",
      "Next-day on-time", "Express on-time", "Scheduled slot adherence", "First-attempt success",
      "Promise kept rate", "Sub-2h delivery share", "Sub-1h delivery share", "Delivery window hit",
      "Late >30m share", "Late >60m share", "Dispatch-to-door time index",
    ],
  },
  {
    group: "Cost Efficiency",
    unit: "$",
    goodWhenDown: true,
    names: [
      "Cost per drop", "Cost per order", "Cost per mile", "Labor cost per stop", "Fuel cost per route",
      "Overtime cost per driver", "Third-party spend per order", "Reattempt cost", "Idle cost per hour",
      "Failed delivery cost", "Surge premium per order", "Fixed cost per route", "Variable cost per stop",
      "Packaging cost per order", "Return handling cost",
    ],
  },
  {
    group: "Route Optimization",
    unit: "",
    goodWhenDown: false,
    names: [
      "Stops per hour", "Stops per route", "Route density index", "Miles per stop", "Deadhead miles",
      "Route compliance", "Sequence adherence", "Batching efficiency", "Load factor",
      "Vehicle fill rate", "Zone overlap index", "Reroute frequency", "Optimizer acceptance rate",
      "Plan vs actual variance", "Cluster tightness",
    ],
  },
  {
    group: "Driver Operations",
    unit: "%",
    goodWhenDown: false,
    names: [
      "Driver utilisation", "Active driver count", "Shift fill rate", "No-show rate", "Attrition rate",
      "Average dwell time", "Break compliance", "Safety event rate", "Training completion",
      "Driver satisfaction", "Overtime hours share", "Onboarding time", "Tenure >6 months share",
      "App engagement", "Route acceptance rate",
    ],
  },
  {
    group: "Customer Experience",
    unit: "%",
    goodWhenDown: false,
    names: [
      "Delivery NPS", "CSAT", "Complaint rate", "Contact rate per 1K orders", "Refund rate",
      "Damage claim rate", "Missing item rate", "Substitution acceptance", "Tip rate",
      "Repeat order rate", "App rating", "Notification open rate", "Live-tracking usage",
      "Rating <3 share", "Resolution time index",
    ],
  },
  {
    group: "Capacity & Demand",
    unit: "%",
    goodWhenDown: false,
    names: [
      "Slot fill rate", "Capacity utilisation", "Demand forecast accuracy", "Peak coverage",
      "Order volume", "Basket size", "Cancelled order rate", "Backlog at cutoff", "Wave completion",
      "Pick-to-dispatch time", "Store readiness", "DC throughput", "Flex slot uptake",
      "Weekend capacity", "Holiday surge readiness",
    ],
  },
  {
    group: "Exceptions & Quality",
    unit: "%",
    goodWhenDown: true,
    names: [
      "Exception rate", "Reattempt rate", "Undeliverable rate", "Address error rate",
      "Wrong item rate", "Temperature excursion rate", "Perishables spoilage", "Order edit rate",
      "Photo-proof compliance", "Signature capture rate", "Geofence mismatch", "Fraud flag rate",
      "Escalation rate", "SLA breach count", "Returns pickup completion",
    ],
  },
  {
    group: "Sustainability & Fleet",
    unit: "",
    goodWhenDown: true,
    names: [
      "CO2 per delivery", "EV share of routes", "Miles per gallon", "Fleet uptime",
      "Maintenance events", "Charging downtime", "Idling minutes per route", "Empty-mile share",
      "Packaging waste per order", "Recycled packaging share", "Battery health index",
      "Telematics compliance", "Vehicle age index", "Breakdown rate", "Green-route adoption",
    ],
  },
];

export const METRICS: MetricRow[] = (() => {
  const rand = rng(20260905);
  const rows: MetricRow[] = [];
  METRIC_GROUPS.forEach((g, gi) => {
    g.names.forEach((name, i) => {
      const base = 20 + rand() * 80;
      const change = (rand() - 0.45) * 0.14;
      const current = Number((base * (1 + change)).toFixed(2));
      rows.push({
        id: `${gi}-${i}`,
        name,
        group: g.group,
        current,
        previous: Number(base.toFixed(2)),
        unit: g.unit,
        goodWhenDown: g.goodWhenDown,
      });
    });
  });
  return rows;
})();

export const METRIC_GROUP_NAMES = METRIC_GROUPS.map((g) => g.group);

// ---------------------------------------------------------------------------
// TAB 3 — Root cause analysis
// ---------------------------------------------------------------------------
export interface RcaItem {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  region: string;
  impact: string;
  metric: string;
  confidence: number;
  drivers: { label: string; contribution: number }[];
  narrative: string;
  action: string;
}

export const RCA: RcaItem[] = [
  {
    id: "rca-1",
    title: "Southeast exception spike Wed–Thu",
    severity: "Critical",
    region: "Southeast",
    impact: "-1.8 pts on-time · $412K cost",
    metric: "Exception rate",
    confidence: 0.91,
    drivers: [
      { label: "Storm corridor (unpadded ETAs)", contribution: 46 },
      { label: "Late dispatcher override", contribution: 24 },
      { label: "Driver no-shows", contribution: 18 },
      { label: "Address quality", contribution: 12 },
    ],
    narrative:
      "A convective storm line crossed Atlanta–Charlotte at 14:10. Weather padding required a manual dispatcher review that landed 40 minutes after the first delayed wave, so 11.4K stops kept their original promise windows and breached.",
    action: "Automate padding from the storm feed with a dispatcher opt-out instead of opt-in.",
  },
  {
    id: "rca-2",
    title: "Southwest same-day slot fill decline",
    severity: "High",
    region: "Southwest",
    impact: "-2.6 pts slot fill",
    metric: "Slot fill rate",
    confidence: 0.84,
    drivers: [
      { label: "Phoenix driver supply shortfall", contribution: 52 },
      { label: "Heat-advisory shift caps", contribution: 27 },
      { label: "Demand over-forecast", contribution: 21 },
    ],
    narrative:
      "Phoenix and Tucson lost 310 driver-hours per day to heat-advisory caps while forecast demand rose 6%. Capacity planning did not re-run after the advisory was issued.",
    action: "Add 60 flex slots/day and re-run capacity planning on advisory events.",
  },
  {
    id: "rca-3",
    title: "Returns pickup completion below target",
    severity: "Medium",
    region: "All regions",
    impact: "-3.5 pts vs goal",
    metric: "Returns pickup completion",
    confidence: 0.72,
    drivers: [
      { label: "Customer not ready at pickup", contribution: 44 },
      { label: "No reminder notification", contribution: 33 },
      { label: "Route sequencing conflicts", contribution: 23 },
    ],
    narrative:
      "Returns pickups are appended to the end of delivery routes with no advance reminder, so 8.5% of stops find the customer unprepared and the driver moves on.",
    action: "Ship the 2-hour reminder experiment to 10% of markets and measure lift.",
  },
  {
    id: "rca-4",
    title: "Midwest cost improvement (positive driver)",
    severity: "Low",
    region: "Midwest",
    impact: "-$0.31 cost per drop",
    metric: "Cost per drop",
    confidence: 0.88,
    drivers: [
      { label: "Densification rollout (214 stores)", contribution: 61 },
      { label: "Better batching at cutoff", contribution: 24 },
      { label: "Fuel price easing", contribution: 15 },
    ],
    narrative:
      "Densification lifted stops-per-route from 42 to 48 without extending shift length, cutting per-drop labor and mileage cost.",
    action: "Extend densification to the Northeast in week 38.",
  },
];

// ---------------------------------------------------------------------------
// TAB 4 — Charts
// ---------------------------------------------------------------------------
export const TREND = [
  { week: "WK-30", onTime: 92.1, cost: 6.32, orders: 11.2 },
  { week: "WK-31", onTime: 92.8, cost: 6.24, orders: 11.4 },
  { week: "WK-32", onTime: 93.0, cost: 6.18, orders: 11.6 },
  { week: "WK-33", onTime: 92.6, cost: 6.11, orders: 11.9 },
  { week: "WK-34", onTime: 93.4, cost: 6.05, orders: 12.0 },
  { week: "WK-35", onTime: 93.6, cost: 6.05, orders: 12.1 },
  { week: "WK-36", onTime: 94.8, cost: 5.84, orders: 12.4 },
];

export const REGION_BARS = [
  { region: "Northeast", onTime: 94.1, target: 95 },
  { region: "Southeast", onTime: 91.7, target: 95 },
  { region: "Midwest", onTime: 96.4, target: 95 },
  { region: "Southwest", onTime: 93.2, target: 95 },
  { region: "West", onTime: 95.1, target: 95 },
];

export const EXCEPTION_MIX = [
  { name: "Weather", value: 34 },
  { name: "Address", value: 22 },
  { name: "Capacity", value: 18 },
  { name: "Customer", value: 15 },
  { name: "Other", value: 11 },
];

export const HOURS = ["06", "08", "10", "12", "14", "16", "18", "20"];
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const HEATMAP: { day: string; hour: string; value: number }[] = (() => {
  const rand = rng(4242);
  const cells: { day: string; hour: string; value: number }[] = [];
  DAYS.forEach((day) => {
    HOURS.forEach((hour) => {
      cells.push({ day, hour, value: Math.round(35 + rand() * 65) });
    });
  });
  return cells;
})();

// ---------------------------------------------------------------------------
// TAB 5 — ~100 monitored agents
// ---------------------------------------------------------------------------
export interface FleetAgent {
  id: string;
  name: string;
  domain: string;
  region: string;
  status: "Healthy" | "Degraded" | "Offline";
  runs: number;
  successRate: number;
  latencyMs: number;
}

const DOMAINS = [
  "Routing", "ETA", "Capacity", "Pricing", "Forecast", "Exceptions", "Returns",
  "Driver Supply", "Fraud", "Notifications", "Geocoding", "Fleet Health",
];
const REGIONS = ["Northeast", "Southeast", "Midwest", "Southwest", "West"];

export const FLEET: FleetAgent[] = (() => {
  const rand = rng(777);
  const list: FleetAgent[] = [];
  for (let i = 1; i <= 98; i++) {
    const r = rand();
    const status: FleetAgent["status"] = r > 0.93 ? "Offline" : r > 0.78 ? "Degraded" : "Healthy";
    const domain = DOMAINS[i % DOMAINS.length]!;
    list.push({
      id: `agent-${String(i).padStart(3, "0")}`,
      name: `${domain.replace(/\s/g, "")}-${String(i).padStart(2, "0")}`,
      domain,
      region: REGIONS[i % REGIONS.length]!,
      status,
      runs: Math.round(200 + rand() * 9800),
      successRate: Number((88 + rand() * 11.8).toFixed(1)),
      latencyMs: Math.round(60 + rand() * 900),
    });
  }
  return list;
})();
