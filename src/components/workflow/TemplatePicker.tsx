import React, { useState } from "react";
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from "@/data/workflowTemplates";
import { useWorkflow } from "@/context/WorkflowContext";
import { LayoutTemplate, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function TemplatePicker() {
  const [open, setOpen] = useState(false);
  const { importWorkflow } = useWorkflow();

  const loadTemplate = (template: WorkflowTemplate) => {
    importWorkflow(template.build());
    setOpen(false);
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
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-2 gap-3">
          {WORKFLOW_TEMPLATES.map((t) => (
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
        </div>
      </div>
    </div>
  );
}
