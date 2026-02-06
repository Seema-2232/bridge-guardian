import { useState } from "react";
import { sensors } from "@/data/mockData";
import InfrastructureOverview from "@/components/InfrastructureOverview";
import SensorCard from "@/components/SensorCard";
import SensorChart from "@/components/SensorChart";
import AlertFeed from "@/components/AlertFeed";
import SensorStatusBar from "@/components/SensorStatusBar";
import { Activity, Radio } from "lucide-react";

const Index = () => {
  const [selectedSensorId, setSelectedSensorId] = useState<string>("S-005");
  const selectedSensor = sensors.find(s => s.id === selectedSensorId) ?? sensors[0];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center glow-primary">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">StructureGuard</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Structural Health Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-xs font-mono text-muted-foreground">LIVE</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Overview + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InfrastructureOverview />
          </div>
          <div className="space-y-6">
            <SensorStatusBar />
          </div>
        </div>

        {/* Charts + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SensorChart sensor={selectedSensor} />
          </div>
          <AlertFeed />
        </div>

        {/* Sensor Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary">Sensor Network</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onClick={() => setSelectedSensorId(sensor.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
