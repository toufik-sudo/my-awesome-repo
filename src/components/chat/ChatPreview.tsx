import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Bot, User, Loader2, Image, Film, RotateCcw, Play, Sparkles, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import { useWorkflow } from "@/context/WorkflowContext";
import { useI18n } from "@/context/I18nContext";
import { DEFAULT_CHAT_CONFIG } from "@/types/workflow";
import type { ChatMessage, WorkflowNode } from "@/types/workflow";

marked.setOptions({ gfm: true, breaks: true });

// ─── Variable compilation ───────────────────────
function compileVariables(text: string, vars: Record<string, string>): string {
  if (!text) return "";
  return text.replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] ?? `{{${name}}}`);
}

// ─── Render content with HTML support ───────────
function RenderContent({ content, format, className = "" }: { content: string; format?: string; className?: string }) {
  if (!content) return null;
  const fmt = format || "markdown";

  if (fmt === "html" || fmt === "mixed") {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  if (fmt === "plain") {
    return <p className={`${className} whitespace-pre-wrap`}>{content}</p>;
  }
  // markdown — also allow inline HTML
  try {
    const html = marked.parse(content) as string;
    return <div className={`markdown-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <p className={`${className} whitespace-pre-wrap`}>{content}</p>;
  }
}

interface ChatPreviewProps {
  onMinimize?: () => void;
}

export function ChatPreview({ onMinimize }: ChatPreviewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("Type a message...");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const resolveInputRef = useRef<((value: string) => void) | null>(null);
  const stopRef = useRef(false);
  const varsRef = useRef<Record<string, string>>({});
  const { workflow, updateGlobalVariable, addGlobalVariable } = useWorkflow();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Initialize vars from global variables
  const initVars = useCallback(() => {
    const vars: Record<string, string> = {};
    for (const v of workflow.globalVariables || []) {
      vars[v.name] = v.defaultValue || "";
    }
    varsRef.current = vars;
  }, [workflow.globalVariables]);

  const updateLastUtterance = useCallback((text: string) => {
    varsRef.current["last_utterance"] = text;
    const existing = (workflow.globalVariables || []).find((v) => v.name === "last_utterance");
    if (existing) {
      updateGlobalVariable(existing.id, { defaultValue: text });
    } else {
      addGlobalVariable({ name: "last_utterance", type: "string", defaultValue: text, description: "Latest user input" });
    }
  }, [workflow.globalVariables, updateGlobalVariable, addGlobalVariable]);

  // ─── Speech-to-Text ─────────────────────────────
  const toggleSTT = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported."); return; }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  // ─── Wait for user input (called during workflow execution) ──
  const waitForUserInput = useCallback((prompt: string): Promise<string> => {
    setInputPrompt(prompt || "Type a message...");
    setWaitingForInput(true);
    setIsLoading(false);
    return new Promise((resolve) => {
      resolveInputRef.current = resolve;
    });
  }, []);

  // ─── Submit user input ──────────────────────────
  const submitInput = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    updateLastUtterance(text);
    varsRef.current["user_input"] = text;

    const userMsg: ChatMessage = {
      id: uuidv4(), role: "user", content: text, timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (resolveInputRef.current) {
      const resolve = resolveInputRef.current;
      resolveInputRef.current = null;
      setWaitingForInput(false);
      resolve(text);
    }
  }, [input, updateLastUtterance]);

  // ─── Add assistant message ──────────────────────
  const addAssistantMessage = useCallback((content: string, extra?: Record<string, any>) => {
    const msg: any = {
      id: uuidv4(), role: "assistant", content, timestamp: Date.now(), ...extra,
    };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  }, []);

  // ─── Stream text to message ─────────────────────
  const streamText = useCallback(async (text: string) => {
    const id = uuidv4();
    setMessages((prev) => [...prev, { id, role: "assistant", content: "", timestamp: Date.now() }]);
    setIsStreaming(true);
    let acc = "";
    for (let i = 0; i < text.length; i++) {
      if (stopRef.current) break;
      await new Promise((r) => setTimeout(r, 12 + Math.random() * 20));
      acc += text[i];
      const content = acc;
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, content } : m));
    }
    setIsStreaming(false);
  }, []);

  // ─── Follow next node from a given node ─────────
  const getNextNodeId = useCallback((node: WorkflowNode, portLabel?: string): string | null => {
    const outPort = portLabel
      ? node.ports.outputs.find((p) => p.label === portLabel)
      : node.ports.outputs[0];
    if (!outPort) return null;
    const conn = workflow.connections.find(
      (c) => c.fromNodeId === node.id && c.fromPortId === outPort.id
    );
    return conn?.toNodeId || null;
  }, [workflow.connections]);

  // ─── Execute the workflow in chat ───────────────
  const runWorkflowInChat = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);
    setMessages([]);
    initVars();

    const startNode = workflow.nodes.find((n) => n.type === "start");
    if (!startNode) {
      addAssistantMessage("⚠️ No Start node found in the workflow.");
      setIsRunning(false);
      return;
    }

    let currentNodeId: string | null = startNode.id;

    while (currentNodeId && !stopRef.current) {
      const node = workflow.nodes.find((n) => n.id === currentNodeId);
      if (!node) break;

      const compile = (t: string) => compileVariables(t, varsRef.current);

      switch (node.type) {
        case "start": {
          const greeting = compile(node.config.greeting || "Hello!");
          addAssistantMessage(greeting);
          await new Promise((r) => setTimeout(r, 400));
          break;
        }

        case "user_input": {
          const userText = await waitForUserInput(compile(node.config.prompt || "Type your message..."));
          varsRef.current["user_input"] = userText;
          varsRef.current["last_utterance"] = userText;
          break;
        }

        case "ai_response": {
          setIsLoading(true);
          const systemPrompt = compile(node.config.systemPrompt || "");
          const userTemplate = compile(node.config.userMessageTemplate || "{{user_input}}");
          const mockResp = generateMockResponse(userTemplate, systemPrompt);
          if (node.config.stream) {
            await streamText(mockResp);
          } else {
            await new Promise((r) => setTimeout(r, 500));
            addAssistantMessage(mockResp);
          }
          varsRef.current["ai_output"] = mockResp;
          setIsLoading(false);
          break;
        }

        case "text_display": {
          const text = compile(node.config.text || "");
          const format = node.config.format || "markdown";
          addAssistantMessage(text, { type: "text_display", format });
          await new Promise((r) => setTimeout(r, 300));
          break;
        }

        case "button_input": {
          const prompt = compile(node.config.prompt || "Choose:");
          const buttons = node.config.buttons || [];
          addAssistantMessage(prompt, { type: "button_input", buttons, layout: node.config.layout || "horizontal" });
          // Wait for button click
          const selected = await waitForUserInput("Click a button above...");
          varsRef.current["button_value"] = selected;
          break;
        }

        case "api_call": {
          setIsLoading(true);
          const url = compile(node.config.url || "");
          const method = node.config.method || "GET";
          // Compile headers
          const rawHeaders = node.config.headers || {};
          const compiledHeaders: Record<string, string> = {};
          for (const [k, v] of Object.entries(rawHeaders)) {
            compiledHeaders[compile(k)] = compile(v as string);
          }
          addAssistantMessage(`🔗 **API Call**: \`${method} ${url}\`\n\nHeaders: ${Object.keys(compiledHeaders).length > 0 ? Object.entries(compiledHeaders).map(([k, v]) => `\`${k}: ${v}\``).join(", ") : "none"}`);
          await new Promise((r) => setTimeout(r, 600));
          varsRef.current["api_response"] = '{"status": "ok", "data": {}}';
          setIsLoading(false);
          break;
        }

        case "condition": {
          const expr = compile(node.config.expression || "true");
          let result = true;
          try {
            result = new Function("vars", `with(vars) { return !!(${expr}); }`)(varsRef.current);
          } catch { result = true; }
          addAssistantMessage(`🔀 **Condition**: \`${expr}\` → **${result ? "Yes" : "No"}**`);
          await new Promise((r) => setTimeout(r, 300));
          currentNodeId = getNextNodeId(node, result ? "Yes" : "No");
          continue;
        }

        case "set_variable": {
          const varName = node.config.variableName || "";
          const value = compile(node.config.value || "");
          const op = node.config.operation || "set";
          if (op === "set") varsRef.current[varName] = value;
          else if (op === "append") varsRef.current[varName] = (varsRef.current[varName] || "") + value;
          else if (op === "increment") varsRef.current[varName] = String(Number(varsRef.current[varName] || "0") + Number(value || "1"));
          else if (op === "toggle") varsRef.current[varName] = varsRef.current[varName] === "true" ? "false" : "true";
          break;
        }

        case "action": {
          addAssistantMessage(`⚡ **Action**: \`${node.config.functionName || "(unnamed)"}\``);
          await new Promise((r) => setTimeout(r, 300));
          break;
        }

        case "db_query": {
          setIsLoading(true);
          const db = node.config.database || node.config.connectionString || "(no db)";
          addAssistantMessage(`🗄️ **DB Query** on \`${db}\`:\n\`\`\`sql\n${compile(node.config.query || "")}\n\`\`\``);
          await new Promise((r) => setTimeout(r, 500));
          varsRef.current["db_result"] = '[{"id": 1}]';
          setIsLoading(false);
          break;
        }

        case "js_function": {
          addAssistantMessage(`💻 **JS Function** executed`);
          await new Promise((r) => setTimeout(r, 300));
          break;
        }

        case "image_gallery": {
          const images = (node.config.images || []).map((img: any) => ({
            ...img,
            url: compile(img.url || ""),
            title: compile(img.title || ""),
            description: compile(img.description || ""),
          }));
          const selectable = node.config.selectable ?? true;
          addAssistantMessage("", {
            type: "image_gallery",
            images,
            selectable,
            layout: node.config.layout || "horizontal",
            imageWidth: node.config.imageWidth || 200,
            imageHeight: node.config.imageHeight || 150,
          });
          if (selectable) {
            const selected = await waitForUserInput("Select an image...");
            varsRef.current["selected_image"] = selected;
          }
          await new Promise((r) => setTimeout(r, 300));
          break;
        }

        case "email_sender": {
          addAssistantMessage(`📧 **Email** sent to \`${compile(node.config.to || "")}\`\nSubject: ${compile(node.config.subject || "")}`);
          await new Promise((r) => setTimeout(r, 400));
          break;
        }

        case "timer": {
          const duration = node.config.duration || 3;
          const unit = node.config.unit || "seconds";
          const ms = unit === "minutes" ? duration * 60000 : duration * 1000;
          const msg = compile(node.config.message || "");
          if (msg) addAssistantMessage(`⏳ ${msg}`);
          setIsLoading(true);
          await new Promise((r) => setTimeout(r, ms));
          setIsLoading(false);
          break;
        }

        case "random_choice": {
          const branches: string[] = node.config.branches || ["A", "B"];
          const idx = Math.floor(Math.random() * branches.length);
          addAssistantMessage(`🎲 **Random**: picked "${branches[idx]}"`);
          await new Promise((r) => setTimeout(r, 300));
          // Find output port for this branch
          const outPort = node.ports.outputs[idx] || node.ports.outputs[0];
          if (outPort) {
            const conn = workflow.connections.find(
              (c) => c.fromNodeId === node.id && c.fromPortId === outPort.id
            );
            currentNodeId = conn?.toNodeId || null;
          } else {
            currentNodeId = null;
          }
          continue;
        }

        case "loop": {
          const iterations = node.config.iterations || 3;
          const counterVar = node.config.counterVar || "loop_i";
          const bodyPort = node.ports.outputs.find((p) => p.label === "Loop Body");
          const donePort = node.ports.outputs.find((p) => p.label === "Done");

          for (let i = 0; i < iterations && !stopRef.current; i++) {
            varsRef.current[counterVar] = String(i);
            addAssistantMessage(`🔁 **Loop** iteration ${i + 1}/${iterations}`);
            // Execute body sub-chain
            if (bodyPort) {
              const bodyConn = workflow.connections.find(
                (c) => c.fromNodeId === node.id && c.fromPortId === bodyPort.id
              );
              // Note: body nodes run inline (single step for now)
              if (bodyConn) {
                const bodyNode = workflow.nodes.find((n) => n.id === bodyConn.toNodeId);
                if (bodyNode) {
                  addAssistantMessage(`  → Running: ${bodyNode.label}`);
                }
              }
            }
            await new Promise((r) => setTimeout(r, 400));
          }

          if (donePort) {
            const doneConn = workflow.connections.find(
              (c) => c.fromNodeId === node.id && c.fromPortId === donePort.id
            );
            currentNodeId = doneConn?.toNodeId || null;
          } else {
            currentNodeId = null;
          }
          continue;
        }

        case "end": {
          const msg = compile(node.config.message || "Goodbye!");
          addAssistantMessage(msg);
          currentNodeId = null;
          continue;
        }

        default: {
          await new Promise((r) => setTimeout(r, 300));
          break;
        }
      }

      // Follow to next node
      currentNodeId = getNextNodeId(node);
    }

    setIsRunning(false);
    setWaitingForInput(false);
    if (!stopRef.current) {
      addAssistantMessage("✅ *Workflow completed.*");
    }
  }, [workflow, initVars, addAssistantMessage, waitForUserInput, streamText, getNextNodeId]);

  const stopExecution = useCallback(() => {
    stopRef.current = true;
    setIsRunning(false);
    setWaitingForInput(false);
    if (resolveInputRef.current) {
      resolveInputRef.current("");
      resolveInputRef.current = null;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitInput();
    }
  };

  const handleButtonClick = useCallback((value: string, label: string) => {
    updateLastUtterance(value);
    varsRef.current["user_input"] = value;
    varsRef.current["button_value"] = value;

    const userMsg: ChatMessage = { id: uuidv4(), role: "user", content: label, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    if (resolveInputRef.current) {
      const resolve = resolveInputRef.current;
      resolveInputRef.current = null;
      setWaitingForInput(false);
      resolve(value);
    }
  }, [updateLastUtterance]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          setInput((prev) => prev + `\n![pasted image](${url})\n`);
          updateLastUtterance("[image attachment]");
        }
        return;
      }
    }
  }, [updateLastUtterance]);

  const resetChat = useCallback(() => {
    stopExecution();
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setIsStreaming(false);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }, [isListening, stopExecution]);

  const renderMessageContent = (msg: any) => {
    if (msg.type === "text_display") {
      return (
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-primary/60">📝 Text Display</span>
          <RenderContent content={msg.content} format={msg.format} className="text-xs" />
        </div>
      );
    }

    if (msg.type === "button_input") {
      return (
        <div className="space-y-2">
          <p className="text-xs">{msg.content}</p>
          <div className={cn("flex gap-1.5 flex-wrap", msg.layout === "vertical" ? "flex-col" : "flex-row")}>
            {(msg.buttons || []).map((btn: any, i: number) => (
              <button
                key={i}
                onClick={() => handleButtonClick(btn.value, btn.label)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:scale-105 active:scale-95 border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                style={{
                  ...(btn.bgColor ? { backgroundColor: btn.bgColor, borderColor: btn.bgColor } : {}),
                  ...(btn.textColor ? { color: btn.textColor } : {}),
                  ...(btn.fontSize ? { fontSize: `${btn.fontSize}px` } : {}),
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === "image_gallery") {
      const images = msg.images || [];
      const w = msg.imageWidth || 200;
      const h = msg.imageHeight || 150;
      return (
        <div className="space-y-1.5">
          <span className="text-[9px] uppercase tracking-wider font-bold text-node-gallery/60">🖼️ Image Gallery</span>
          <div
            className={cn(
              msg.layout === "grid"
                ? "grid grid-cols-2 gap-2"
                : "flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
            )}
            style={msg.layout !== "grid" ? { scrollSnapType: "x mandatory" } : undefined}
          >
            {images.map((img: any, i: number) => (
              <div
                key={i}
                className={cn(
                  "shrink-0 rounded-lg border border-border overflow-hidden bg-secondary/30 transition-all",
                  msg.selectable && "cursor-pointer hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-95"
                )}
                style={{ width: w, scrollSnapAlign: "start" }}
                onClick={() => msg.selectable && handleButtonClick(img.title || `image_${i}`, img.title || `Image ${i + 1}`)}
              >
                <img
                  src={img.url}
                  alt={img.title || ""}
                  className="w-full object-cover"
                  style={{ height: h }}
                  onError={(e) => { e.currentTarget.src = `https://via.placeholder.com/${w}x${h}?text=No+Image`; }}
                />
                {(img.title || img.description) && (
                  <div className="p-2 space-y-0.5">
                    {img.title && <p className="text-[11px] font-semibold text-foreground truncate">{img.title}</p>}
                    {img.description && <p className="text-[9px] text-muted-foreground line-clamp-2">{img.description}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (msg.role === "assistant") {
      return (
        <>
          <RenderContent content={msg.content} format="markdown" className="text-xs" />
          {isStreaming && msg.id === messages[messages.length - 1]?.id && (
            <span className="inline-block w-1.5 h-3.5 bg-primary/60 ml-0.5 animate-pulse" />
          )}
        </>
      );
    }

    return <RenderContent content={msg.content} format="markdown" className="text-xs" />;
  };

  const chatConfig = workflow.chatConfig || DEFAULT_CHAT_CONFIG;
  const radius = `${chatConfig.borderRadius}px`;

  return (
    <div
      className="w-96 bg-card ltr:border-l rtl:border-r border-border flex flex-col"
      style={{ fontFamily: chatConfig.fontFamily || "Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 border-b border-border"
        style={{
          background: chatConfig.primaryColor
            ? `linear-gradient(135deg, ${chatConfig.primaryColor}22, ${chatConfig.primaryColor}08)`
            : undefined,
        }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            background: chatConfig.primaryColor ? `${chatConfig.primaryColor}30` : "hsl(var(--primary) / 0.2)",
            border: `2px solid ${chatConfig.primaryColor || "hsl(var(--primary) / 0.3)"}`,
          }}
        >
          {chatConfig.headerImageUrl ? (
            <img src={chatConfig.headerImageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Bot className="w-4.5 h-4.5" style={{ color: chatConfig.primaryColor || "hsl(var(--primary))" }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-foreground truncate">{chatConfig.headerTitle || "Agent Preview"}</h2>
          <p className="text-[10px] text-muted-foreground truncate">
            {isRunning ? (waitingForInput ? "Waiting for input..." : "Running workflow...") : chatConfig.headerSubtitle || "Click ▶ to run"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {!isRunning ? (
            <button
              onClick={runWorkflowInChat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: chatConfig.primaryColor ? `${chatConfig.primaryColor}20` : "hsl(var(--primary) / 0.1)",
                color: chatConfig.primaryColor || "hsl(var(--primary))",
              }}
              title="Run workflow"
            >
              <Play className="w-3 h-3" /> Run
            </button>
          ) : (
            <button
              onClick={stopExecution}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              Stop
            </button>
          )}
          <button onClick={resetChat} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Reset">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {onMinimize && (
            <button onClick={onMinimize} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Minimize chat">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", isStreaming ? "bg-warning animate-pulse" : isRunning ? "bg-success animate-pulse" : "bg-muted-foreground/40")} />
            <span className="text-[10px] text-muted-foreground">{isStreaming ? "Streaming" : isRunning ? "Running" : "Idle"}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !isRunning && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-80">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: chatConfig.primaryColor ? `${chatConfig.primaryColor}15` : "hsl(var(--primary) / 0.1)",
                border: `2px solid ${chatConfig.primaryColor ? `${chatConfig.primaryColor}30` : "hsl(var(--primary) / 0.2)"}`,
              }}
            >
              {chatConfig.welcomeAvatarUrl ? (
                <img src={chatConfig.welcomeAvatarUrl} alt="" className="w-full h-full object-cover" />
              ) : chatConfig.bubbleIconUrl ? (
                <img src={chatConfig.bubbleIconUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Sparkles className="w-7 h-7" style={{ color: chatConfig.primaryColor || "hsl(var(--primary))" }} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{chatConfig.headerTitle || "AI Assistant"}</p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
                {chatConfig.welcomeMessage || "Click Run to start a conversation"}
              </p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden"
              style={{
                background: msg.role === "user"
                  ? (chatConfig.userBubbleColor ? `${chatConfig.userBubbleColor}30` : "hsl(var(--accent) / 0.2)")
                  : (chatConfig.primaryColor ? `${chatConfig.primaryColor}30` : "hsl(var(--primary) / 0.2)"),
              }}
            >
              {msg.role === "user" ? (
                <User className="w-3 h-3" style={{ color: chatConfig.userBubbleColor || "hsl(var(--accent))" }} />
              ) : chatConfig.headerImageUrl ? (
                <img src={chatConfig.headerImageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Bot className="w-3 h-3" style={{ color: chatConfig.primaryColor || "hsl(var(--primary))" }} />
              )}
            </div>
            <div
              className="max-w-[80%] px-3 py-2 text-xs leading-relaxed text-foreground"
              style={{
                borderRadius: radius,
                background: msg.role === "user"
                  ? (chatConfig.userBubbleColor ? `${chatConfig.userBubbleColor}18` : "hsl(var(--accent) / 0.1)")
                  : (chatConfig.botBubbleColor ? `${chatConfig.botBubbleColor}18` : "hsl(var(--muted))"),
              }}
            >
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: chatConfig.primaryColor ? `${chatConfig.primaryColor}30` : "hsl(var(--primary) / 0.2)" }}
            >
              <Loader2 className="w-3 h-3 animate-spin" style={{ color: chatConfig.primaryColor || "hsl(var(--primary))" }} />
            </div>
            <div className="bg-muted px-3 py-2" style={{ borderRadius: radius }}>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        {waitingForInput && (
          <p className="text-[10px] font-medium mb-1.5 px-1" style={{ color: chatConfig.primaryColor || "hsl(var(--primary))" }}>{inputPrompt}</p>
        )}
        <div
          className="flex items-end gap-2 bg-muted px-3 py-2 border border-border focus-within:ring-1 focus-within:ring-ring"
          style={{ borderRadius: radius }}
        >
          <textarea
            className="flex-1 bg-transparent text-xs text-foreground resize-none focus:outline-none placeholder:text-muted-foreground min-h-[20px] max-h-[80px]"
            placeholder={waitingForInput ? inputPrompt : "Run the workflow first..."}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={!waitingForInput && !isRunning}
          />
          <button
            onClick={toggleSTT}
            className={cn("p-1.5 rounded-lg transition-colors shrink-0", isListening ? "bg-destructive/20 text-destructive animate-pulse" : "hover:bg-muted-foreground/10 text-muted-foreground")}
            disabled={!waitingForInput}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={submitInput}
            disabled={!input.trim() || !waitingForInput}
            className="p-1.5 rounded-lg disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0"
            style={{
              background: chatConfig.primaryColor || "hsl(var(--primary))",
              color: "white",
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function generateMockResponse(userInput: string, systemPrompt: string): string {
  const lower = userInput.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello! I'm your AI agent running through the workflow. What would you like to explore?";
  }
  if (lower.includes("api")) {
    return "I can make API calls as part of my workflow! Configure endpoints, methods, headers with {{variable}} support.";
  }
  if (systemPrompt.toLowerCase().includes("translator")) {
    return `[Translation of "${userInput}"] — This is a mock translation response.`;
  }
  return `Based on your input: "${userInput}" — here's my response. In production, this comes from the configured AI model with streaming.`;
}
