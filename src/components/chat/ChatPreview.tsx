import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Bot, User, Loader2, Image, Film } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChatMessage } from "@/types/workflow";

export function ChatPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: "Hello! I'm your AI agent. How can I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Speech-to-Text
  const toggleSTT = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  // Mock streaming response
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

    // Simulate streaming AI response
    const mockResponse = generateMockResponse(text);
    const assistantId = uuidv4();
    let accumulated = "";

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now() },
    ]);

    for (let i = 0; i < mockResponse.length; i++) {
      await new Promise((r) => setTimeout(r, 15 + Math.random() * 25));
      accumulated += mockResponse[i];
      const content = accumulated;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content } : m))
      );
    }

    setIsLoading(false);
    setIsStreaming(false);
  }, [input, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          setInput((prev) => prev + `\n![pasted image](${url})\n`);
        }
        return;
      }
    }
  }, []);

  const handleFileAttach = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) {
      setInput((prev) => prev + `\n![${file.name}](${url})\n`);
    } else if (file.type.startsWith("video/")) {
      setInput((prev) => prev + `\n<video src="${url}" controls style="max-width:100%;border-radius:6px"></video>\n`);
    }
    e.target.value = "";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (const file of Array.from(files)) {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith("image/")) {
        setInput((prev) => prev + `\n![${file.name}](${url})\n`);
      } else if (file.type.startsWith("video/")) {
        setInput((prev) => prev + `\n<video src="${url}" controls style="max-width:100%;border-radius:6px"></video>\n`);
      }
    }
  }, []);

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-xs font-semibold text-foreground">Agent Preview</h2>
          <p className="text-[10px] text-muted-foreground">Test your conversational flow</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className={cn("w-2 h-2 rounded-full", isStreaming ? "bg-yellow-400 animate-pulse" : "bg-green-400")} />
          <span className="text-[10px] text-muted-foreground">{isStreaming ? "Streaming" : "Ready"}</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2.5",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === "user" ? "bg-accent/20" : "bg-primary/20"
              )}
            >
              {msg.role === "user" ? (
                <User className="w-3 h-3 text-accent" />
              ) : (
                <Bot className="w-3 h-3 text-primary" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                msg.role === "user"
                  ? "bg-accent/15 text-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {msg.role === "assistant" ? (
                <MarkdownRenderer content={msg.content} className="text-xs" />
              ) : (
                msg.content
              )}
              {msg.role === "assistant" && isStreaming && msg.id === messages[messages.length - 1]?.id && (
                <span className="inline-block w-1.5 h-3.5 bg-primary/60 ml-0.5 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
            </div>
            <div className="bg-muted rounded-xl px-3 py-2">
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
        <div className="flex items-end gap-2 bg-muted rounded-xl px-3 py-2 border border-border focus-within:ring-1 focus-within:ring-ring">
          <textarea
            className="flex-1 bg-transparent text-xs text-foreground resize-none focus:outline-none placeholder:text-muted-foreground min-h-[20px] max-h-[80px]"
            placeholder="Type a message (supports **markdown**)..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          />
          <label className="p-1.5 rounded-lg hover:bg-muted-foreground/10 text-muted-foreground cursor-pointer shrink-0" title="Attach image">
            <Image className="w-4 h-4" />
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileAttach} />
          </label>
          <button
            onClick={toggleSTT}
            className={cn(
              "p-1.5 rounded-lg transition-colors shrink-0",
              isListening
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "hover:bg-muted-foreground/10 text-muted-foreground"
            )}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello! I'm your AI agent running through the workflow you've built. I can respond to your messages, call APIs, and execute custom functions. What would you like to explore?";
  }
  if (lower.includes("api")) {
    return "I can make API calls as part of my workflow! You can configure endpoints, methods, headers, and request bodies in the API Call block. The response gets passed to the next block in the flow.";
  }
  if (lower.includes("stream")) {
    return "Streaming is enabled by default on AI Response blocks. This means you'll see my response appear token by token, just like this! When connected to a real backend, this uses Server-Sent Events (SSE) for real-time delivery.";
  }
  if (lower.includes("voice") || lower.includes("speech")) {
    return "Voice input is supported! Click the microphone icon to start speaking. Your speech is converted to text using the Web Speech API. In production, you can integrate ElevenLabs for more advanced speech-to-text capabilities.";
  }
  return `I received your message: "${input}". In a production setup, this response would come from the AI model configured in your workflow's AI Response block, with streaming enabled for a real-time experience. Try asking me about APIs, streaming, or voice input!`;
}
