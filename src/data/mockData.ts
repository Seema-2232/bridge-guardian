import { Sensor, Alert, TimeSeriesPoint, InfrastructureAsset } from "@/types/monitoring";

// Generate time series data
const generateTimeSeries = (hours: number, baseValue: number, variance: number, trend: number = 0): TimeSeriesPoint[] => {
  const now = Date.now();
  const points: TimeSeriesPoint[] = [];
  for (let i = hours; i >= 0; i--) {
    const time = now - i * 3600000;
    const noise = (Math.random() - 0.5) * variance;
    const trendValue = trend * (hours - i) / hours;
    points.push({
      timestamp: new Date(time).toISOString(),
      value: Math.round((baseValue + noise + trendValue) * 100) / 100,
    });
  }
  return points;
};

export const sensors: Sensor[] = [
  { id: "S-001", name: "Main Span Strain Gauge A", type: "strain", location: "Span 1 - Midpoint", status: "normal", value: 245, unit: "μϵ", threshold: 400, healthScore: 92, data: generateTimeSeries(24, 245, 30) },
  { id: "S-002", name: "Main Span Strain Gauge B", type: "strain", location: "Span 1 - Quarter", status: "normal", value: 198, unit: "μϵ", threshold: 400, healthScore: 96, data: generateTimeSeries(24, 198, 20) },
  { id: "S-003", name: "Pier 2 Accelerometer", type: "vibration", location: "Pier 2 - Base", status: "warning", value: 3.8, unit: "mm/s²", threshold: 5.0, healthScore: 68, data: generateTimeSeries(24, 3.2, 0.8, 1.2) },
  { id: "S-004", name: "Deck Temperature Sensor", type: "temperature", location: "Deck - Center", status: "normal", value: 28.3, unit: "°C", threshold: 55, healthScore: 98, data: generateTimeSeries(24, 27, 3) },
  { id: "S-005", name: "Cable Stay Tension #4", type: "stress", location: "Cable 4 - Anchor", status: "critical", value: 385, unit: "MPa", threshold: 420, healthScore: 34, data: generateTimeSeries(24, 340, 20, 50) },
  { id: "S-006", name: "Foundation Tilt Sensor", type: "displacement", location: "Foundation N", status: "normal", value: 0.02, unit: "°", threshold: 0.5, healthScore: 95, data: generateTimeSeries(24, 0.02, 0.005) },
  { id: "S-007", name: "Bearing Displacement X", type: "displacement", location: "Bearing 1 - East", status: "warning", value: 12.4, unit: "mm", threshold: 18, healthScore: 55, data: generateTimeSeries(24, 10, 2, 4) },
  { id: "S-008", name: "Pier 1 Crack Gauge", type: "strain", location: "Pier 1 - South Face", status: "normal", value: 0.12, unit: "mm", threshold: 1.0, healthScore: 88, data: generateTimeSeries(24, 0.11, 0.02) },
];

export const alerts: Alert[] = [
  { id: "A-001", sensorId: "S-005", severity: "critical", message: "Cable Stay #4 tension approaching yield threshold — 91.7% of limit", timestamp: new Date(Date.now() - 300000).toISOString(), acknowledged: false },
  { id: "A-002", sensorId: "S-003", severity: "warning", message: "Pier 2 vibration amplitude trending upward over 6h", timestamp: new Date(Date.now() - 1800000).toISOString(), acknowledged: false },
  { id: "A-003", sensorId: "S-007", severity: "warning", message: "Bearing displacement exceeding normal range — inspect recommended", timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: true },
  { id: "A-004", sensorId: "S-001", severity: "info", message: "Routine calibration check completed for Main Span Gauge A", timestamp: new Date(Date.now() - 7200000).toISOString(), acknowledged: true },
  { id: "A-005", sensorId: "S-005", severity: "critical", message: "Rate of tension increase exceeds safe threshold — immediate review required", timestamp: new Date(Date.now() - 900000).toISOString(), acknowledged: false },
];

export const infrastructure: InfrastructureAsset = {
  id: "BR-2024-001",
  name: "Riverside Highway Bridge",
  type: "Suspension Bridge",
  location: "Highway 101, Riverside County",
  builtYear: 1998,
  lastInspection: "2024-11-15",
  overallHealth: 74,
  sensorCount: sensors.length,
  activeSensors: sensors.filter(s => s.status !== "offline").length,
  criticalAlerts: alerts.filter(a => a.severity === "critical" && !a.acknowledged).length,
};
