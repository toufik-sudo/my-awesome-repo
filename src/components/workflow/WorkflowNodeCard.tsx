import React, { useState } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { cn } from "@/lib/utils";
import { NODE_ICONS, NODE_COLORS } from "./nodeConfig";
import { X, Copy, ChevronDown, ChevronRight } from "lucide-react";
import type { WorkflowNode } from "@/types/workflow";

interface Props {
  node: WorkflowNode;
  onDragStart: (e: React.MouseEvent) => void;
  onPortDragStart: (portId: string, e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  isDragOver?: boolean;
}

export function WorkflowNodeCard({ node, onDragStart, onPortDragStart, onContextMenu, isDragOver }: Props) {
  const { selectedNodeId, selectedNodeIds, selectNode, toggleSelectNode, removeNode, duplicateNodes, workflow } = useWorkflow();
  const isSelected = selectedNodeIds.has(node.id);
  const [collapsed, setCollapsed] = useState(false);

  // Don't render nodes that are children of a component (they render inside their parent)
  if (node.parentComponentId) return null;

  const configPreview = getConfigPreview(node);
  const isComponent = node.type === "component";
  const childNodes = isComponent
    ? workflow.nodes.filter((n) => node.childNodeIds?.includes(n.id))
    : [];

  return (
    <div
      className={cn(
        "absolute group select-none",
        isComponent ? "w-64" : "w-52",
        "rounded-xl border-2 backdrop-blur-sm transition-all duration-200",
        NODE_COLORS[node.type],
        isSelected && "ring-2 ring-ring shadow-lg shadow-primary/20",
        isDragOver && isComponent && "ring-2 ring-accent shadow-xl shadow-accent/30 scale-[1.02]"
      )}
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={(e) => {
        if (e.shiftKey) {
          e.stopPropagation();
          toggleSelectNode(node.id);
        } else {
          if (!selectedNodeIds.has(node.id)) {
            selectNode(node.id);
          }
          onDragStart(e);
        }
      }}
      onContextMenu={onContextMenu}
    >
      {/* Drag-over glow overlay */}
      {isDragOver && isComponent && (
        <div className="absolute inset-0 rounded-xl bg-accent/10 border-2 border-accent animate-pulse pointer-events-none z-10" />
      )}

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-current/10">
        {isComponent && (
          <button
            className="p-0.5 rounded hover:bg-current/10"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-current/10">
          {NODE_ICONS[node.type]}
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase flex-1 truncate">
          {node.label}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-0.5 rounded hover:bg-current/10"
            onClick={(e) => {
              e.stopPropagation();
              duplicateNodes([node.id]);
            }}
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          {node.type !== "start" && (
            <button
              className="p-0.5 rounded hover:bg-current/10"
              onClick={(e) => {
                e.stopPropagation();
                removeNode(node.id);
              }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Ports */}
      <div className="px-3 py-2 space-y-1">
        {node.ports.inputs.map((port) => (
          <div key={port.id} className="flex items-center gap-2 text-[10px] text-current/70">
            <div
              data-port-id={port.id}
              data-port-type="input"
              data-node-id={node.id}
              className="w-2.5 h-2.5 rounded-full bg-current/40 border border-current/60 -ml-[21px] cursor-crosshair hover:scale-150 transition-transform"
            />
            {port.label}
          </div>
        ))}
        {node.ports.outputs.map((port) => (
          <div key={port.id} className="flex items-center justify-end gap-2 text-[10px] text-current/70">
            {port.label}
            <div
              data-port-id={port.id}
              data-port-type="output"
              data-node-id={node.id}
              className="w-2.5 h-2.5 rounded-full bg-current/40 border border-current/60 -mr-[21px] cursor-crosshair hover:scale-150 transition-transform"
              onMouseDown={(e) => {
                e.stopPropagation();
                onPortDragStart(port.id, e);
              }}
            />
          </div>
        ))}
      </div>

      {/* Component: show child nodes inside (collapsible) */}
      {isComponent && !collapsed && (
        <div className="px-3 pb-2">
          <div className="border border-current/10 rounded-lg bg-current/5 p-2 space-y-1.5 min-h-[40px]">
            {childNodes.length === 0 ? (
              <p className="text-[9px] text-current/40 text-center py-2">
                Drop blocks here to add to component
              </p>
            ) : (
              childNodes.map((child) => (
                <div
                  key={child.id}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px]",
                    NODE_COLORS[child.type]
                  )}
                >
                  <span className="w-3 h-3 flex items-center justify-center">
                    {NODE_ICONS[child.type]}
                  </span>
                  <span className="truncate font-medium">{child.label}</span>
                </div>
              ))
            )}
          </div>
          <p className="text-[9px] text-current/40 mt-1 text-center">
            {childNodes.length} block{childNodes.length !== 1 ? "s" : ""} inside
          </p>
        </div>
      )}

      {/* Component collapsed summary */}
      {isComponent && collapsed && childNodes.length > 0 && (
        <div className="px-3 pb-2">
          <p className="text-[9px] text-current/40 text-center">
            {childNodes.length} block{childNodes.length !== 1 ? "s" : ""} (collapsed)
          </p>
        </div>
      )}

      {/* Config preview (non-component) */}
      {!isComponent && configPreview && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-current/50 truncate font-mono">{configPreview}</p>
        </div>
      )}
    </div>
  );
}

function getConfigPreview(node: WorkflowNode): string | null {
  switch (node.type) {
    case "ai_response": return node.config.systemPrompt || null;
    case "api_call": return node.config.url ? `${node.config.method} ${node.config.url}` : null;
    case "js_function": return node.config.code ? `${node.config.code.substring(0, 40)}…` : null;
    case "email_sender": return node.config.to ? `→ ${node.config.to}` : null;
    case "db_query": return node.config.query ? node.config.query.substring(0, 40) : null;
    case "text_display": return node.config.text ? node.config.text.substring(0, 40) : null;
    case "button_input": return node.config.buttons ? `${node.config.buttons.length} buttons` : null;
    case "set_variable": return node.config.variableName ? `{{${node.config.variableName}}} = ${node.config.value}` : null;
    case "condition": return node.config.expression || null;
    case "component": return node.config.description || null;
    default: return null;
  }
}
