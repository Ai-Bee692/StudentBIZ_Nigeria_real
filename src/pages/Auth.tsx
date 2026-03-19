import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Users,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import myLogo from "@/assets/my-Logo.png";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type") || "investor";
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && session) {
      navigate("/dashboard");
    }
  }, [session, authLoading, navigate]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolName: "",
    investorType: "community" as "student" | "alumni" | "community"
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // LOGIN LOGIC
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "Sign in successful.",
        });
        
        // No manual navigate needed here, the useEffect at the top handles it 
        // as soon as the session is updated in useAuth().
      } else {
        // REGISTRATION LOGIC
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match.",
            variant: "destructive"
          });
          return;
        }

        const role = userType === "student" ? "student_entrepreneur" : "investor";
        
        // Frontend Validation
        if (formData.password.length < 6) {
          toast({
            title: "Password too short",
            description: "Password must be at least 6 characters long.",
            variant: "destructive"
          });
          return;
        }

        // 1. Sign up user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              role: role,
              investor_type: role === "investor" ? formData.investorType : null,
              school_name: (userType === "student" || (role === "investor" && formData.investorType !== "community")) 
                ? formData.schoolName 
                : null,
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            throw new Error("This email is already taken. Please sign in instead.");
          }
          throw signUpError;
        }
        if (!authData.user) throw new Error("Registration failed");

        // 2. Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: authData.user.id,
            full_name: formData.name,
            role: role,
            investor_type: role === "investor" ? formData.investorType : null,
            school_name: (userType === "student" || (role === "investor" && formData.investorType !== "community")) 
              ? formData.schoolName 
              : null,
          });

        if (profileError) {
          console.error("Profile creation error details:", profileError);
          throw new Error(`Account created, but profile setup failed: ${profileError.message}`);
        }

        toast({
          title: "Account created!",
          description: "Registration successful. You can now sign in.",
        });
        
        // If Supabase auto-logged them in, redirect. Otherwise, show login.
        if (authData.session) {
          navigate("/dashboard");
        } else {
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
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
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Student<span className="text-[#00c04b]">BIZ</span>
            </span>
          </Link>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl font-bold mb-4">
                {userType === "student" 
                  ? "Turn Your Ideas Into Reality" 
                  : "Invest in Tomorrow's Leaders"}
              </h1>
              <p className="text-primary-foreground/80 text-lg">
                {userType === "student"
                  ? "Join hundreds of student entrepreneurs who've received funding through our platform."
                  : "Connect with innovative student ventures and earn competitive returns while making an impact."}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {userType === "student" ? (
                <>
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">$2.4M+</div>
                    <div className="text-sm text-primary-foreground/70">Funded to Students</div>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">94%</div>
                    <div className="text-sm text-primary-foreground/70">Funding Success</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">12%</div>
                    <div className="text-sm text-primary-foreground/70">Avg. Returns</div>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-xl p-4">
                    <div className="text-3xl font-bold mb-1">350+</div>
                    <div className="text-sm text-primary-foreground/70">Active Ventures</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="text-sm text-primary-foreground/60">
            © 2024 StudentBIZ. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* User Type Toggle */}
          <div className="flex gap-2 mb-8">
            <Link to="/auth?type=student" className="flex-1">
              <Button
                variant={userType === "student" ? "hero" : "outline"}
                className="w-full gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </Button>
            </Link>
            <Link to="/auth?type=investor" className="flex-1">
              <Button
                variant={userType === "investor" ? "hero" : "outline"}
                className="w-full gap-2"
              >
                <Users className="w-4 h-4" />
                Investor
              </Button>
            </Link>
          </div>

          <Card variant="bordered" className="border-0 shadow-none lg:shadow-card lg:border">
            <CardHeader className="px-0 lg:px-6">
              <CardTitle className="font-display text-2xl">
                {isLogin ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? `Sign in to your ${userType} account` 
                  : `Register as ${userType === "student" ? "a student entrepreneur" : "an impact investor"}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {userType === "investor" && (
                      <div className="space-y-2">
                        <Label htmlFor="investorType">I am joining as a/an</Label>
                        <Select
                          value={formData.investorType}
                          onValueChange={(value: any) => setFormData({ ...formData, investorType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select investor type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student Investor</SelectItem>
                            <SelectItem value="alumni">Alumni Investor</SelectItem>
                            <SelectItem value="community">Community Investor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {(userType === "student" || (userType === "investor" && formData.investorType !== "community")) && (
                      <div className="space-y-2">
                        <Label htmlFor="schoolName">University / School Name</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="schoolName"
                            placeholder="e.g. Trinity University"
                            className="pl-10"
                            value={formData.schoolName}
                            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                )}

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>

              {!isLogin && (
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
