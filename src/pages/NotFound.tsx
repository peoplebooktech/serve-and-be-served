
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="inline-block p-6 rounded-full bg-peoplebook-lightPurple">
              <span className="text-7xl font-bold gradient-text">404</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved,
            deleted, or never existed in the first place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90 px-8">
                Return Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="border-peoplebook-purple text-peoplebook-purple hover:bg-peoplebook-lightPurple px-8">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
