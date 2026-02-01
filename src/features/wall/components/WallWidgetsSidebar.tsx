// -----------------------------------------------------------------------------
// WallWidgetsSidebar Component
// Right sidebar displaying all wall widgets
// -----------------------------------------------------------------------------

import React from 'react';
import { cn } from '@/lib/utils';
import { UserRankingsWidget } from './widgets/UserRankingsWidget';
import { UserNumberWidget } from './widgets/UserNumberWidget';
import { UserDeclarationsWidget } from './widgets/UserDeclarationsWidget';
import { AgendaWidget } from './widgets/AgendaWidget';
import { ContactUsWidget } from './widgets/ContactUsWidget';

interface WallWidgetsSidebarProps {
  className?: string;
  userCount?: number;
  isLoadingUserCount?: boolean;
  agendaTasks?: Array<{
    id: number;
    title: string;
    time: string;
    type?: 'task' | 'event' | 'meeting';
  }>;
  isLoadingAgenda?: boolean;
  declarations?: Array<{
    id: number;
    label: string;
    value: string | number;
  }>;
  isLoadingDeclarations?: boolean;
  isBeneficiary?: boolean;
  isFreemium?: boolean;
  isManager?: boolean;
  colorMainButtons?: string;
  colorWidgetTitle?: string;
  colorSidebar?: string;
  colorTitle?: string;
  onDateChange?: (date: Date) => void;
}

const WallWidgetsSidebar: React.FC<WallWidgetsSidebarProps> = ({
  className,
  userCount = 0,
  isLoadingUserCount = false,
  agendaTasks = [],
  isLoadingAgenda = false,
  declarations = [],
  isLoadingDeclarations = false,
  isBeneficiary = false,
  isFreemium = false,
  isManager = false,
  colorMainButtons,
  colorWidgetTitle,
  colorSidebar,
  colorTitle,
  onDateChange,
}) => {
  // Hide declarations widget for freemium programs
  const showDeclarationsWidget = !isFreemium;

  return (
    <aside className={cn('hidden lg:block w-80 space-y-4', className)}>
      {/* User Number Widget */}
      <UserNumberWidget
        userCount={userCount}
        isLoading={isLoadingUserCount}
        colorTitle={colorTitle}
        colorMainButtons={colorMainButtons}
        colorWidgetTitle={colorWidgetTitle}
      />

      {/* User Rankings Widget */}
      <UserRankingsWidget
        colorSidebar={colorSidebar}
        colorMainButtons={colorMainButtons}
      />

      {/* User Declarations Widget - Hidden for freemium */}
      {showDeclarationsWidget && (
        <UserDeclarationsWidget
          declarations={declarations}
          isLoading={isLoadingDeclarations}
          isBeneficiary={isBeneficiary}
          isFreemium={isFreemium}
          isManager={isManager}
          colorMainButtons={colorMainButtons}
          colorWidgetTitle={colorWidgetTitle}
        />
      )}

      {/* Agenda Widget */}
      <AgendaWidget
        tasks={agendaTasks}
        isLoading={isLoadingAgenda}
        colorMainButtons={colorMainButtons}
        colorWidgetTitle={colorWidgetTitle}
        onDateChange={onDateChange}
      />

      {/* Contact Us Widget */}
      <ContactUsWidget
        colorWidgetTitle={colorWidgetTitle}
        colorMainButtons={colorMainButtons}
      />
    </aside>
  );
};

export { WallWidgetsSidebar };
export default WallWidgetsSidebar;
