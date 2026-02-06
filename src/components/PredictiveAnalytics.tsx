import { Sensor } from "@/types/monitoring";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Brain, Clock, Wrench, AlertTriangle, TrendingUp, Shield } from "lucide-react";

interface PredictiveAnalyticsProps {
  sensors: Sensor[];
}

const PredictiveAnalytics = ({ sensors }: PredictiveAnalyticsProps) => {
  // Fatigue analysis
  const fatigueData = sensors.map((s) => {
    const usage = s.value / s.threshold;
    const fatigue = Math.round(usage * 100 * (1 + Math.random() * 0.2));
    return {
      name: s.id,
      fatigue: Math.min(fatigue, 100),
      status: s.status,
    };
  });

  // Risk prediction
  const criticalSensors = sensors.filter((s) => s.status === "critical");
  const warningSensors = sensors.filter((s) => s.status === "warning");
  const failureRisk = Math.min(
    Math.round(criticalSensors.length * 25 + warningSensors.length * 10 + Math.random() * 5),
    100
  );

  // Remaining useful life estimation
  const riskySensors = sensors
    .filter((s) => s.status !== "normal")
    .map((s) => {
      const rate = (s.value / s.threshold);
      const remainingDays = Math.max(Math.round((1 - rate) * 365 * (0.8 + Math.random() * 0.4)), 1);
      return { ...s, remainingDays };
    })
    .sort((a, b) => a.remainingDays - b.remainingDays);

  // Maintenance recommendations
  const recommendations = [
    ...(criticalSensors.length > 0
      ? [{ priority: "critical" as const, action: `Immediate inspection of ${criticalSensors.map(s => s.name).join(", ")}`, deadline: "Within 24 hours" }]
      : []),
    ...(warningSensors.length > 0
      ? [{ priority: "warning" as const, action: `Schedule maintenance for ${warningSensors.map(s => s.name).join(", ")}`, deadline: "Within 7 days" }]
      : []),
    { priority: "info" as const, action: "Full structural assessment recommended", deadline: "Within 30 days" },
    { priority: "info" as const, action: "Sensor calibration check for all strain gauges", deadline: "Within 14 days" },
  ];

  const statusBarColor = (status: string) =>
    status === "critical" ? "hsl(0, 80%, 55%)" : status === "warning" ? "hsl(38, 95%, 55%)" : "hsl(145, 65%, 42%)";

  const priorityConfig = {
    critical: { color: "text-critical", bg: "bg-critical/10 border-critical/30", label: "URGENT" },
    warning: { color: "text-warning", bg: "bg-warning/10 border-warning/30", label: "HIGH" },
    info: { color: "text-primary", bg: "bg-primary/10 border-primary/30", label: "ROUTINE" },
  };

  return (
    <div className="space-y-6">
      {/* Top row: Risk Score + Fatigue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Failure Risk Score</span>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={failureRisk > 60 ? "hsl(0, 80%, 55%)" : failureRisk > 35 ? "hsl(38, 95%, 55%)" : "hsl(145, 65%, 42%)"}
                  strokeWidth="8" strokeDasharray={`${failureRisk * 3.14} ${314 - failureRisk * 3.14}`}
                  strokeLinecap="round" className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono">{failureRisk}%</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Risk</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {failureRisk > 60
              ? "High risk — immediate action recommended"
              : failureRisk > 35
              ? "Moderate risk — schedule inspection"
              : "Low risk — continue monitoring"}
          </p>
        </div>

        {/* Fatigue Analysis Chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-warning" />
            <span className="text-xs font-mono uppercase tracking-widest text-warning">Fatigue Index by Sensor</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fatigueData} barCategoryGap="20%">
                <XAxis
                  dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }}
                  axisLine={{ stroke: "hsl(220, 15%, 18%)" }} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }}
                  axisLine={{ stroke: "hsl(220, 15%, 18%)" }} tickLine={false}
                  domain={[0, 100]} width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 18%, 10%)",
                    border: "1px solid hsl(220, 15%, 18%)",
                    borderRadius: "6px", fontSize: "11px", fontFamily: "JetBrains Mono",
                  }}
                  formatter={(value: number) => [`${value}%`, "Fatigue Index"]}
                />
                <Bar dataKey="fatigue" radius={[4, 4, 0, 0]}>
                  {fatigueData.map((entry, i) => (
                    <Cell key={i} fill={statusBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row: Remaining Life + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remaining Useful Life */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-widest text-accent">Estimated Remaining Life</span>
          </div>
          {riskySensors.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 mr-2 text-success" />
              All components within safe operating range
            </div>
          ) : (
            <div className="space-y-3">
              {riskySensors.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{s.name}</span>
                      <span className={`text-xs font-mono font-semibold ${s.remainingDays < 30 ? "text-critical" : s.remainingDays < 90 ? "text-warning" : "text-success"}`}>
                        {s.remainingDays} days
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((s.remainingDays / 365) * 100, 100)}%`,
                          background: s.remainingDays < 30 ? "hsl(0, 80%, 55%)" : s.remainingDays < 90 ? "hsl(38, 95%, 55%)" : "hsl(145, 65%, 42%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Recommendations */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Maintenance Actions</span>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const cfg = priorityConfig[rec.priority];
              return (
                <div key={i} className={`rounded-md border p-3 ${cfg.bg}`}>
                  <div className="flex items-start gap-2">
                    <span className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm">{rec.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Deadline: {rec.deadline}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
