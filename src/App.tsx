import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";

// Dashboard Pages
import DashboardPage from "./pages/dashboard/DashboardPage";

// BPO Pages
import ClientsPage from "./pages/bpo/ClientsPage";

// Client Pages
import ProductsPage from "./pages/client/ProductsPage";
import SectorsPage from "./pages/client/SectorsPage";

// Counting Pages
import CountingLoginPage from "./pages/counting/CountingLoginPage";
import CountingPage from "./pages/counting/CountingPage";
import CountingTestPage from "./pages/counting/CountingTestPage";
import CompletionPage from "./pages/counting/CompletionPage";

// Other Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/counting-test" element={<CountingTestPage />} />
          <Route path="/counting/:countingId" element={<CountingLoginPage />} />
          <Route path="/counting/:countingId/sector/:sectorId" element={<CountingPage />} />
          <Route path="/counting/:countingId/completed" element={<CompletionPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              
              {/* BPO Admin Routes */}
              <Route path="clients" element={
                <ProtectedRoute allowedRoles={['super_admin', 'bpo_admin']}>
                  <ClientsPage />
                </ProtectedRoute>
              } />
              <Route path="counts" element={
                <ProtectedRoute allowedRoles={['super_admin', 'bpo_admin']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Monitoramento de Contagens</h1>
                    <p className="text-muted-foreground mt-2">Em desenvolvimento</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute allowedRoles={['super_admin', 'bpo_admin']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Relatórios</h1>
                    <p className="text-muted-foreground mt-2">Em desenvolvimento</p>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Client Admin Routes */}
              <Route path="products" element={
                <ProtectedRoute allowedRoles={['client_admin']}>
                  <ProductsPage />
                </ProtectedRoute>
              } />
              <Route path="sectors" element={
                <ProtectedRoute allowedRoles={['client_admin']}>
                  <SectorsPage />
                </ProtectedRoute>
              } />
              <Route path="history" element={
                <ProtectedRoute allowedRoles={['client_admin']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Histórico de Contagens</h1>
                    <p className="text-muted-foreground mt-2">Em desenvolvimento</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="communications" element={
                <ProtectedRoute allowedRoles={['client_admin', 'bpo_admin']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Comunicados</h1>
                    <p className="text-muted-foreground mt-2">Em desenvolvimento</p>
                  </div>
                </ProtectedRoute>
              } />
            </Route>
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">403</h1>
                <p className="text-xl text-muted-foreground mb-4">Acesso não autorizado</p>
                <a href="/dashboard" className="text-primary hover:underline">
                  Voltar ao Dashboard
                </a>
              </div>
            </div>
          } />
          
          {/* 404 - Keep as last route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
