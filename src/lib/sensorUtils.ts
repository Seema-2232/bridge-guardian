import { SensorStatus } from "@/types/monitoring";
import { Activity, Thermometer, Move, Zap, Waves } from "lucide-react";

export const statusColor: Record<SensorStatus, string> = {
  normal: "text-success",
  warning: "text-warning",
  critical: "text-critical",
  offline: "text-muted-foreground",
};

export const statusBg: Record<SensorStatus, string> = {
  normal: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
  critical: "bg-critical/10 border-critical/30",
  offline: "bg-muted/10 border-muted-foreground/30",
};

export const statusGlow: Record<SensorStatus, string> = {
  normal: "glow-success",
  warning: "glow-accent",
  critical: "glow-critical",
  offline: "",
};

export const sensorTypeIcon = {
  strain: Zap,
  stress: Zap,
  vibration: Waves,
  temperature: Thermometer,
  displacement: Move,
};

export const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};
