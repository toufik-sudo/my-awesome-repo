import React, { useRef, useCallback, useState } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { WorkflowNodeCard } from "./WorkflowNodeCard";
import { ConnectionLines } from "./ConnectionLines";
import { CanvasControls } from "./CanvasControls";
import { Minimap } from "./Minimap";
import { cn } from "@/lib/utils";
import { NODE_ACCENT } from "./nodeConfig";
import type { NodeType } from "@/types/workflow";

interface DragConnection {
  fromNodeId: string;
  fromPortId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.15;

export function WorkflowCanvas() {
  const { workflow, selectNode, moveNode, addNode, addConnection, canConnect } = useWorkflow();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 });
  const [dragConn, setDragConn] = useState<DragConnection | null>(null);

  const getCanvasPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - offset.x) / zoom,
        y: (clientY - rect.top - offset.y) / zoom,
      };
    },
    [offset, zoom]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-grid")) {
        setIsPanning(true);
        panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
        selectNode(null);
      }
    },
    [offset, selectNode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
      }
      if (draggingNodeId) {
        const dx = (e.clientX - dragStart.current.x) / zoom;
        const dy = (e.clientY - dragStart.current.y) / zoom;
        moveNode(draggingNodeId, {
          x: dragStart.current.nodeX + dx,
          y: dragStart.current.nodeY + dy,
        });
      }
      if (dragConn) {
        const pt = getCanvasPoint(e.clientX, e.clientY);
        setDragConn((prev) => prev ? { ...prev, x2: pt.x, y2: pt.y } : null);
      }
    },
    [isPanning, draggingNodeId, moveNode, dragConn, getCanvasPoint, zoom]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      setIsPanning(false);
      setDraggingNodeId(null);

      if (dragConn) {
        const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
        const portEl = target?.closest("[data-port-type='input']") as HTMLElement;
        if (portEl) {
          const toNodeId = portEl.getAttribute("data-node-id")!;
          const toPortId = portEl.getAttribute("data-port-id")!;
          if (canConnect(dragConn.fromNodeId, dragConn.fromPortId, toNodeId, toPortId)) {
            addConnection({
              fromNodeId: dragConn.fromNodeId,
              fromPortId: dragConn.fromPortId,
              toNodeId,
              toPortId,
            });
          }
        }
        setDragConn(null);
      }
    },
    [dragConn, addConnection, canConnect]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
        const ratio = newZoom / zoom;
        setOffset({
          x: mouseX - ratio * (mouseX - offset.x),
          y: mouseY - ratio * (mouseY - offset.y),
        });
        setZoom(newZoom);
      }
    },
    [zoom, offset]
  );

  const handlePortDragStart = useCallback(
    (nodeId: string, portId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const node = workflow.nodes.find((n) => n.id === nodeId);
      if (!node) return;
      const x1 = node.position.x + 208;
      const y1 = node.position.y + 40;
      const pt = getCanvasPoint(e.clientX, e.clientY);
      setDragConn({ fromNodeId: nodeId, fromPortId: portId, x1, y1, x2: pt.x, y2: pt.y });
    },
    [workflow.nodes, getCanvasPoint]
  );

  const handleNodeDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setDraggingNodeId(nodeId);
    dragStart.current = { x: e.clientX, y: e.clientY, nodeX: node.position.x, nodeY: node.position.y };
  }, [workflow.nodes]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData("nodeType") as NodeType;
      if (!nodeType || !canvasRef.current) return;
      const pt = getCanvasPoint(e.clientX, e.clientY);
      addNode(nodeType, pt);
    },
    [addNode, getCanvasPoint]
  );

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  }, []);
  const zoomReset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleMinimapNavigate = useCallback((x: number, y: number) => {
    setOffset({ x, y });
  }, []);

  const dragConnColor = dragConn
    ? NODE_ACCENT[workflow.nodes.find((n) => n.id === dragConn.fromNodeId)?.type || "end"]
    : "hsl(220,10%,40%)";

  const canvasSize = canvasRef.current?.getBoundingClientRect();

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative flex-1 overflow-hidden cursor-grab canvas-grid",
        isPanning && "cursor-grabbing"
      )}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onWheel={handleWheel}
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          <ConnectionLines />
          {dragConn && (
            <path
              d={`M ${dragConn.x1} ${dragConn.y1} C ${dragConn.x1 + 60} ${dragConn.y1}, ${dragConn.x2 - 60} ${dragConn.y2}, ${dragConn.x2} ${dragConn.y2}`}
              fill="none"
              stroke={dragConnColor}
              strokeWidth={2}
              strokeDasharray="6 4"
              strokeOpacity={0.7}
            />
          )}
        </svg>

        {workflow.nodes.map((node) => (
          <WorkflowNodeCard
            key={node.id}
            node={node}
            onDragStart={(e) => handleNodeDragStart(node.id, e)}
            onPortDragStart={(portId, e) => handlePortDragStart(node.id, portId, e)}
          />
        ))}
      </div>

      <CanvasControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onZoomReset={zoomReset} />
      <Minimap
        offset={offset}
        zoom={zoom}
        canvasWidth={canvasSize?.width || 800}
        canvasHeight={canvasSize?.height || 600}
        onNavigate={handleMinimapNavigate}
      />
    </div>
  );
}
