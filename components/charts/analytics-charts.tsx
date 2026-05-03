"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

import type { MealType } from "@/lib/constants";
import type { AnalyticsPayload } from "@/lib/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const palette = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#9334E6"];

export function MealPie({ data }: { data: AnalyticsPayload | undefined }) {
  const meals: MealType[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const chart = meals.map((m) => ({
    name: m,
    value: data?.byMeal[m].avg ?? 0,
    count: data?.byMeal[m].count ?? 0,
  }));
  return (
    <Card className="bg-white/80 backdrop-blur-sm ring-black/[0.06]">
      <CardHeader>
        <CardTitle>Meal mood mix</CardTitle>
        <CardDescription>Average rating share by meal</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] w-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={chart}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              animationDuration={900}
            >
              {chart.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const row = payload[0].payload as { name: string; value: number; count: number };
                return (
                  <div className="rounded-xl border border-black/[0.06] bg-white/95 px-3 py-2 text-xs shadow-md">
                    <div className="font-semibold">{row.name}</div>
                    <div>{row.value.toFixed(2)}★ avg</div>
                    <div className="text-muted-foreground">{row.count} responses</div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StudentBlockBars({ data }: { data: AnalyticsPayload | undefined }) {
  const blocks = Object.entries(data?.byBlock ?? {}).map(([name, v]) => ({
    name,
    avg: v.avg,
    count: v.count,
  }));
  return (
    <Card className="bg-white/80 backdrop-blur-sm ring-black/[0.06]">
      <CardHeader>
        <CardTitle>Hostel blocks</CardTitle>
        <CardDescription>Where feedback is coming from</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] w-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={blocks} margin={{ left: 6, right: 6, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4285F4" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#4285F4" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.[0]) return null;
                const v = payload[0].payload as { avg: number; count: number };
                return (
                  <div className="rounded-xl border border-black/[0.06] bg-white/95 px-3 py-2 text-xs shadow-md">
                    <div className="font-semibold">{label}</div>
                    <div>{v.avg.toFixed(2)}★</div>
                    <div className="text-muted-foreground">{v.count} responses</div>
                  </div>
                );
              }}
            />
            <Bar dataKey="avg" fill="url(#barGrad)" radius={[10, 10, 6, 6]} animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DailyTrend({ data }: { data: AnalyticsPayload | undefined }) {
  const pts = [...(data?.byDate ?? [])].slice(-21);
  return (
    <Card className="bg-white/80 backdrop-blur-sm ring-black/[0.06]">
      <CardHeader>
        <CardTitle>Daily softness curve</CardTitle>
        <CardDescription>Last few days of averages</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] w-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={pts} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#34A853"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 2, stroke: "#ffffff", fill: "#34A853" }}
              activeDot={{ r: 6 }}
              name="Avg rating"
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4285F4"
              strokeWidth={2}
              dot={false}
              name="Responses"
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function NationalIntlBars({ data }: { data: AnalyticsPayload | undefined }) {
  const rows = Object.entries(data?.byStudentType ?? {}).map(([name, v]) => ({
    name,
    avg: v.avg,
    count: v.count,
  }));
  return (
    <Card className="bg-white/80 backdrop-blur-sm ring-black/[0.06]">
      <CardHeader>
        <CardTitle>National • International</CardTitle>
        <CardDescription>Warm averages, side by side</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px] w-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={rows} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="intlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBC05" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#FBBC05" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="avg" fill="url(#intlGrad)" radius={[10, 10, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RatingPie({ data }: { data: AnalyticsPayload | undefined }) {
  const dist = data?.ratingDistribution ?? { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  const chart = (["5", "4", "3", "2", "1"] as const).map((k) => ({
    name: `${k}★`,
    value: dist[k],
  }));
  return (
    <Card className="bg-white/80 backdrop-blur-sm ring-black/[0.06]">
      <CardHeader>
        <CardTitle>Ratings bouquet</CardTitle>
        <CardDescription>How stars stack up overall</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie data={chart} dataKey="value" nameKey="name" outerRadius={100} animationDuration={800}>
              {chart.map((_, i) => (
                <Cell key={i} fill={palette[(i + 1) % palette.length]} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const dayOrder = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function MealDayHeat({ data }: { data: AnalyticsPayload | undefined }) {
  const meals: MealType[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const lookup = new Map<string, { avg: number; count: number }>();
  (data?.heatmapMealDay ?? []).forEach((h) =>
    lookup.set(`${h.day}__${h.mealType}`, { avg: h.avg, count: h.count })
  );

  function colorFor(avg: number, count: number) {
    if (count === 0) return "bg-neutral-100";
    if (avg >= 4) return "bg-emerald-500/85";
    if (avg >= 3) return "bg-amber-400/80";
    return "bg-rose-500/85";
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm ring-black/[0.06]">
      <CardHeader>
        <CardTitle>Gentle heatmap</CardTitle>
        <CardDescription>Average sentiment by weekday × meal</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="overflow-x-auto pb-2">
          <table className="min-w-[640px] w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left font-semibold text-neutral-900">Day</th>
                {meals.map((m) => (
                  <th key={m} className="p-2 text-center font-semibold text-neutral-900">
                    {m.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dayOrder.map((d) => (
                <tr key={d} className="border-t border-black/[0.06]">
                  <td className="p-2 font-medium text-neutral-800">{d.slice(0, 3)}</td>
                  {meals.map((m) => {
                    const cell = lookup.get(`${d}__${m}`) ?? { avg: 0, count: 0 };
                    return (
                      <td key={`${d}-${m}`} className="p-2">
                        <div
                          className={`mx-auto grid h-12 w-[72px] place-items-center rounded-2xl text-white shadow-inner shadow-black/10 ${colorFor(
                            cell.avg,
                            cell.count
                          )}`}
                          title={`${m} • ${d}`}
                        >
                          {cell.count ? (
                            <span className="text-sm font-semibold">{cell.avg.toFixed(1)}</span>
                          ) : (
                            <span className="text-neutral-700">—</span>
                          )}
                        </div>
                        <div className="mt-1 text-center text-[10px] text-neutral-600">
                          {cell.count ? `${cell.count} resp.` : ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 h-[260px] w-full min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart
              data={dayOrder.map((d) => {
                const agg = meals.reduce(
                  (acc, m) => {
                    const c = lookup.get(`${d}__${m}`);
                    acc.count += c?.count ?? 0;
                    acc.sum += (c?.avg ?? 0) * (c?.count ?? 0);
                    return acc;
                  },
                  { count: 0, sum: 0 }
                );
                return {
                  name: d.slice(0, 3),
                  avg: agg.count ? Number((agg.sum / agg.count).toFixed(2)) : 0,
                };
              })}
              margin={{ left: 4, right: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="#34A853" radius={[12, 12, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
