import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award, 
  Settings, 
  LogOut,
  Wind,
  Leaf,
  GraduationCap,
  BarChart
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meus Cursos", url: "/my-courses", icon: BookOpen },
  { title: "Certificados", url: "/certificates", icon: Award },
  { title: "Perfil", url: "/profile", icon: Settings },
];

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Meus Cursos", url: "/my-courses", icon: GraduationCap },
  { title: "Relatórios", url: "/admin/reports", icon: BarChart },
  { title: "Gerenciar Cursos", url: "/admin/courses", icon: BookOpen },
  { title: "Usuários", url: "/admin/users", icon: Users },
  { title: "Certificados", url: "/admin/certificates", icon: Award },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  // Fallback para emails admin conhecidos
  const isKnownAdmin = user?.email === 'lailson@oxentecode.com.br' || user?.email === 'admin@conexaopalmeira.com';
  const isAdmin = isKnownAdmin || profile?.role === 'admin';
  
  const menuItems = isAdmin ? adminItems : studentItems;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className="w-60">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <Wind className="h-6 w-6 text-primary" />
            <Leaf className="h-6 w-6 text-secondary" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">METIS</span>
            <span className="text-xs text-muted-foreground">
              {isAdmin ? 'Administrador' : 'Estudante'}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAdmin ? 'Administração' : 'Aprendizado'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        {user && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.email || user.email}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="w-full text-xs"
            >
              <LogOut className="h-3 w-3 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}