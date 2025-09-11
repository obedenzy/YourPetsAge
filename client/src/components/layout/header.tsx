import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

export default function Header() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm" data-testid="header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <i className="fas fa-paw text-primary-foreground text-sm"></i>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Pet Age Translator
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/calculator" 
              className={`transition-colors ${location === '/calculator' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-calculator"
            >
              Calculator
            </Link>
            <Link 
              href="/community" 
              className={`transition-colors ${location === '/community' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-community"
            >
              Community
            </Link>
            <Link 
              href="/meetups" 
              className={`transition-colors ${location === '/meetups' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-meetups"
            >
              Meetups
            </Link>
            <Link 
              href="/forums" 
              className={`transition-colors ${location === '/forums' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-forums"
            >
              Forums
            </Link>
            <Link 
              href="/health" 
              className={`transition-colors ${location === '/health' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-health"
            >
              Health
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full" data-testid="token-display">
              <i className="fas fa-coins text-accent text-sm"></i>
              <span className="text-sm font-medium">{user?.tokens ?? 0}</span>
            </div>
            <Link href="/profile">
              <Button className="flex items-center space-x-2" data-testid="button-profile">
                <i className="fas fa-user-circle"></i>
                <span>{user?.username ?? "User"}</span>
              </Button>
            </Link>
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="mobile-menu">
            <Link href="/calculator" className="block py-2 text-muted-foreground hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link href="/community" className="block py-2 text-muted-foreground hover:text-primary transition-colors">
              Community
            </Link>
            <Link href="/meetups" className="block py-2 text-muted-foreground hover:text-primary transition-colors">
              Meetups
            </Link>
            <Link href="/forums" className="block py-2 text-muted-foreground hover:text-primary transition-colors">
              Forums
            </Link>
            <Link href="/health" className="block py-2 text-muted-foreground hover:text-primary transition-colors">
              Health
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
