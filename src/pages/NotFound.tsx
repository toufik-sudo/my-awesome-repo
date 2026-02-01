// -----------------------------------------------------------------------------
// NotFound Page Component
// Enhanced 404 page that adapts based on authentication status
// Migrated from old_app/src/components/pages/NotFoundPage.tsx
// -----------------------------------------------------------------------------

import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Home, ArrowLeft, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/auth';
import { ROOT, WALL_ROUTE } from '@/constants/routes';
import { DashboardLayout } from '@/features/wall';

/**
 * Error 404 content component
 */
interface Error404ContentProps {
  isAuthenticated: boolean;
}

const Error404Content: React.FC<Error404ContentProps> = ({ isAuthenticated }) => {
  const returnPath = isAuthenticated ? WALL_ROUTE : ROOT;
  const returnLabelId = isAuthenticated ? 'page.not.found.logged.cta' : 'page.not.found.anonymous.cta';
  const returnDefault = isAuthenticated ? 'Return to Dashboard' : 'Return to Home';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-10 pb-6 space-y-6">
          {/* 404 Number */}
          <div className="relative">
            <span className="text-[120px] font-bold leading-none text-primary/10">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              <FormattedMessage 
                id="page.not.found.error" 
                defaultMessage="Page Not Found" 
              />
            </h1>
            <p className="text-muted-foreground">
              <FormattedMessage 
                id="page.not.found.error.message" 
                defaultMessage="Sorry, the page you're looking for doesn't exist or has been moved." 
              />
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pb-8">
          <Button asChild className="w-full">
            <Link to={returnPath}>
              <Home className="mr-2 h-4 w-4" />
              <FormattedMessage id={returnLabelId} defaultMessage={returnDefault} />
            </Link>
          </Button>
          
          <Button variant="ghost" onClick={() => window.history.back()} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <FormattedMessage id="page.not.found.goBack" defaultMessage="Go Back" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

/**
 * NotFound page component
 * Renders different layouts based on authentication status
 */
const NotFound: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useProtectedRoute();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  // If authenticated, wrap with dashboard layout
  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <Error404Content isAuthenticated={true} />
      </DashboardLayout>
    );
  }

  // Anonymous users see a standalone page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Error404Content isAuthenticated={false} />
    </div>
  );
};

export default NotFound;
