
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">Peoplebook.ai</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-peoplebook-purple font-medium">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-peoplebook-purple font-medium">
              About
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-peoplebook-purple font-medium">
              How It Works
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-peoplebook-purple font-medium">
              Dashboard
            </Link>
            <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90">
              Sign Up
            </Button>
            <Button variant="outline" className="border-peoplebook-purple text-peoplebook-purple hover:bg-peoplebook-lightPurple">
              Log In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-foreground hover:text-peoplebook-purple focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-peoplebook-lightPurple"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-peoplebook-lightPurple"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link 
              to="/how-it-works" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-peoplebook-lightPurple"
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-peoplebook-lightPurple"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <div className="flex flex-col space-y-2 mt-4 px-3 pb-3">
              <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90 w-full">
                Sign Up
              </Button>
              <Button variant="outline" className="border-peoplebook-purple text-peoplebook-purple hover:bg-peoplebook-lightPurple w-full">
                Log In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
