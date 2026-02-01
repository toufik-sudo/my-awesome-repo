// -----------------------------------------------------------------------------
// PDFViewerModal Organism Component
// Migrated from old_app/src/components/organisms/modals/TCDynamicModal.tsx
// Modal for displaying PDF documents
// -----------------------------------------------------------------------------

import React, { ReactElement, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { X, Download } from 'lucide-react';
import { PDFViewer, DocumentProps } from '@react-pdf/renderer';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loading } from '@/components/library/atoms/Loading';

export interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ReactElement<DocumentProps>;
  
  title?: string;
  titleId?: string;
  width?: number;
  height?: number;
  showDownload?: boolean;
  className?: string;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  title,
  titleId,
  width = 900,
  height = 900,
  showDownload = false,
  className,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure proper rendering
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          'max-w-[95vw] max-h-[95vh] w-auto p-0 overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {title || (titleId && <FormattedMessage id={titleId} defaultMessage="Document" />)}
          </h2>
          <div className="flex items-center gap-2">
            {showDownload && (
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div 
          className="overflow-auto"
          style={{ maxHeight: '85vh' }}
        >
          {!isReady ? (
            <div className="flex items-center justify-center p-8" style={{ width, height: 400 }}>
              <Loading size="lg" />
            </div>
          ) : (
            <PDFViewer
              width={width}
              height={height}
              style={{ maxHeight: '82vh', maxWidth: '100%', border: 'none' }}
            >
              {document}
            </PDFViewer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PDFViewerModal };
export default PDFViewerModal;
