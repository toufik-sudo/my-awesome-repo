import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { IntlProvider } from "./providers";
import { UserProvider } from "./contexts/UserContext";
import AuthProvider from "./providers/AuthProvider";
import MainRouter from "./router/MainRouter";

// Import main styles
import './styles/main.scss';

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <IntlProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <UserProvider>
              <AuthProvider>
                <MainRouter />
              </AuthProvider>
            </UserProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </IntlProvider>
  </Provider>
);

export default App;
