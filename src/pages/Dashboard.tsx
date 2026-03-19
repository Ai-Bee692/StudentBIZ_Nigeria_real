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
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
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
                Welcome, {profile?.full_name} 👋
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Simple stats for now */}
            <DashboardCard 
              title={profile?.role === "student_entrepreneur" ? "Current Funding" : "Total Invested"}
              value="$0.00"
              icon={Wallet}
              trend="+0%"
              color="primary"
            />
            <DashboardCard 
              title={profile?.role === "student_entrepreneur" ? "Venture Quality Score" : "Active Investments"}
              value={profile?.role === "student_entrepreneur" ? "N/A" : "0"}
              icon={TrendingUp}
              trend="N/A"
              color="success"
            />
            <DashboardCard 
              title="Recent Activity"
              value="0"
              icon={Clock}
              trend="Just now"
              color="accent"
            />
          </div>

          <div className="mt-12 bg-card rounded-2xl border p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Your new dashboard is almost ready!</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              We are finalizing the {profile?.role?.replace('_', ' ')} modules. 
              {profile?.role === "student_entrepreneur" 
                ? " Soon you'll be able to submit your business plan and track your funding."
                : " Soon you'll be able to browse through scored student ventures and invest."}
            </p>
            {profile?.role === "student_entrepreneur" && (
              <Button variant="hero" className="gap-2 px-8 py-6 rounded-full">
                <PlusCircle className="w-5 h-5" />
                Submit New Venture
              </Button>
            )}
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
