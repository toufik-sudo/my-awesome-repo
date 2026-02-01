// -----------------------------------------------------------------------------
// CreatePostBlock Component
// Migrated from old_app/src/components/molecules/wall/postBlock/CreatePostBlock.tsx
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { MessageSquare, CheckSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useWallSelection } from '@/hooks/wall';
import { POST, TASK } from '@/constants/wall/posts';
import { cn } from '@/lib/utils';
import CreatePostWrapper from './CreatePostWrapper';

interface ICreatePostBlockProps {
  className?: string;
  onPostCreated?: () => void;
}

/**
 * Molecule component used to render Create Post block with tabs for post/task
 */
const CreatePostBlock: React.FC<ICreatePostBlockProps> = ({ className, onPostCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(POST);
  const { formatMessage } = useIntl();
  
  const { programs, selectedProgramIndex } = useWallSelection();
  const selectedProgram = programs[selectedProgramIndex as number];
  
  // Get colors from program design or use defaults
  const contentColor = selectedProgram?.design?.colorContent || 'hsl(var(--primary))';
  const taskColor = selectedProgram?.design?.colorTask || 'hsl(var(--secondary))';

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300',
      isExpanded ? 'shadow-lg' : 'shadow-sm',
      className
    )}>
      <Tabs value={activeTab} onValueChange={handleTabClick}>
        <TabsList className="grid w-full grid-cols-2 h-auto p-0 bg-transparent">
          <TabsTrigger 
            value={POST}
            className={cn(
              'flex items-center gap-2 py-4 rounded-none border-b-2 data-[state=active]:border-current data-[state=inactive]:border-transparent',
              'data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            )}
            style={{ color: activeTab === POST ? contentColor : undefined }}
            onClick={() => handleTabClick(POST)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{formatMessage({ id: 'wall.posts.tab.post' })}</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value={TASK}
            className={cn(
              'flex items-center gap-2 py-4 rounded-none border-b-2 data-[state=active]:border-current data-[state=inactive]:border-transparent',
              'data-[state=active]:bg-transparent data-[state=active]:shadow-none'
            )}
            style={{ color: activeTab === TASK ? taskColor : undefined }}
            onClick={() => handleTabClick(TASK)}
          >
            <CheckSquare className="h-4 w-4" />
            <span>{formatMessage({ id: 'wall.posts.tab.task' })}</span>
          </TabsTrigger>
        </TabsList>

        {isExpanded && (
          <>
            <TabsContent value={POST} className="m-0 p-4">
              <CreatePostWrapper 
                postType={POST} 
                color={contentColor}
                onClose={handleClose}
                onPostCreated={onPostCreated}
              />
            </TabsContent>
            
            <TabsContent value={TASK} className="m-0 p-4">
              <CreatePostWrapper 
                postType={TASK} 
                color={taskColor}
                onClose={handleClose}
                onPostCreated={onPostCreated}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </Card>
  );
};

export default CreatePostBlock;
