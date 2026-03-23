import * as React from "react";

import { cn } from "@/lib/utils";
import { MicrophoneInput } from "@/modules/shared/components/MicrophoneInput";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  enableSpeech?: boolean;
  speechLanguage?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, enableSpeech = true, speechLanguage, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref]
    );

    const handleTranscript = React.useCallback(
      (transcript: string) => {
        const textarea = textareaRef.current;
        if (!textarea || props.disabled) return;

        // Use native input setter to trigger React onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;

        const currentValue = textarea.value;
        const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;

        nativeInputValueSetter?.call(textarea, newValue);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      },
      [props.disabled]
    );

    const showMic = enableSpeech && !props.disabled;

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            showMic && "pr-9",
            className,
          )}
          ref={setRefs}
          {...props}
        />
        {showMic && (
          <div className="absolute right-1 top-1">
            <MicrophoneInput
              onTranscript={handleTranscript}
              language={speechLanguage}
              disabled={props.disabled}
            />
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
