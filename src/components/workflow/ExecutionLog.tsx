import React from "react";
import { NODE_ICONS } from "./nodeConfig";
import type { ExecutionState } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface Props {
  execution: ExecutionState;
}

export function ExecutionLog({ execution }: Props) {
  if (execution.log.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 max-h-48 overflow-y-auto bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg z-10">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Execution Log
        </h3>
      </div>
      <div className="p-2 space-y-1">
        {execution.log.map((entry, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-2 px-2 py-1.5 rounded-md text-xs",
              entry.nodeId === execution.currentNodeId && "bg-warning/10"
            )}
          >
            <span className="shrink-0 mt-0.5">{NODE_ICONS[entry.type]}</span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground">{entry.label}</span>
              <p className="text-muted-foreground truncate font-mono text-[10px]">{entry.output}</p>
            </div>
            <span className="text-[9px] text-muted-foreground shrink-0">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
