// -----------------------------------------------------------------------------
// Dashboard Layout Component
// Main layout wrapper for the Wall/Dashboard feature
// -----------------------------------------------------------------------------

import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from './DashboardSidebar';
import { Toaster } from '@/components/ui/sonner';
import { WallDataProvider } from '../providers/WallDataProvider';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <WallDataProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          
          <SidebarInset className="flex-1">
            {/* Header with sidebar trigger */}
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1" />
              {/* Add header actions here (notifications, user menu, etc.) */}
            </header>

            {/* Main content area */}
            <main className="flex-1 p-6">
              {children || <Outlet />}
            </main>
          </SidebarInset>
        </div>
        <Toaster />
      </SidebarProvider>
    </WallDataProvider>
  );
};

export default DashboardLayout;
