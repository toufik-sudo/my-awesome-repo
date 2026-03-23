import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { ErrorBoundary } from "@/modules/shared/components/ErrorBoundary";
import { Routes } from "@/routes/Routes";
import '@/i18n/config';
import '@/modules/shared/styles/swal.css';

const queryClient = new QueryClient();

const App = () => (
  <ReduxProvider store={store}>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LoadingProvider>
            <AuthProvider>
              <NotificationProvider>
                <NavigationProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes />
                    </BrowserRouter>
                  </TooltipProvider>
                </NavigationProvider>
              </NotificationProvider>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </ReduxProvider>
);

export default App;
