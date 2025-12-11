import React, { useState } from 'react';
import { User, LogOut, Package, CreditCard, Clock, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
        ${activePage === page 
          ? 'bg-accent/10 text-accent' 
          : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Package className="w-8 h-8 text-accent" />
            ShipCrypto
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-2">
          <NavItem page="dashboard" icon={CreditCard} label="Dashboard" />
          <NavItem page="create-label" icon={Package} label="Create Label" />
          <NavItem page="history" icon={Clock} label="History" />
          <NavItem page="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
              <p className="text-xs text-gray-500">User Account</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 font-bold text-primary text-xl">
             <Package className="w-6 h-6 text-accent" />
             ShipCrypto
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-10 bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
               <div className="flex justify-end mb-6">
                 <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6 text-gray-500"/></button>
               </div>
               <nav className="flex-1">
                  <NavItem page="dashboard" icon={CreditCard} label="Dashboard" />
                  <NavItem page="create-label" icon={Package} label="Create Label" />
                  <NavItem page="history" icon={Clock} label="History" />
                  <NavItem page="settings" icon={Settings} label="Settings" />
               </nav>
               <div className="pt-4 border-t">
                 <button onClick={logout} className="flex items-center w-full text-red-600 p-2">
                   <LogOut className="w-4 h-4 mr-2" /> Sign Out
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;