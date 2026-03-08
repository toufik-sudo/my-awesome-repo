import React, { useState, useCallback, useRef, useEffect } from "react";
import { WorkflowProvider, useWorkflow } from "@/context/WorkflowContext";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { NodePalette } from "@/components/workflow/NodePalette";
import { NodeConfigModal } from "@/components/workflow/NodeConfigModal";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { WorkflowToolbar } from "@/components/workflow/WorkflowToolbar";
import { ExecutionLog } from "@/components/workflow/ExecutionLog";
import { Bot, Layout, MessageSquare, Variable, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExecutionState, GlobalVariable } from "@/types/workflow";
import Swal from "sweetalert2";
import ReactDOM from "react-dom/client";
import { ChatAppearancePanel } from "@/components/workflow/ChatAppearancePanel";
import { WorkflowContext } from "@/context/WorkflowContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/context/I18nContext";

function VariablesModalButton() {
  const ctx = useWorkflow();
  const { t } = useI18n();

  const openModal = () => {
    const container = document.createElement("div");
    container.id = "swal-variables-root";

    Swal.fire({
      title: "",
      html: container,
      showConfirmButton: false,
      showCloseButton: true,
      width: 520,
      customClass: {
        popup: "!bg-card !border !border-border !rounded-2xl !shadow-2xl !p-0 !overflow-hidden",
        htmlContainer: "!m-0 !p-0",
        closeButton: "!text-muted-foreground hover:!text-foreground !outline-none !shadow-none",
      },
      background: "hsl(var(--card))",
      didOpen: () => {
        const root = ReactDOM.createRoot(container);
        root.render(
          <WorkflowContext.Provider value={ctx}>
            <VariablesContent />
          </WorkflowContext.Provider>
        );
        (container as any).__reactRoot = root;
      },
      willClose: () => {
        const root = (container as any).__reactRoot;
        if (root) root.unmount();
      },
    });
  };

  return (
    <button
      onClick={openModal}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={t("toolbar.variables")}
    >
      <Variable className="w-3.5 h-3.5" />
      {t("toolbar.variables")}
    </button>
  );
}

