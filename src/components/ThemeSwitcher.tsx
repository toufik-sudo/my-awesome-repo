import React from "react";
import { useTheme, type Theme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-0.5 bg-muted/80 rounded-lg p-0.5 border border-border">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={cn(
            "px-2 py-1 rounded-md text-[10px] font-medium transition-all",
            theme === t.id
              ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          title={t.label}
        >
          <span className="mr-1">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
