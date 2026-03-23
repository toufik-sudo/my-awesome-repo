import React, { memo, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface ReactionConfig {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
}

export interface ReactionSummary {
  counts: Partial<Record<ReactionType, number>>;
  total: number;
  userReaction?: ReactionType;
  topReactors?: { name: string; type: ReactionType }[];
}

export interface DynamicReactionsProps {
  summary: ReactionSummary;
  onReact: (type: ReactionType) => void | Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showLabels?: boolean;
  disabled?: boolean;
  className?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const REACTION_CONFIGS: ReactionConfig[] = [
  { type: 'like', emoji: '👍', label: 'reactions.like', color: 'text-blue-500' },
  { type: 'love', emoji: '❤️', label: 'reactions.love', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', label: 'reactions.haha', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'reactions.wow', color: 'text-yellow-500' },
  { type: 'sad', emoji: '😢', label: 'reactions.sad', color: 'text-yellow-600' },
  { type: 'angry', emoji: '😡', label: 'reactions.angry', color: 'text-orange-600' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const DynamicReactions: React.FC<DynamicReactionsProps> = memo(({
  summary,
  onReact,
  size = 'md',
  showCount = true,
  showLabels = false,
  disabled = false,
  className,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  const sizeClasses = useMemo(() => ({
    sm: { btn: 'h-7 text-xs', emoji: 'text-sm', picker: 'text-lg' },
    md: { btn: 'h-8 text-sm', emoji: 'text-base', picker: 'text-xl' },
    lg: { btn: 'h-9 text-base', emoji: 'text-lg', picker: 'text-2xl' },
  }), []);

  const classes = sizeClasses[size];

  const topEmojis = useMemo(() => {
    return Object.entries(summary.counts)
      .filter(([, count]) => count && count > 0)
      .sort(([, a], [, b]) => (b || 0) - (a || 0))
      .slice(0, 3)
      .map(([type]) => REACTION_CONFIGS.find(r => r.type === type)?.emoji)
      .filter(Boolean);
  }, [summary.counts]);

  const handleReact = useCallback(async (type: ReactionType) => {
    if (disabled || isReacting) return;
    setIsReacting(true);
    setIsOpen(false);
    try {
      await onReact(type);
    } finally {
      setIsReacting(false);
    }
  }, [disabled, isReacting, onReact]);

  const userReactionConfig = summary.userReaction
    ? REACTION_CONFIGS.find(r => r.type === summary.userReaction)
    : null;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <TooltipProvider>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={summary.userReaction ? 'secondary' : 'ghost'}
              size="sm"
              disabled={disabled}
              className={cn(
                classes.btn,
                'gap-1 px-2',
                summary.userReaction && userReactionConfig?.color
              )}
              onMouseEnter={() => !disabled && setIsOpen(true)}
            >
              {summary.userReaction && userReactionConfig ? (
                <span className={classes.emoji}>{userReactionConfig.emoji}</span>
              ) : topEmojis.length > 0 ? (
                <span className="flex -space-x-1">
                  {topEmojis.map((e, i) => <span key={i} className={classes.emoji}>{e}</span>)}
                </span>
              ) : (
                <span className={classes.emoji}>👍</span>
              )}
              {showCount && summary.total > 0 && (
                <span className="font-medium">{summary.total}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-1.5 flex gap-1"
            side="top"
            align="start"
            onMouseLeave={() => setIsOpen(false)}
          >
            {REACTION_CONFIGS.map(config => (
              <Tooltip key={config.type}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleReact(config.type)}
                    disabled={disabled}
                    className={cn(
                      'p-1.5 rounded-full transition-transform hover:scale-125 hover:bg-accent',
                      classes.picker,
                      summary.userReaction === config.type && 'bg-accent ring-2 ring-primary/30'
                    )}
                  >
                    {config.emoji}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {t(config.label)}
                  {summary.counts[config.type] ? ` (${summary.counts[config.type]})` : ''}
                </TooltipContent>
              </Tooltip>
            ))}
          </PopoverContent>
        </Popover>
      </TooltipProvider>

      {/* Show breakdown of reactions */}
      {showLabels && summary.total > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {Object.entries(summary.counts)
            .filter(([, count]) => count && count > 0)
            .map(([type, count]) => {
              const config = REACTION_CONFIGS.find(r => r.type === type);
              return config ? (
                <span key={type} className="flex items-center gap-0.5">
                  <span>{config.emoji}</span>
                  <span>{count}</span>
                </span>
              ) : null;
            })}
        </div>
      )}
    </div>
  );
});

DynamicReactions.displayName = 'DynamicReactions';
