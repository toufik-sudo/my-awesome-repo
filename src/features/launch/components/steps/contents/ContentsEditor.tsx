// -----------------------------------------------------------------------------
// Contents Editor Component
// WYSIWYG-like rich text editor for program content
// -----------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Image as ImageIcon,
  Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentsEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  placeholder?: string;
  minHeight?: string;
}

const TOOLBAR_BUTTONS = [
  { icon: Bold, action: 'bold', label: 'Bold' },
  { icon: Italic, action: 'italic', label: 'Italic' },
  { icon: Underline, action: 'underline', label: 'Underline' },
  { type: 'divider' },
  { icon: List, action: 'list', label: 'Bullet List' },
  { icon: ListOrdered, action: 'ordered-list', label: 'Numbered List' },
  { type: 'divider' },
  { icon: AlignLeft, action: 'align-left', label: 'Align Left' },
  { icon: AlignCenter, action: 'align-center', label: 'Align Center' },
  { icon: AlignRight, action: 'align-right', label: 'Align Right' },
  { type: 'divider' },
  { icon: Link2, action: 'link', label: 'Insert Link' },
  { icon: ImageIcon, action: 'image', label: 'Insert Image' },
];

export const ContentsEditor: React.FC<ContentsEditorProps> = ({
  value,
  onChange,
  title,
  placeholder = 'Write your content here...',
  minHeight = '200px',
}) => {
  const { formatMessage } = useIntl();
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const handleToolbarAction = useCallback((action: string) => {
    // Toggle format state (visual only, actual formatting would require a rich text library)
    setActiveFormats((prev) =>
      prev.includes(action)
        ? prev.filter((f) => f !== action)
        : [...prev, action]
    );
  }, []);

  return (
    <Card className="border-2 border-border/50 shadow-sm">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-base">
          <Type className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-background">
          {TOOLBAR_BUTTONS.map((button, index) => {
            if (button.type === 'divider') {
              return (
                <div
                  key={`divider-${index}`}
                  className="w-px h-6 bg-border mx-1"
                />
              );
            }
            const Icon = button.icon!;
            const isActive = activeFormats.includes(button.action!);
            return (
              <Button
                key={button.action}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 w-8 p-0 hover:bg-muted',
                  isActive && 'bg-primary/10 text-primary'
                )}
                onClick={() => handleToolbarAction(button.action!)}
                title={button.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        {/* Editor */}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 rounded-none focus-visible:ring-0 resize-none"
          style={{ minHeight }}
        />
      </CardContent>
    </Card>
  );
};

export default ContentsEditor;
