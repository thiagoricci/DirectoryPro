import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ClientLogin from "./pages/ClientLogin";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ClientDirectory from "./pages/ClientDirectory";
import RealtorDirectory from "./pages/RealtorDirectory";
import NotFound from "./pages/NotFound";
import DebugClientAccess from "./pages/DebugClientAccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-login" element={<ClientLogin />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/directory" element={<ClientDirectory />} />
                <Route path="/directory/:realtorId" element={<ClientDirectory />} />
                <Route path="/realtor-directory" element={
                  <ProtectedRoute>
                    <RealtorDirectory />
                  </ProtectedRoute>
                } />
                <Route path="/debug-client-access" element={
                  <ProtectedRoute>
                    <DebugClientAccess />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
