import React, { useState } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { X, Plus, Trash2, Variable, MessageCircle } from "lucide-react";
import type { GlobalVariable } from "@/types/workflow";
import { ChatAppearancePanel } from "./ChatAppearancePanel";

export function NodeConfigPanel() {
  const {
    workflow, selectedNodeIds, selectNode,
    addGlobalVariable, updateGlobalVariable, removeGlobalVariable,
  } = useWorkflow();
  const [panelTab, setPanelTab] = useState<"variables" | "appearance">("variables");

  const multiCount = selectedNodeIds.size;

  // Multi-select info panel
  if (multiCount > 1) {
    return (
      <div className="w-72 bg-card border-l border-border flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {multiCount} Nodes Selected
          </h2>
          <button onClick={() => selectNode(null)} className="p-1 rounded hover:bg-muted">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-4 text-xs text-muted-foreground space-y-2">
          <p><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Delete</kbd> to remove selected</p>
          <p><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+D</kbd> to duplicate selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col">
      {/* Tab switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setPanelTab("variables")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${panelTab === "variables" ? "text-foreground border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Variable className="w-3 h-3" /> Variables
        </button>
        <button
          onClick={() => setPanelTab("appearance")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${panelTab === "appearance" ? "text-foreground border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
        >
          <MessageCircle className="w-3 h-3" /> Chat Style
        </button>
      </div>

      {panelTab === "appearance" ? (
        <div className="flex-1 overflow-y-auto p-4">
          <ChatAppearancePanel />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Global Variables
            </h2>
            <button
              onClick={() => addGlobalVariable({ name: "new_var", type: "string", defaultValue: "", description: "" })}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Add variable"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {(!workflow.globalVariables || workflow.globalVariables.length === 0) && (
              <p className="text-[10px] text-muted-foreground px-1">
                No global variables yet. Add variables to share data across nodes using <code className="bg-muted px-1 rounded">{"{{var_name}}"}</code> syntax.
              </p>
            )}
            {(workflow.globalVariables || []).map((v) => (
              <div key={v.id} className="bg-secondary/30 border border-border rounded-lg p-2.5 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Variable className="w-3 h-3 text-node-variable" />
                  <input
                    className="flex-1 bg-transparent text-xs font-mono font-medium text-foreground focus:outline-none"
                    value={v.name}
                    onChange={(e) => updateGlobalVariable(v.id, { name: e.target.value })}
                    placeholder="variable_name"
                  />
                  <select
                    className="bg-muted border border-border rounded px-1 py-0.5 text-[10px] text-foreground focus:outline-none"
                    value={v.type}
                    onChange={(e) => updateGlobalVariable(v.id, { type: e.target.value as GlobalVariable["type"] })}
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="json">json</option>
                  </select>
                  <button
                    onClick={() => removeGlobalVariable(v.id)}
                    className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <input
                  className="w-full bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={v.defaultValue}
                  onChange={(e) => updateGlobalVariable(v.id, { defaultValue: e.target.value })}
                  placeholder="Default value"
                />
                <input
                  className="w-full bg-transparent text-[10px] text-muted-foreground focus:outline-none"
                  value={v.description}
                  onChange={(e) => updateGlobalVariable(v.id, { description: e.target.value })}
                  placeholder="Description..."
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
