import React, { useMemo, useState } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { NODE_ACCENT } from "./nodeConfig";
import { X } from "lucide-react";

interface Props {
  onConnectionContextMenu?: (connId: string, x: number, y: number) => void;
}

export function ConnectionLines({ onConnectionContextMenu }: Props) {
  const { workflow, removeConnection } = useWorkflow();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const lines = useMemo(() => {
    return workflow.connections.map((conn) => {
      const fromNode = workflow.nodes.find((n) => n.id === conn.fromNodeId);
      const toNode = workflow.nodes.find((n) => n.id === conn.toNodeId);
      if (!fromNode || !toNode) return null;

      const x1 = fromNode.position.x + 208;
      const y1 = fromNode.position.y + 40;
      const x2 = toNode.position.x;
      const y2 = toNode.position.y + 40;

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const cpOffset = Math.max(60, Math.abs(x2 - x1) * 0.4);
      const color = NODE_ACCENT[fromNode.type] || "hsl(220, 10%, 40%)";
      const isHovered = hoveredId === conn.id;

      return (
        <g key={conn.id}>
          <path
            d={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={color}
            strokeWidth={isHovered ? 3 : 2}
            strokeOpacity={isHovered ? 1 : 0.6}
            className="transition-all"
          />
          <path
            d={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke="transparent"
            strokeWidth={18}
            className="cursor-pointer"
            style={{ pointerEvents: "stroke" }}
            onMouseEnter={() => setHoveredId(conn.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => removeConnection(conn.id)}
            onContextMenu={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              onConnectionContextMenu?.(conn.id, (e as any).clientX, (e as any).clientY);
            }}
          />
          {isHovered && (
            <foreignObject x={midX - 10} y={midY - 10} width={20} height={20}>
              <div
                className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center cursor-pointer shadow-lg"
                onClick={() => removeConnection(conn.id)}
              >
                <X className="w-3 h-3 text-destructive-foreground" />
              </div>
            </foreignObject>
          )}
          {!isHovered && (
            <circle r={3} fill={color} opacity={0.8}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
              />
            </circle>
          )}
        </g>
      );
    });
  }, [workflow.connections, workflow.nodes, removeConnection, hoveredId, onConnectionContextMenu]);

  return <>{lines}</>;
}
