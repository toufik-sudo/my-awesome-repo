import React, { useMemo } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { NODE_ACCENT } from "./nodeConfig";

export function ConnectionLines() {
  const { workflow, removeConnection } = useWorkflow();

  const lines = useMemo(() => {
    return workflow.connections.map((conn) => {
      const fromNode = workflow.nodes.find((n) => n.id === conn.fromNodeId);
      const toNode = workflow.nodes.find((n) => n.id === conn.toNodeId);
      if (!fromNode || !toNode) return null;

      // Output port on the right side of the node (208px width)
      const x1 = fromNode.position.x + 208;
      const y1 = fromNode.position.y + 40;
      // Input port on the left side
      const x2 = toNode.position.x;
      const y2 = toNode.position.y + 40;

      const midX = (x1 + x2) / 2;
      const cpOffset = Math.max(60, Math.abs(x2 - x1) * 0.4);

      const color = NODE_ACCENT[fromNode.type] || "hsl(220, 10%, 40%)";

      return (
        <g key={conn.id}>
          <path
            d={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeOpacity={0.6}
            className="transition-all"
          />
          {/* Invisible wider path for click target */}
          <path
            d={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke="transparent"
            strokeWidth={14}
            className="cursor-pointer"
            onClick={() => removeConnection(conn.id)}
          />
          {/* Animated dot */}
          <circle r={3} fill={color} opacity={0.8}>
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
            />
          </circle>
        </g>
      );
    });
  }, [workflow.connections, workflow.nodes, removeConnection]);

  return <>{lines}</>;
}
