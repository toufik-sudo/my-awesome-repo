import React, { useState, useMemo } from "react";
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from "@/data/workflowTemplates";
import { useWorkflow } from "@/context/WorkflowContext";
import { LayoutTemplate, X, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function TemplatePicker() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { importWorkflow } = useWorkflow();

  const filtered = useMemo(() => {
    if (!search.trim()) return WORKFLOW_TEMPLATES;
    const q = search.toLowerCase();
    return WORKFLOW_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  const loadTemplate = (template: WorkflowTemplate) => {
    importWorkflow(template.build());
    setOpen(false);
    setSearch("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Load a template"
      >
        <LayoutTemplate className="w-3.5 h-3.5" />
        Templates
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Workflow Templates</h2>
              <p className="text-[10px] text-muted-foreground">Pre-built flows to get you started fast</p>
            </div>
          </div>
          <button
            onClick={() => { setOpen(false); setSearch(""); }}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates…"
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Template grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-2 gap-3">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => loadTemplate(t)}
              className={cn(
                "group text-left p-4 rounded-xl border border-border bg-secondary/30",
                "hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              )}
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                    {t.description}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-0.5" />
              </div>
              <div className="flex gap-1.5 mt-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-xs text-muted-foreground">No templates match "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
