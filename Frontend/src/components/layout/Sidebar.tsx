import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Heart, 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const menuItems: Record<UserRole, Array<{ icon: any; label: string; path: string }>> = {
  donor: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/donor/dashboard' },
    { icon: Building2, label: 'NGOs', path: '/ngos' },
    { icon: Heart, label: 'My Donations', path: '/donor/donations' },
    { icon: BarChart3, label: 'Impact Report', path: '/donor/reports' },
  ],
  ngo: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/ngo/dashboard' },
    { icon: Heart, label: 'Donations', path: '/ngo/donations' },
    { icon: BarChart3, label: 'Spending', path: '/ngo/spending' },
    { icon: Building2, label: 'Profile', path: '/ngo/profile' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShieldCheck, label: 'Verify NGOs', path: '/admin/verify' },
    { icon: Building2, label: 'All NGOs', path: '/admin/ngos' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  ],
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const items = menuItems[user.role];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">DaanDrishti</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1 capitalize">{user.role} Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4 p-3 bg-sidebar-accent rounded-lg">
          <p className="text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
          <p className="text-xs text-sidebar-accent-foreground/70">{user.email}</p>
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-sidebar flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
