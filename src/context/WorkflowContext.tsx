import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Workflow, WorkflowNode, Connection, NodeType, Position, GlobalVariable } from "@/types/workflow";
import { createNode } from "@/types/workflow";

const MAX_HISTORY = 50;

interface WorkflowContextType {
  workflow: Workflow;
  selectedNodeId: string | null;
  selectedNodeIds: Set<string>;
  selectNode: (id: string | null) => void;
  toggleSelectNode: (id: string) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  addNode: (type: NodeType, position: Position) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  removeNodes: (ids: string[]) => void;
  duplicateNodes: (ids: string[]) => void;
  moveNode: (id: string, position: Position) => void;
  addConnection: (conn: Omit<Connection, "id">) => void;
  removeConnection: (id: string) => void;
  canConnect: (fromNodeId: string, fromPortId: string, toNodeId: string, toPortId: string) => boolean;
  importWorkflow: (data: Workflow) => void;
  addGlobalVariable: (v: Omit<GlobalVariable, "id">) => void;
  updateGlobalVariable: (id: string, updates: Partial<GlobalVariable>) => void;
  removeGlobalVariable: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error("useWorkflow must be used inside WorkflowProvider");
  return ctx;
}

function defaultWorkflow(): Workflow {
  const startNode = createNode("start", { x: 100, y: 200 });
  const inputNode = createNode("user_input", { x: 400, y: 200 });
  const aiNode = createNode("ai_response", { x: 700, y: 200 });

  return {
    id: uuidv4(),
    name: "My Agent",
    nodes: [startNode, inputNode, aiNode],
    connections: [
      {
        id: uuidv4(),
        fromNodeId: startNode.id,
        fromPortId: startNode.ports.outputs[0].id,
        toNodeId: inputNode.id,
        toPortId: inputNode.ports.inputs[0].id,
      },
      {
        id: uuidv4(),
        fromNodeId: inputNode.id,
        fromPortId: inputNode.ports.outputs[0].id,
        toNodeId: aiNode.id,
        toPortId: aiNode.ports.inputs[0].id,
      },
    ],
    globalVariables: [],
  };
}

