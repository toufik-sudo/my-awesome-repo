import React from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { X } from "lucide-react";

export function NodeConfigPanel() {
  const { workflow, selectedNodeId, selectNode, updateNode } = useWorkflow();
  const node = workflow.nodes.find((n) => n.id === selectedNodeId);

  if (!node) return null;

  const updateConfig = (key: string, value: any) => {
    updateNode(node.id, { config: { ...node.config, [key]: value } });
  };

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
                <input
                  type="checkbox"
                  checked={node.config.stream ?? true}
                  onChange={(e) => updateConfig("stream", e.target.checked)}
                  className="rounded border-border"
                />
                Enable streaming response
              </label>
            </Field>
          </>
        )}

        {node.type === "api_call" && (
          <>
            <Field label="Method">
              <select
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={node.config.method || "GET"}
                onChange={(e) => updateConfig("method", e.target.value)}
              >
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="URL">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                placeholder="https://api.example.com/..."
                value={node.config.url || ""}
                onChange={(e) => updateConfig("url", e.target.value)}
              />
            </Field>
            <Field label="Request Body (JSON)">
              <textarea
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20 font-mono"
                placeholder='{"key": "value"}'
                value={node.config.body || ""}
                onChange={(e) => updateConfig("body", e.target.value)}
              />
            </Field>
          </>
        )}

        {node.type === "condition" && (
          <Field label="Expression">
            <input
              className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              placeholder="e.g. intent === 'buy'"
              value={node.config.expression || ""}
              onChange={(e) => updateConfig("expression", e.target.value)}
            />
          </Field>
        )}

        {node.type === "action" && (
          <Field label="Function Name">
            <input
              className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              placeholder="e.g. sendEmail"
              value={node.config.functionName || ""}
              onChange={(e) => updateConfig("functionName", e.target.value)}
            />
          </Field>
        )}

        {node.type === "user_input" && (
          <>
            <Field label="Prompt Text">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={node.config.prompt || ""}
                onChange={(e) => updateConfig("prompt", e.target.value)}
              />
            </Field>
            <Field label="Speech-to-Text">
              <label className="flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={node.config.enableSTT ?? true}
                  onChange={(e) => updateConfig("enableSTT", e.target.checked)}
                  className="rounded border-border"
                />
                Enable voice input
              </label>
            </Field>
          </>
        )}

        {node.type === "end" && (
          <Field label="Goodbye Message">
            <textarea
              className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
              value={node.config.message || ""}
              onChange={(e) => updateConfig("message", e.target.value)}
            />
          </Field>
        )}

        {node.type === "email_sender" && (
          <>
            <Field label="To">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                placeholder="recipient@example.com"
                value={node.config.to || ""}
                onChange={(e) => updateConfig("to", e.target.value)}
              />
            </Field>
            <Field label="From">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                placeholder="noreply@yourapp.com"
                value={node.config.from || ""}
                onChange={(e) => updateConfig("from", e.target.value)}
              />
            </Field>
            <Field label="Subject">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={node.config.subject || ""}
                onChange={(e) => updateConfig("subject", e.target.value)}
              />
            </Field>
            <Field label="Body">
              <textarea
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24"
                value={node.config.body || ""}
                onChange={(e) => updateConfig("body", e.target.value)}
              />
            </Field>
          </>
        )}

        {node.type === "webhook_trigger" && (
          <>
            <Field label="Webhook URL">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                placeholder="https://your-webhook-url.com/hook"
                value={node.config.url || ""}
                onChange={(e) => updateConfig("url", e.target.value)}
              />
            </Field>
            <Field label="Method">
              <select
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={node.config.method || "POST"}
                onChange={(e) => updateConfig("method", e.target.value)}
              >
                {["POST", "GET", "PUT"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Secret">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                type="password"
                placeholder="Optional webhook secret"
                value={node.config.secret || ""}
                onChange={(e) => updateConfig("secret", e.target.value)}
              />
            </Field>
          </>
        )}

        {node.type === "db_query" && (
          <>
            <Field label="Query Type">
              <select
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={node.config.type || "select"}
                onChange={(e) => updateConfig("type", e.target.value)}
              >
                {["select", "insert", "update", "delete", "raw"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Query">
              <textarea
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-24 font-mono"
                placeholder="SELECT * FROM users WHERE id = $1"
                value={node.config.query || ""}
                onChange={(e) => updateConfig("query", e.target.value)}
              />
            </Field>
            <Field label="Connection String">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                type="password"
                placeholder="postgres://..."
                value={node.config.connectionString || ""}
                onChange={(e) => updateConfig("connectionString", e.target.value)}
              />
            </Field>
          </>
        )}

        {node.type === "js_function" && (
          <Field label="JavaScript Code">
            <textarea
              className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-36 font-mono"
              placeholder={"// input is available as `data`\nreturn data;"}
              value={node.config.code || ""}
              onChange={(e) => updateConfig("code", e.target.value)}
            />
          </Field>
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
