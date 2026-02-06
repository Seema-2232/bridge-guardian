import { Sensor } from "@/types/monitoring";
import { statusColor, statusBg, statusGlow, sensorTypeIcon } from "@/lib/sensorUtils";

interface SensorCardProps {
  sensor: Sensor;
  onClick?: () => void;
}

const SensorCard = ({ sensor, onClick }: SensorCardProps) => {
  const Icon = sensorTypeIcon[sensor.type];
  const usagePercent = Math.min((sensor.value / sensor.threshold) * 100, 100);
  const barColor = sensor.status === "critical" ? "bg-critical" : sensor.status === "warning" ? "bg-warning" : "bg-success";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-4 transition-all duration-200 hover:scale-[1.02] ${statusBg[sensor.status]} ${statusGlow[sensor.status]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${statusColor[sensor.status]}`} />
          <span className="text-xs font-mono text-muted-foreground">{sensor.id}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${sensor.status === "critical" ? "bg-critical animate-pulse-glow" : sensor.status === "warning" ? "bg-warning" : "bg-success"}`} />
      </div>

      <h3 className="text-sm font-medium mb-1 truncate">{sensor.name}</h3>
      <p className="text-xs text-muted-foreground mb-3">{sensor.location}</p>

      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-2xl font-mono font-bold">{sensor.value}</span>
          <span className="text-xs text-muted-foreground ml-1">{sensor.unit}</span>
        </div>
        <span className={`text-xs font-mono ${statusColor[sensor.status]}`}>
          {Math.round(usagePercent)}% of limit
        </span>
      </div>

      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Health Score</span>
        <span className={`text-sm font-mono font-semibold ${statusColor[sensor.status]}`}>{sensor.healthScore}</span>
      </div>
    </button>
  );
};

export default SensorCard;
