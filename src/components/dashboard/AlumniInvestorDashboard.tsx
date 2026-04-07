import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Briefcase, 
  Globe, 
  User, 
  ChevronRight, 
  ArrowLeft,
  PieChart,
  Target,
  FileText,
  ShieldCheck,
  Zap,
  Star,
  ShieldAlert, 
  ArrowUpRight, 
  School, 
  ArrowRight, 
  Sparkles,
  Award,
  Upload,
  X,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import myLogo from "@/assets/my-Logo.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type AlumniTab = "guide" | "overview" | "portfolio" | "inflow" | "ventures" | "returns" | "kyc" | "notifications" | "profile";

const AlumniInvestorDashboard = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AlumniTab>("overview");
  const [selectedVenture, setSelectedVenture] = useState<any>(null);
  const [showKycForm, setShowKycForm] = useState(false);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);

  const [kycForm, setKycForm] = useState({
    phoneNumber: profile?.phone_number || "",
    bvn: profile?.bvn || "",
    bankName: profile?.bank_name || "",
    accountNumber: profile?.bank_account_number || "",
    address: profile?.address || "",
    state: profile?.state || "",
    dateOfBirth: profile?.date_of_birth || "",
    nationalIdNumber: profile?.national_id_number || "",
    instagramHandle: profile?.instagram_handle || "",
    twitterHandle: profile?.twitter_handle || "",
    facebookHandle: profile?.facebook_handle || "",
    occupation: profile?.occupation || "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: profile?.full_name || "",
    phoneNumber: profile?.phone_number || "",
    occupation: profile?.occupation || "",
    bvn: profile?.bvn || "",
    bankName: profile?.bank_name || "",
    accountNumber: profile?.bank_account_number || "",
    address: profile?.address || "",
    state: profile?.state || "",
    dateOfBirth: profile?.date_of_birth || "",
    nationalIdNumber: profile?.national_id_number || "",
    instagram: profile?.instagram_handle || "",
    twitter: profile?.twitter_handle || "",
    facebook: profile?.facebook_handle || ""
  });

  const startEditing = () => {
    setEditForm({
      fullName: profile?.full_name || "",
      phoneNumber: profile?.phone_number || "",
      occupation: profile?.occupation || "",
      bvn: profile?.bvn || "",
      bankName: profile?.bank_name || "",
      accountNumber: profile?.bank_account_number || "",
      address: profile?.address || "",
      state: profile?.state || "",
      dateOfBirth: profile?.date_of_birth || "",
      nationalIdNumber: profile?.national_id_number || "",
      instagram: profile?.instagram_handle || "",
      twitter: profile?.twitter_handle || "",
      facebook: profile?.facebook_handle || ""
    });
    setIsEditingProfile(true);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.fullName,
          phone_number: editForm.phoneNumber,
          occupation: editForm.occupation,
          bvn: editForm.bvn,
          bank_name: editForm.bankName,
          bank_account_number: editForm.accountNumber,
          address: editForm.address,
          state: editForm.state,
          date_of_birth: editForm.dateOfBirth,
          national_id_number: editForm.nationalIdNumber,
          instagram_handle: editForm.instagram,
          twitter_handle: editForm.twitter,
          facebook_handle: editForm.facebook,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({ title: "Profile Updated", description: "Your professional profile has been updated." });
      
      // Update local profile object
      if (profile) {
        profile.full_name = editForm.fullName;
        profile.phone_number = editForm.phoneNumber;
        profile.occupation = editForm.occupation;
        profile.bvn = editForm.bvn;
        profile.bank_name = editForm.bankName;
        profile.bank_account_number = editForm.accountNumber;
        profile.address = editForm.address;
        profile.state = editForm.state;
        profile.date_of_birth = editForm.dateOfBirth;
        profile.national_id_number = editForm.nationalIdNumber;
        profile.instagram_handle = editForm.instagram;
        profile.twitter_handle = editForm.twitter;
        profile.facebook_handle = editForm.facebook;
      }

      setIsEditingProfile(false);
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const formatNaira = (amt: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) {
      console.error("KYC SUBMIT ERROR: No profile ID found");
      return;
    }

    // Manual validation for files if they are not already in DB
    if (!idFile && !profile?.student_id_url) {
      toast({ 
        title: "Document Required", 
        description: "Please upload your identity document to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingKyc(true);
    console.log("KYC Submission started for Alumni:", profile.id);

    try {
      let idUrl = profile?.student_id_url;

      if (idFile) {
        try {
          console.log(`Uploading Identity: ${idFile.name} (${idFile.size} bytes)`);
          const ext = idFile.name.split('.').pop();
          const path = `${profile.id}/id-doc-${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(path, idFile, { upsert: true });
          
          if (uploadError) {
            console.error("ID Upload API returned error:", uploadError);
            toast({ 
              title: "Upload failed", 
              description: `Document upload failed: ${uploadError.message}. We will try to save other details.`,
              variant: "destructive" 
            });
          } else {
            console.log("Upload raw response check...");
            const publicUrlData = supabase.storage.from('kyc-documents').getPublicUrl(path);
            idUrl = publicUrlData.data?.publicUrl || idUrl;
            console.log("ID Upload successful. URL retrieved:", idUrl);
          }
        } catch (uploadInnerErr: any) {
          console.error("Catastrophic ID Upload error:", uploadInnerErr);
        }
      }

      console.log("Starting DB UPDATE for Alumni ID:", profile.id);
      const updateData = {
        phone_number: kycForm.phoneNumber || profile?.phone_number,
        bvn: kycForm.bvn || profile?.bvn,
        bank_name: kycForm.bankName || profile?.bank_name,
        bank_account_number: kycForm.accountNumber || profile?.bank_account_number,
        address: kycForm.address || profile?.address,
        state: kycForm.state || profile?.state,
        date_of_birth: kycForm.dateOfBirth || profile?.date_of_birth,
        national_id_number: kycForm.nationalIdNumber || profile?.national_id_number,
        instagram_handle: kycForm.instagramHandle || profile?.instagram_handle,
        twitter_handle: kycForm.twitterHandle || profile?.twitter_handle,
        facebook_handle: kycForm.facebookHandle || profile?.facebook_handle,
        occupation: kycForm.occupation || profile?.occupation,
        student_id_url: idUrl,
        kyc_status: 'under_review',
        kyc_submitted_at: new Date().toISOString(),
      };

      console.log("Final Update Payload:", updateData);

      const { data: updateResponse, error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (updateError) {
        console.error("Supabase Database Update Error:", updateError);
        throw updateError;
      }

      console.log("KYC UPDATE successful! Response:", updateResponse);
      toast({ title: "Verification Submitted", description: "Your KYC data is now under review." });
      setShowKycForm(false);
    } catch (err: any) {
      console.error("Final KYC Submission error:", err);
      toast({ title: "Submission Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmittingKyc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] font-sans antialiased text-[#1a1a1a]">
      <style>{`
        :root {
          --gn: #1a7a4a;
          --gnt: #e6f4ed;
          --bl: #1a56db;
          --blt: #e8f0fe;
          --rd: #dc2626;
          --rdt: #fef2f2;
          --or: #d97706;
          --ort: #fffbeb;
        }
      `}</style>

      <div className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col min-h-screen"
        >
          {/* TOPBAR */}
          <header className="bg-gradient-to-r from-green-700 via-[#1a7a4a] to-emerald-700 px-6 md:px-12 py-3 flex items-center justify-between text-white w-full shadow-md">
            <div className="flex items-center gap-3">
              <img src={myLogo} alt="StudentBIZ Logo" className="h-10 w-auto object-contain bg-white rounded-2xl p-1.5 shadow-sm rotate-[-2deg] hover:rotate-0 transition-all" />
              <div className="font-extrabold text-2xl tracking-tight leading-none flex items-center">
                <span className="text-white drop-shadow-sm">Student</span>
                <span className="text-[#cefbdf] drop-shadow-sm">BIZ</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">

              <div className="hidden sm:flex items-center gap-2 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-[13px] font-bold whitespace-nowrap shadow-sm hover:bg-white/20 transition-all cursor-pointer">
                <span>🎓</span> Alumni Investor
              </div>
              <div className="hidden sm:block whitespace-nowrap font-bold text-[15px] ml-2">
                {profile?.full_name || "Emeka Chukwu"}
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-[#1a7a4a] shadow-md transform hover:scale-105 transition-all text-lg border-2 border-green-200">
                {profile?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "EC"}
              </div>
            </div>
          </header>

          {/* NAV TABS */}
          <nav className="bg-white border-b-2 border-green-50 flex items-center gap-6 px-6 md:px-12 overflow-x-auto no-scrollbar w-full shadow-sm">
            {[
              { id: "overview", label: "Overview" },
              { id: "guide", label: "Guide 💡" },
              { id: "portfolio", label: "Portfolio" },
              { id: "inflow", label: "Cash Inflow" },
              { id: "ventures", label: "Explore Ventures" },
              { id: "returns", label: "Returns" },
              { id: "kyc", label: "KYC Registration" },
              { id: "notifications", label: "Notifications" },
              { id: "profile", label: "Profile" }
            ].map((tab) => (
              <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })}
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AlumniTab)}
                className={`py-5 text-[13px] font-extrabold uppercase tracking-wide whitespace-nowrap transition-all relative ${
                  activeTab === tab.id ? "text-[#1a7a4a]" : "text-slate-400 hover:text-green-600 hover:-translate-y-0.5"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a7a4a]"
                  />
                )}
              </button>
            ))}
            <div className="ml-auto pl-4 border-l-2 border-slate-100 py-4 flex gap-4">
              <LogOut size={16} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" onClick={() => signOut()} />
            </div>
          </nav>

          {/* MAIN CONTENT */}
          <main className="px-6 md:px-12 py-8 bg-[#f3f6fb]/50 pb-20 flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "guide" && <AlumniGuide setActiveTab={setActiveTab} />}
                {activeTab === "overview" && <AlumniOverview formatNaira={formatNaira} profile={profile} setActiveTab={setActiveTab} />}
                {activeTab === "portfolio" && <AlumniPortfolio formatNaira={formatNaira} />}
                {activeTab === "inflow" && <AlumniInflow formatNaira={formatNaira} />}
                {activeTab === "ventures" && <AlumniVentures formatNaira={formatNaira} onSelect={setSelectedVenture} />}
                {activeTab === "returns" && <AlumniReturns formatNaira={formatNaira} />}
                {activeTab === "kyc" && (
                  <AlumniKYC 
                    profile={profile}
                    showForm={showKycForm}
                    setShowForm={setShowKycForm}
                    isSubmitting={isSubmittingKyc}
                    formData={kycForm}
                    setFormData={setKycForm}
                    onSubmit={handleKycSubmit}
                    setFile={setIdFile}
                  />
                )}
                {activeTab === "notifications" && <AlumniNotifications />}
                {activeTab === "profile" && (
                  <AlumniProfile 
                    profile={profile} 
                    isEditing={isEditingProfile}
                    setIsEditing={setIsEditingProfile}
                    isSaving={isSavingProfile}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    startEditing={startEditing}
                    onUpdate={handleProfileUpdate}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedVenture && (
          <CreditProfileModal 
            venture={selectedVenture} 
            formatNaira={formatNaira} 
            onClose={() => setSelectedVenture(null)} 
            type="alumni"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- VIEWS ---

const AlumniGuide = ({ setActiveTab }: { setActiveTab: (tab: AlumniTab) => void }) => {
  const steps = [
    {
      emoji: "🛡️",
      title: "Verify Alumni Shield",
      desc: "Complete your professional profile and link your alma mater. This confirms your status and builds trust with student founders.",
      cta: "Verify Account",
      tab: "kyc" as AlumniTab,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      btnBg: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      emoji: "🏛️",
      title: "Browse Alma Mater Ventures",
      desc: "Explore verified businesses from your school or other universities. Filter by industry, ROI, and student academic standing.",
      cta: "Explore Ventures",
      tab: "ventures" as AlumniTab,
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      btnBg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      emoji: "🤝",
      title: "Back the Next-Gen",
      desc: "Invest in a student's vision. Your capital is paired with professional mentorship to help their startup cross the finish line.",
      cta: "Find Ventures",
      tab: "ventures" as AlumniTab,
      bg: "bg-violet-50",
      border: "border-violet-100",
      text: "text-violet-700",
      btnBg: "bg-[#534ab7] hover:bg-[#3c3489]",
    },
    {
      emoji: "📊",
      title: "Mentor & Earn",
      desc: "Track your portfolio's performance. Receive repayments + ROI as the student reaches milestones and pays back the debt.",
      cta: "Check Portfolio",
      tab: "portfolio" as AlumniTab,
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      btnBg: "bg-green-600 hover:bg-green-700",
    },
  ];

  const faqs = [
    {
      q: "Why should I invest as an alumnus?",
      a: "Investing as an alumnus is a powerful way to 'give back' while earning a profit. You help students build credit history and businesses that create local jobs.",
    },
    {
      q: "How secure is my investment?",
      a: "All ventures are 'Credit-Proofed' via university records (CGPA, enrollment status) and identity documents. We also have a dedicated default recovery process.",
    },
    {
      q: "Can I mentor the students I fund?",
      a: "Yes! While the platform handles the financial transaction, we encourage Alumni to provide professional guidance to their funded student entrepreneurs.",
    },
    {
      q: "What are the typical ROI rates?",
      a: "Student ventures on our platform typically offer between 8% to 20% ROI over 3 to 12 month tenures, depending on the risk level.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 via-[#1a7a4a] to-emerald-800 rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden shadow-2xl shadow-green-900/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Sparkles size={400} className="absolute -right-20 -top-20 text-white" />
        </div>
        <div className="relative z-10 text-left md:text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <h2 className="text-3xl font-black tracking-tight mb-3">The Alumni Network</h2>
          <p className="text-emerald-50 font-medium text-lg max-w-xl mx-auto leading-relaxed">
            Welcome back! As an <strong className="text-white">Alumni Investor</strong>, you hold the keys to a student's success. Turn your professional capital into student-preneur growth.
          </p>
          <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })}
            onClick={() => setActiveTab("ventures")}
            className="mt-8 bg-white text-emerald-800 font-black text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full shadow-xl hover:-translate-y-1 transition-all"
          >
            Browse New-Gen Founders
          </button>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-1">Your Path — 4 Simple Steps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map((step, i) => (
            <div key={i} className={`${step.bg} border-2 ${step.border} rounded-[2rem] p-7 flex flex-col gap-4 hover:-translate-y-1 transition-all shadow-sm text-left`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm`}>
                  {step.emoji}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step.text}`}>Step {i + 1}</span>
              </div>
              <h4 className="text-base font-black text-slate-800 tracking-tight leading-tight">{step.title}</h4>
              <p className="text-sm font-medium text-slate-600 leading-relaxed flex-1">{step.desc}</p>
              <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })}
                onClick={() => setActiveTab(step.tab)}
                className={`self-start ${step.btnBg} text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2`}
              >
                {step.cta} <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-1">Alumni FAQ</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border-2 border-slate-100 rounded-[1.5rem] p-6 shadow-sm text-left">
              <h4 className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                <span className="text-emerald-500">Q.</span> {faq.q}
              </h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AlumniOverview = ({ formatNaira, profile, setActiveTab }: any) => {
  const chartData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Invested",
        data: [100000, 200000, 350000, 550000, 650000, 750000],
        backgroundColor: "rgba(26,86,219,.7)",
        borderRadius: 4,
      },
      {
        label: "Returns",
        data: [5000, 15000, 32000, 60000, 88000, 112500],
        backgroundColor: "rgba(26,122,74,.7)",
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { display: true, color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 10, weight: 'bold' }, callback: (v: any) => "₦" + (v/1000) + "k" } },
      x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {profile?.kyc_status !== 'verified' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-900 leading-tight">Verification Profile Needed</h4>
              <p className="text-sm text-emerald-800/70 font-bold mt-0.5">Please finalize your identity profile to enable full investment capabilities.</p>
            </div>
          </div>
          <button onClick={() => setActiveTab("kyc")} className="relative z-10 bg-[#1a7a4a] text-white border-0 px-8 py-3.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-green-950/20 hover:bg-green-700 transition-all font-sans">
            Start Trust Flow
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { icon: "💰", label: "Total invested", val: formatNaira(750000), sub: "5 ventures", color: "blue" },
          { icon: "📈", label: "Total returns", val: formatNaira(112500), sub: "15% avg ROI", color: "green" },
          { icon: "💸", label: "Repayment inflow", val: formatNaira(68000), sub: "This month", color: "green" },
          { icon: "🚀", label: "Open ventures", val: "12", sub: "Seeking funding", color: "blue" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">{stat.val}</h4>
            <p className={`text-[11px] font-bold mt-2 bg-slate-50 inline-block px-2 py-1 rounded-lg ${stat.color === 'blue' ? 'text-[#1a56db]' : 'text-[#1a7a4a]'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 text-lg mb-2">Returns growth over 6 months</h3>
        <div className="flex gap-4 mb-6">
           <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold"><span className="w-2.5 h-2.5 rounded-sm bg-[#1a56db]"></span> Invested</div>
           <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold"><span className="w-2.5 h-2.5 rounded-sm bg-[#1a7a4a]"></span> Returns</div>
        </div>
        <div className="h-[250px]">
          <Bar data={chartData} options={chartOptions as any} />
        </div>
      </div>
    </div>
  );
};

const AlumniPortfolio = ({ formatNaira }: any) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden p-6">
      <h3 className="font-black text-slate-800 text-lg mb-6">Funded businesses</h3>
      <div className="space-y-4">
        {[
          { icon: "AO", c: "bg-[#e6f4ed] text-[#1a7a4a]", name: "Adaeze’s Accessories", sub: "Fashion · UNILAG", amt: 200000, roi: "+18% ROI" },
          { icon: "TM", c: "bg-[#e8f0fe] text-[#1a56db]", name: "TechMart Nigeria", sub: "Tech · UI", amt: 150000, roi: "+12% ROI" },
          { icon: "NK", c: "bg-[#fffbeb] text-[#d97706]", name: "NaijaBakes", sub: "Food · UNIPORT", amt: 100000, roi: "+9% ROI" },
          { icon: "BE", c: "bg-[#e8f0fe] text-[#1a56db]", name: "BrightEdu Solutions", sub: "Edtech · UNIABUJA", amt: 180000, roi: "+14% ROI" },
          { icon: "SW", c: "bg-[#e6f4ed] text-[#1a7a4a]", name: "SwiftLogistics PH", sub: "Logistics · UNIPORT", amt: 120000, roi: "+11% ROI" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${item.c}`}>
               {item.icon}
             </div>
             <div className="flex-1">
               <h4 className="font-black text-slate-800">{item.name}</h4>
               <p className="text-xs text-slate-500 font-semibold">{item.sub}</p>
             </div>
             <div className="text-right">
               <div className="font-black text-slate-800">{formatNaira(item.amt)}</div>
               <div className="text-xs font-bold text-[#1a7a4a] bg-[#e6f4ed] inline-block px-2 py-0.5 rounded mt-1">{item.roi}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlumniInflow = ({ formatNaira }: any) => {
  const chartData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [{
      label: "Inflow",
      data: [20000, 35000, 50000, 65000, 80000, 98000],
      borderColor: "#1a7a4a",
      backgroundColor: "rgba(26,122,74,0.07)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#1a7a4a",
      pointRadius: 4,
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm p-6">
        <h3 className="font-black text-slate-800 text-lg mb-6">Recent repayment inflows</h3>
        <div className="space-y-4">
          {[
            { n: "Adaeze’s Accessories", d: "Mar 18, 2026", a: 25000 },
            { n: "TechMart Nigeria", d: "Mar 15, 2026", a: 18000 },
            { n: "NaijaBakes", d: "Mar 10, 2026", a: 25000 },
            { n: "BrightEdu Solutions", d: "Mar 5, 2026", a: 30000 }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0">
               <div>
                 <div className="font-black text-[13px] text-slate-800">{item.n}</div>
                 <div className="text-[11px] text-slate-500 font-semibold">{item.d}</div>
               </div>
               <div className="font-black text-[#1a7a4a]">+{formatNaira(item.a)}</div>
            </div>
          ))}
          <div className="pt-2 text-xs font-bold text-slate-500">
             Total this month: <span className="text-[#1a7a4a] text-sm ml-1">{formatNaira(98000)}</span>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm p-6">
        <h3 className="font-black text-slate-800 text-lg mb-6">Monthly inflow trend</h3>
        <div className="h-[250px]">
           <Line data={chartData} options={{
             responsive: true,
             maintainAspectRatio: false,
             plugins: { legend: { display: false } },
             scales: {
               y: { grid: { display: true, color: 'rgba(0,0,0,0.03)' }, ticks: { callback: (v: any) => "₦" + (v/1000) + "k", font: { weight: 'bold', size: 10 } } },
               x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } }
             }
           }} />
        </div>
      </div>
    </div>
  );
};

const AlumniVentures = ({ formatNaira, onSelect }: any) => {
  const ventures = [
    {
      id: "chidi", name: "FarmFresh Abuja", tag: "High credit", tagType: "green",
      school: "ABU Zaria · Enrolled", occ: "Chidi Eze · Agribusiness, Yr 4",
      loan: 200000, roi: 14, tenure: "6 months",
      sV: 742, sType: "green", trLabel: "Highly trustworthy",
      pl: ["94% repayment", "KYC verified", "CGPA 4.2", "Enrolled"],
      riskLabel: "Low", riskW: "20%", avatar: "CE", avatarBg: "bg-[#e6f4ed] text-[#1a7a4a]"
    },
    {
      id: "amaka", name: "StyleHub Lagos", tag: "Medium credit", tagType: "orange",
      school: "LASPOTECH · Enrolled", occ: "Amaka Nwosu · Fashion, Yr 3",
      loan: 150000, roi: 11, tenure: "4 months",
      sV: 614, sType: "orange", trLabel: "Moderate — review profile",
      pl: ["72% repayment", "KYC partial", "CGPA 3.1", "Enrolled"],
      riskLabel: "Medium", riskW: "55%", avatar: "AN", avatarBg: "bg-[#fffbeb] text-[#d97706]"
    },
    {
      id: "biodun", name: "CodeCamp PH", tag: "High credit", tagType: "green",
      school: "FUTA · Enrolled", occ: "Biodun Alli · Tech, Yr 4",
      loan: 300000, roi: 17, tenure: "9 months",
      sV: 780, sType: "green", trLabel: "Highly trustworthy",
      pl: ["97% repayment", "KYC verified", "CGPA 4.6", "Enrolled"],
      riskLabel: "Low", riskW: "15%", avatar: "BA", avatarBg: "bg-[#e8f0fe] text-[#1a56db]"
    },
    {
      id: "obi", name: "EduBox Enugu", tag: "Medium credit", tagType: "orange",
      school: "UNN · Enrolled", occ: "Obi Eze · Edtech, Yr 3",
      loan: 120000, roi: 10, tenure: "5 months",
      sV: 588, sType: "orange", trLabel: "Moderate — review profile",
      pl: ["68% repayment", "KYC partial", "CGPA 2.9", "Enrolled"],
      riskLabel: "Medium", riskW: "60%", avatar: "OE", avatarBg: "bg-[#eeedfe] text-[#534ab7]"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-[#e8f0fe] border border-[#1a56db]/30 p-4 rounded-xl text-xs text-[#0c447c] font-semibold">
        Click “View full credit profile” to see repayment history, CGPA, KYC status, enrollment proof, social media and investor reviews before committing funds.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ventures.map(v => (
          <div key={v.id} className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 flex flex-col shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <h4 className="font-black text-lg text-slate-800">{v.name}</h4>
               <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${v.tagType==='green'?'bg-[#e6f4ed] text-[#1a7a4a]':'bg-[#fffbeb] text-[#d97706]'}`}>{v.tag}</span>
             </div>
             <p className="text-[11px] font-black uppercase tracking-widest text-[#1a56db] mb-1">{v.school}</p>
             <p className="text-[11px] font-bold text-slate-500 mb-4">{v.occ}</p>
             
             <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 mb-4">
                <div>
                   <span className="block text-[9px] font-black uppercase text-slate-400">Loan needed</span>
                   <span className="font-black text-slate-800 text-sm">₦{v.loan/1000}k</span>
                </div>
                <div>
                   <span className="block text-[9px] font-black uppercase text-slate-400">ROI</span>
                   <span className="font-black text-[#1a7a4a] text-sm">{v.roi}%</span>
                </div>
                <div>
                   <span className="block text-[9px] font-black uppercase text-slate-400">Tenure</span>
                   <span className="font-black text-slate-800 text-sm">{v.tenure}</span>
                </div>
             </div>

             <div className="border border-slate-100 rounded-xl p-4 mb-5 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-3">
                   <div className={`w-12 h-12 rounded-full border-[3px] flex flex-col items-center justify-center bg-white ${v.sType==='green'?'border-[#1a7a4a]':'border-[#d97706]'}`}>
                     <span className={`text-sm font-black leading-none ${v.sType==='green'?'text-[#1a7a4a]':'text-[#d97706]'}`}>{v.sV}</span>
                     <span className="text-[8px] text-slate-400 font-bold">/850</span>
                   </div>
                   <div>
                     <div className="font-black text-slate-800 text-sm">{v.occ.split(' · ')[0]}</div>
                     <div className={`text-[11px] font-semibold ${v.sType==='green'?'text-[#1a7a4a]':'text-[#d97706]'}`}>{v.trLabel}</div>
                   </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                   {v.pl.map((p, idx) => (
                      <span key={idx} className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 
                        ${p.includes('verified')||p.includes('9')||p.includes('4.')?'bg-[#e6f4ed] text-[#1a7a4a]':
                          p.includes('partial')||p.includes('7')||p.includes('3.')?'bg-[#fffbeb] text-[#d97706]':
                          p==='Enrolled'?'bg-[#eeedfe] text-[#534ab7]':'bg-[#e8f0fe] text-[#1a56db]'}`}>
                        {p}
                      </span>
                   ))}
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-slate-500 uppercase">Risk</span>
                   <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${v.sType==='green'?'bg-[#1a7a4a]':'bg-[#d97706]'}`} style={{width: v.riskW}}></div>
                   </div>
                   <span className={`text-[10px] font-black uppercase ${v.sType==='green'?'text-[#1a7a4a]':'text-[#d97706]'}`}>{v.riskLabel}</span>
                </div>
             </div>

             <div className="mt-auto grid grid-cols-2 gap-3">
                <button onClick={() => onSelect(v)} className="py-3 bg-[#e6f4ed] text-[#1a7a4a] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#d1ebd9] transition-colors">View Profile</button>
                <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="py-3 bg-[#1a7a4a] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-green-800 transition-colors shadow-lg shadow-green-700/20">Fund Venture</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlumniReturns = ({ formatNaira }: any) => {
  const chartData = {
    labels: ["Adaeze's", "TechMart", "NaijaBakes", "BrightEdu", "SwiftLog"],
    datasets: [{
      data: [18, 12, 9, 14, 11],
      backgroundColor: "rgba(26,122,74,.7)",
      borderRadius: 4
    }]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { l: "Total earned", v: "₦112,500", s: "All time", c: "text-[#1a7a4a]" },
          { l: "Best performer", v: "+18%", s: "Adaeze's Accessories", c: "text-[#1a7a4a]" },
          { l: "Avg ROI", v: "15%", s: "5 ventures", c: "text-[#1a7a4a]" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 text-center">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.l}</div>
             <div className={`text-2xl font-black mb-1 ${item.c || 'text-slate-800'}`}>{item.v}</div>
             <div className="text-[11px] font-bold text-slate-500">{item.s}</div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100">
        <h3 className="font-black text-slate-800 text-lg mb-6">Returns by venture</h3>
        <div className="h-[250px]">
           <Bar data={chartData} options={{
             responsive: true,
             maintainAspectRatio: false,
             plugins: { legend: { display: false } },
             scales: {
               y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: (v: any) => v + "%", font: { size: 10, weight: 'bold' } } },
               x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
             }
           }} />
        </div>
      </div>
    </div>
  );
};

const AlumniNotifications = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
      <h3 className="font-black text-slate-800 text-lg mb-6">Recent notifications</h3>
      <div className="space-y-4">
        {[
          { text: "Repayment of ₦25,000 received from Adaeze", time: "Today, 9:04 AM", col: "bg-[#1a7a4a]" },
          { text: "New venture — FarmFresh Abuja (High credit)", time: "Yesterday, 2:30 PM", col: "bg-[#1a56db]" },
          { text: "StyleHub Lagos repayment slightly delayed", time: "Mar 12, 4:15 PM", col: "bg-[#d97706]" }
        ].map((n, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
             <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${n.col}`}></div>
             <div>
                <div className="font-black text-sm text-slate-800">{n.text}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">{n.time}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlumniProfile = ({ 
  profile, 
  isEditing, 
  setIsEditing, 
  isSaving, 
  editForm, 
  setEditForm, 
  startEditing, 
  onUpdate 
}: any) => {
  const displayName = profile?.full_name || "Alumni Investor";
  return (
    <div className="space-y-6">
      <div className="bg-white border text-left border-black/5 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
           <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-3xl font-bold text-[#1a7a4a] mb-4 ring-4 ring-[#1a7a4a]/5">
             {displayName.substring(0, 2).toUpperCase()}
           </div>
           <h3 className="text-xl font-black text-slate-800 tracking-tight">{displayName}</h3>
           <p className="text-xs font-black text-[#1a7a4a] uppercase tracking-[0.2em] mt-1 bg-emerald-50 px-3 py-1 rounded-full">Alumni Investor</p>
        </div>
        
        {!isEditing ? (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Basic Information</h4>
            <div className="space-y-0 divide-y divide-black/5">
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Full Name</span>
                <span className="text-slate-800 font-black">{profile?.full_name || "Not provided"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Occupation</span>
                <span className="text-slate-800 font-black">{profile?.occupation || "Not provided"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Phone Number</span>
                <span className="text-slate-800 font-black">{profile?.phone_number || "Not provided"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">KYC Status</span>
                <span className={`font-black uppercase tracking-wider text-[10px] ${profile?.kyc_status === 'verified' ? 'text-green-600' : 'text-orange-500'}`}>{profile?.kyc_status || "Pending"}</span>
              </div>
            </div>

            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-8 mb-1">Financial & Identity Info</h4>
            <div className="space-y-0 divide-y divide-black/5">
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">BVN (KYC)</span>
                <span className="text-slate-800 font-black">{profile?.bvn ? `XXXXXX${profile.bvn.slice(-4)}` : "Pending"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Bank Details</span>
                <span className="text-slate-800 font-black">{profile?.bank_name ? `${profile.bank_name} - ${profile.bank_account_number}` : "Pending"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Current Residence</span>
                <span className="text-slate-800 font-black">{profile?.address ? `${profile.address}, ${profile.state}` : "Pending"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">NIN</span>
                <span className="text-slate-800 font-black">{profile?.national_id_number || "N/A"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Date of Birth</span>
                <span className="text-slate-800 font-black">{profile?.date_of_birth || "N/A"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Member Since</span>
                <span className="text-green-600 font-black">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"}</span>
              </div>
            </div>

            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-8 mb-1">Social Handles</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-black/5 text-[11px] font-black tracking-wide text-slate-500 flex items-center gap-2">
                <span className="text-[#1a7a4a]">Instagram:</span> {profile?.instagram_handle || "None"}
              </div>
              <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-black/5 text-[11px] font-black tracking-wide text-slate-500 flex items-center gap-2">
                <span className="text-[#1a7a4a]">X/Twitter:</span> {profile?.twitter_handle || "None"}
              </div>
            </div>

            <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} 
              onClick={startEditing}
              className="w-full py-4 mt-8 border-2 border-[#1a7a4a] text-[#1a7a4a] font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-50 transition-all shadow-sm"
            >
              Edit Complete Profile
            </button>
          </div>
        ) : (
          <form onSubmit={onUpdate} className="space-y-8 max-h-[60vh] overflow-y-auto px-2 pr-4 custom-scrollbar text-left">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a7a4a] mb-3">Basic Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <input required type="text" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone</label>
                  <input type="text" value={editForm.phoneNumber} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Occupation</label>
                  <input type="text" value={editForm.occupation} onChange={(e) => setEditForm({...editForm, occupation: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a7a4a] mb-3">KYC Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">11-Digit BVN</label>
                  <input type="text" value={editForm.bvn} onChange={(e) => setEditForm({...editForm, bvn: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">NIN (11 Digits)</label>
                  <input type="text" maxLength={11} value={editForm.nationalIdNumber} onChange={(e) => setEditForm({...editForm, nationalIdNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Bank Name</label>
                  <input type="text" value={editForm.bankName} onChange={(e) => setEditForm({...editForm, bankName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Account Number</label>
                  <input type="text" value={editForm.accountNumber} onChange={(e) => setEditForm({...editForm, accountNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Residential Address</label>
                  <input type="text" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">State</label>
                  <input type="text" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Date of Birth</label>
                  <input type="date" value={editForm.dateOfBirth} onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a7a4a] mb-3">Professional Socials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Instagram</label>
                  <input type="text" value={editForm.instagram} onChange={(e) => setEditForm({...editForm, instagram: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">X/Twitter</label>
                  <input type="text" value={editForm.twitter} onChange={(e) => setEditForm({...editForm, twitter: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Facebook</label>
                  <input type="text" value={editForm.facebook} onChange={(e) => setEditForm({...editForm, facebook: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#1a7a4a]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8 sticky bottom-0 bg-white pb-4">
              <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} 
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-[1] py-4 border-2 border-slate-200 text-slate-500 font-black tracking-widest uppercase text-[10px] rounded-2xl hover:bg-slate-50 transition-all"
              >
                Discard
              </button>
              <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} 
                type="submit"
                disabled={isSaving}
                className="flex-[2] py-4 bg-[#1a7a4a] text-white font-black tracking-widest uppercase text-[10px] rounded-2xl shadow-xl shadow-green-900/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:-translate-y-0"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : "Apply Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const CreditProfileModal = ({ venture, onClose, formatNaira, type }: any) => {
  // Chart datasets mappings
  const _repD: any = {
    chidi: [15, 20, 18, 22, 19, 25],
    amaka: [10, 12, 8, 14, 0, 11],
    biodun: [18, 22, 20, 25, 22, 28],
    obi: [8, 10, 0, 12, 8, 0],
  };
  const _revD: any = {
    chidi: [280, 320, 390, 450, 510, 580],
    amaka: [90, 110, 85, 130, 105, 145],
    biodun: [350, 420, 500, 580, 650, 720],
    obi: [60, 75, 70, 90, 80, 95],
  };
  
  const idStr = venture.id;
  const rc = _repD[idStr].map((v: number, i: number) =>
    v === 0 || (idStr === "obi" && i === 5) ? "rgba(163,45,45,0.7)" : "rgba(26,122,74,0.75)"
  );

  const repData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [{ data: _repD[idStr], backgroundColor: rc, borderRadius: 4 }],
  };

  const revCol = idStr === 'chidi' || idStr === 'biodun' ? '#1a56db' : '#d97706';
  const revBg = idStr === 'chidi' || idStr === 'biodun' ? 'rgba(26,86,219,0.07)' : 'rgba(217,119,6,0.07)';

  const revData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [{
      data: _revD[idStr],
      borderColor: revCol,
      backgroundColor: revBg,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: revCol,
      pointRadius: 3,
    }],
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 py-10 overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#f3f6fb] w-full max-w-3xl rounded-[2rem] shadow-2xl relative my-auto"
      >
        <button onClick={onClose} className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md text-sm font-black flex items-center gap-2 hover:bg-slate-50 transition-colors">
           <ArrowLeft size={16} className="text-slate-800" /> Back
        </button>
        
        <div className="bg-white p-8 pt-16 rounded-t-[2rem] border-b-2 border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-6">
           <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black ${venture.avatarBg}`}>
             {venture.avatar}
           </div>
           <div className="flex-1 text-center md:text-left">
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">{venture.studentName}</h2>
             <p className="font-bold text-slate-500">{venture.name} · {venture.occ.split(' · ')[1]}</p>
             <div className="flex flex-wrapjustify-center md:justify-start gap-2 mt-3">
               <span className="text-[10px] font-black uppercase bg-[#e8f0fe] text-[#1a56db] px-2 py-1 rounded">{venture.school.split(' · ')[0]}</span>
               <span className="text-[10px] font-black uppercase bg-[#e6f4ed] text-[#1a7a4a] px-2 py-1 rounded">{venture.year}</span>
               <span className="text-[10px] font-black uppercase bg-[#eeedfe] text-[#534ab7] px-2 py-1 rounded">Matric: {idStr==='chidi'?'180-AG':idStr==='amaka'?'210-FD':idStr==='biodun'?'195-CS':'220-IT'}-000</span>
             </div>
           </div>
           <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 text-center">
             <div className="text-[10px] font-black uppercase text-slate-400">Score</div>
             <div className={`text-2xl font-black leading-none my-1 ${venture.sType==='green'?'text-[#1a7a4a]':'text-[#d97706]'}`}>{venture.sV}<span className="text-xs text-slate-400">/850</span></div>
             <div className={`text-[10px] font-black uppercase ${venture.sType==='green'?'text-[#1a7a4a]':'text-[#d97706]'}`}>{venture.tag}</div>
           </div>
        </div>

        <div className="p-4 md:p-8 space-y-6">
           <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1a7a4a] flex items-center justify-center text-white shrink-0"><School size={20}/></div>
              <div>
                 <h4 className="font-black text-slate-800">Enrollment verified — {venture.school.split(' · ')[0]}</h4>
                 <p className="text-xs font-semibold text-slate-500">Confirmed active student via university portal</p>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 mt-4 pt-4 border-t border-slate-100">
                    <div><span className="block text-[10px] uppercase font-black text-slate-400">Status</span><span className="text-xs font-black text-slate-800">Enrolled</span></div>
                    <div><span className="block text-[10px] uppercase font-black text-slate-400">Year</span><span className="text-xs font-black text-slate-800">{venture.year.split(' ')[1]} of 4</span></div>
                    <div><span className="block text-[10px] uppercase font-black text-slate-400">Verified</span><span className="text-xs font-black text-[#1a7a4a]">Mar 2026</span></div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-100">
                 <h4 className="font-black text-slate-800 mb-4">Repayment history</h4>
                 <div className="h-[150px]">
                    <Bar data={repData} options={{ maintainAspectRatio: false, plugins: {legend: {display: false}}, scales: { x: {grid:{display:false}, ticks:{font:{size:9}}}, y:{ticks:{callback:(v:any)=>"₦"+v+"k", font:{size:9}}} } }} />
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-100">
                 <h4 className="font-black text-slate-800 mb-4">Business revenue trend</h4>
                 <div className="h-[150px]">
                    <Line data={revData} options={{ maintainAspectRatio: false, plugins: {legend: {display: false}}, scales: { x: {grid:{display:false}, ticks:{font:{size:9}}}, y:{ticks:{callback:(v:any)=>"₦"+v+"k", font:{size:9}}} } }} />
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
               <h4 className="font-black text-slate-800 p-6 pb-2">KYC checklist</h4>
               <div className="divide-y divide-slate-100">
                  {['Student ID verified', 'Matric number confirmed', 'BVN / NIN submitted', 'Bank account linked', 'Enrollment letter', 'CAC business registration'].map((k, i) => {
                     let status = 'Verified';
                     let c = 'bg-[#e6f4ed] text-[#1a7a4a]';
                     
                     if (venture.id === 'amaka' && (k.includes('Bank') || k.includes('CAC'))) {
                        status = k.includes('CAC') ? 'Not submitted' : 'Pending';
                        c = 'bg-[#fffbeb] text-[#d97706]';
                     }
                     if (venture.id === 'obi' && (k.includes('BVN') || k.includes('Bank') || k.includes('CAC'))) {
                        status = k.includes('CAC') ? 'Not submitted' : 'Pending';
                        c = 'bg-[#fffbeb] text-[#d97706]';
                     }
                     
                     return (
                     <div key={i} className="flex justify-between items-center px-6 py-3">
                        <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${c.includes('green')?'bg-[#1a7a4a]':'bg-[#d97706]'}`}></div>
                           {k}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${c}`}>{status}</span>
                     </div>
                  )})}
               </div>
           </div>

           <div className="flex gap-4">
               <button onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Back to ventures</button>
               <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="flex-[2] py-4 text-xs font-black uppercase tracking-widest bg-[#1a7a4a] text-white rounded-xl shadow-lg shadow-green-700/30 hover:bg-green-800 hover:-translate-y-1 transition-all">Fund {venture.name}</button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AlumniKYC = ({ 
  profile, 
  showForm, 
  setShowForm, 
  isSubmitting, 
  formData, 
  setFormData, 
  onSubmit, 
  setFile 
}: any) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {profile?.kyc_status !== 'verified' && !showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-emerald-100 flex items-center justify-center flex-shrink-0 animate-pulse">
              <ShieldCheck size={28} className="text-[#1a7a4a]" /> 
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-xl tracking-tight leading-none mb-1">Verify Professional Status</h3>
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest">Alumni trust protocol enabled</p>
            </div>
          </div>
          <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} 
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto bg-[#1a7a4a] hover:bg-green-700 text-white font-black text-[11px] uppercase tracking-[0.2em] px-10 py-5 rounded-2xl shadow-xl shadow-green-950/20 transition-all hover:-translate-y-1"
          >
            Start Verification
          </button>
        </motion.div>
      )}

      {showForm ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
          
          <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} 
            onClick={() => setShowForm(false)} 
            className="absolute top-8 right-8 text-slate-300 hover:bg-slate-50 p-2 rounded-full transition-all z-10"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 relative z-10 tracking-tight">
            <ShieldCheck size={28} className="text-[#1a7a4a]" /> 
            Alumni Accreditation
          </h3>
          
          <form onSubmit={onSubmit} className="space-y-10 relative z-10 text-left">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 font-sans">Identity & Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Mobile Number</label>
                  <input required type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} placeholder="081 2345 6789" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Current Occupation</label>
                  <input required type="text" value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} placeholder="Software Engineer at Flutterwave" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">11-Digit BVN</label>
                  <input required type="text" maxLength={11} value={formData.bvn} onChange={(e) => setFormData({...formData, bvn: e.target.value})} placeholder="National bank verification" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Bank Details</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input required type="text" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} placeholder="Bank" className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/10 text-xs font-bold" />
                    <input required type="text" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} placeholder="Account" className="w-full px-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/10 text-xs font-bold" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Current Residential Address</label>
                  <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Full address for residency proof" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Date of Birth</label>
                  <input required type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-500/5 text-sm font-bold" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 font-sans">Accreditation Document</h4>
              <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center hover:bg-slate-50/50 transition-all group">
                <input type="file" accept="image/*,.pdf" className="hidden" id="alumni_id_upload" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <label htmlFor="alumni_id_upload" className="cursor-pointer flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-green-500/5 font-black text-xl">
                    <Upload className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-800 tracking-tight leading-none text-left">Upload Govt ID / Alumni Card</p>
                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">PNG, JPG or PDF (Max 5MB)</p>
                  </div>
                </label>
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-[#1a7a4a] text-white rounded-3xl font-black text-[13px] uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-green-950/40 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Accrediting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={24} />
                  <span>Finalize Verification</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-10 border-b border-black/5 pb-6">
              <h3 className="font-black text-slate-800 text-xl tracking-tight">Trust Checklist</h3>
              <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Accreditation Protocol</div>
            </div>
            
            <div className="space-y-0 divide-y divide-black/5">
              {[
                { label: "Government/Alumni ID", stat: profile?.student_id_url ? "Uploaded" : "Pending", confirmed: !!profile?.student_id_url },
                { label: "Phone & Mobile Security", stat: profile?.phone_number ? "Verified" : "Required", confirmed: !!profile?.phone_number },
                { label: "National BVN Submission", stat: profile?.bvn ? "Submitted" : "Required", confirmed: !!profile?.bvn },
                { label: "Professional Occupation", stat: profile?.occupation ? "Confirmed" : "Required", confirmed: !!profile?.occupation },
                { label: "Residential Proof (Address)", stat: profile?.address ? "Confirmed" : "Required", confirmed: !!profile?.address },
                { label: "Bank Settlement Details", stat: profile?.bank_account_number ? "Linked" : "Required", confirmed: !!profile?.bank_account_number },
                { label: "Social Media Identity", stat: (profile?.instagram_handle || profile?.twitter_handle) ? "Linked" : "Pending", confirmed: (!!profile?.instagram_handle || !!profile?.twitter_handle) }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-5 group transition-all text-left">
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${row.confirmed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {row.confirmed ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <span className="text-sm font-black text-slate-800 tracking-tight leading-none font-sans">{row.label}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-black tracking-[0.2em] px-4 py-1.5 rounded-full ${row.confirmed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {row.stat}
                  </span>
                </div>
              ))}
            </div>
            
            {profile?.kyc_status !== 'verified' && (
              <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} 
                onClick={() => setShowForm(true)}
                className="w-full py-6 mt-10 border-4 border-dashed border-emerald-50 text-[#1a7a4a] font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-emerald-50 transition-all font-sans"
              >
                Launch Accreditation Flow
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};


export default AlumniInvestorDashboard;
