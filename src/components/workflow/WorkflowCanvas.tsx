import React, { useRef, useCallback, useState } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { WorkflowNodeCard } from "./WorkflowNodeCard";
import { ConnectionLines } from "./ConnectionLines";
import { CanvasControls } from "./CanvasControls";
import { Minimap } from "./Minimap";
import { ContextMenu, type ContextMenuState } from "./ContextMenu";
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

interface MarqueeRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.15;

export function WorkflowCanvas() {
  const { workflow, selectNode, clearSelection, selectMultiple, selectedNodeIds, moveNode, addNode, addConnection, canConnect, addNodeToComponent } = useWorkflow();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOverComponentId, setDragOverComponentId] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, nodeX: 0, nodeY: 0 });
  const multiDragStart = useRef<Map<string, { x: number; y: number }>>(new Map());
  const [dragConn, setDragConn] = useState<DragConnection | null>(null);
  const [marquee, setMarquee] = useState<MarqueeRect | null>(null);
  const marqueeStart = useRef({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

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
      if (contextMenu) { setContextMenu(null); return; }
      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-grid")) {
        if (e.shiftKey) {
          const pt = getCanvasPoint(e.clientX, e.clientY);
          marqueeStart.current = pt;
          setMarquee({ x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y });
        } else {
          setIsPanning(true);
          panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
          clearSelection();
        }
      }
    },
    [offset, clearSelection, getCanvasPoint, contextMenu]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
      }
      if (draggingNodeId) {
        const dx = (e.clientX - dragStart.current.x) / zoom;
        const dy = (e.clientY - dragStart.current.y) / zoom;
        if (selectedNodeIds.has(draggingNodeId) && selectedNodeIds.size > 1) {
          multiDragStart.current.forEach((startPos, nodeId) => {
            moveNode(nodeId, { x: startPos.x + dx, y: startPos.y + dy });
          });
        } else {
          moveNode(draggingNodeId, { x: dragStart.current.nodeX + dx, y: dragStart.current.nodeY + dy });
        }
        // Check drag-over component
        const draggedNode = workflow.nodes.find((n) => n.id === draggingNodeId);
        if (draggedNode && !draggedNode.parentComponentId && draggedNode.type !== "start" && draggedNode.type !== "component") {
          const pt = { x: draggedNode.position.x, y: draggedNode.position.y };
          const target = workflow.nodes.find((n) =>
            n.type === "component" && n.id !== draggingNodeId &&
            pt.x >= n.position.x && pt.x <= n.position.x + 256 &&
            pt.y >= n.position.y && pt.y <= n.position.y + 200
          );
          setDragOverComponentId(target?.id || null);
        } else {
          setDragOverComponentId(null);
        }
      }
      if (dragConn) {
        const pt = getCanvasPoint(e.clientX, e.clientY);
        setDragConn((prev) => prev ? { ...prev, x2: pt.x, y2: pt.y } : null);
      }
      if (marquee) {
        const pt = getCanvasPoint(e.clientX, e.clientY);
        setMarquee((prev) => prev ? { ...prev, x2: pt.x, y2: pt.y } : null);
      }
    },
    [isPanning, draggingNodeId, moveNode, dragConn, getCanvasPoint, zoom, marquee, selectedNodeIds]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      // Check if node was dropped onto a component
      if (draggingNodeId) {
        const draggedNode = workflow.nodes.find((n) => n.id === draggingNodeId);
        if (draggedNode && !draggedNode.parentComponentId && draggedNode.type !== "start") {
          const pt = { x: draggedNode.position.x, y: draggedNode.position.y };
          const componentTarget = workflow.nodes.find((n) =>
            n.type === "component" && n.id !== draggingNodeId &&
            pt.x >= n.position.x && pt.x <= n.position.x + 256 &&
            pt.y >= n.position.y && pt.y <= n.position.y + 200
          );
          if (componentTarget) {
            addNodeToComponent(draggingNodeId, componentTarget.id);
          }
        }
      }

      setIsPanning(false);
      setDraggingNodeId(null);
      setDragOverComponentId(null);
      multiDragStart.current.clear();

      if (marquee) {
        const minX = Math.min(marquee.x1, marquee.x2);
        const maxX = Math.max(marquee.x1, marquee.x2);
        const minY = Math.min(marquee.y1, marquee.y2);
        const maxY = Math.max(marquee.y1, marquee.y2);
        const NODE_W = 208, NODE_H = 60;
        const selected = workflow.nodes.filter((n) => {
          const nx = n.position.x, ny = n.position.y;
          return nx + NODE_W > minX && nx < maxX && ny + NODE_H > minY && ny < maxY;
        }).map((n) => n.id);
        if (selected.length > 0) selectMultiple(selected);
        setMarquee(null);
        return;
      }

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
    [dragConn, addConnection, canConnect, marquee, workflow.nodes, selectMultiple, draggingNodeId, addNodeToComponent]
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
    if (selectedNodeIds.has(nodeId) && selectedNodeIds.size > 1) {
      const positions = new Map<string, { x: number; y: number }>();
      selectedNodeIds.forEach((id) => {
        const n = workflow.nodes.find((nd) => nd.id === id);
        if (n) positions.set(id, { x: n.position.x, y: n.position.y });
      });
      multiDragStart.current = positions;
    }
  }, [workflow.nodes, selectedNodeIds]);

  const handleNodeContextMenu = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ids = selectedNodeIds.has(nodeId) && selectedNodeIds.size > 1
      ? Array.from(selectedNodeIds)
      : [nodeId];
    if (!selectedNodeIds.has(nodeId)) selectNode(nodeId);
    setContextMenu({ x: e.clientX, y: e.clientY, type: "node", targetId: nodeId, multiNodeIds: ids });
  }, [selectedNodeIds, selectNode]);

  const handleConnectionContextMenu = useCallback((connId: string, x: number, y: number) => {
    setContextMenu({ x, y, type: "connection", targetId: connId });
  }, []);

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

  const zoomIn = useCallback(() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP)), []);
  const zoomReset = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);
  const handleMinimapNavigate = useCallback((x: number, y: number) => setOffset({ x, y }), []);

  const dragConnColor = dragConn
    ? NODE_ACCENT[workflow.nodes.find((n) => n.id === dragConn.fromNodeId)?.type || "end"]
    : "hsl(220,10%,40%)";

  const canvasSize = canvasRef.current?.getBoundingClientRect();

  const marqueeStyle = marquee ? {
    left: Math.min(marquee.x1, marquee.x2),
    top: Math.min(marquee.y1, marquee.y2),
    width: Math.abs(marquee.x2 - marquee.x1),
    height: Math.abs(marquee.y2 - marquee.y1),
  } : null;

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
      onContextMenu={(e) => {
        if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-grid")) {
          e.preventDefault();
        }
      }}
    >
      <div
        className="absolute inset-0 origin-top-left canvas-grid"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          width: "10000px",
          height: "10000px",
        }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          <ConnectionLines onConnectionContextMenu={handleConnectionContextMenu} />
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
            onContextMenu={(e) => handleNodeContextMenu(node.id, e)}
            isDragOver={dragOverComponentId === node.id}
          />
        ))}

        {marqueeStyle && (
          <div
            className="absolute border-2 border-primary/60 bg-primary/10 rounded-sm pointer-events-none"
            style={marqueeStyle}
          />
        )}
      </div>

      <CanvasControls zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} onZoomReset={zoomReset} />
      <Minimap
        offset={offset}
        zoom={zoom}
        canvasWidth={canvasSize?.width || 800}
        canvasHeight={canvasSize?.height || 600}
        onNavigate={handleMinimapNavigate}
      />

      {selectedNodeIds.size > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-primary/20 border border-primary/40 text-primary rounded-full px-3 py-1 text-[10px] font-semibold backdrop-blur-sm">
          {selectedNodeIds.size} nodes selected · drag to move all · <kbd className="bg-primary/20 px-1 rounded">Del</kbd> delete · <kbd className="bg-primary/20 px-1 rounded">⌘D</kbd> duplicate
        </div>
      )}

      {contextMenu && <ContextMenu menu={contextMenu} onClose={() => setContextMenu(null)} />}
    </div>
  );
}
