
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { DownloadWebsiteButton } from '@/components/admin/DownloadWebsiteButton';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!user?.isAdmin) {
    navigate('/login');
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-kstore-purple text-white' : 'hover:bg-gray-100';
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-white w-64 border-r shadow-sm">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-kstore-purple">KStore Admin</span>
          </Link>
        </div>
        
        <nav className="mt-6 px-2 space-y-1">
          <Link 
            to="/admin" 
            className={`block px-4 py-2 rounded-md transition-colors ${isActive('/admin')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className={`block px-4 py-2 rounded-md transition-colors ${isActive('/admin/products')}`}
          >
            Products
          </Link>
          <Link 
            to="/admin/orders" 
            className={`block px-4 py-2 rounded-md transition-colors ${isActive('/admin/orders')}`}
          >
            Orders
          </Link>
        </nav>
        
        <div className="px-4 py-6">
          <DownloadWebsiteButton />
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <span>{user?.email}</span>
            <Button 
              variant="ghost" 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-red-500 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            {location.pathname === '/admin' && 'Dashboard'}
            {location.pathname === '/admin/products' && 'Products Management'}
            {location.pathname === '/admin/orders' && 'Orders Management'}
          </h1>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
