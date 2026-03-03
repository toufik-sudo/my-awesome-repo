import React, { useState, useCallback, useRef } from "react";
import { WorkflowProvider, useWorkflow } from "@/context/WorkflowContext";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { NodePalette } from "@/components/workflow/NodePalette";
import { NodeConfigPanel } from "@/components/workflow/NodeConfigPanel";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { WorkflowToolbar } from "@/components/workflow/WorkflowToolbar";
import { ExecutionLog } from "@/components/workflow/ExecutionLog";
import { Bot, Layout, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExecutionState } from "@/types/workflow";

type ViewMode = "builder" | "chat" | "split";

function AgentBuilderInner() {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const { workflow } = useWorkflow();
  const [execution, setExecution] = useState<ExecutionState>({
    status: "idle",
    currentNodeId: null,
    log: [],
  });
  const stopRef = useRef(false);

  const runWorkflow = useCallback(async () => {
    stopRef.current = false;
    setExecution({ status: "running", currentNodeId: null, log: [] });

    // Find start node
    const startNode = workflow.nodes.find((n) => n.type === "start");
    if (!startNode) {
      setExecution({ status: "error", currentNodeId: null, log: [{ nodeId: "", label: "Error", type: "end", output: "No start node found", timestamp: Date.now() }] });
      return;
    }

    let currentNodeId: string | null = startNode.id;
    const log: ExecutionState["log"] = [];

    while (currentNodeId && !stopRef.current) {
      const node = workflow.nodes.find((n) => n.id === currentNodeId);
      if (!node) break;

      setExecution((prev) => ({ ...prev, currentNodeId: node.id }));

      // Simulate execution
      let output = "";
      switch (node.type) {
        case "start": output = node.config.greeting || "Started"; break;
        case "user_input": output = `Waiting: "${node.config.prompt}"`; break;
        case "ai_response": output = `Model: ${node.config.model || "gemini-flash"}`; break;
        case "api_call": output = `${node.config.method} ${node.config.url || "(no url)"}`; break;
        case "condition": output = `Eval: ${node.config.expression || "(empty)"} → Yes`; break;
        case "action": output = `Run: ${node.config.functionName || "(unnamed)"}`; break;
        case "email_sender": output = `Send to: ${node.config.to || "(no recipient)"}`; break;
        case "webhook_trigger": output = `Listen: ${node.config.url || "(no url)"}`; break;
        case "db_query": output = `Query: ${node.config.query?.substring(0, 30) || "(empty)"}`; break;
        case "js_function": output = "Execute JS"; break;
        case "end": output = node.config.message || "Ended"; break;
      }

      const entry = { nodeId: node.id, label: node.label, type: node.type, output, timestamp: Date.now() };
      log.push(entry);
      setExecution((prev) => ({ ...prev, log: [...log] }));

      await new Promise((r) => setTimeout(r, 600));

      if (node.type === "end") break;

      // Follow first output connection (for condition, follow "true" port)
      const outPort = node.type === "condition"
        ? node.ports.outputs.find((p) => p.label === "Yes")
        : node.ports.outputs[0];

      if (!outPort) break;

      const conn = workflow.connections.find(
        (c) => c.fromNodeId === node.id && c.fromPortId === outPort.id
      );
      currentNodeId = conn?.toNodeId || null;
    }

    setExecution((prev) => ({
      ...prev,
      status: stopRef.current ? "idle" : "completed",
      currentNodeId: null,
    }));
  }, [workflow]);

  const stopWorkflow = useCallback(() => {
    stopRef.current = true;
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">Agent Builder</h1>
            <p className="text-[10px] text-muted-foreground">Visual AI workflow editor</p>
          </div>
        </div>

        <WorkflowToolbar execution={execution} onRun={runWorkflow} onStop={stopWorkflow} />

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(
            [
              { mode: "builder", icon: Layout, label: "Builder" },
              { mode: "split", icon: Bot, label: "Split" },
              { mode: "chat", icon: MessageSquare, label: "Chat" },
            ] as const
          ).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                viewMode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {viewMode !== "chat" && (
          <>
            <NodePalette />
            <div className="flex-1 flex flex-col relative">
              <WorkflowCanvas />
              <ExecutionLog execution={execution} />
            </div>
            <NodeConfigPanel />
          </>
        )}
        {viewMode !== "builder" && <ChatPreview />}
      </div>
    </div>
  );
}

export default function AgentBuilder() {
  return (
    <WorkflowProvider>
      <AgentBuilderInner />
    </WorkflowProvider>
  );
}
