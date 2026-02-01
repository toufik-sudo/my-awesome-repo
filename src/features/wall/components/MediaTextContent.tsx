// -----------------------------------------------------------------------------
// MediaTextContent Component
// Displays post text content with media
// Migrated from old_app/src/components/atoms/wall/MediaTextContent.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { MediaBlock, MediaFile } from './MediaBlock';

interface MediaTextContentProps {
  content: string;
  file?: MediaFile | null;
  endDate?: string;
  objectId?: number;
  isAutomatic?: boolean;
  automaticType?: string;
  colorFont?: string;
  className?: string;
}

// Simple linkify function - replaces URLs with clickable links
const linkifyText = (text: string): React.ReactNode => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Handle hashtags
const hashtagifyText = (text: string): React.ReactNode => {
  const hashtagRegex = /(#\w+)/g;
  const parts = text.split(hashtagRegex);
  
  return parts.map((part, index) => {
    if (hashtagRegex.test(part)) {
      return (
        <span
          key={index}
          className="text-primary font-medium cursor-pointer hover:underline"
        >
          {part}
        </span>
      );
    }
    // Also linkify URLs within the text
    if (typeof part === 'string') {
      return <React.Fragment key={index}>{linkifyText(part)}</React.Fragment>;
    }
    return part;
  });
};

const MediaTextContent: React.FC<MediaTextContentProps> = ({
  content,
  file,
  endDate,
  objectId,
  isAutomatic = false,
  automaticType,
  colorFont,
  className,
}) => {
  const hasFile = file && (file.url || file.name);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Text Content */}
      <div
        className="text-sm leading-relaxed whitespace-pre-wrap"
        style={colorFont ? { color: colorFont } : undefined}
      >
        {isAutomatic ? (
          <div>
            <div dangerouslySetInnerHTML={{ __html: content }} />
            {/* Additional content for automatic posts */}
            {automaticType && (
              <div className="mt-2 p-2 bg-muted/50 rounded-md text-xs text-muted-foreground">
                <span className="font-medium">{automaticType}</span>
                {endDate && (
                  <span className="ml-2">
                    • Ends: {new Date(endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          hashtagifyText(content)
        )}
      </div>

      {/* Media Content */}
      {hasFile && (
        <MediaBlock
          media={{
            url: file.url || '',
            type: file.type,
            name: file.name,
            extension: file.extension,
            size: file.size,
          }}
        />
      )}
    </div>
  );
};

export { MediaTextContent };
export default MediaTextContent;
