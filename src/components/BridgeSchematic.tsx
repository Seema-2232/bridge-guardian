import { Sensor } from "@/types/monitoring";
import { motion } from "framer-motion";

interface BridgeSchematicProps {
  sensors: Sensor[];
  selectedSensorId: string;
  onSelectSensor: (id: string) => void;
}

const sensorPositions: Record<string, { x: number; y: number }> = {
  "S-001": { x: 50, y: 38 },
  "S-002": { x: 35, y: 38 },
  "S-003": { x: 28, y: 68 },
  "S-004": { x: 50, y: 28 },
  "S-005": { x: 62, y: 18 },
  "S-006": { x: 20, y: 82 },
  "S-007": { x: 15, y: 55 },
  "S-008": { x: 72, y: 68 },
};

const statusColors = {
  normal: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
  offline: "#6b7280",
};

const BridgeSchematic = ({ sensors, selectedSensorId, onSelectSensor }: BridgeSchematicProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary">Bridge Schematic</span>
          <p className="text-xs text-muted-foreground mt-0.5">Click sensor markers to inspect</p>
        </div>
        <div className="flex items-center gap-3">
          {(["normal", "warning", "critical"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: statusColors[s] }} />
              <span className="text-[10px] text-muted-foreground capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full aspect-[3/1] bg-secondary/30 rounded-md overflow-hidden">
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(190, 95%, 50%)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Bridge SVG */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Water */}
          <rect x="0" y="85" width="100" height="15" fill="hsl(200, 60%, 15%)" opacity="0.5" />
          <path d="M0,88 Q10,85 20,88 T40,88 T60,88 T80,88 T100,88" fill="none" stroke="hsl(190, 95%, 50%)" strokeWidth="0.3" opacity="0.3" />

          {/* Foundation / Piers */}
          <rect x="18" y="55" width="4" height="33" fill="hsl(220, 15%, 25%)" stroke="hsl(220, 15%, 35%)" strokeWidth="0.3" />
          <rect x="70" y="55" width="4" height="33" fill="hsl(220, 15%, 25%)" stroke="hsl(220, 15%, 35%)" strokeWidth="0.3" />

          {/* Deck */}
          <rect x="5" y="40" width="90" height="4" fill="hsl(220, 15%, 22%)" stroke="hsl(220, 15%, 35%)" strokeWidth="0.3" rx="1" />

          {/* Tower 1 */}
          <rect x="19" y="10" width="2" height="45" fill="hsl(220, 15%, 30%)" stroke="hsl(220, 15%, 40%)" strokeWidth="0.3" />
          {/* Tower 2 */}
          <rect x="71" y="10" width="2" height="45" fill="hsl(220, 15%, 30%)" stroke="hsl(220, 15%, 40%)" strokeWidth="0.3" />

          {/* Cables from Tower 1 */}
          <line x1="20" y1="12" x2="10" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />
          <line x1="20" y1="12" x2="30" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />
          <line x1="20" y1="12" x2="40" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />
          <line x1="20" y1="12" x2="50" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />

          {/* Cables from Tower 2 */}
          <line x1="72" y1="12" x2="60" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />
          <line x1="72" y1="12" x2="65" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />
          <line x1="72" y1="12" x2="80" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />
          <line x1="72" y1="12" x2="90" y2="40" stroke="hsl(190, 95%, 50%)" strokeWidth="0.4" opacity="0.5" />

          {/* Abutments */}
          <path d="M3,44 L7,44 L5,55 L1,55 Z" fill="hsl(220, 15%, 25%)" />
          <path d="M93,44 L97,44 L99,55 L95,55 Z" fill="hsl(220, 15%, 25%)" />

          {/* Sensor markers */}
          {sensors.map((sensor) => {
            const pos = sensorPositions[sensor.id];
            if (!pos) return null;
            const isSelected = sensor.id === selectedSensorId;
            const color = statusColors[sensor.status];

            return (
              <g key={sensor.id} onClick={() => onSelectSensor(sensor.id)} className="cursor-pointer">
                {/* Pulse ring for critical */}
                {sensor.status === "critical" && (
                  <circle cx={pos.x} cy={pos.y} r="4" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4">
                    <animate attributeName="r" from="2.5" to="6" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Selection ring */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r="4" fill="none" stroke="hsl(190, 95%, 50%)" strokeWidth="0.5" strokeDasharray="1.5 1" >
                    <animateTransform attributeName="transform" type="rotate" from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`} dur="6s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Marker */}
                <circle cx={pos.x} cy={pos.y} r="2.2" fill={color} stroke="hsl(220, 20%, 7%)" strokeWidth="0.6" />

                {/* Label */}
                <text x={pos.x} y={pos.y - 4} textAnchor="middle" fontSize="2.5" fill="hsl(210, 20%, 70%)" fontFamily="monospace">
                  {sensor.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BridgeSchematic;
