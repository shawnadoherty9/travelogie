import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full gradient-wanderlust flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Travelogie</h3>
                <p className="text-sm opacity-80">Learn from Locals</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Connecting travelers with authentic local experiences worldwide. 
              Discover culture, learn languages, and create memories that last a lifetime.
            </p>
          </div>

          {/* For Travelers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">For Travelers</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Find Experiences</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Book Tours</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Language Lessons</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Travel Guides</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Cultural Events</a></li>
            </ul>
          </div>

          {/* For Locals */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">For Locals</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Become a Guide</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Teach Languages</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Host Experiences</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">List Your Venue</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Earn Income</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Help Center</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Safety Guidelines</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Community Standards</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Trust & Safety</a></li>
            </ul>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <Mail className="w-4 h-4" />
                <span>hello@travelogie.io</span>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <Phone className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm opacity-80">
            © 2024 Travelogie. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Cookie Policy</a>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm">
              Global
            </Button>
            <Button variant="secondary" size="sm">
              USD $
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;