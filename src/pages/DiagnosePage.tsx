import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Camera, Video, Mic, Image, X, StopCircle, AlertCircle, Car, Loader2, ScanSearch, BookOpen } from "lucide-react";
import { useStore, MediaAttachment, Message } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { compressImage } from "../utils/imageCompression";
import { extractDtcFromImage } from "../utils/ocrDtc";
import { DTCLookup } from "../components/DTCLookup";
import { supabase } from "../integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";

export default function DiagnosePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { vehicles, activeVehicleId, sessions, createSession, addMessage, updateMessage, setActiveSession, initialize, initialized } = useStore();
  
  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId);
  const currentSession = sessions.find((s) => s.id === sessionId);
  const messages = currentSession?.messages ?? [];

  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | null>(null);
  const [showDTCLookup, setShowDTCLookup] = useState(false);
  const [detectedCodes, setDetectedCodes] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => { initialize(); }, []);

  useEffect(() => {
    if (sessionId) setActiveSession(sessionId);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check for active vehicle
  if (!activeVehicle) {
    return (
      <div className="p-4 text-center py-20">
        <AlertCircle className="w-12 h-12 mx-auto text-warning mb-4" />
        <h2 className="font-display text-xl font-semibold mb-2">No Vehicle Selected</h2>
        <p className="text-muted-foreground mb-6">Select a vehicle from your garage first</p>
        <button
          onClick={() => navigate("/garage")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
        >
          Go to Garage
        </button>
      </div>
    );
  }

  const startSession = async () => {
    const session = await createSession(activeVehicle.id);
    navigate(`/diagnose/${session.id}`);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith("image/");
      const type = file.type.startsWith("video/") ? "video" : "image";

      let processedFile = file;
      if (isImage) {
        setIsProcessingImage(true);
        try {
          // Compress
          const originalSize = file.size;
          processedFile = await compressImage(file);
          const savings = Math.round((1 - processedFile.size / originalSize) * 100);
          if (savings > 5) {
            toast.success(`Compressed ${file.name}: ${savings}% smaller`);
          }

          // OCR for DTC codes
          const ocrResult = await extractDtcFromImage(processedFile);
          if (ocrResult.dtcCodes.length > 0) {
            const codes = ocrResult.dtcCodes.join(", ");
            toast.success(`Detected DTC codes: ${codes}`, { duration: 6000 });
            // Store detected codes and auto-append to input
            setDetectedCodes(ocrResult.dtcCodes);
            setInput((prev) =>
              prev ? `${prev}\n\nDetected DTCs: ${codes}` : `Detected DTCs: ${codes}`
            );
          }
        } catch (err) {
          console.error("Image processing error:", err);
          toast.error("Image processing failed, using original");
          processedFile = file;
        } finally {
          setIsProcessingImage(false);
        }
      }

      const attachment: MediaAttachment = {
        id: crypto.randomUUID(),
        type,
        url: URL.createObjectURL(processedFile),
        name: processedFile.name,
        size: processedFile.size,
      };
      setAttachments((prev) => [...prev, attachment]);
    }
    e.target.value = "";
  };

  const startRecording = async (type: "video" | "audio") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === "video" ? "video/webm" : "audio/webm",
        });
        const attachment: MediaAttachment = {
          id: crypto.randomUUID(),
          type,
          url: URL.createObjectURL(blob),
          name: `${type}-${Date.now()}.webm`,
          size: blob.size,
        };
        setAttachments((prev) => [...prev, attachment]);
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        setMediaType(null);
      };

      recorder.start();
      setIsRecording(true);
      setMediaType(type);
    } catch (err) {
      toast.error("Could not access camera/microphone");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const removeAttachment = (id: string) => {
    const att = attachments.find((a) => a.id === id);
    if (att) URL.revokeObjectURL(att.url);
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCodeSelect = (code: string) => {
    setInput(`What does DTC code ${code} mean for my ${activeVehicle.year} ${activeVehicle.brand} ${activeVehicle.model}? What are the likely causes and how should I diagnose it?`);
    setShowDTCLookup(false);
  };

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!currentSession) {
      startSession();
      return;
    }

    const userMessage: Omit<Message, "id" | "timestamp"> = {
      role: "user",
      content: input,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      vehicleContext: activeVehicle,
    };

    addMessage(currentSession.id, userMessage);
    const messageHistory = [...messages, { role: "user" as const, content: input }];
    setInput("");
    setAttachments([]);
    setDetectedCodes([]);
    setIsLoading(true);

    // Add streaming assistant message placeholder
    addMessage(currentSession.id, {
      role: "assistant",
      content: "",
      isStreaming: true,
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diagnose`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: messageHistory.map((m) => ({ role: m.role, content: m.content })),
            vehicle: {
              brand: activeVehicle.brand,
              model: activeVehicle.model,
              year: activeVehicle.year,
              engine: activeVehicle.engine,
              fuelType: activeVehicle.fuelType,
              transmission: activeVehicle.transmission,
              mileage: activeVehicle.mileage,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              const sessions = useStore.getState().sessions;
              const sess = sessions.find((s) => s.id === currentSession.id);
              const lastMsg = sess?.messages[sess.messages.length - 1];
              if (lastMsg && lastMsg.role === "assistant") {
                updateMessage(currentSession.id, lastMsg.id, { content: assistantContent });
              }
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Mark streaming as complete
      const sessions = useStore.getState().sessions;
      const sess = sessions.find((s) => s.id === currentSession.id);
      const lastMsg = sess?.messages[sess.messages.length - 1];
      if (lastMsg && lastMsg.isStreaming) {
        updateMessage(currentSession.id, lastMsg.id, { isStreaming: false });
      }
    } catch (error) {
      console.error("AI request failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get AI response");
      
      // Update the placeholder message with error
      const sessions = useStore.getState().sessions;
      const sess = sessions.find((s) => s.id === currentSession.id);
      const lastMsg = sess?.messages[sess.messages.length - 1];
      if (lastMsg && lastMsg.role === "assistant") {
        updateMessage(currentSession.id, lastMsg.id, {
          content: "Sorry, I couldn't process your request. Please try again.",
          isStreaming: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentSession) {
    return (
      <div className="p-4 text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent flex items-center justify-center">
          <Car className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-xl font-semibold mb-2">
          {activeVehicle.brand} {activeVehicle.model}
        </h2>
        <p className="text-muted-foreground mb-1">{activeVehicle.year}</p>
        {activeVehicle.engine && <p className="text-sm text-muted-foreground mb-6">{activeVehicle.engine}</p>}
        
        <button
          onClick={startSession}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition"
        >
          Start Diagnosis Session
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Vehicle Header */}
      <div className="px-4 py-3 border-b bg-card/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">
            {activeVehicle.year} {activeVehicle.brand} {activeVehicle.model}
          </span>
        </div>
        <button
          onClick={() => setShowDTCLookup(!showDTCLookup)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            showDTCLookup ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          DTC Lookup
        </button>
      </div>

      {/* DTC Lookup Panel */}
      <AnimatePresence>
        {showDTCLookup && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b overflow-hidden"
          >
            <div className="p-4">
              <DTCLookup initialCodes={detectedCodes} onCodeSelect={handleCodeSelect} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Ask a question about your vehicle</p>
            <p className="text-sm mt-1">You can attach photos, videos, or voice recordings</p>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
              }`}
            >
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {msg.attachments.map((att) => (
                    <div key={att.id} className="rounded-lg overflow-hidden">
                      {att.type === "image" && (
                        <img src={att.url} alt={att.name} className="max-w-[200px] max-h-[150px] object-cover" />
                      )}
                      {att.type === "video" && (
                        <video src={att.url} controls className="max-w-[200px] max-h-[150px]" />
                      )}
                      {att.type === "audio" && (
                        <audio src={att.url} controls className="w-[200px]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:bg-muted prose-pre:text-foreground prose-code:text-primary prose-code:before:content-none prose-code:after:content-none">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t px-4 py-2 flex gap-2 overflow-x-auto"
          >
            {attachments.map((att) => (
              <div key={att.id} className="relative shrink-0">
                {att.type === "image" && (
                  <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded-lg" />
                )}
                {att.type === "video" && (
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                {att.type === "audio" && (
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Mic className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="border-t p-4 space-y-3 safe-bottom bg-background">
        {isRecording && (
          <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
            <span className="text-sm font-medium text-destructive flex items-center gap-2">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              Recording {mediaType}...
            </span>
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <StopCircle className="w-4 h-4" />
              Stop
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingImage || isLoading}
              className="p-3 hover:bg-muted rounded-lg transition disabled:opacity-50"
              title="Add image"
            >
              {isProcessingImage ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Image className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={() => startRecording("video")}
              disabled={isRecording || isLoading}
              className="p-3 hover:bg-muted rounded-lg transition disabled:opacity-50"
              title="Record video"
            >
              <Video className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => startRecording("audio")}
              disabled={isRecording || isLoading}
              className="p-3 hover:bg-muted rounded-lg transition disabled:opacity-50"
              title="Record voice"
            >
              <Mic className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Describe the issue..."
            rows={1}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-card border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />

          <button
            onClick={sendMessage}
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
