
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer-gradient mt-16 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-peoplebook-blue">Peoplebook.ai</span>
            </Link>
            <p className="mt-4 text-slate-600 max-w-md">
              Connecting individuals, communities, and organizations for 
              co-creating, co-growth, and shared experiences through non-formal education and mentoring.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-peoplebook-blue">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-peoplebook-blue">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-peoplebook-blue">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-peoplebook-blue">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-peoplebook-text">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-600 hover:text-peoplebook-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-peoplebook-blue">
                  About
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 hover:text-peoplebook-blue">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 hover:text-peoplebook-blue">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-peoplebook-text">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-600 hover:text-peoplebook-blue">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 hover:text-peoplebook-blue">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-600 hover:text-peoplebook-blue">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Peoplebook.ai. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 mt-4 md:mt-0">
            Serve and Be Served
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
