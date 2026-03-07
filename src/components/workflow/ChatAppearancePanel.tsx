import React from "react";
import { useWorkflow } from "@/context/WorkflowContext";
import { DEFAULT_CHAT_CONFIG } from "@/types/workflow";
import { Image, Type, Palette, MessageCircle, Bot, CircleDot } from "lucide-react";

function Field({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function ColorInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || "#6c5ce7"}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent"
      />
      <input
        className="flex-1 bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function ChatAppearancePanel() {
  const { workflow, updateChatConfig } = useWorkflow();
  const config = workflow.chatConfig || DEFAULT_CHAT_CONFIG;

  return (
    <div className="space-y-5">
      {/* Section: Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border">
          <div className="w-5 h-5 rounded-md bg-primary/20 flex items-center justify-center">
            <Type className="w-3 h-3 text-primary" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Chat Header</span>
        </div>
        <Field label="Title" icon={<Type className="w-3 h-3" />}>
          <input
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={config.headerTitle}
            onChange={(e) => updateChatConfig({ headerTitle: e.target.value })}
            placeholder="AI Assistant"
          />
        </Field>
        <Field label="Subtitle">
          <input
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={config.headerSubtitle}
            onChange={(e) => updateChatConfig({ headerSubtitle: e.target.value })}
            placeholder="Always here to help"
          />
        </Field>
        <Field label="Header Image URL" icon={<Image className="w-3 h-3" />}>
          <input
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            value={config.headerImageUrl}
            onChange={(e) => updateChatConfig({ headerImageUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
          {config.headerImageUrl && (
            <div className="mt-1.5 flex items-center gap-2">
              <img src={config.headerImageUrl} alt="Header" className="w-8 h-8 rounded-lg object-cover border border-border" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <span className="text-[9px] text-muted-foreground">Preview</span>
            </div>
          )}
        </Field>
      </div>

      {/* Section: Chat Bubble */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border">
          <div className="w-5 h-5 rounded-md bg-accent/20 flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-accent" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Chat Bubble (Closed)</span>
        </div>
        <Field label="Bubble Icon URL" icon={<CircleDot className="w-3 h-3" />}>
          <input
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            value={config.bubbleIconUrl}
            onChange={(e) => updateChatConfig({ bubbleIconUrl: e.target.value })}
            placeholder="https://example.com/icon.png"
          />
          {config.bubbleIconUrl && (
            <div className="mt-1.5 flex items-center gap-2">
              <img src={config.bubbleIconUrl} alt="Bubble" className="w-8 h-8 rounded-full object-cover border border-border" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <span className="text-[9px] text-muted-foreground">Preview</span>
            </div>
          )}
        </Field>
      </div>

      {/* Section: Welcome Screen */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border">
          <div className="w-5 h-5 rounded-md bg-node-ai/20 flex items-center justify-center">
            <Bot className="w-3 h-3 text-node-ai" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Welcome Screen</span>
        </div>
        <Field label="Welcome Avatar URL" icon={<Image className="w-3 h-3" />}>
          <input
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            value={config.welcomeAvatarUrl}
            onChange={(e) => updateChatConfig({ welcomeAvatarUrl: e.target.value })}
            placeholder="https://example.com/avatar.png"
          />
          {config.welcomeAvatarUrl && (
            <div className="mt-1.5 flex items-center gap-2">
              <img src={config.welcomeAvatarUrl} alt="Welcome" className="w-10 h-10 rounded-full object-cover border border-border" onError={(e) => (e.currentTarget.style.display = 'none')} />
              <span className="text-[9px] text-muted-foreground">Preview</span>
            </div>
          )}
        </Field>
        <Field label="Welcome Message">
          <textarea
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-16"
            value={config.welcomeMessage}
            onChange={(e) => updateChatConfig({ welcomeMessage: e.target.value })}
            placeholder="Start a conversation..."
          />
        </Field>
      </div>

      {/* Section: Theme */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1.5 border-b border-border">
          <div className="w-5 h-5 rounded-md bg-warning/20 flex items-center justify-center">
            <Palette className="w-3 h-3 text-warning" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Theme</span>
        </div>
        <Field label="Primary Color">
          <ColorInput value={config.primaryColor} onChange={(v) => updateChatConfig({ primaryColor: v })} placeholder="#6c5ce7" />
        </Field>
        <Field label="User Bubble Color">
          <ColorInput value={config.userBubbleColor} onChange={(v) => updateChatConfig({ userBubbleColor: v })} placeholder="#00cec9" />
        </Field>
        <Field label="Bot Bubble Color">
          <ColorInput value={config.botBubbleColor} onChange={(v) => updateChatConfig({ botBubbleColor: v })} placeholder="#2d3436" />
        </Field>
        <Field label="Border Radius">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="24"
              value={config.borderRadius}
              onChange={(e) => updateChatConfig({ borderRadius: parseInt(e.target.value) })}
              className="flex-1 accent-primary"
            />
            <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{config.borderRadius}px</span>
          </div>
        </Field>
        <Field label="Font">
          <select
            className="w-full bg-muted border border-border rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={config.fontFamily}
            onChange={(e) => updateChatConfig({ fontFamily: e.target.value })}
          >
            <option value="Inter">Inter</option>
            <option value="system-ui">System UI</option>
            <option value="Georgia">Georgia (Serif)</option>
            <option value="JetBrains Mono">JetBrains Mono</option>
          </select>
        </Field>
      </div>
    </div>
  );
}
