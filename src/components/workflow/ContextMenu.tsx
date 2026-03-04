import React from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { Trash2, Copy, Unlink, Box, Scissors } from "lucide-react";

export interface ContextMenuState {
  x: number;
  y: number;
  type: "node" | "connection";
  targetId: string;
  /** For multi-node context menu */
  multiNodeIds?: string[];
}

interface Props {
  menu: ContextMenuState;
  onClose: () => void;
}

export function ContextMenu({ menu, onClose }: Props) {
  const {
    removeNode, removeNodes, duplicateNodes, removeConnection,
    workflow, selectedNodeIds, addNodeToComponent, removeNodeFromComponent,
    groupIntoComponent,
  } = useWorkflow();

  const items: { label: string; icon: React.ReactNode; action: () => void; danger?: boolean; disabled?: boolean }[] = [];

  if (menu.type === "node") {
    const ids = menu.multiNodeIds && menu.multiNodeIds.length > 1 ? menu.multiNodeIds : [menu.targetId];
    const node = workflow.nodes.find((n) => n.id === menu.targetId);
    const isStart = node?.type === "start";
    const isInsideComponent = !!node?.parentComponentId;

    items.push({
      label: ids.length > 1 ? `Duplicate ${ids.length} nodes` : "Duplicate",
      icon: <Copy className="w-3.5 h-3.5" />,
      action: () => duplicateNodes(ids),
    });

    if (ids.length > 1) {
      items.push({
        label: `Group ${ids.length} into Component`,
        icon: <Box className="w-3.5 h-3.5" />,
        action: () => groupIntoComponent(ids),
      });
    }

    if (isInsideComponent && node?.parentComponentId) {
      items.push({
        label: "Remove from Component",
        icon: <Scissors className="w-3.5 h-3.5" />,
        action: () => removeNodeFromComponent(menu.targetId),
      });
    }

    // Disconnect: remove all connections to/from this node
    const hasConnections = workflow.connections.some(
      (c) => ids.includes(c.fromNodeId) || ids.includes(c.toNodeId)
    );
    if (hasConnections) {
      items.push({
        label: "Disconnect all",
        icon: <Unlink className="w-3.5 h-3.5" />,
        action: () => {
          workflow.connections
            .filter((c) => ids.includes(c.fromNodeId) || ids.includes(c.toNodeId))
            .forEach((c) => removeConnection(c.id));
        },
      });
    }

    if (!isStart) {
      items.push({
        label: ids.length > 1 ? `Delete ${ids.length} nodes` : "Delete",
        icon: <Trash2 className="w-3.5 h-3.5" />,
        action: () => (ids.length > 1 ? removeNodes(ids) : removeNode(menu.targetId)),
        danger: true,
      });
    }
  }

  if (menu.type === "connection") {
    const conn = workflow.connections.find((c) => c.id === menu.targetId);
    const fromNode = conn ? workflow.nodes.find((n) => n.id === conn.fromNodeId) : null;
    const toNode = conn ? workflow.nodes.find((n) => n.id === conn.toNodeId) : null;

    items.push({
      label: `Delete connection${fromNode && toNode ? ` (${fromNode.label} → ${toNode.label})` : ""}`,
      icon: <Trash2 className="w-3.5 h-3.5" />,
      action: () => removeConnection(menu.targetId),
      danger: true,
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      {/* Menu */}
      <div
        className="fixed z-50 min-w-[180px] rounded-lg border border-border bg-popover shadow-xl py-1 animate-in fade-in-0 zoom-in-95"
        style={{ left: menu.x, top: menu.y }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            disabled={item.disabled}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors
              ${item.danger ? "text-destructive hover:bg-destructive/10" : "text-popover-foreground hover:bg-accent"}
              ${item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={() => { item.action(); onClose(); }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
