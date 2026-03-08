import React, { useRef } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { useI18n } from "@/context/I18nContext";
import { Download, Upload, Play, Square, Undo2, Redo2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplatePicker } from "./TemplatePicker";
import { toast } from "sonner";
import type { ExecutionState } from "@/types/workflow";

interface Props {
  execution: ExecutionState;
  onRun: () => void;
  onStop: () => void;
}

export function WorkflowToolbar({ execution, onRun, onStop }: Props) {
  const { workflow, importWorkflow, undo, redo, canUndo, canRedo } = useWorkflow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflow.name || "workflow"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        importWorkflow(data);
        toast.success("Workflow imported successfully");
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSave = () => {
    try {
      const json = JSON.stringify(workflow);
      localStorage.setItem("agent-builder-saved-workflow", json);
      toast.success("Workflow saved", { description: `"${workflow.name}" saved to local storage` });
    } catch (err) {
      toast.error("Failed to save workflow");
    }
  };

  const isRunning = execution.status === "running";

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <TemplatePicker />

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={handleSave}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
        title="Save workflow"
      >
        <Save className="w-3.5 h-3.5" />
        Save
      </button>

      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Export as JSON"
      >
        <Download className="w-3.5 h-3.5" />
        Export
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Import JSON"
      >
        <Upload className="w-3.5 h-3.5" />
        Import
      </button>
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      <div className="w-px h-5 bg-border mx-1" />

      {isRunning ? (
        <button
          onClick={onStop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
        >
          <Square className="w-3.5 h-3.5" />
          Stop
        </button>
      ) : (
        <button
          onClick={onRun}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
            "bg-success/20 text-success hover:bg-success/30"
          )}
        >
          <Play className="w-3.5 h-3.5" />
          Run
        </button>
      )}

      {execution.status === "running" && execution.currentNodeId && (
        <span className="text-[10px] text-warning animate-pulse ml-1">Executing…</span>
      )}
      {execution.status === "completed" && (
        <span className="text-[10px] text-success ml-1">✓ Done</span>
      )}
      {execution.status === "error" && (
        <span className="text-[10px] text-destructive ml-1">✗ Error</span>
      )}
    </div>
  );
}
