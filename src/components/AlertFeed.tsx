import { Alert, Sensor } from "@/types/monitoring";
import { AlertTriangle, Info, Bell, CheckCircle, X } from "lucide-react";
import { formatTimeAgo } from "@/lib/sensorUtils";
import { AlertSeverity } from "@/types/monitoring";
import { motion, AnimatePresence } from "framer-motion";

const severityConfig: Record<AlertSeverity, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: "text-critical", bg: "bg-critical/10 border-critical/30" },
  warning: { icon: Bell, color: "text-warning", bg: "bg-warning/10 border-warning/30" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10 border-primary/30" },
};

interface AlertFeedProps {
  alerts: Alert[];
  sensors: Sensor[];
  onAcknowledge?: (alertId: string) => void;
}

const AlertFeed = ({ alerts, sensors, onAcknowledge }: AlertFeedProps) => {
  const sorted = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="rounded-lg border border-border bg-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-xs font-mono uppercase tracking-widest text-warning">Alert Feed</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">
            {alerts.filter(a => !a.acknowledged && a.severity === "critical").length} critical
          </span>
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">
            {alerts.filter(a => !a.acknowledged).length} unread
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {sorted.map((alert) => {
            const cfg = severityConfig[alert.severity];
            const Icon = cfg.icon;
            const sensor = sensors.find(s => s.id === alert.sensorId);

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-md border p-3 ${cfg.bg} ${alert.acknowledged ? "opacity-40" : ""}`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground truncate">{sensor?.name ?? alert.sensorId}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      {alert.acknowledged ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-success" />
                          <span className="text-[10px] text-success">Acknowledged</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAcknowledge?.(alert.id)}
                          className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border hover:border-primary/30"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertFeed;
