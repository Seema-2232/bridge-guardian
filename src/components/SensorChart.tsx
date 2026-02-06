import { Sensor } from "@/types/monitoring";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface SensorChartProps {
  sensor: Sensor;
}

const SensorChart = ({ sensor }: SensorChartProps) => {
  const chartData = sensor.data.map((p) => ({
    time: new Date(p.timestamp).getHours() + ":00",
    value: p.value,
  }));

  const strokeColor =
    sensor.status === "critical" ? "hsl(0, 80%, 55%)" :
    sensor.status === "warning" ? "hsl(38, 95%, 55%)" :
    "hsl(190, 95%, 50%)";

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium">{sensor.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">{sensor.id} — {sensor.location}</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-mono font-bold">{sensor.value}</span>
          <span className="text-xs text-muted-foreground ml-1">{sensor.unit}</span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="time" tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }}
              axisLine={{ stroke: "hsl(220, 15%, 18%)" }} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215, 15%, 50%)" }}
              axisLine={{ stroke: "hsl(220, 15%, 18%)" }} tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono",
              }}
            />
            <ReferenceLine
              y={sensor.threshold} stroke="hsl(0, 80%, 55%)" strokeDasharray="4 4"
              label={{ value: "Threshold", position: "right", fontSize: 10, fill: "hsl(0, 80%, 55%)" }}
            />
            <Line
              type="monotone" dataKey="value" stroke={strokeColor}
              strokeWidth={2} dot={false} activeDot={{ r: 4, fill: strokeColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorChart;
