import { useState, useEffect, useCallback, useRef } from "react";
import { Sensor, Alert, TimeSeriesPoint } from "@/types/monitoring";
import { sensors as initialSensors, alerts as initialAlerts, infrastructure as initialInfra } from "@/data/mockData";

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const simulateValue = (current: number, threshold: number, status: string): number => {
  const volatility = status === "critical" ? 0.03 : status === "warning" ? 0.02 : 0.01;
  const drift = status === "critical" ? 0.002 : status === "warning" ? 0.001 : 0;
  const noise = (Math.random() - 0.48) * threshold * volatility;
  return Math.round((current + noise + drift * threshold) * 100) / 100;
};

export const useLiveData = () => {
  const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const tickRef = useRef(0);

  const updateSensors = useCallback(() => {
    tickRef.current += 1;

    setSensors((prev) =>
      prev.map((sensor) => {
        const newValue = simulateValue(sensor.value, sensor.threshold, sensor.status);
        const usage = newValue / sensor.threshold;
        const newStatus =
          usage > 0.9 ? "critical" : usage > 0.7 ? "warning" : "normal";
        const healthScore = clamp(Math.round((1 - usage) * 100 + (Math.random() - 0.5) * 5), 0, 100);

        const newPoint: TimeSeriesPoint = {
          timestamp: new Date().toISOString(),
          value: newValue,
        };

        return {
          ...sensor,
          value: newValue,
          status: newStatus as any,
          healthScore,
          data: [...sensor.data.slice(-23), newPoint],
        };
      })
    );

    // Occasionally generate new alerts
    if (tickRef.current % 8 === 0) {
      setSensors((currentSensors) => {
        const criticalSensor = currentSensors.find((s) => s.status === "critical");
        if (criticalSensor) {
          const newAlert: Alert = {
            id: `A-${Date.now()}`,
            sensorId: criticalSensor.id,
            severity: "critical",
            message: `${criticalSensor.name} reading at ${Math.round((criticalSensor.value / criticalSensor.threshold) * 100)}% of safety threshold — immediate attention required`,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          };
          setAlerts((prev) => [newAlert, ...prev].slice(0, 15));
        }
        return currentSensors;
      });
    }

    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    const interval = setInterval(updateSensors, 2000);
    return () => clearInterval(interval);
  }, [updateSensors]);

  const overallHealth = Math.round(
    sensors.reduce((sum, s) => sum + s.healthScore, 0) / sensors.length
  );

  const infra = {
    ...initialInfra,
    overallHealth,
    criticalAlerts: alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length,
    activeSensors: sensors.filter((s) => s.status !== "offline").length,
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  return { sensors, alerts, infrastructure: infra, lastUpdate, acknowledgeAlert };
};
