import React, { useState, useCallback, useEffect } from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { X, Sparkles, Plus, Trash2, Variable, ChevronDown, ChevronRight, Image, Film, Mic, MicOff, Key, Globe } from "lucide-react";
import { NODE_EXAMPLES } from "@/types/workflow";
import { CodeEditor } from "./CodeEditor";
import { motion, AnimatePresence } from "framer-motion";

interface NodeConfigModalProps {
  nodeId: string;
  onClose: () => void;
}

export function NodeConfigModal({ nodeId, onClose }: NodeConfigModalProps) {
  const {
    workflow, updateNode,
  } = useWorkflow();
  const node = workflow.nodes.find((n) => n.id === nodeId);

  // Close on Escape
  useEffect(() => {
    if (!node) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [node, onClose]);

  if (!node) return null;

  const updateConfig = (key: string, value: any) => {
    updateNode(node.id, { config: { ...node.config, [key]: value } });
  };

  const examples = NODE_EXAMPLES[node.type] || [];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9998] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className={`relative bg-card border border-border rounded-2xl shadow-2xl w-full max-h-[85vh] flex flex-col overflow-hidden ${node?.type === "js_function" ? "max-w-3xl" : "max-w-lg"}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ boxShadow: "0 25px 60px -12px hsl(var(--primary) / 0.15)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Configure: {node.label}</h2>
                <p className="text-[10px] text-muted-foreground capitalize">{node.type.replace(/_/g, " ")} block</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Label */}
            <Field label="Label">
              <input
                className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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

            {/* Type-specific configs */}
            {node.type === "start" && (
              <Field label="Greeting Message">
                <div className="relative">
                  <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-20 pr-8" value={node.config.greeting || ""} onChange={(e) => updateConfig("greeting", e.target.value)} />
                  <div className="absolute top-1 right-1">
                    <MicButton onTranscript={(text) => updateConfig("greeting", (node.config.greeting || "") + " " + text)} />
                  </div>
                </div>
              </Field>
            )}

            {node.type === "ai_response" && <AIResponseConfig node={node} updateConfig={updateConfig} />}
            {node.type === "api_call" && <APICallConfig node={node} updateConfig={updateConfig} />}
            {node.type === "condition" && (
              <Field label="Expression">
                <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="e.g. intent === 'buy'" value={node.config.expression || ""} onChange={(e) => updateConfig("expression", e.target.value)} />
              </Field>
            )}
            {node.type === "action" && (
              <Field label="Function Name">
                <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="e.g. sendEmail" value={node.config.functionName || ""} onChange={(e) => updateConfig("functionName", e.target.value)} />
              </Field>
            )}
            {node.type === "user_input" && (
              <>
                <Field label="Prompt Text">
                  <div className="relative">
                    <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8" value={node.config.prompt || ""} onChange={(e) => updateConfig("prompt", e.target.value)} />
                    <div className="absolute top-1/2 -translate-y-1/2 right-1">
                      <MicButton onTranscript={(text) => updateConfig("prompt", (node.config.prompt || "") + " " + text)} />
                    </div>
                  </div>
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
                <div className="relative">
                  <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-20 pr-8" value={node.config.message || ""} onChange={(e) => updateConfig("message", e.target.value)} />
                  <div className="absolute top-1 right-1">
                    <MicButton onTranscript={(text) => updateConfig("message", (node.config.message || "") + " " + text)} />
                  </div>
                </div>
              </Field>
            )}
            {node.type === "email_sender" && <EmailSenderConfig node={node} updateConfig={updateConfig} />}
            {node.type === "webhook_trigger" && (
              <>
                <Field label="Webhook URL"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="https://your-webhook-url.com/hook" value={node.config.url || ""} onChange={(e) => updateConfig("url", e.target.value)} /></Field>
                <Field label="Method"><select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.method || "POST"} onChange={(e) => updateConfig("method", e.target.value)}>{["POST", "GET", "PUT"].map((m) => <option key={m}>{m}</option>)}</select></Field>
                <Field label="Secret"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" type="password" placeholder="Optional webhook secret" value={node.config.secret || ""} onChange={(e) => updateConfig("secret", e.target.value)} /></Field>
              </>
            )}
            {node.type === "db_query" && <DBQueryConfig node={node} updateConfig={updateConfig} />}
            {node.type === "js_function" && <JSFunctionConfig node={node} updateConfig={updateConfig} />}
            {node.type === "text_display" && <TextDisplayConfig node={node} updateConfig={updateConfig} />}
            {node.type === "image_gallery" && <ImageGalleryConfig node={node} updateConfig={updateConfig} />}
            {node.type === "button_input" && <ButtonInputConfig node={node} updateConfig={updateConfig} />}
            {node.type === "set_variable" && (
              <>
                <Field label="Variable Name"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="user_name" value={node.config.variableName || ""} onChange={(e) => updateConfig("variableName", e.target.value)} /></Field>
                <Field label="Value"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="{{input}}" value={node.config.value || ""} onChange={(e) => updateConfig("value", e.target.value)} /></Field>
                <Field label="Operation">
                  <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.operation || "set"} onChange={(e) => updateConfig("operation", e.target.value)}>
                    <option value="set">Set</option><option value="append">Append</option><option value="increment">Increment</option><option value="toggle">Toggle</option>
                  </select>
                </Field>
              </>
            )}
            {node.type === "timer" && (
              <>
                <Field label="Duration">
                  <div className="flex gap-1.5">
                    <input type="number" min="0.1" step="0.5" className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.duration ?? 3} onChange={(e) => updateConfig("duration", parseFloat(e.target.value) || 1)} />
                    <select className="bg-muted border border-border rounded-md px-2 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.unit || "seconds"} onChange={(e) => updateConfig("unit", e.target.value)}>
                      <option value="seconds">seconds</option><option value="minutes">minutes</option>
                    </select>
                  </div>
                </Field>
                <Field label="Display Message (optional)">
                  <div className="relative">
                    <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8" placeholder="Please wait..." value={node.config.message || ""} onChange={(e) => updateConfig("message", e.target.value)} />
                    <div className="absolute top-1/2 -translate-y-1/2 right-1">
                      <MicButton onTranscript={(text) => updateConfig("message", (node.config.message || "") + " " + text)} />
                    </div>
                  </div>
                </Field>
              </>
            )}
            {node.type === "random_choice" && (
              <>
                <Field label="Branches">
                  <div className="space-y-1.5">
                    {(node.config.branches || []).map((branch: string, i: number) => (
                      <div key={i} className="flex gap-1.5">
                        <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring" value={branch} onChange={(e) => { const b = [...(node.config.branches || [])]; b[i] = e.target.value; updateConfig("branches", b); }} placeholder={`Branch ${i + 1}`} />
                        <button onClick={() => updateConfig("branches", (node.config.branches || []).filter((_: any, j: number) => j !== i))} className="p-0.5 text-muted-foreground hover:text-destructive" disabled={(node.config.branches || []).length <= 2}><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateConfig("branches", [...(node.config.branches || []), `Option ${(node.config.branches || []).length + 1}`])} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add branch</button>
                  </div>
                </Field>
              </>
            )}
            {node.type === "loop" && (
              <>
                <Field label="Iterations"><input type="number" min="1" className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.iterations ?? 3} onChange={(e) => updateConfig("iterations", parseInt(e.target.value) || 1)} /></Field>
                <Field label="Counter Variable"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="loop_i" value={node.config.counterVar || ""} onChange={(e) => updateConfig("counterVar", e.target.value)} /></Field>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sub-components ────────────────────────────────

function MicButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const recRef = React.useRef<any>(null);

  const toggle = useCallback(() => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported."); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      onTranscript(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }, [listening, onTranscript]);

  return (
    <button
      type="button"
      onClick={toggle}
      className={`p-1 rounded-md transition-colors ${listening ? "bg-destructive/20 text-destructive animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
      title={listening ? "Stop recording" : "Voice to text"}
    >
      {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
    </button>
  );
}

function AIResponseConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  return (
    <>
      <Field label="API Key Variable">
        <div className="flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-warning shrink-0" />
          <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="{{OPENAI_API_KEY}} or {{LOVABLE_API_KEY}}" value={node.config.apiKey || ""} onChange={(e) => updateConfig("apiKey", e.target.value)} />
        </div>
        <p className="text-[9px] text-muted-foreground mt-0.5">Reference a global variable containing your API key</p>
      </Field>
      <Field label="Endpoint URL">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="https://ai.gateway.lovable.dev/v1/chat/completions" value={node.config.endpoint || ""} onChange={(e) => updateConfig("endpoint", e.target.value)} />
        </div>
      </Field>
      <Field label="Model">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.model || "gemini-flash"} onChange={(e) => updateConfig("model", e.target.value)}>
          <option value="gemini-flash">Google Gemini Flash</option>
          <option value="gemini-pro">Google Gemini Pro</option>
          <option value="gpt-5">OpenAI GPT-5</option>
          <option value="gpt-5-mini">OpenAI GPT-5 Mini</option>
          <option value="gpt-5-nano">OpenAI GPT-5 Nano</option>
          <option value="custom">Custom</option>
        </select>
      </Field>
      <Field label="Headers">
        <div className="space-y-1.5">
          {Object.entries(node.config.headers || {}).map(([key, val], i) => (
            <div key={i} className="flex gap-1.5">
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={key} onChange={(e) => { const entries = Object.entries(node.config.headers || {}); entries[i] = [e.target.value, entries[i][1]]; updateConfig("headers", Object.fromEntries(entries)); }} placeholder="Header-Name" />
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={val as string} onChange={(e) => { const entries = Object.entries(node.config.headers || {}); entries[i] = [entries[i][0], e.target.value]; updateConfig("headers", Object.fromEntries(entries)); }} placeholder="value" />
              <button onClick={() => { const h = { ...(node.config.headers || {}) }; const entries = Object.entries(h); entries.splice(i, 1); updateConfig("headers", Object.fromEntries(entries)); }} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => updateConfig("headers", { ...(node.config.headers || {}), "": "" })} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add header</button>
        </div>
      </Field>
      <Field label="System Prompt">
        <div className="relative">
          <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-24 font-mono pr-8" value={node.config.systemPrompt || ""} onChange={(e) => updateConfig("systemPrompt", e.target.value)} />
          <div className="absolute top-1 right-1">
            <MicButton onTranscript={(text) => updateConfig("systemPrompt", (node.config.systemPrompt || "") + " " + text)} />
          </div>
        </div>
      </Field>
      <Field label="User Message Template">
        <div className="relative">
          <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-16 font-mono pr-8" placeholder="{{last_utterance}}" value={node.config.userMessageTemplate || ""} onChange={(e) => updateConfig("userMessageTemplate", e.target.value)} />
          <div className="absolute top-1 right-1">
            <MicButton onTranscript={(text) => updateConfig("userMessageTemplate", (node.config.userMessageTemplate || "") + " " + text)} />
          </div>
        </div>
        <p className="text-[9px] text-muted-foreground mt-0.5">Use <code className="bg-muted px-1 rounded">{"{{var}}"}</code> to inject variables. <code className="bg-muted px-1 rounded">{"{{last_utterance}}"}</code> contains the latest user message.</p>
      </Field>
      <Field label="Variables">
        <div className="space-y-1.5">
          {(node.config.variables || []).map((v: { name: string; value: string }, i: number) => (
            <div key={i} className="flex gap-1.5">
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={v.name} onChange={(e) => { const vars = [...(node.config.variables || [])]; vars[i] = { ...vars[i], name: e.target.value }; updateConfig("variables", vars); }} placeholder="name" />
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={v.value} onChange={(e) => { const vars = [...(node.config.variables || [])]; vars[i] = { ...vars[i], value: e.target.value }; updateConfig("variables", vars); }} placeholder="value / {{ref}}" />
              <button onClick={() => updateConfig("variables", (node.config.variables || []).filter((_: any, j: number) => j !== i))} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => updateConfig("variables", [...(node.config.variables || []), { name: "", value: "" }])} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add variable</button>
        </div>
      </Field>
      <Field label="Sample Utterances">
        <div className="space-y-1">
          {(node.config.utterances || []).map((u: string, i: number) => (
            <div key={i} className="flex gap-1.5">
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] text-foreground focus:outline-none" value={u} onChange={(e) => { const utt = [...(node.config.utterances || [])]; utt[i] = e.target.value; updateConfig("utterances", utt); }} placeholder="Sample user message..." />
              <MicButton onTranscript={(text) => { const utt = [...(node.config.utterances || [])]; utt[i] = text; updateConfig("utterances", utt); }} />
              <button onClick={() => updateConfig("utterances", (node.config.utterances || []).filter((_: any, j: number) => j !== i))} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => updateConfig("utterances", [...(node.config.utterances || []), ""])} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add utterance</button>
        </div>
      </Field>
      <Field label="Temperature">
        <input type="number" min="0" max="2" step="0.1" className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.temperature ?? 0.7} onChange={(e) => updateConfig("temperature", parseFloat(e.target.value))} />
      </Field>
      <Field label="Max Tokens">
        <input type="number" min="1" step="100" className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="4096" value={node.config.maxTokens || ""} onChange={(e) => updateConfig("maxTokens", parseInt(e.target.value) || undefined)} />
      </Field>
      <Field label="Streaming">
        <label className="flex items-center gap-2 text-xs text-foreground">
          <input type="checkbox" checked={node.config.stream ?? true} onChange={(e) => updateConfig("stream", e.target.checked)} className="rounded border-border" />
          Enable streaming response
        </label>
      </Field>
    </>
  );
}

function APICallConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  return (
    <>
      <Field label="Method">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.method || "GET"} onChange={(e) => updateConfig("method", e.target.value)}>
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="URL">
        <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="https://api.example.com/..." value={node.config.url || ""} onChange={(e) => updateConfig("url", e.target.value)} />
      </Field>
      <Field label="Async / Await">
        <label className="flex items-center gap-2 text-xs text-foreground">
          <input type="checkbox" checked={node.config.async ?? true} onChange={(e) => updateConfig("async", e.target.checked)} className="rounded border-border" />
          Use async/await
        </label>
      </Field>
      <Field label="Timeout (ms)">
        <input type="number" min="0" step="1000" className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="30000" value={node.config.timeout ?? 30000} onChange={(e) => updateConfig("timeout", parseInt(e.target.value) || 30000)} />
      </Field>
      <Field label="Headers">
        <div className="space-y-1.5">
          {Object.entries(node.config.headers || {}).map(([key, val], i) => (
            <div key={i} className="flex gap-1.5">
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={key} onChange={(e) => { const entries = Object.entries(node.config.headers || {}); entries[i] = [e.target.value, entries[i][1]]; updateConfig("headers", Object.fromEntries(entries)); }} placeholder="Header-Name" />
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={val as string} onChange={(e) => { const entries = Object.entries(node.config.headers || {}); entries[i] = [entries[i][0], e.target.value]; updateConfig("headers", Object.fromEntries(entries)); }} placeholder="value" />
              <button onClick={() => { const h = { ...(node.config.headers || {}) }; const entries = Object.entries(h); entries.splice(i, 1); updateConfig("headers", Object.fromEntries(entries)); }} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => updateConfig("headers", { ...(node.config.headers || {}), "": "" })} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add header</button>
        </div>
      </Field>
      <Field label="Request Body (JSON)">
        <div className="relative">
          <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-20 font-mono pr-8" placeholder='{"key": "{{variable}}"}' value={node.config.body || ""} onChange={(e) => updateConfig("body", e.target.value)} />
          <div className="absolute top-1 right-1">
            <MicButton onTranscript={(text) => updateConfig("body", (node.config.body || "") + " " + text)} />
          </div>
        </div>
      </Field>
      <Field label="Response Mapping">
        <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="response.data.result" value={node.config.responseMapping || ""} onChange={(e) => updateConfig("responseMapping", e.target.value)} />
      </Field>
    </>
  );
}

function EmailSenderConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  return (
    <>
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-2.5 text-[10px] text-warning space-y-1">
        <p className="font-semibold">⚡ To send real emails, connect Lovable Cloud</p>
      </div>
      <Field label="Email Provider">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.provider || "resend"} onChange={(e) => updateConfig("provider", e.target.value)}>
          <option value="resend">Resend</option><option value="sendgrid">SendGrid</option><option value="mailgun">Mailgun</option><option value="ses">Amazon SES</option><option value="smtp">Custom SMTP</option>
        </select>
      </Field>
      <Field label="API Key Variable"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="{{EMAIL_API_KEY}}" value={node.config.apiKeyVar || ""} onChange={(e) => updateConfig("apiKeyVar", e.target.value)} /></Field>
      <Field label="To"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="{{user_email}}" value={node.config.to || ""} onChange={(e) => updateConfig("to", e.target.value)} /></Field>
      <Field label="From"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="noreply@yourdomain.com" value={node.config.from || ""} onChange={(e) => updateConfig("from", e.target.value)} /></Field>
      <Field label="Subject">
        <div className="relative">
          <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8" placeholder="Welcome!" value={node.config.subject || ""} onChange={(e) => updateConfig("subject", e.target.value)} />
          <div className="absolute top-1/2 -translate-y-1/2 right-1">
            <MicButton onTranscript={(text) => updateConfig("subject", (node.config.subject || "") + " " + text)} />
          </div>
        </div>
      </Field>
      <Field label="Body (HTML)">
        <div className="relative">
          <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-24 font-mono pr-8" value={node.config.body || ""} onChange={(e) => updateConfig("body", e.target.value)} />
          <div className="absolute top-1 right-1">
            <MicButton onTranscript={(text) => updateConfig("body", (node.config.body || "") + " " + text)} />
          </div>
        </div>
      </Field>
    </>
  );
}

function DBQueryConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  return (
    <>
      <Field label="Database">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.database || ""} onChange={(e) => updateConfig("database", e.target.value)}>
          <option value="">— Select —</option><option value="postgresql">PostgreSQL</option><option value="mysql">MySQL</option><option value="mongodb">MongoDB</option><option value="supabase">Supabase</option>
        </select>
      </Field>
      <Field label="Connection String"><input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" type="password" placeholder="postgres://..." value={node.config.connectionString || ""} onChange={(e) => updateConfig("connectionString", e.target.value)} /></Field>
      <Field label="Query Type">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.type || "select"} onChange={(e) => updateConfig("type", e.target.value)}>
          {["select", "insert", "update", "delete", "raw"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Query">
        <div className="relative">
          <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-24 font-mono pr-8" placeholder="SELECT * FROM users" value={node.config.query || ""} onChange={(e) => updateConfig("query", e.target.value)} />
          <div className="absolute top-1 right-1">
            <MicButton onTranscript={(text) => updateConfig("query", (node.config.query || "") + " " + text)} />
          </div>
        </div>
      </Field>
    </>
  );
}

const PREBUILT_JS_FUNCTIONS = [
  { title: "Parse JSON", code: "// Parse JSON string\nconst parsed = JSON.parse(data.body || '{}');\nreturn { name: parsed.name, email: parsed.email };" },
  { title: "Format Currency", code: "// Format number as USD\nconst amount = parseFloat(data.amount || '0');\nreturn { formatted: `$${amount.toFixed(2)}` };" },
  { title: "Array Filter", code: "// Filter active items\nreturn (data.items || []).filter(item => item.status === 'active');" },
  { title: "Date Format", code: "// Format current date\nconst d = new Date();\nreturn { date: d.toLocaleDateString(), time: d.toLocaleTimeString(), iso: d.toISOString() };" },
  { title: "Slug Generator", code: "// Generate URL slug\nconst text = data.text || '';\nreturn { slug: text.toLowerCase().trim().replace(/[^\\w\\s-]/g, '').replace(/[\\s_]+/g, '-') };" },
  { title: "Random ID", code: "// Generate random ID\nreturn { id: Math.random().toString(36).substring(2, 10) + Date.now().toString(36) };" },
  { title: "Word Count", code: "// Count words and chars\nconst text = data.text || '';\nreturn { words: text.split(/\\s+/).filter(Boolean).length, chars: text.length };" },
  { title: "Extract Emails", code: "// Extract emails from text\nconst matches = (data.text || '').match(/[\\w.-]+@[\\w.-]+\\.\\w+/g) || [];\nreturn { emails: matches, count: matches.length };" },
  { title: "Merge Objects", code: "// Deep merge two objects\nreturn { ...data.obj1, ...data.obj2 };" },
  { title: "Capitalize", code: "// Capitalize each word\nconst text = data.text || '';\nreturn { result: text.replace(/\\b\\w/g, c => c.toUpperCase()) };" },
];

function JSFunctionConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  return (
    <>
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3 h-3 text-node-js" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Prebuilt Functions</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {PREBUILT_JS_FUNCTIONS.map((fn, i) => (
            <button
              key={i}
              onClick={() => updateConfig("code", fn.code)}
              className="px-2 py-1 rounded-md bg-node-js/10 border border-node-js/30 text-[10px] font-medium text-node-js hover:bg-node-js/20 transition-colors"
            >
              {fn.title}
            </button>
          ))}
        </div>
      </div>
      <Field label="Input Variables">
        <div className="space-y-1.5">
          {(node.config.inputs || []).map((inp: { name: string; source: string }, i: number) => (
            <div key={i} className="flex gap-1.5">
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={inp.name} onChange={(e) => { const inputs = [...(node.config.inputs || [])]; inputs[i] = { ...inputs[i], name: e.target.value }; updateConfig("inputs", inputs); }} placeholder="param_name" />
              <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={inp.source} onChange={(e) => { const inputs = [...(node.config.inputs || [])]; inputs[i] = { ...inputs[i], source: e.target.value }; updateConfig("inputs", inputs); }} placeholder="{{var}}" />
              <button onClick={() => updateConfig("inputs", (node.config.inputs || []).filter((_: any, j: number) => j !== i))} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => updateConfig("inputs", [...(node.config.inputs || []), { name: "", source: "" }])} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add input</button>
        </div>
      </Field>
      <Field label="Execution Mode">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.execMode || "async"} onChange={(e) => updateConfig("execMode", e.target.value)}>
          <option value="async">Async</option><option value="sync">Synchronous</option>
        </select>
      </Field>
      <Field label="JavaScript Code">
        <CodeEditor value={node.config.code || ""} onChange={(val) => updateConfig("code", val)} placeholder="// Available: inputs, globals, fetch()" />
      </Field>
      <Field label="Output Variable">
        <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" placeholder="js_result" value={node.config.outputVar || ""} onChange={(e) => updateConfig("outputVar", e.target.value)} />
      </Field>
    </>
  );
}

function TextDisplayConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/") || item.type.startsWith("video/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          const tag = item.type.startsWith("image/") ? `\n![pasted](${url})\n` : `\n<video src="${url}" controls style="max-width:100%"></video>\n`;
          updateConfig("text", (node.config.text || "") + tag);
        }
        return;
      }
    }
  }, [node.config.text, updateConfig]);

  const handleFileAttach = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const tag = file.type.startsWith("image/") ? `\n![${file.name}](${url})\n` : `\n<video src="${url}" controls style="max-width:100%"></video>\n`;
    updateConfig("text", (node.config.text || "") + tag);
    e.target.value = "";
  }, [node.config.text, updateConfig]);

  return (
    <>
      <Field label="Display Text">
        <div className="relative">
          <textarea className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-24 pr-8" placeholder="Supports markdown, HTML, images" value={node.config.text || ""} onChange={(e) => updateConfig("text", e.target.value)} onPaste={handlePaste} />
          <div className="absolute top-1 right-1">
            <MicButton onTranscript={(text) => updateConfig("text", (node.config.text || "") + " " + text)} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <label className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium cursor-pointer">
            <Image className="w-3 h-3" /> Add image
            <input type="file" accept="image/*" className="hidden" onChange={handleFileAttach} />
          </label>
          <label className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium cursor-pointer">
            <Film className="w-3 h-3" /> Add video
            <input type="file" accept="video/*" className="hidden" onChange={handleFileAttach} />
          </label>
        </div>
      </Field>
      <Field label="Format">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.format || "markdown"} onChange={(e) => updateConfig("format", e.target.value)}>
          <option value="markdown">Markdown</option><option value="plain">Plain Text</option><option value="html">HTML</option><option value="mixed">Mixed</option>
        </select>
      </Field>
    </>
  );
}

function ButtonInputConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  const [expandedBtn, setExpandedBtn] = useState<number | null>(null);
  return (
    <>
      <Field label="Prompt">
        <input className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.prompt || ""} onChange={(e) => updateConfig("prompt", e.target.value)} />
      </Field>
      <Field label="Layout">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.layout || "horizontal"} onChange={(e) => updateConfig("layout", e.target.value)}>
          <option value="horizontal">Horizontal</option><option value="vertical">Vertical</option>
        </select>
      </Field>
      <Field label="Buttons">
        <div className="space-y-2">
          {(node.config.buttons || []).map((btn: any, i: number) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-secondary/30">
                <button onClick={() => setExpandedBtn(expandedBtn === i ? null : i)} className="p-0.5 text-muted-foreground">
                  {expandedBtn === i ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                <input className="flex-1 bg-transparent text-[10px] font-medium text-foreground focus:outline-none" value={btn.label} onChange={(e) => { const b = [...node.config.buttons]; b[i] = { ...b[i], label: e.target.value }; updateConfig("buttons", b); }} placeholder="Label" />
                <input className="w-14 bg-muted border border-border rounded px-1.5 py-0.5 text-[10px] font-mono text-foreground focus:outline-none" value={btn.value} onChange={(e) => { const b = [...node.config.buttons]; b[i] = { ...b[i], value: e.target.value }; updateConfig("buttons", b); }} placeholder="value" />
                <button onClick={() => updateConfig("buttons", node.config.buttons.filter((_: any, j: number) => j !== i))} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
              </div>
              {expandedBtn === i && (
                <div className="px-2 py-2 space-y-1.5 bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="flex-1">
                      <label className="text-[9px] text-muted-foreground uppercase">BG Color</label>
                      <div className="flex gap-1 items-center">
                        <input type="color" className="w-5 h-5 rounded border-none cursor-pointer" value={btn.bgColor || "#6366f1"} onChange={(e) => { const b = [...node.config.buttons]; b[i] = { ...b[i], bgColor: e.target.value }; updateConfig("buttons", b); }} />
                        <input className="flex-1 bg-muted border border-border rounded px-1.5 py-0.5 text-[10px] font-mono text-foreground focus:outline-none" value={btn.bgColor || ""} onChange={(e) => { const b = [...node.config.buttons]; b[i] = { ...b[i], bgColor: e.target.value }; updateConfig("buttons", b); }} placeholder="#6366f1" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] text-muted-foreground uppercase">Text Color</label>
                      <div className="flex gap-1 items-center">
                        <input type="color" className="w-5 h-5 rounded border-none cursor-pointer" value={btn.textColor || "#ffffff"} onChange={(e) => { const b = [...node.config.buttons]; b[i] = { ...b[i], textColor: e.target.value }; updateConfig("buttons", b); }} />
                        <input className="flex-1 bg-muted border border-border rounded px-1.5 py-0.5 text-[10px] font-mono text-foreground focus:outline-none" value={btn.textColor || ""} onChange={(e) => { const b = [...node.config.buttons]; b[i] = { ...b[i], textColor: e.target.value }; updateConfig("buttons", b); }} placeholder="#ffffff" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-muted-foreground uppercase">Font Size (px)</label>
                    <input className="w-full bg-muted border border-border rounded px-2 py-1 text-[10px] text-foreground focus:outline-none" type="number" min="10" max="32" value={btn.fontSize || "14"} onChange={(e) => { const b = [...node.config.buttons]; b[i] = { ...b[i], fontSize: e.target.value }; updateConfig("buttons", b); }} />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={() => updateConfig("buttons", [...(node.config.buttons || []), { label: "New", value: "new", bgColor: "", textColor: "", fontSize: "14" }])} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add button</button>
        </div>
      </Field>
    </>
  );
}

function ImageGalleryConfig({ node, updateConfig }: { node: any; updateConfig: (k: string, v: any) => void }) {
  const images = node.config.images || [];
  return (
    <>
      <Field label="Layout">
        <select className="w-full bg-muted border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" value={node.config.layout || "horizontal"} onChange={(e) => updateConfig("layout", e.target.value)}>
          <option value="horizontal">Horizontal Scroll</option><option value="grid">Grid</option>
        </select>
      </Field>
      <Field label="Selectable">
        <label className="flex items-center gap-2 text-xs text-foreground">
          <input type="checkbox" checked={node.config.selectable ?? true} onChange={(e) => updateConfig("selectable", e.target.checked)} className="rounded border-border" />
          Allow user to select an image
        </label>
      </Field>
      <Field label="Image Size">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[9px] text-muted-foreground">Width</label>
            <input type="number" min="80" max="500" className="w-full bg-muted border border-border rounded px-2 py-1 text-[10px] text-foreground focus:outline-none" value={node.config.imageWidth || 200} onChange={(e) => updateConfig("imageWidth", parseInt(e.target.value) || 200)} />
          </div>
          <div className="flex-1">
            <label className="text-[9px] text-muted-foreground">Height</label>
            <input type="number" min="60" max="400" className="w-full bg-muted border border-border rounded px-2 py-1 text-[10px] text-foreground focus:outline-none" value={node.config.imageHeight || 150} onChange={(e) => updateConfig("imageHeight", parseInt(e.target.value) || 150)} />
          </div>
        </div>
      </Field>
      <Field label="Images">
        <div className="space-y-2.5">
          {images.map((img: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-2.5 space-y-1.5 bg-secondary/20">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-muted-foreground">#{i + 1}</span>
                <input className="flex-1 bg-muted border border-border rounded px-2 py-1 text-[10px] font-medium text-foreground focus:outline-none" value={img.title || ""} onChange={(e) => { const imgs = [...images]; imgs[i] = { ...imgs[i], title: e.target.value }; updateConfig("images", imgs); }} placeholder="Title" />
                <button onClick={() => updateConfig("images", images.filter((_: any, j: number) => j !== i))} className="p-0.5 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
              </div>
              <input className="w-full bg-muted border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground focus:outline-none" value={img.url || ""} onChange={(e) => { const imgs = [...images]; imgs[i] = { ...imgs[i], url: e.target.value }; updateConfig("images", imgs); }} placeholder="https://example.com/image.jpg" />
              <input className="w-full bg-muted border border-border rounded px-2 py-1 text-[10px] text-foreground focus:outline-none" value={img.description || ""} onChange={(e) => { const imgs = [...images]; imgs[i] = { ...imgs[i], description: e.target.value }; updateConfig("images", imgs); }} placeholder="Description..." />
              {img.url && <img src={img.url} alt={img.title} className="w-16 h-12 rounded object-cover border border-border" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            </div>
          ))}
          <button onClick={() => updateConfig("images", [...images, { url: "", title: "", description: "" }])} className="text-[10px] text-primary hover:text-primary/80 font-medium">+ Add image</button>
        </div>
      </Field>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
