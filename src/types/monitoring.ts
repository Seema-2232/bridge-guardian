export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export type SensorStatus = "normal" | "warning" | "critical" | "offline";
export type SensorType = "strain" | "stress" | "vibration" | "temperature" | "displacement";
export type AlertSeverity = "info" | "warning" | "critical";

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  status: SensorStatus;
  value: number;
  unit: string;
  threshold: number;
  healthScore: number;
  data: TimeSeriesPoint[];
}

export interface Alert {
  id: string;
  sensorId: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: string;
  location: string;
  builtYear: number;
  lastInspection: string;
  overallHealth: number;
  sensorCount: number;
  activeSensors: number;
  criticalAlerts: number;
}
