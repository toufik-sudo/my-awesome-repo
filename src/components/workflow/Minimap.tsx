import React, { useMemo } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { NODE_ACCENT } from "./nodeConfig";

interface Props {
  offset: { x: number; y: number };
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  onNavigate: (x: number, y: number) => void;
}

const MINIMAP_W = 160;
const MINIMAP_H = 100;
const NODE_W = 208;
const NODE_H = 60;

export function Minimap({ offset, zoom, canvasWidth, canvasHeight, onNavigate }: Props) {
  const { workflow } = useWorkflow();

  const { bounds, scale } = useMemo(() => {
    if (workflow.nodes.length === 0) {
      return { bounds: { minX: 0, minY: 0, maxX: 800, maxY: 600 }, scale: 0.15 };
    }
    const padding = 100;
    const minX = Math.min(...workflow.nodes.map((n) => n.position.x)) - padding;
    const minY = Math.min(...workflow.nodes.map((n) => n.position.y)) - padding;
    const maxX = Math.max(...workflow.nodes.map((n) => n.position.x + NODE_W)) + padding;
    const maxY = Math.max(...workflow.nodes.map((n) => n.position.y + NODE_H)) + padding;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const s = Math.min(MINIMAP_W / rangeX, MINIMAP_H / rangeY);
    return { bounds: { minX, minY, maxX, maxY }, scale: s };
  }, [workflow.nodes]);

  // Viewport rect in minimap coordinates
  const vpX = (-offset.x / zoom - bounds.minX) * scale;
  const vpY = (-offset.y / zoom - bounds.minY) * scale;
  const vpW = (canvasWidth / zoom) * scale;
  const vpH = (canvasHeight / zoom) * scale;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const worldX = mx / scale + bounds.minX;
    const worldY = my / scale + bounds.minY;
    onNavigate(
      -(worldX - canvasWidth / zoom / 2) * zoom,
      -(worldY - canvasHeight / zoom / 2) * zoom
    );
  };

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-card/90 border border-border rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
      <svg
        width={MINIMAP_W}
        height={MINIMAP_H}
        className="cursor-crosshair"
        onClick={handleClick}
      >
        {/* Connections */}
        {workflow.connections.map((c) => {
          const from = workflow.nodes.find((n) => n.id === c.fromNodeId);
          const to = workflow.nodes.find((n) => n.id === c.toNodeId);
          if (!from || !to) return null;
          const x1 = (from.position.x + NODE_W - bounds.minX) * scale;
          const y1 = (from.position.y + NODE_H / 2 - bounds.minY) * scale;
          const x2 = (to.position.x - bounds.minX) * scale;
          const y2 = (to.position.y + NODE_H / 2 - bounds.minY) * scale;
          return (
            <line
              key={c.id}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth={0.8}
            />
          );
        })}

        {/* Nodes */}
        {workflow.nodes.map((node) => {
          const x = (node.position.x - bounds.minX) * scale;
          const y = (node.position.y - bounds.minY) * scale;
          const w = NODE_W * scale;
          const h = NODE_H * scale;
          return (
            <rect
              key={node.id}
              x={x} y={y} width={w} height={h}
              rx={2}
              fill={NODE_ACCENT[node.type]}
              fillOpacity={0.6}
            />
          );
        })}

        {/* Viewport indicator */}
        <rect
          x={vpX} y={vpY} width={vpW} height={vpH}
          rx={1}
          fill="hsl(var(--primary) / 0.08)"
          stroke="hsl(var(--primary))"
          strokeWidth={1}
          strokeOpacity={0.6}
        />
      </svg>
    </div>
  );
}
