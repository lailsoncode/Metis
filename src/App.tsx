import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import MetisHome from "./pages/MetisHome";
import Matricula from "./pages/Matricula";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminReports from "./pages/AdminReports";
import AdminCourses from "./pages/AdminCourses";
import AdminUsers from "./pages/AdminUsers";
import AdminCertificates from "./pages/AdminCertificates";
import MyCourses from "./pages/MyCourses";
import Course from "./pages/Course";
import Profile from "./pages/Profile";
import Certificates from "./pages/Certificates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MetisHome />} />
            <Route path="/matricula" element={<Matricula />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/course/:courseId" element={<Course />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedAdminRoute>
                  <AdminReports />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/courses" 
              element={
                <ProtectedAdminRoute>
                  <AdminCourses />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedAdminRoute>
                  <AdminUsers />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/certificates" 
              element={
                <ProtectedAdminRoute>
                  <AdminCertificates />
                </ProtectedAdminRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
