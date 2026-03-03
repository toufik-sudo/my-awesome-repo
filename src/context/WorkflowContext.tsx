import React, { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Workflow, WorkflowNode, Connection, NodeType, Position } from "@/types/workflow";
import { createNode } from "@/types/workflow";

const MAX_HISTORY = 50;

interface WorkflowContextType {
  workflow: Workflow;
  selectedNodeId: string | null;
  selectNode: (id: string | null) => void;
  addNode: (type: NodeType, position: Position) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, position: Position) => void;
  addConnection: (conn: Omit<Connection, "id">) => void;
  removeConnection: (id: string) => void;
  canConnect: (fromNodeId: string, fromPortId: string, toNodeId: string, toPortId: string) => boolean;
  importWorkflow: (data: Workflow) => void;
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
  };
}

function cloneWorkflow(w: Workflow): Workflow {
  return JSON.parse(JSON.stringify(w));
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflow, setWorkflow] = useState<Workflow>(defaultWorkflow);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // History stacks store snapshots
  const pastRef = useRef<Workflow[]>([]);
  const futureRef = useRef<Workflow[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0); // triggers re-render for canUndo/canRedo

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

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const selectNode = useCallback((id: string | null) => setSelectedNodeId(id), []);

  const addNode = useCallback((type: NodeType, position: Position) => {
    const node = createNode(type, position);
    setWorkflowWithHistory((w) => ({ ...w, nodes: [...w.nodes, node] }));
    setSelectedNodeId(node.id);
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
  }, [setWorkflowWithHistory]);

  // moveNode does NOT push history (too frequent during drag)
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
      setWorkflowWithHistory(() => data);
      setSelectedNodeId(null);
    }
  }, [setWorkflowWithHistory]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  return (
    <WorkflowContext.Provider
      value={{
        workflow,
        selectedNodeId,
        selectNode,
        addNode,
        updateNode,
        removeNode,
        moveNode,
        addConnection,
        removeConnection,
        canConnect,
        importWorkflow,
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
