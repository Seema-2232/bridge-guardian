import { InfrastructureAsset } from "@/types/monitoring";
import { Shield, MapPin, Calendar, AlertTriangle, Radio } from "lucide-react";

interface InfrastructureOverviewProps {
  infrastructure: InfrastructureAsset;
}

const HealthRing = ({ score }: { score: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score > 75 ? "hsl(var(--success))" : score > 50 ? "hsl(var(--warning))" : "hsl(var(--critical))";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle
          cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono transition-all duration-700" style={{ color }}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Health</span>
      </div>
    </div>
  );
};

const InfrastructureOverview = ({ infrastructure: asset }: InfrastructureOverviewProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 glow-primary">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Infrastructure Overview</span>
          </div>
          <h2 className="text-xl font-semibold">{asset.name}</h2>
          <p className="text-sm text-muted-foreground">{asset.type} — {asset.id}</p>
        </div>
        <HealthRing score={asset.overallHealth} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoBlock icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={asset.location} />
        <InfoBlock icon={<Calendar className="w-3.5 h-3.5" />} label="Last Inspection" value={asset.lastInspection} />
        <InfoBlock icon={<Radio className="w-3.5 h-3.5" />} label="Active Sensors" value={`${asset.activeSensors} / ${asset.sensorCount}`} />
        <InfoBlock
          icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Critical Alerts"
          value={String(asset.criticalAlerts)}
          highlight={asset.criticalAlerts > 0}
        />
      </div>
    </div>
  );
};

const InfoBlock = ({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) => (
  <div className="bg-secondary/50 rounded-md p-3">
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
    <p className={`text-sm font-medium ${highlight ? "text-critical animate-pulse-glow" : ""}`}>{value}</p>
  </div>
);

export default InfrastructureOverview;
