import { sensors } from "@/data/mockData";

const SensorStatusBar = () => {
  const counts = {
    normal: sensors.filter(s => s.status === "normal").length,
    warning: sensors.filter(s => s.status === "warning").length,
    critical: sensors.filter(s => s.status === "critical").length,
  };
  const total = sensors.length;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Sensor Status Distribution</span>
      <div className="flex items-center gap-1 mt-3 h-3 rounded-full overflow-hidden">
        <div className="h-full bg-success rounded-l-full transition-all" style={{ width: `${(counts.normal / total) * 100}%` }} />
        <div className="h-full bg-warning transition-all" style={{ width: `${(counts.warning / total) * 100}%` }} />
        <div className="h-full bg-critical rounded-r-full transition-all" style={{ width: `${(counts.critical / total) * 100}%` }} />
      </div>
      <div className="flex items-center gap-6 mt-3">
        <Legend color="bg-success" label="Normal" count={counts.normal} />
        <Legend color="bg-warning" label="Warning" count={counts.warning} />
        <Legend color="bg-critical" label="Critical" count={counts.critical} />
      </div>
    </div>
  );
};

const Legend = ({ color, label, count }: { color: string; label: string; count: number }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-xs font-mono font-semibold">{count}</span>
  </div>
);

export default SensorStatusBar;