function VariablesContent() {
  const { workflow, addGlobalVariable, updateGlobalVariable, removeGlobalVariable } = useWorkflow();
  // Force re-renders
  const [, setTick] = useState(0);

  return (
    <div className="flex flex-col max-h-[60vh]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center"><Variable className="w-3.5 h-3.5 text-primary" /></div>
          <h2 className="text-sm font-bold text-foreground">{t("variables.title")}</h2>
        </div>
        <button
          onClick={() => { addGlobalVariable({ name: "new_var", type: "string", defaultValue: "", description: "" }); setTick(t => t + 1); }}
          className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
        >{t("variables.add")}</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {(!workflow.globalVariables || workflow.globalVariables.length === 0) && (
          <p className="text-xs text-muted-foreground text-center py-6">{t("variables.empty")}</p>
        )}
        {(workflow.globalVariables || []).map((v) => (
          <div key={v.id} className="bg-secondary/30 border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Variable className="w-3.5 h-3.5 text-node-variable shrink-0" />
              <input className="flex-1 bg-transparent text-xs font-mono font-medium text-foreground focus:outline-none" value={v.name} onChange={(e) => updateGlobalVariable(v.id, { name: e.target.value })} placeholder="variable_name" />
              <select className="bg-muted border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground focus:outline-none" value={v.type} onChange={(e) => updateGlobalVariable(v.id, { type: e.target.value as GlobalVariable["type"] })}>
                <option value="string">string</option><option value="number">number</option><option value="boolean">boolean</option><option value="json">json</option>
              </select>
              <button onClick={() => { removeGlobalVariable(v.id); setTick(t => t + 1); }} className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                <span className="text-xs">✕</span>
              </button>
            </div>
            <input className="w-full bg-muted border border-border rounded px-2.5 py-1.5 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={v.defaultValue} onChange={(e) => updateGlobalVariable(v.id, { defaultValue: e.target.value })} placeholder="Default value" />
            <input className="w-full bg-transparent text-[10px] text-muted-foreground focus:outline-none" value={v.description} onChange={(e) => updateGlobalVariable(v.id, { description: e.target.value })} placeholder="Description..." />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatStyleModalButton() {
  const ctx = useWorkflow();
  const { t } = useI18n();

  const openModal = () => {
    const container = document.createElement("div");

    Swal.fire({
      title: "",
      html: container,
      showConfirmButton: false,
      showCloseButton: true,
      width: 520,
      customClass: {
        popup: "!bg-card !border !border-border !rounded-2xl !shadow-2xl !p-0 !overflow-hidden",
        htmlContainer: "!m-0 !p-0",
        closeButton: "!text-muted-foreground hover:!text-foreground !outline-none !shadow-none",
      },
      background: "hsl(var(--card))",
      didOpen: () => {
        const root = ReactDOM.createRoot(container);
        root.render(
          <WorkflowContext.Provider value={ctx}>
            <div className="flex flex-col max-h-[70vh]">
              <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
                <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5 text-accent" /></div>
                <h2 className="text-sm font-bold text-foreground">{t("toolbar.chatStyle")}</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <ChatAppearancePanel />
              </div>
            </div>
          </WorkflowContext.Provider>
        );
        (container as any).__reactRoot = root;
      },
      willClose: () => {
        const root = (container as any).__reactRoot;
        if (root) root.unmount();
      },
    });
  };

  return (
    <button
      onClick={openModal}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={t("toolbar.chatStyle")}
    >
      <MessageCircle className="w-3.5 h-3.5" />
      {t("toolbar.chatStyle")}
    </button>
  );
}
type ViewMode = "builder" | "chat" | "split";

function AgentBuilderInner() {
  const { t, dir } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [chatMinimized, setChatMinimized] = useState(false);
  const [configModalNodeId, setConfigModalNodeId] = useState<string | null>(null);
  const { workflow, selectedNodeId, selectedNodeIds, selectNode } = useWorkflow();
  const [execution, setExecution] = useState<ExecutionState>({
    status: "idle",
    currentNodeId: null,
    log: [],
  });
  const stopRef = useRef(false);

  const runWorkflow = useCallback(async () => {
    stopRef.current = false;
    setExecution({ status: "running", currentNodeId: null, log: [] });

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

      let output = "";
      switch (node.type) {
        case "start": output = node.config.greeting || "Started"; break;
        case "user_input": output = `Waiting: "${node.config.prompt}"`; break;
        case "ai_response": output = `Model: ${node.config.model || "gemini-flash"}`; break;
        case "api_call": {
          const isAsync = node.config.async ?? true;
          const timeout = node.config.timeout ?? 30000;
          output = `${isAsync ? "async " : ""}${node.config.method} ${node.config.url || "(no url)"} (${timeout}ms timeout)`;
          if (node.config.retry) output += ` retry:${node.config.retryCount ?? 3}`;
          break;
        }
        case "condition": output = `Eval: ${node.config.expression || "(empty)"} → Yes`; break;
        case "action": output = `Run: ${node.config.functionName || "(unnamed)"}`; break;
        case "email_sender": output = `[${node.config.provider || "resend"}] Send to: ${node.config.to || "(no recipient)"}`; break;
        case "webhook_trigger": output = `Listen: ${node.config.url || "(no url)"}`; break;
        case "db_query": output = `Query: ${node.config.query?.substring(0, 30) || "(empty)"}`; break;
        case "js_function": {
          const mode = node.config.execMode || "async";
          output = `[${mode}] JS`;
          if (node.config.outputVar) output += ` → {{${node.config.outputVar}}}`;
          break;
        }
        case "text_display": output = `Display: ${(node.config.text || "").substring(0, 30)}`; break;
        case "button_input": output = `Buttons: ${(node.config.buttons || []).map((b: any) => b.label).join(", ")}`; break;
        case "set_variable": output = `Set {{${node.config.variableName || "?"}}} = ${node.config.value || ""}`; break;
        case "end": output = node.config.message || "Ended"; break;
      }

      const entry = { nodeId: node.id, label: node.label, type: node.type, output, timestamp: Date.now() };
      log.push(entry);
      setExecution((prev) => ({ ...prev, log: [...log] }));

      await new Promise((r) => setTimeout(r, 600));

      if (node.type === "end") break;

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

  // Close config modal when node is deselected
  useEffect(() => {
    if (configModalNodeId && !workflow.nodes.find(n => n.id === configModalNodeId)) {
      setConfigModalNodeId(null);
    }
  }, [workflow.nodes, configModalNodeId]);

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    selectNode(nodeId);
    setConfigModalNodeId(nodeId);
  }, [selectNode]);

  const handleCloseConfigModal = useCallback(() => {
    setConfigModalNodeId(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background" dir={dir}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-2 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center shadow-lg shadow-primary/10">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">{t("app.title")}</h1>
            <p className="text-[10px] text-muted-foreground">{t("app.subtitle")}</p>
          </div>
        </div>

        <WorkflowToolbar execution={execution} onRun={runWorkflow} onStop={stopWorkflow} />

        <div className="flex items-center gap-2">
          <VariablesModalButton />
          <ChatStyleModalButton />

          <div className="w-px h-5 bg-border" />

          {/* View mode toggle */}
          <div className="flex items-center gap-0.5 bg-muted/80 rounded-xl p-0.5 border border-border">
            {(
              [
                { mode: "builder", icon: Layout, label: t("view.builder") },
                { mode: "split", icon: Bot, label: t("view.split") },
                { mode: "chat", icon: MessageSquare, label: t("view.chat") },
              ] as const
            ).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  viewMode === mode
                    ? "bg-primary/15 text-primary shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border" />

          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {viewMode !== "chat" && (
          <>
            <NodePalette />
            <div className="flex-1 flex flex-col relative">
              <WorkflowCanvas onNodeDoubleClick={handleNodeDoubleClick} />
              <ExecutionLog execution={execution} />
            </div>
          </>
        )}
        {viewMode !== "builder" && (
          chatMinimized ? (
            <button
              onClick={() => setChatMinimized(false)}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary shadow-xl shadow-primary/30 flex items-center justify-center text-primary-foreground hover:scale-110 active:scale-95 transition-transform"
              title="Open chat"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          ) : (
            <ChatPreview onMinimize={() => setChatMinimized(true)} />
          )
        )}
      </div>

      {/* Node config modal — opens on double-click only */}
      {configModalNodeId && (
        <NodeConfigModal nodeId={configModalNodeId} onClose={handleCloseConfigModal} />
      )}
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
