import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Search, Users, BookOpen, Stethoscope, Wheat, Trophy, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Fetch profiles for search functionality
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase.rpc('get_public_profiles');
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Failed to fetch profiles for search:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Filter profiles based on search query
  const filteredSuggestions = profiles.filter(profile =>
    searchQuery && (
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.skills?.some((skill: string) => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  ).slice(0, 6); // Limit to 6 results

  const handleSearchResultClick = (profileId: string) => {
    setIsSearchFocused(false);
    setSearchQuery("");
    navigate(`/profiles/${profileId}`);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/03dda1ae-fe4e-4afe-88ab-3f4889cf38bf.png" 
                alt="Peoplebook.ai" 
                className="h-10 w-auto"
              />
            </Link>
            
            {/* Search Panel */}
            <div className="hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search people, skills, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="pl-10 pr-4 w-80 bg-slate-50 border-slate-200 rounded-full focus:bg-white focus:border-peoplebook-blue transition-all duration-200"
                />
              </div>
              
              {/* Search Dropdown */}
              {(isSearchFocused && (searchQuery || filteredSuggestions.length > 0)) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto z-50">
                  {searchQuery && (
                    <div className="p-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3 text-sm text-slate-600">
                        <Search className="h-4 w-4" />
                        <span>Search for "{searchQuery}"</span>
                      </div>
                    </div>
                  )}
                  
                  {filteredSuggestions.length > 0 && (
                    <div className="py-2">
                      {filteredSuggestions.map((profile, index) => (
                        <button
                          key={profile.id || index}
                          className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-slate-50 transition-colors text-left"
                          onClick={() => handleSearchResultClick(profile.id)}
                        >
                          {profile.image_url ? (
                            <img
                              src={profile.image_url}
                              alt={profile.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-peoplebook-blue/10 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-peoplebook-blue" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 truncate">{profile.name}</div>
                            <div className="text-sm text-slate-500 truncate">
                              {profile.title && profile.company ? `${profile.title} at ${profile.company}` : 
                               profile.title || profile.company || 'Profile'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchQuery && filteredSuggestions.length === 0 && (
                    <div className="p-4 text-center text-slate-500">
                      No profiles found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-700 hover:text-peoplebook-blue font-medium">
              Home
            </Link>
            <Link to="/profiles" className="text-slate-700 hover:text-peoplebook-blue font-medium">
              Profiles
            </Link>
            <Link to="/about" className="text-slate-700 hover:text-peoplebook-blue font-medium">
              About
            </Link>
            <Link to="/how-it-works" className="text-slate-700 hover:text-peoplebook-blue font-medium">
              How It Works
            </Link>
            <Link to="/dashboard" className="text-slate-700 hover:text-peoplebook-blue font-medium">
              Dashboard
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-600 text-sm">Welcome, {user.user_metadata?.name || user.email}</span>
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  className="border-peoplebook-blue text-peoplebook-blue hover:bg-slate-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button className="bg-peoplebook-blue hover:bg-peoplebook-blue/90 text-white">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="border-peoplebook-blue text-peoplebook-blue hover:bg-slate-50">
                    Log In
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-slate-700 hover:text-peoplebook-blue focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search people, skills, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-slate-50 border-slate-200 rounded-full"
              />
            </div>
          </div>
          
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/profiles" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              onClick={toggleMenu}
            >
              Profiles
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link 
              to="/how-it-works" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <div className="flex flex-col space-y-2 mt-4 px-3 pb-3">
              {user ? (
                <div className="space-y-2">
                  <div className="text-slate-600 text-sm text-center">Welcome, {user.user_metadata?.name || user.email}</div>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline" 
                    className="border-peoplebook-blue text-peoplebook-blue hover:bg-slate-50 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/auth">
                    <Button className="bg-peoplebook-blue hover:bg-peoplebook-blue/90 text-white w-full">
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" className="border-peoplebook-blue text-peoplebook-blue hover:bg-slate-50 w-full">
                      Log In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
