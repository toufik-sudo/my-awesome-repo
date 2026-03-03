import React from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface Props {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function CanvasControls({ zoom, onZoomIn, onZoomOut, onZoomReset }: Props) {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-card border border-border rounded-lg p-1 shadow-lg">
      <button
        onClick={onZoomOut}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onZoomReset}
        className="px-2 py-1 rounded-md text-[10px] font-mono font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-w-[3rem] text-center"
        title="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        onClick={onZoomIn}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-5 bg-border mx-0.5" />
      <button
        onClick={onZoomReset}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Fit to screen"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
