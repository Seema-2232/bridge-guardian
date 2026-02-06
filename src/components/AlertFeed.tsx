import { alerts, sensors } from "@/data/mockData";
import { AlertTriangle, Info, Bell, CheckCircle } from "lucide-react";
import { formatTimeAgo } from "@/lib/sensorUtils";
import { AlertSeverity } from "@/types/monitoring";

const severityConfig: Record<AlertSeverity, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: "text-critical", bg: "bg-critical/10 border-critical/30" },
  warning: { icon: Bell, color: "text-warning", bg: "bg-warning/10 border-warning/30" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10 border-primary/30" },
};

const AlertFeed = () => {
  const sorted = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-xs font-mono uppercase tracking-widest text-warning">Alert Feed</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {alerts.filter(a => !a.acknowledged).length} unread
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {sorted.map((alert) => {
          const cfg = severityConfig[alert.severity];
          const Icon = cfg.icon;
          const sensor = sensors.find(s => s.id === alert.sensorId);

          return (
            <div key={alert.id} className={`rounded-md border p-3 ${cfg.bg} ${alert.acknowledged ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-2.5">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{sensor?.name ?? alert.sensorId}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{alert.message}</p>
                  {alert.acknowledged && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span className="text-[10px] text-success">Acknowledged</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertFeed;
