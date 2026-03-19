import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  User, 
  LogOut, 
  Bell, 
  Settings,
  PlusCircle,
  Clock,
  CheckCircle2,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getRoleTitle = () => {
    switch (profile?.role) {
      case "student_entrepreneur":
        return "Student Entrepreneur Dashboard";
      case "investor":
        return "Investor Portal";
      case "admin":
        return "Admin Control Panel";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="pt-24 lg:pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-display font-bold text-foreground"
              >
                Welcome, {profile?.full_name || user?.user_metadata?.full_name || "User"} 👋
              </motion.h1>
              <p className="text-muted-foreground mt-1">
                {getRoleTitle()} | {profile?.school_name || "Community Member"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2 rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title={profile?.role === "student_entrepreneur" ? "Current Funding" : "Total Invested"}
              value={profile?.role === "student_entrepreneur" ? "$0.00" : "$12,450.00"}
              icon={Wallet}
              trend="+12%"
              color="primary"
            />
            <DashboardCard 
              title={profile?.role === "student_entrepreneur" ? "Venture Quality" : "ROI Rate"}
              value={profile?.role === "student_entrepreneur" ? "N/A" : "14.2%"}
              icon={TrendingUp}
              trend="+2%"
              color="success"
            />
            <DashboardCard 
              title={profile?.role === "student_entrepreneur" ? "Recent Activity" : "Portfolio Distribution"}
              value={profile?.role === "student_entrepreneur" ? "0" : "8 Sectors"}
              icon={Clock}
              trend="Just now"
              color="accent"
            />
            <DashboardCard 
              title={profile?.role === "student_entrepreneur" ? "Pending Actions" : "Match Success"}
              value={profile?.role === "student_entrepreneur" ? "1" : "98%"}
              icon={CheckCircle2}
              trend="Good"
              color="info"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl border p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Venture Performance</h3>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">View Details</Button>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Performance charts will appear once you invest in ventures.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="text-lg font-bold mb-4">Recommended for You</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <PlusCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">EcoSnacks Nigeria</div>
                        <div className="text-xs text-muted-foreground">Food & Beverage • ROI 12%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-primary-foreground shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6" />
                  <h3 className="font-bold">Premium Benefits</h3>
                </div>
                <p className="text-sm opacity-90 mb-6">As an {profile?.investor_type || 'early'} investor, you have access to exclusive student-led ventures.</p>
                <Button variant="hero" className="w-full bg-white text-primary hover:bg-white/90">Upgrade Profile</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const DashboardCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-card p-6 rounded-2xl shadow-sm border group transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}/10 transition-colors`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full flex items-center gap-1">
        <TrendingUp className="w-3 h-3" /> {trend}
      </span>
    </div>
    <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </motion.div>
);

export default Dashboard;
