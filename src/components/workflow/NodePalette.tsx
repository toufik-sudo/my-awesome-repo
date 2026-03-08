import React, { useState, useMemo } from "react";
import type { NodeType } from "@/types/workflow";
import { NODE_ICONS, NODE_COLORS } from "./nodeConfig";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

const PALETTE_ITEMS: { type: NodeType; label: string; group: string }[] = [
  { type: "start", label: "Start", group: "Flow" },
  { type: "user_input", label: "User Input", group: "Flow" },
  { type: "ai_response", label: "AI Response", group: "Flow" },
  { type: "text_display", label: "Text Display", group: "Flow" },
  { type: "button_input", label: "Button Choice", group: "Flow" },
  { type: "image_gallery", label: "Image Gallery", group: "Flow" },
  { type: "condition", label: "Condition", group: "Flow" },
  { type: "end", label: "End", group: "Flow" },
  { type: "component", label: "Component", group: "Flow" },
  { type: "timer", label: "Timer / Delay", group: "Logic" },
  { type: "random_choice", label: "Random Choice", group: "Logic" },
  { type: "loop", label: "Loop", group: "Logic" },
  { type: "action", label: "Action", group: "Logic" },
  { type: "js_function", label: "JS Function", group: "Logic" },
  { type: "set_variable", label: "Set Variable", group: "Logic" },
  { type: "api_call", label: "API Call", group: "Integrations" },
  { type: "email_sender", label: "Email Sender", group: "Integrations" },
  { type: "webhook_trigger", label: "Webhook", group: "Integrations" },
  { type: "db_query", label: "DB Query", group: "Integrations" },
];

const GROUPS = ["Flow", "Integrations", "Logic"];

export function NodePalette() {
  const [search, setSearch] = useState("");
  const { t } = useI18n();
  const filtered = useMemo(() => {
    if (!search.trim()) return PALETTE_ITEMS;
    const q = search.toLowerCase();
    return PALETTE_ITEMS.filter(
      (i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)
    );
  }, [search]);

  const visibleGroups = GROUPS.filter((g) => filtered.some((i) => i.group === g));

  return (
    <div className="w-56 bg-card border-r border-border rtl:border-r-0 rtl:border-l flex flex-col">
      <div className="px-3 py-3 border-b border-border space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t("palette.title")}
        </h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("palette.search")}
            className="w-full pl-7 pr-2 py-1.5 text-[11px] rounded-md bg-secondary border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <div className="p-3 space-y-3 overflow-y-auto flex-1">
        {visibleGroups.map((group) => (
          <div key={group}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 px-1">
              {group}
            </p>
            <div className="space-y-1.5">
              {filtered.filter((i) => i.group === group).map((item) => (
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
        {filtered.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">{t("palette.noResults")} "{search}"</p>
        )}
      </div>
      <div className="px-4 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          {t("palette.hint")}
        </p>
      </div>
    </div>
  );
}
