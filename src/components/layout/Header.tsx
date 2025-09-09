import { Button } from "@/components/ui/button";
import { Globe, Menu, User } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full gradient-wanderlust flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Travelogie</h1>
            <p className="text-xs text-muted-foreground">Learn from Locals</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#destinations" className="text-foreground hover:text-travel-ocean transition-colors">
            Destinations
          </a>
          <a href="#experiences" className="text-foreground hover:text-travel-ocean transition-colors">
            Experiences
          </a>
          <a href="#tours" className="text-foreground hover:text-travel-ocean transition-colors">
            Tours
          </a>
          <a href="#languages" className="text-foreground hover:text-travel-ocean transition-colors">
            Languages
          </a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            Sign In
          </Button>
          <Button variant="wanderlust" size="sm">
            <User className="w-4 h-4" />
            Join Now
          </Button>
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <a href="#destinations" className="block py-2 text-foreground hover:text-travel-ocean">
              Destinations
            </a>
            <a href="#experiences" className="block py-2 text-foreground hover:text-travel-ocean">
              Experiences
            </a>
            <a href="#tours" className="block py-2 text-foreground hover:text-travel-ocean">
              Tours
            </a>
            <a href="#languages" className="block py-2 text-foreground hover:text-travel-ocean">
              Languages
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;