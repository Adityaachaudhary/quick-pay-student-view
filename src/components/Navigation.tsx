import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, LogOut, User, Users } from 'lucide-react';

export function Navigation() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg gradient-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                EduPay
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link to="/students">
              <Button 
                variant={isActive('/students') ? 'default' : 'ghost'} 
                className="flex items-center space-x-2 transition-smooth"
              >
                <Users className="h-4 w-4" />
                <span>All Students</span>
              </Button>
            </Link>

            {currentUser ? (
              <>
                <Link to="/profile">
                  <Button 
                    variant={isActive('/profile') ? 'default' : 'ghost'} 
                    className="flex items-center space-x-2 transition-smooth"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{currentUser.name}</div>
                    <div className="text-muted-foreground">{currentUser.email}</div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="flex items-center space-x-1 transition-smooth"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="gradient-primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}