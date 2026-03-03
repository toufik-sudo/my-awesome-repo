import React from "react";
import type { NodeType } from "@/types/workflow";
import { NODE_ICONS, NODE_COLORS } from "./nodeConfig";
import { cn } from "@/lib/utils";

const PALETTE_ITEMS: { type: NodeType; label: string; group: string }[] = [
  { type: "user_input", label: "User Input", group: "Flow" },
  { type: "ai_response", label: "AI Response", group: "Flow" },
  { type: "condition", label: "Condition", group: "Flow" },
  { type: "end", label: "End", group: "Flow" },
  { type: "api_call", label: "API Call", group: "Integrations" },
  { type: "email_sender", label: "Email Sender", group: "Integrations" },
  { type: "webhook_trigger", label: "Webhook", group: "Integrations" },
  { type: "db_query", label: "DB Query", group: "Integrations" },
  { type: "action", label: "Action", group: "Logic" },
  { type: "js_function", label: "JS Function", group: "Logic" },
];

const GROUPS = ["Flow", "Integrations", "Logic"];

export function NodePalette() {
  return (
    <div className="w-56 bg-card border-r border-border flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Blocks
        </h2>
      </div>
      <div className="p-3 space-y-3 overflow-y-auto flex-1">
        {GROUPS.map((group) => (
          <div key={group}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 px-1">
              {group}
            </p>
            <div className="space-y-1.5">
              {PALETTE_ITEMS.filter((i) => i.group === group).map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("nodeType", item.type)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]",
                    NODE_COLORS[item.type]
                  )}
                >
                  {NODE_ICONS[item.type]}
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          Drag blocks onto the canvas to build your agent flow.
        </p>
      </div>
    </div>
  );
}
