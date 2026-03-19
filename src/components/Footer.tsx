import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import myLogo from "@/assets/my-Logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const quickLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Browse Businesses", href: "/businesses" },
    { label: "For Students", href: "/auth?type=student" },
    { label: "For Investors", href: "/auth?type=investor" },
  ];

  const legalLinks = [
    "Terms of Service",
    "Privacy Policy",
    "Risk Disclaimer",
    "Cookie Policy",
  ];

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="space-y-5 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                <img
                  src={myLogo}
                  alt="StudentBIZ Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Student<span className="text-[#00c04b]">BIZ</span>
              </span>
            </Link>

            <p className="text-background/60 text-sm leading-relaxed max-w-xs">
              Empowering student entrepreneurs with accessible funding while providing
              investors with meaningful returns and social impact.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-background/8 border border-background/10 flex items-center justify-center text-background/60 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-background/40 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-1.5 text-background/65 hover:text-primary transition-colors text-sm"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-background/40 mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center gap-1.5 text-background/65 hover:text-primary transition-colors text-sm"
                  >
                    <span>{item}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-background/40 mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@studentbiz.com"
                  className="flex items-center gap-3 text-background/65 hover:text-primary transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                  </div>
                  support@studentbiz.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="flex items-center gap-3 text-background/65 hover:text-primary transition-colors text-sm group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                  </div>
                  +234 904 708 6673
                </a>
              </li>
              <li className="flex items-start gap-3 text-background/65 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>
                  1 FFF Road, off Alara Street, <br />
                  Near Queen's College, Yaba, Lagos
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-background/40 text-xs">
            © {currentYear} StudentBIZ Nigeria. All rights reserved.
          </p>
          <p className="text-background/35 text-xs max-w-md text-center md:text-right">
            Investing involves risk. Past performance is not indicative of future results.
            Please read our risk disclaimer before investing.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
