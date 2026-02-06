import { Sensor } from "@/types/monitoring";

interface SensorDetailPanelProps {
  sensor: Sensor;
}

const SensorDetailPanel = ({ sensor }: SensorDetailPanelProps) => {
  const usage = sensor.value / sensor.threshold;
  const riskLevel = usage > 0.9 ? "CRITICAL" : usage > 0.7 ? "ELEVATED" : usage > 0.5 ? "MODERATE" : "LOW";
  const riskColor = usage > 0.9 ? "text-critical" : usage > 0.7 ? "text-warning" : "text-success";

  const dataPoints = sensor.data;
  const values = dataPoints.map(d => d.value);
  const min = Math.min(...values).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  const stdDev = Math.sqrt(values.reduce((sq, v) => sq + (v - parseFloat(avg)) ** 2, 0) / values.length).toFixed(2);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Sensor Detail</span>
          <h3 className="text-sm font-medium mt-1">{sensor.name}</h3>
        </div>
        <div className={`text-xs font-mono font-bold px-2 py-1 rounded ${riskColor} bg-secondary`}>
          {riskLevel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DetailRow label="Sensor ID" value={sensor.id} />
        <DetailRow label="Type" value={sensor.type} />
        <DetailRow label="Location" value={sensor.location} />
        <DetailRow label="Unit" value={sensor.unit} />
        <DetailRow label="Current Value" value={String(sensor.value)} highlight />
        <DetailRow label="Threshold" value={String(sensor.threshold)} />
        <DetailRow label="Min (24h)" value={min} />
        <DetailRow label="Max (24h)" value={max} />
        <DetailRow label="Avg (24h)" value={avg} />
        <DetailRow label="Std Dev" value={stdDev} />
        <DetailRow label="Health Score" value={`${sensor.healthScore}/100`} />
        <DetailRow label="Data Points" value={String(dataPoints.length)} />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="bg-secondary/30 rounded-md p-2.5">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">{label}</span>
    <span className={`text-sm font-mono ${highlight ? "font-bold text-primary" : ""}`}>{value}</span>
  </div>
);

export default SensorDetailPanel;
