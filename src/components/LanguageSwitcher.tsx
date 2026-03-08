import React from "react";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale, locales } = useI18n();

  return (
    <div className="flex items-center gap-0.5 bg-muted/80 rounded-lg p-0.5 border border-border">
      <Globe className="w-3 h-3 text-muted-foreground mx-1" />
      {locales.map((l) => (
        <button
          key={l.id}
          onClick={() => setLocale(l.id)}
          className={cn(
            "px-2 py-1 rounded-md text-[10px] font-medium transition-all",
            locale === l.id
              ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          title={l.label}
        >
          <span className="mr-0.5">{l.flag}</span>
          {l.id.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
