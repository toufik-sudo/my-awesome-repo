import React from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { cn } from "@/lib/utils";
import { NODE_ICONS, NODE_COLORS } from "./nodeConfig";
import { X } from "lucide-react";
import type { WorkflowNode } from "@/types/workflow";

interface Props {
  node: WorkflowNode;
  onDragStart: (e: React.MouseEvent) => void;
  onPortDragStart: (portId: string, e: React.MouseEvent) => void;
}

export function WorkflowNodeCard({ node, onDragStart, onPortDragStart }: Props) {
  const { selectedNodeId, selectNode, removeNode } = useWorkflow();
  const isSelected = selectedNodeId === node.id;

  return (
    <div
      className={cn(
        "absolute group select-none",
        "w-52 rounded-xl border-2 backdrop-blur-sm transition-shadow",
        NODE_COLORS[node.type],
        isSelected && "ring-2 ring-ring shadow-lg shadow-primary/20"
      )}
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={(e) => {
        selectNode(node.id);
        onDragStart(e);
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-current/10">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-current/10">
          {NODE_ICONS[node.type]}
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase flex-1 truncate">
          {node.label}
        </span>
        {node.type !== "start" && (
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-current/10"
            onClick={(e) => {
              e.stopPropagation();
              removeNode(node.id);
            }}
          >
            <X className="w-3 h-3" />
          </button>
        )}
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

      {/* Config preview */}
      {node.type === "ai_response" && node.config.systemPrompt && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-current/50 truncate font-mono">
            {node.config.systemPrompt}
          </p>
        </div>
      )}
      {node.type === "api_call" && node.config.url && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-current/50 truncate font-mono">
            {node.config.method} {node.config.url}
          </p>
        </div>
      )}
      {node.type === "js_function" && node.config.code && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-current/50 truncate font-mono">
            {node.config.code.substring(0, 40)}…
          </p>
        </div>
      )}
      {node.type === "email_sender" && node.config.to && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-current/50 truncate font-mono">
            → {node.config.to}
          </p>
        </div>
      )}
      {node.type === "db_query" && node.config.query && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-current/50 truncate font-mono">
            {node.config.query.substring(0, 40)}
          </p>
        </div>
      )}
    </div>
  );
}
