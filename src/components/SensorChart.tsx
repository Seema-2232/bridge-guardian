import { Sensor } from "@/types/monitoring";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SensorChartProps {
  sensor: Sensor;
}

const SensorChart = ({ sensor }: SensorChartProps) => {
  const chartData = sensor.data.map((p, i) => ({
    time: new Date(p.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: p.value,
    index: i,
  }));

  const strokeColor =
    sensor.status === "critical" ? "hsl(0, 80%, 55%)" :
    sensor.status === "warning" ? "hsl(38, 95%, 55%)" :
    "hsl(190, 95%, 50%)";

  const fillColor =
    sensor.status === "critical" ? "hsl(0, 80%, 55%)" :
    sensor.status === "warning" ? "hsl(38, 95%, 55%)" :
    "hsl(190, 95%, 50%)";

  // Calculate trend
  const recent = sensor.data.slice(-5);
  const older = sensor.data.slice(-10, -5);
  const recentAvg = recent.reduce((s, p) => s + p.value, 0) / recent.length;
  const olderAvg = older.length ? older.reduce((s, p) => s + p.value, 0) / older.length : recentAvg;
  const trendPct = ((recentAvg - olderAvg) / olderAvg) * 100;
  const TrendIcon = trendPct > 1 ? TrendingUp : trendPct < -1 ? TrendingDown : Minus;
  const trendColor = Math.abs(trendPct) < 1 ? "text-muted-foreground" : trendPct > 0 ? "text-critical" : "text-success";

  const usagePercent = Math.round((sensor.value / sensor.threshold) * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-medium">{sensor.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">{sensor.id} — {sensor.location}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono font-bold">{sensor.value}</span>
            <span className="text-xs text-muted-foreground">{sensor.unit}</span>
          </div>
          <div className={`flex items-center gap-1 justify-end ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span className="text-xs font-mono">{trendPct > 0 ? "+" : ""}{trendPct.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Usage bar */}
      <div className="flex items-center gap-3 mb-4 mt-3">
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(usagePercent, 100)}%`,
              background: `linear-gradient(90deg, hsl(190, 95%, 50%), ${fillColor})`,
            }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground w-14 text-right">{usagePercent}%</span>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time" tick={{ fontSize: 9, fill: "hsl(215, 15%, 50%)" }}
              axisLine={{ stroke: "hsl(220, 15%, 18%)" }} tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(215, 15%, 50%)" }}
              axisLine={{ stroke: "hsl(220, 15%, 18%)" }} tickLine={false}
              width={45} domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "JetBrains Mono",
              }}
              formatter={(value: number) => [`${value} ${sensor.unit}`, "Value"]}
            />
            <ReferenceLine
              y={sensor.threshold} stroke="hsl(0, 80%, 55%)" strokeDasharray="4 4"
              label={{ value: `Limit: ${sensor.threshold}`, position: "insideTopRight", fontSize: 9, fill: "hsl(0, 80%, 55%)" }}
            />
            <Area
              type="monotone" dataKey="value" stroke={strokeColor}
              strokeWidth={2} fill={`url(#gradient-${sensor.id})`}
              dot={false} activeDot={{ r: 4, fill: strokeColor, stroke: "hsl(220, 20%, 7%)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-border">
        <StatBlock label="Min" value={Math.min(...sensor.data.map(d => d.value)).toFixed(1)} unit={sensor.unit} />
        <StatBlock label="Avg" value={(sensor.data.reduce((s, d) => s + d.value, 0) / sensor.data.length).toFixed(1)} unit={sensor.unit} />
        <StatBlock label="Max" value={Math.max(...sensor.data.map(d => d.value)).toFixed(1)} unit={sensor.unit} />
      </div>
    </div>
  );
};

const StatBlock = ({ label, value, unit }: { label: string; value: string; unit: string }) => (
  <div className="text-center">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">{label}</span>
    <span className="text-sm font-mono font-semibold">{value}</span>
    <span className="text-[10px] text-muted-foreground ml-0.5">{unit}</span>
  </div>
);

export default SensorChart;
