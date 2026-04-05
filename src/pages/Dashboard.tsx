import Footer from "@/components/Footer";
import StudentDashboardTemplate from "@/components/dashboard/StudentDashboardTemplate";
import StudentInvestorDashboard from "@/components/dashboard/StudentInvestorDashboard";
import AlumniInvestorDashboard from "@/components/dashboard/AlumniInvestorDashboard";
import CommunityInvestorDashboard from "@/components/dashboard/CommunityInvestorDashboard";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine which dashboard to show based on role and investor type
  const renderDashboard = () => {
    if (profile?.role === "investor") {
      if (profile.investor_type === "student") {
        return <StudentInvestorDashboard />;
      }
      if (profile.investor_type === "alumni") {
        return <AlumniInvestorDashboard />;
      }
      if (profile.investor_type === "community") {
        return <CommunityInvestorDashboard />;
      }
      
      // Fallback for types not yet implemented
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-6">
             <div className="w-3 h-3 bg-primary rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 mb-2">
            {profile.investor_type ? `${String(profile.investor_type).charAt(0).toUpperCase() + String(profile.investor_type).slice(1)} Investor Hub` : "Investor Hub"} Coming Soon
          </h2>
          <p className="text-slate-500 max-w-sm font-medium">
            We're currently refining the investment experience for {String(profile.investor_type) || "investors"}. Check back soon!
          </p>
        </div>
      );
    }
    
    return <StudentDashboardTemplate />;
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <div className="flex-1 pb-12">
        {renderDashboard()}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
