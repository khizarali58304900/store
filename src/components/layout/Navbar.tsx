
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/0e29d908-86b1-4b9b-80ac-f9f6d1eac5c7.png" 
            alt="Kstore Logo" 
            className="h-8 w-8"
          />
          <span className="text-2xl font-bold text-kstore-purple">Kstore</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            to="/track" 
            className="text-gray-600 hover:text-kstore-purple transition-colors"
          >
            Track Order
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                  className="text-kstore-purple hover:text-kstore-dark-purple hover:bg-kstore-light-gray"
                >
                  Admin Panel
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => logout()}
                className="text-gray-600 hover:text-kstore-purple hover:bg-kstore-light-gray"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-kstore-purple hover:bg-kstore-light-gray"
            >
              Login
            </Button>
          )}
          
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-kstore-purple hover:bg-kstore-light-gray p-2"
            onClick={() => navigate('/checkout')}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
