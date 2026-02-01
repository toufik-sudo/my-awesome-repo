/**
 * LikesModal Component
 * Migrated from old_app/src/components/organisms/modals/LikesModal.tsx
 * Modern implementation using shadcn Dialog
 */

import React from 'react';
import { useIntl } from 'react-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLikesModal } from '@/hooks/modals/useLikesModal';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LikeUser {
  name: string;
  avatar?: string;
}

interface LikesListProps {
  likeNames: LikeUser[];
  postColor?: string;
}

/**
 * List of users who liked a post
 */
const LikesList: React.FC<LikesListProps> = ({ likeNames, postColor }) => {
  return (
    <div className="space-y-2">
      {likeNames.map((user, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className={cn("text-sm font-medium", postColor)}>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Modal displaying users who liked a post
 */
export const LikesModal: React.FC = () => {
  const { formatMessage } = useIntl();
  const { isOpen, data, onClose } = useLikesModal();

  const likeNames = (data?.likeNames || []) as LikeUser[];
  const isExpress = data?.type === 'EXPRESS';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn(
                "h-8 w-8 rounded-full",
                isExpress ? "hover:bg-accent" : "hover:bg-muted"
              )}
            >
              <ArrowLeft className={cn(
                "h-4 w-4",
                isExpress ? "text-primary" : "text-muted-foreground"
              )} />
            </Button>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Heart className={cn(
                "h-5 w-5",
                isExpress ? "fill-primary text-primary" : "fill-secondary text-secondary"
              )} />
              {formatMessage({ id: 'wall.likes.title' }, { count: likeNames.length })}
            </DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[300px] pr-4">
          {likeNames.length > 0 ? (
            <LikesList 
              likeNames={likeNames} 
              postColor={isExpress ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"} 
            />
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              {formatMessage({ id: 'wall.likes.empty' })}
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LikesModal;
