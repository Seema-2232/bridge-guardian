import { useState } from "react";
import { useLiveData } from "@/hooks/useLiveData";
import InfrastructureOverview from "@/components/InfrastructureOverview";
import SensorCard from "@/components/SensorCard";
import SensorChart from "@/components/SensorChart";
import SensorDetailPanel from "@/components/SensorDetailPanel";
import AlertFeed from "@/components/AlertFeed";
import SensorStatusBar from "@/components/SensorStatusBar";
import BridgeSchematic from "@/components/BridgeSchematic";
import PredictiveAnalytics from "@/components/PredictiveAnalytics";
import { Activity, Radio, BarChart3, Map, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabId = "overview" | "analytics" | "sensors";

const tabs: { id: TabId; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Live Monitor", icon: Activity },
  { id: "analytics", label: "Predictive Analytics", icon: BarChart3 },
  { id: "sensors", label: "Sensor Network", icon: Radio },
];

const Index = () => {
  const { sensors, alerts, infrastructure, lastUpdate, acknowledgeAlert } = useLiveData();
  const [selectedSensorId, setSelectedSensorId] = useState<string>("S-005");
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const selectedSensor = sensors.find(s => s.id === selectedSensorId) ?? sensors[0];
  const timeSinceUpdate = Math.round((Date.now() - lastUpdate) / 1000);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center glow-primary">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold tracking-tight">StructureGuard</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Intelligent Structural Health Monitoring</p>
              </div>
            </div>

            {/* Tabs */}
            <nav className="flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 bg-primary/10 rounded-md"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Live indicator */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Clock className="w-3 h-3" />
                <span>Updated {timeSinceUpdate}s ago</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-success/10 border border-success/20">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
                <span className="text-[10px] font-mono text-success font-semibold tracking-wider">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Overview + Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <InfrastructureOverview infrastructure={infrastructure} />
                </div>
                <div className="space-y-6">
                  <SensorStatusBar sensors={sensors} />
                  <SensorDetailPanel sensor={selectedSensor} />
                </div>
              </div>

              {/* Bridge Schematic */}
              <BridgeSchematic
                sensors={sensors}
                selectedSensorId={selectedSensorId}
                onSelectSensor={setSelectedSensorId}
              />

              {/* Charts + Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SensorChart sensor={selectedSensor} />
                </div>
                <AlertFeed alerts={alerts} sensors={sensors} onAcknowledge={acknowledgeAlert} />
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PredictiveAnalytics sensors={sensors} />
            </motion.div>
          )}

          {activeTab === "sensors" && (
            <motion.div
              key="sensors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sensors.map((sensor) => (
                  <SensorCard
                    key={sensor.id}
                    sensor={sensor}
                    isSelected={sensor.id === selectedSensorId}
                    onClick={() => {
                      setSelectedSensorId(sensor.id);
                      setActiveTab("overview");
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-4">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            StructureGuard v1.0 — Intelligent Infrastructure Monitoring
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {sensors.length} sensors · {alerts.length} alerts · {new Date().toLocaleDateString()}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
