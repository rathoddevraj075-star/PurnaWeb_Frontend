import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "../services/api";
import {
  FaYoutube,
  FaTiktok,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";

const Footer = () => {
  // Fetch site settings
  const { data: settingsData } = useQuery({
    queryKey: ['public-settings'],
    queryFn: () => settingsService.getPublicSettings(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const settings = settingsData?.data || {};
  const social = settings.socialLinks || {};
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#153820] text-[#E8E6E1] overflow-hidden pt-20 pb-10 px-6 md:px-12 lg:px-24 font-['TT_Firs_Neue']">
      {/* Background decoration - optional subtle gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#1F4D2B] via-[#153820] to-[#0D2615] opacity-50 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1920px] mx-auto">
        {/* Navigation Grid - Spread Out */}
        <div className="w-full mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 w-full">
            {/* Column 1 - Left */}
            <div className="space-y-6 justify-self-start text-left">
              <h3 className="text-xs tracking-[0.2em] font-medium text-white/40 uppercase">Categories</h3>
              <ul className="space-y-3 text-sm md:text-base font-light">
                <li><Link to="/categories/oral-care" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Oral Care</Link></li>
                <li><Link to="/categories/skin-care" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Skin Care</Link></li>
                <li><Link to="/categories/body-care" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Body Care</Link></li>
                <li><Link to="/categories/hair-care" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Hair Care</Link></li>
              </ul>
            </div>

            {/* Column 2 - Center */}
            <div className="space-y-6 md:justify-self-center md:text-center text-left">
              <h3 className="text-xs tracking-[0.2em] font-medium text-white/40 uppercase">Company</h3>
              <ul className="space-y-3 text-sm md:text-base font-light">
                <li><Link to="/about" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Our Story</Link></li>
                <li><Link to="/science" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Science</Link></li>
                <li><Link to="/blog" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Blogs</Link></li>
                <li><Link to="/contact" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3 - Right */}
            <div className="space-y-6 md:justify-self-end md:text-right text-left">
              <h3 className="text-xs tracking-[0.2em] font-medium text-white/40 uppercase">Support</h3>
              <ul className="space-y-3 text-sm md:text-base font-light">
                <li><Link to="/faq" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">FAQ</Link></li>
                <li><Link to="/terms" className="block hover:text-[#E65800] hover:translate-x-1 transition-all duration-300">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/10 relative z-20">
          <div className="text-xs text-white/40 font-light tracking-wide flex flex-col md:flex-row gap-2 md:gap-6">
            <span>&copy; {year} {settings.siteName || 'PurnaRoutine'}. All rights reserved.</span>
            {settings.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                {settings.contactEmail}
              </a>
            )}
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            {social.instagram && <SocialIcon href={social.instagram} icon={<FaInstagram size={18} />} />}
            {social.facebook && <SocialIcon href={social.facebook} icon={<FaFacebookF size={18} />} />}
            {social.youtube && <SocialIcon href={social.youtube} icon={<FaYoutube size={18} />} />}
            {social.twitter && <SocialIcon href={social.twitter} icon={<FaTwitter size={18} />} />}
            {social.linkedin && <SocialIcon href={social.linkedin} icon={<FaLinkedinIn size={18} />} />}


          </div>
        </div>

        {/* Massive Brand Typographic Anchor */}
        <div className="mt-16 md:mt-24 w-full select-none pointer-events-none opacity-[0.08] mix-blend-overlay">
          <h1 className="text-[18vw] leading-[0.7] text-center font-bold tracking-tighter text-white">
            PURNA
          </h1>
        </div>
      </div>
    </footer>
  );
};

// Helper for consistency
const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-[#E65800] hover:border-[#E65800] hover:text-[#153820] transition-all duration-300 hover:scale-110"
    aria-label="Social Link"
  >
    {icon}
  </a>
);

export default Footer;
