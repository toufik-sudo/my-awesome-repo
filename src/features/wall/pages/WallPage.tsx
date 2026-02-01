// -----------------------------------------------------------------------------
// Wall Page Component
// Main wall/feed page showing posts, widgets, and content
// Now connected to real API data with widgets
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallSelection, useIsFreemiumProgram } from '@/hooks/wall';
import { usePostsListData } from '../hooks/usePostsListData';
import { PostsList } from '../components/PostsList';
import { PostsPlaceholder } from '../components/PostsPlaceholder';
import { WallWidgetsSidebar } from '../components/WallWidgetsSidebar';
import { GlobalSlider } from '../components/GlobalSlider';
import { postsApi } from '@/api/PostsApi';
import { toast } from 'sonner';

const WallPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { 
    selectedProgramName, 
    selectedProgramId,
    programs,
    platforms,
    selectedPlatform,
    loadingPlatforms
  } = useWallSelection();
  const isFreemium = useIsFreemiumProgram();

  const {
    postsListData,
    isLoading: postsLoading,
    hasMore,
    handleLoadMoreItems,
    isBeneficiary,
    triggerPostsReload
  } = usePostsListData();

  // Handle post deletion
  const handleDeletePost = async (postId: number) => {
    try {
      await postsApi.deletePost(postId);
      triggerPostsReload();
      toast.success(formatMessage({ id: 'wall.post.deleted', defaultMessage: 'Post deleted successfully' }));
    } catch (error) {
      toast.error(formatMessage({ id: 'wall.post.delete.error', defaultMessage: 'Failed to delete post' }));
    }
  };

  // Handle agenda date change
  const handleDateChange = (date: Date) => {
    console.log('Agenda date changed:', date);
    // TODO: Load tasks for selected date
  };

  // Mock data for widgets - replace with real hooks
  const userCount = 156;
  const agendaTasks = [
    { id: 1, title: 'Team meeting', time: '09:00', type: 'meeting' as const },
    { id: 2, title: 'Complete report', time: '14:00', type: 'task' as const },
    { id: 3, title: 'Client call', time: '16:30', type: 'event' as const },
  ];
  const declarations = [
    { id: 1, label: 'Sales', value: '€12,500' },
    { id: 2, label: 'Contracts', value: 8 },
  ];

  // Show loading while platforms are loading
  if (loadingPlatforms) {
    return (
      <div className="flex gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {formatMessage({ id: 'wall.title', defaultMessage: 'Dashboard' })}
            </h1>
            <p className="text-muted-foreground">
              {formatMessage({ id: 'wall.loading', defaultMessage: 'Loading your dashboard...' })}
            </p>
          </div>
          <PostsPlaceholder count={3} />
        </div>
        
        {/* Skeleton widgets sidebar */}
        <aside className="hidden lg:block w-80 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))}
        </aside>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {formatMessage({ id: 'wall.title', defaultMessage: 'Dashboard' })}
            </h1>
            <p className="text-muted-foreground">
              {selectedProgramName || formatMessage({ id: 'wall.subtitle', defaultMessage: 'Welcome to your dashboard' })}
            </p>
          </div>
          
          {/* Platform and Program Selectors */}
          {(platforms.length > 1 || programs.length > 0) && (
            <GlobalSlider className="shrink-0" />
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {formatMessage({ id: 'wall.stats.programs', defaultMessage: 'Active Programs' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{programs.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatMessage({ id: 'wall.stats.programsDesc', defaultMessage: 'Programs you are enrolled in' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {formatMessage({ id: 'wall.stats.platform', defaultMessage: 'Current Platform' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{selectedPlatform.name || '-'}</div>
              <p className="text-xs text-muted-foreground">
                {formatMessage({ id: 'wall.stats.platformDesc', defaultMessage: 'Your active platform' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {formatMessage({ id: 'wall.stats.posts', defaultMessage: 'Posts' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postsListData.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatMessage({ id: 'wall.stats.postsDesc', defaultMessage: 'Posts loaded' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {formatMessage({ id: 'wall.stats.program', defaultMessage: 'Selected Program' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {selectedProgramName || '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedProgramId ? `ID: ${selectedProgramId}` : formatMessage({ id: 'wall.stats.noProgram', defaultMessage: 'No program selected' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts Feed */}
        <Card>
          <CardHeader>
            <CardTitle>
              {formatMessage({ id: 'wall.recentActivity', defaultMessage: 'Recent Activity' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PostsList
              posts={postsListData}
              isLoading={postsLoading}
              hasMore={hasMore}
              onLoadMore={() => handleLoadMoreItems()}
              onDeletePost={!isBeneficiary ? handleDeletePost : undefined}
              isBeneficiary={isBeneficiary}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Widgets */}
      <WallWidgetsSidebar
        userCount={userCount}
        isLoadingUserCount={false}
        agendaTasks={agendaTasks}
        isLoadingAgenda={false}
        declarations={declarations}
        isLoadingDeclarations={false}
        isBeneficiary={isBeneficiary}
        isFreemium={isFreemium}
        isManager={!isBeneficiary}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default WallPage;