function cloneWorkflow(w: Workflow): Workflow {
  return JSON.parse(JSON.stringify(w));
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflow, setWorkflow] = useState<Workflow>(defaultWorkflow);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());

  const pastRef = useRef<Workflow[]>([]);
  const futureRef = useRef<Workflow[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0);

  const pushHistory = useCallback((current: Workflow) => {
    pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), cloneWorkflow(current)];
    futureRef.current = [];
    setHistoryVersion((v) => v + 1);
  }, []);

  const setWorkflowWithHistory = useCallback(
    (updater: (w: Workflow) => Workflow) => {
      setWorkflow((prev) => {
        pushHistory(prev);
        return updater(prev);
      });
    },
    [pushHistory]
  );

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    setWorkflow((prev) => {
      futureRef.current = [cloneWorkflow(prev), ...futureRef.current.slice(0, MAX_HISTORY - 1)];
      const restored = pastRef.current[pastRef.current.length - 1];
      pastRef.current = pastRef.current.slice(0, -1);
      setHistoryVersion((v) => v + 1);
      return restored;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    setWorkflow((prev) => {
      pastRef.current = [...pastRef.current, cloneWorkflow(prev)];
      const restored = futureRef.current[0];
      futureRef.current = futureRef.current.slice(1);
      setHistoryVersion((v) => v + 1);
      return restored;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      // Delete / Backspace for bulk delete
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeIds.size > 0) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
        e.preventDefault();
        removeNodes(Array.from(selectedNodeIds));
      }
      // Ctrl+D duplicate
      if ((e.metaKey || e.ctrlKey) && e.key === "d" && selectedNodeIds.size > 0) {
        e.preventDefault();
        duplicateNodes(Array.from(selectedNodeIds));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, selectedNodeIds]);

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
    setSelectedNodeIds(id ? new Set([id]) : new Set());
  }, []);

  const toggleSelectNode = useCallback((id: string) => {
    setSelectedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setSelectedNodeId(next.size === 1 ? Array.from(next)[0] : null);
      return next;
    });
  }, []);

  const selectMultiple = useCallback((ids: string[]) => {
    setSelectedNodeIds(new Set(ids));
    setSelectedNodeId(ids.length === 1 ? ids[0] : null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedNodeIds(new Set());
  }, []);

  const addNode = useCallback((type: NodeType, position: Position) => {
    const node = createNode(type, position);
    setWorkflowWithHistory((w) => ({ ...w, nodes: [...w.nodes, node] }));
    setSelectedNodeId(node.id);
    setSelectedNodeIds(new Set([node.id]));
  }, [setWorkflowWithHistory]);

  const updateNode = useCallback((id: string, updates: Partial<WorkflowNode>) => {
    setWorkflowWithHistory((w) => ({
      ...w,
      nodes: w.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  }, [setWorkflowWithHistory]);

  const removeNode = useCallback((id: string) => {
    setWorkflowWithHistory((w) => ({
      ...w,
      nodes: w.nodes.filter((n) => n.id !== id),
      connections: w.connections.filter((c) => c.fromNodeId !== id && c.toNodeId !== id),
    }));
    setSelectedNodeId((s) => (s === id ? null : s));
    setSelectedNodeIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }, [setWorkflowWithHistory]);

  const removeNodes = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setWorkflowWithHistory((w) => ({
      ...w,
      nodes: w.nodes.filter((n) => !idSet.has(n.id)),
      connections: w.connections.filter((c) => !idSet.has(c.fromNodeId) && !idSet.has(c.toNodeId)),
    }));
    setSelectedNodeId(null);
    setSelectedNodeIds(new Set());
  }, [setWorkflowWithHistory]);

  const duplicateNodes = useCallback((ids: string[]) => {
    setWorkflowWithHistory((w) => {
      const idMap = new Map<string, string>();
      const portMap = new Map<string, string>();
      const newNodes: WorkflowNode[] = [];

      for (const id of ids) {
        const node = w.nodes.find((n) => n.id === id);
        if (!node) continue;
        const newId = uuidv4();
        idMap.set(id, newId);
        const newNode: WorkflowNode = {
          ...JSON.parse(JSON.stringify(node)),
          id: newId,
          position: { x: node.position.x + 40, y: node.position.y + 40 },
          ports: {
            inputs: node.ports.inputs.map((p) => {
              const newPortId = `${uuidv4()}-${p.id.split("-").pop()}`;
              portMap.set(p.id, newPortId);
              return { ...p, id: newPortId };
            }),
            outputs: node.ports.outputs.map((p) => {
              const newPortId = `${uuidv4()}-${p.id.split("-").pop()}`;
              portMap.set(p.id, newPortId);
              return { ...p, id: newPortId };
            }),
          },
        };
        newNodes.push(newNode);
      }

      // Duplicate internal connections
      const newConns: Connection[] = [];
      for (const conn of w.connections) {
        if (idMap.has(conn.fromNodeId) && idMap.has(conn.toNodeId)) {
          newConns.push({
            id: uuidv4(),
            fromNodeId: idMap.get(conn.fromNodeId)!,
            fromPortId: portMap.get(conn.fromPortId) || conn.fromPortId,
            toNodeId: idMap.get(conn.toNodeId)!,
            toPortId: portMap.get(conn.toPortId) || conn.toPortId,
          });
        }
      }

      const newIds = newNodes.map((n) => n.id);
      setTimeout(() => {
        setSelectedNodeIds(new Set(newIds));
        setSelectedNodeId(newIds.length === 1 ? newIds[0] : null);
      }, 0);

      return {
        ...w,
        nodes: [...w.nodes, ...newNodes],
        connections: [...w.connections, ...newConns],
      };
    });
  }, [setWorkflowWithHistory]);

  const moveNode = useCallback((id: string, position: Position) => {
    setWorkflow((w) => ({
      ...w,
      nodes: w.nodes.map((n) => (n.id === id ? { ...n, position } : n)),
    }));
  }, []);

  const canConnect = useCallback(
    (fromNodeId: string, _fromPortId: string, toNodeId: string, _toPortId: string) => {
      if (fromNodeId === toNodeId) return false;
      return !workflow.connections.some(
        (c) => c.fromNodeId === fromNodeId && c.toNodeId === toNodeId
      );
    },
    [workflow.connections]
  );

  const addConnection = useCallback((conn: Omit<Connection, "id">) => {
    setWorkflowWithHistory((w) => ({
      ...w,
      connections: [...w.connections, { ...conn, id: uuidv4() }],
    }));
  }, [setWorkflowWithHistory]);

  const removeConnection = useCallback((id: string) => {
    setWorkflowWithHistory((w) => ({
      ...w,
      connections: w.connections.filter((c) => c.id !== id),
    }));
  }, [setWorkflowWithHistory]);

  const importWorkflow = useCallback((data: Workflow) => {
    if (data && data.nodes && data.connections) {
      setWorkflowWithHistory(() => ({ ...data, globalVariables: data.globalVariables || [] }));
      setSelectedNodeId(null);
      setSelectedNodeIds(new Set());
    }
  }, [setWorkflowWithHistory]);

  // Global variables
  const addGlobalVariable = useCallback((v: Omit<GlobalVariable, "id">) => {
    setWorkflowWithHistory((w) => ({
      ...w,
      globalVariables: [...(w.globalVariables || []), { ...v, id: uuidv4() }],
    }));
  }, [setWorkflowWithHistory]);

  const updateGlobalVariable = useCallback((id: string, updates: Partial<GlobalVariable>) => {
    setWorkflowWithHistory((w) => ({
      ...w,
      globalVariables: (w.globalVariables || []).map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  }, [setWorkflowWithHistory]);

  const removeGlobalVariable = useCallback((id: string) => {
    setWorkflowWithHistory((w) => ({
      ...w,
      globalVariables: (w.globalVariables || []).filter((v) => v.id !== id),
    }));
  }, [setWorkflowWithHistory]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  return (
    <WorkflowContext.Provider
      value={{
        workflow,
        selectedNodeId,
        selectedNodeIds,
        selectNode,
        toggleSelectNode,
        selectMultiple,
        clearSelection,
        addNode,
        updateNode,
        removeNode,
        removeNodes,
        duplicateNodes,
        moveNode,
        addConnection,
        removeConnection,
        canConnect,
        importWorkflow,
        addGlobalVariable,
        updateGlobalVariable,
        removeGlobalVariable,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}
