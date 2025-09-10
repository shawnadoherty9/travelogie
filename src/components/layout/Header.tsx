import { Button } from "@/components/ui/button";
import { Globe, Menu, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You've been signed out of your account.",
      });
      navigate('/');
    }
  };
  return <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between bg-slate-50">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/lovable-uploads/4f14a223-57a1-4a7d-bf9a-6bc3e17c25b9.png" alt="Travelogie Logo - Interactive Culture Platform" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl text-gradient text-sky-950 font-bold">Travelogie</h1>
            <p className="text-xs text-muted-foreground">Learn with Locals</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#destinations" className="text-foreground hover:text-travel-ocean transition-colors">
            Destinations
          </a>
          <Link to="/experiences" className="text-foreground hover:text-travel-ocean transition-colors">
            Experiences
          </Link>
          <Link to="/tours" className="text-foreground hover:text-travel-ocean transition-colors">
            Tours
          </Link>
          <Link to="/languages" className="text-foreground hover:text-travel-ocean transition-colors">
            Languages
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="wanderlust" size="sm" asChild>
                <Link to="/auth">
                  <User className="w-4 h-4" />
                  Join Now
                </Link>
              </Button>
            </>
          )}
          
          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <a href="#destinations" className="block py-2 text-foreground hover:text-travel-ocean">
              Destinations
            </a>
            <Link to="/experiences" className="block py-2 text-foreground hover:text-travel-ocean">
              Experiences
            </Link>
            <Link to="/tours" className="block py-2 text-foreground hover:text-travel-ocean">
              Tours
            </Link>
            <Link to="/languages" className="block py-2 text-foreground hover:text-travel-ocean">
              Languages
            </Link>
          </nav>
        </div>}
    </header>;
};
export default Header;