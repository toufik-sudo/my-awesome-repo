import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MicrophoneInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const MicrophoneInput: React.FC<MicrophoneInputProps> = ({
  onTranscript,
  language = 'fr-FR',
  disabled = false,
  className,
  size = 'sm',
}) => {
  const { isListening, isSupported, toggleListening } = useSpeechToText({
    language,
    onResult: (transcript) => {
      onTranscript(transcript);
    },
  });

  if (!isSupported) return null;

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const btnSize = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          onClick={toggleListening}
          className={cn(
            btnSize,
            'rounded-full shrink-0',
            isListening && 'bg-destructive/10 text-destructive animate-pulse',
            className
          )}
        >
          {isListening ? (
            <MicOff className={iconSize} />
          ) : (
            <Mic className={cn(iconSize, 'text-muted-foreground')} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isListening ? 'Stop dictation' : 'Start dictation'}
      </TooltipContent>
    </Tooltip>
  );
};
