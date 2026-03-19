import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Users, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import myLogo from "@/assets/my-Logo.png";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, LogOut } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/businesses", label: "Browse Businesses" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border/40"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <img
                src={myLogo}
                alt="StudentBIZ Logo"
                className="h-10 w-auto object-contain"
              />
            </motion.div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Student<span className="text-[#00c04b]">BIZ</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="hero"
                    size="default"
                    className="gap-2 rounded-full px-8 font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?type=student">
                  <Button
                    variant="outline"
                    size="default"
                    className="gap-2 rounded-full px-10 font-medium border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-all"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Students
                  </Button>
                </Link>
                <Link to="/auth?type=investor">
                  <Button
                    variant="hero"
                    size="default"
                    className="gap-2 rounded-full px-10 font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    <Users className="w-4 h-4" />
                    Investors
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-muted/80 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border/40 shadow-lg"
          >
            <div className="container mx-auto px-4 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/40 mt-2">
                {session ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="hero" className="w-full gap-2 rounded-xl">
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth?type=student" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full gap-2 rounded-xl">
                        <GraduationCap className="w-4 h-4" />
                        For Students
                      </Button>
                    </Link>
                    <Link to="/auth?type=investor" onClick={() => setIsOpen(false)}>
                      <Button variant="hero" className="w-full gap-2 rounded-xl">
                        <Users className="w-4 h-4" />
                        For Investors
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
