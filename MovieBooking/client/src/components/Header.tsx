import { Button } from '@/components/ui/button';
import { Film, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-md px-3 py-2" data-testid="link-home">
            <Film className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold font-display">CineBook</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/movies">
            <Button variant={location === '/movies' ? 'default' : 'ghost'} size="sm" data-testid="link-all-movies">
              All Movies
            </Button>
          </Link>
          {user ? (
            <>
              {user.email === 'admin@example.com' && (
                <Link href="/admin">
                  <Button
                    variant={location === '/admin' ? 'default' : 'ghost'}
                    size="sm"
                    data-testid="link-admin"
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button
                  variant={location === '/profile' ? 'default' : 'ghost'}
                  size="sm"
                  data-testid="link-profile"
                >
                  <User className="w-4 h-4 mr-2" />
                  {user.name}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} data-testid="button-logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" data-testid="link-login">
                Signup/Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
