import React, { useState } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { X, Sparkles, Plus, Trash2, Variable } from "lucide-react";
import { NODE_EXAMPLES } from "@/types/workflow";
import type { GlobalVariable } from "@/types/workflow";

export function NodeConfigPanel() {
  const {
    workflow, selectedNodeId, selectedNodeIds, selectNode, updateNode,
    addGlobalVariable, updateGlobalVariable, removeGlobalVariable,
  } = useWorkflow();
  const node = workflow.nodes.find((n) => n.id === selectedNodeId);
  const [showVars, setShowVars] = useState(false);

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

  if (!node) {
    return (
      <div className="w-72 bg-card border-l border-border flex flex-col">
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
      </div>
    );
  }

  const updateConfig = (key: string, value: any) => {
    updateNode(node.id, { config: { ...node.config, [key]: value } });
  };

  const examples = NODE_EXAMPLES[node.type] || [];

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Configure
        </h2>
        <button onClick={() => selectNode(null)} className="p-1 rounded hover:bg-muted">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label */}
        <Field label="Label">
          <input
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={node.label}
            onChange={(e) => updateNode(node.id, { label: e.target.value })}
          />
        </Field>

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3 h-3 text-warning" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Examples</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => updateNode(node.id, { config: { ...node.config, ...ex.config } })}
                  className="px-2 py-1 rounded-md bg-warning/10 border border-warning/30 text-[10px] font-medium text-warning hover:bg-warning/20 transition-colors"
                >
                  {ex.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type-specific config */}
        {node.type === "start" && (
          <Field label="Greeting Message">
            <textarea
              className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
              value={node.config.greeting || ""}
              onChange={(e) => updateConfig("greeting", e.target.value)}
            />
          </Field>
        )}

        {node.type === "ai_response" && (
          <>
            <Field label="System Prompt">
              <textarea
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24 font-mono"
                value={node.config.systemPrompt || ""}
                onChange={(e) => updateConfig("systemPrompt", e.target.value)}
              />
            </Field>
            <Field label="Streaming">
              <label className="flex items-center gap-2 text-xs text-foreground">
                <input type="checkbox" checked={node.config.stream ?? true} onChange={(e) => updateConfig("stream", e.target.checked)} className="rounded border-border" />
                Enable streaming response
              </label>
            </Field>
          </>
        )}

        {node.type === "api_call" && (
          <>
            <Field label="Method">
              <select className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.method || "GET"} onChange={(e) => updateConfig("method", e.target.value)}>
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="URL">
              <input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="https://api.example.com/..." value={node.config.url || ""} onChange={(e) => updateConfig("url", e.target.value)} />
            </Field>
            <Field label="Request Body (JSON)">
              <textarea className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20 font-mono" placeholder='{"key": "value"}' value={node.config.body || ""} onChange={(e) => updateConfig("body", e.target.value)} />
            </Field>
          </>
        )}

        {node.type === "condition" && (
          <Field label="Expression">
            <input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="e.g. intent === 'buy'" value={node.config.expression || ""} onChange={(e) => updateConfig("expression", e.target.value)} />
          </Field>
        )}

        {node.type === "action" && (
          <Field label="Function Name">
            <input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="e.g. sendEmail" value={node.config.functionName || ""} onChange={(e) => updateConfig("functionName", e.target.value)} />
          </Field>
        )}

        {node.type === "user_input" && (
          <>
            <Field label="Prompt Text">
              <input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.prompt || ""} onChange={(e) => updateConfig("prompt", e.target.value)} />
            </Field>
            <Field label="Speech-to-Text">
              <label className="flex items-center gap-2 text-xs text-foreground">
                <input type="checkbox" checked={node.config.enableSTT ?? true} onChange={(e) => updateConfig("enableSTT", e.target.checked)} className="rounded border-border" />
                Enable voice input
              </label>
            </Field>
          </>
        )}

        {node.type === "end" && (
          <Field label="Goodbye Message">
            <textarea className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20" value={node.config.message || ""} onChange={(e) => updateConfig("message", e.target.value)} />
          </Field>
        )}

        {node.type === "email_sender" && (
          <>
            <Field label="To"><input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="recipient@example.com" value={node.config.to || ""} onChange={(e) => updateConfig("to", e.target.value)} /></Field>
            <Field label="From"><input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="noreply@yourapp.com" value={node.config.from || ""} onChange={(e) => updateConfig("from", e.target.value)} /></Field>
            <Field label="Subject"><input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.subject || ""} onChange={(e) => updateConfig("subject", e.target.value)} /></Field>
            <Field label="Body"><textarea className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24" value={node.config.body || ""} onChange={(e) => updateConfig("body", e.target.value)} /></Field>
          </>
        )}

        {node.type === "webhook_trigger" && (
          <>
            <Field label="Webhook URL"><input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="https://your-webhook-url.com/hook" value={node.config.url || ""} onChange={(e) => updateConfig("url", e.target.value)} /></Field>
            <Field label="Method"><select className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.method || "POST"} onChange={(e) => updateConfig("method", e.target.value)}>{["POST", "GET", "PUT"].map((m) => <option key={m}>{m}</option>)}</select></Field>
            <Field label="Secret"><input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" type="password" placeholder="Optional webhook secret" value={node.config.secret || ""} onChange={(e) => updateConfig("secret", e.target.value)} /></Field>
          </>
        )}

        {node.type === "db_query" && (
          <>
            <Field label="Query Type"><select className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.type || "select"} onChange={(e) => updateConfig("type", e.target.value)}>{["select", "insert", "update", "delete", "raw"].map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Query"><textarea className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24 font-mono" placeholder="SELECT * FROM users WHERE id = $1" value={node.config.query || ""} onChange={(e) => updateConfig("query", e.target.value)} /></Field>
            <Field label="Connection String"><input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" type="password" placeholder="postgres://..." value={node.config.connectionString || ""} onChange={(e) => updateConfig("connectionString", e.target.value)} /></Field>
          </>
        )}

        {node.type === "js_function" && (
          <Field label="JavaScript Code">
            <textarea className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-36 font-mono" placeholder={"// input is available as `data`\nreturn data;"} value={node.config.code || ""} onChange={(e) => updateConfig("code", e.target.value)} />
          </Field>
        )}

        {node.type === "text_display" && (
          <>
            <Field label="Display Text">
              <textarea className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24" placeholder="Hello {{user_name}}!" value={node.config.text || ""} onChange={(e) => updateConfig("text", e.target.value)} />
            </Field>
            <Field label="Format">
              <select className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.format || "markdown"} onChange={(e) => updateConfig("format", e.target.value)}>
                <option value="markdown">Markdown</option>
                <option value="plain">Plain Text</option>
                <option value="html">HTML</option>
              </select>
            </Field>
          </>
        )}

        {node.type === "button_input" && (
          <>
            <Field label="Prompt">
              <input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.prompt || ""} onChange={(e) => updateConfig("prompt", e.target.value)} />
            </Field>
            <Field label="Buttons">
              <div className="space-y-1.5">
                {(node.config.buttons || []).map((btn: { label: string; value: string }, i: number) => (
                  <div key={i} className="flex gap-1.5">
                    <input
                      className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={btn.label}
                      onChange={(e) => {
                        const newBtns = [...node.config.buttons];
                        newBtns[i] = { ...newBtns[i], label: e.target.value };
                        updateConfig("buttons", newBtns);
                      }}
                      placeholder="Label"
                    />
                    <input
                      className="w-16 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={btn.value}
                      onChange={(e) => {
                        const newBtns = [...node.config.buttons];
                        newBtns[i] = { ...newBtns[i], value: e.target.value };
                        updateConfig("buttons", newBtns);
                      }}
                      placeholder="value"
                    />
                    <button
                      onClick={() => {
                        const newBtns = node.config.buttons.filter((_: any, j: number) => j !== i);
                        updateConfig("buttons", newBtns);
                      }}
                      className="p-0.5 rounded text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => updateConfig("buttons", [...(node.config.buttons || []), { label: "New", value: "new" }])}
                  className="text-[10px] text-primary hover:text-primary/80 font-medium"
                >
                  + Add button
                </button>
              </div>
            </Field>
          </>
        )}

        {node.type === "set_variable" && (
          <>
            <Field label="Variable Name">
              <input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="user_name" value={node.config.variableName || ""} onChange={(e) => updateConfig("variableName", e.target.value)} />
            </Field>
            <Field label="Value">
              <input className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono" placeholder="{{input}}" value={node.config.value || ""} onChange={(e) => updateConfig("value", e.target.value)} />
            </Field>
            <Field label="Operation">
              <select className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={node.config.operation || "set"} onChange={(e) => updateConfig("operation", e.target.value)}>
                <option value="set">Set</option>
                <option value="append">Append</option>
                <option value="increment">Increment</option>
                <option value="toggle">Toggle</option>
              </select>
            </Field>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
