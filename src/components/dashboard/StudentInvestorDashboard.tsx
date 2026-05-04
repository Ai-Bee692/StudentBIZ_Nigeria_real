import React, { useState, useEffect } from "react";
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
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
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

// Register ChartJS components
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

type StudentTab = "guide" | "overview" | "ventures" | "portfolio" | "savings" | "kyc" | "notifications" | "profile";

// --- INTERNAL COMPONENTS ---
const TrustBadge = ({ type }: { type: 'id' | 'investor' | 'academic' | 'alma' }) => {
  const configs = {
    id: { label: 'ID Verified', icon: <ShieldCheck className="w-3 h-3" />, color: 'bg-green-50 text-green-700 border-green-200' },
    investor: { label: 'Verified Peer Investor', icon: <Briefcase className="w-3 h-3" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    academic: { label: 'Top Tier GPA', icon: <Star className="w-3 h-3" />, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    alma: { label: 'Alma Mater Linked', icon: <School className="w-3 h-3" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };
  const config = configs[type];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.color} shadow-sm animate-fade-in`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const StudentInvestorDashboard = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<StudentTab>("overview");
  const [selectedVenture, setSelectedVenture] = useState<any>(null);
  const [showKycForm, setShowKycForm] = useState(false);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);

  const [kycForm, setKycForm] = useState({
    phoneNumber: profile?.phone_number || "",
    matricNumber: profile?.matric_number || "",
    bvn: profile?.bvn || "",
    bankName: profile?.bank_name || "",
    accountNumber: profile?.bank_account_number || "",
    semesterGpa: profile?.semester_gpa?.toString() || "",
    cgpa: profile?.cgpa?.toString() || "",
    address: profile?.address || "",
    state: profile?.state || "",
    dateOfBirth: profile?.date_of_birth || "",
    nationalIdNumber: profile?.national_id_number || "",
    instagramHandle: profile?.instagram_handle || "",
    twitterHandle: profile?.twitter_handle || "",
    facebookHandle: profile?.facebook_handle || "",
    schoolEntryYear: profile?.school_entry_year || "",
    courseDuration: profile?.course_duration || "",
    graduationYear: profile?.graduation_year || "",
    courseOfStudy: profile?.course_of_study || "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: profile?.full_name || "",
    phoneNumber: profile?.phone_number || "",
    schoolName: profile?.school_name || "",
    matricNumber: profile?.matric_number || "",
    bvn: profile?.bvn || "",
    bankName: profile?.bank_name || "",
    accountNumber: profile?.bank_account_number || "",
    address: profile?.address || "",
    state: profile?.state || "",
    dateOfBirth: profile?.date_of_birth || "",
    nationalIdNumber: profile?.national_id_number || "",
    semesterGpa: profile?.semester_gpa?.toString() || "",
    cgpa: profile?.cgpa?.toString() || "",
    instagram: profile?.instagram_handle || "",
    twitter: profile?.twitter_handle || "",
    facebook: profile?.facebook_handle || "",
    schoolEntryYear: profile?.school_entry_year || "",
    courseDuration: profile?.course_duration || "",
    graduationYear: profile?.graduation_year || "",
    courseOfStudy: profile?.course_of_study || "",
  });

  const startEditing = () => {
    setEditForm({
      fullName: profile?.full_name || "",
      phoneNumber: profile?.phone_number || "",
      schoolName: profile?.school_name || "",
      matricNumber: profile?.matric_number || "",
      bvn: profile?.bvn || "",
      bankName: profile?.bank_name || "",
      accountNumber: profile?.bank_account_number || "",
      address: profile?.address || "",
      state: profile?.state || "",
      dateOfBirth: profile?.date_of_birth || "",
      nationalIdNumber: profile?.national_id_number || "",
      semesterGpa: profile?.semester_gpa?.toString() || "",
      cgpa: profile?.cgpa?.toString() || "",
      instagram: profile?.instagram_handle || "",
      twitter: profile?.twitter_handle || "",
      facebook: profile?.facebook_handle || "",
      schoolEntryYear: profile?.school_entry_year || "",
      courseDuration: profile?.course_duration || "",
      graduationYear: profile?.graduation_year || "",
      courseOfStudy: profile?.course_of_study || "",
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
          school_name: editForm.schoolName,
          matric_number: editForm.matricNumber,
          bvn: editForm.bvn,
          bank_name: editForm.bankName,
          bank_account_number: editForm.accountNumber,
          address: editForm.address,
          state: editForm.state,
          date_of_birth: editForm.dateOfBirth,
          national_id_number: editForm.nationalIdNumber,
          semester_gpa: editForm.semesterGpa ? parseFloat(editForm.semesterGpa) : null,
          cgpa: editForm.cgpa ? parseFloat(editForm.cgpa) : null,
          instagram_handle: editForm.instagram,
          twitter_handle: editForm.twitter,
          facebook_handle: editForm.facebook,
          school_entry_year: editForm.schoolEntryYear,
          course_duration: editForm.courseDuration,
          graduation_year: editForm.graduationYear,
          course_of_study: editForm.courseOfStudy,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
      
      // Update local profile object
      if (profile) {
        profile.full_name = editForm.fullName;
        profile.phone_number = editForm.phoneNumber;
        profile.school_name = editForm.schoolName;
        profile.matric_number = editForm.matricNumber;
        profile.bvn = editForm.bvn;
        profile.bank_name = editForm.bankName;
        profile.bank_account_number = editForm.accountNumber;
        profile.address = editForm.address;
        profile.state = editForm.state;
        profile.date_of_birth = editForm.dateOfBirth;
        profile.national_id_number = editForm.nationalIdNumber;
        profile.semester_gpa = editForm.semesterGpa ? parseFloat(editForm.semesterGpa) : null;
        profile.cgpa = editForm.cgpa ? parseFloat(editForm.cgpa) : null;
        profile.instagram_handle = editForm.instagram;
        profile.twitter_handle = editForm.twitter;
        profile.facebook_handle = editForm.facebook;
        profile.school_entry_year = editForm.schoolEntryYear;
        profile.course_duration = editForm.courseDuration;
        profile.graduation_year = editForm.graduationYear;
        profile.course_of_study = editForm.courseOfStudy;
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
    if (!studentIdFile && !profile?.student_id_url) {
      toast({ 
        title: "Document Required", 
        description: "Please upload your Student ID to proceed with verification.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingKyc(true);
    console.log("KYC Submission started for user:", profile.id);

    // ── ADVANCED KYC VALIDATION (11-DIGIT RULE) ──
    const cleanBvn = kycForm.bvn.replace(/\D/g, "");
    const cleanNin = kycForm.nationalIdNumber.replace(/\D/g, "");

    if (cleanBvn.length !== 11) {
      toast({ 
        title: "Invalid BVN Format", 
        description: "Your Bank Verification Number (BVN) must be exactly 11 digits.", 
        variant: "destructive" 
      });
      setIsSubmittingKyc(false);
      return;
    }

    if (cleanNin && cleanNin.length !== 11) {
      toast({ 
        title: "Invalid NIN Format", 
        description: "Your National Identity Number (NIN) must be exactly 11 digits.", 
        variant: "destructive" 
      });
      setIsSubmittingKyc(false);
      return;
    }

    try {
      let studentIdUrl = profile?.student_id_url;

      if (studentIdFile) {
        try {
          console.log(`Uploading Student ID: ${studentIdFile.name} (${studentIdFile.size} bytes)`);
          const ext = studentIdFile.name.split('.').pop();
          const path = `${profile.id}/student-id-${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(path, studentIdFile, { upsert: true });
          
          if (uploadError) {
            console.error("ID Upload API returned error:", uploadError);
            toast({ 
              title: "Upload failed", 
              description: `identity document could not be uploaded: ${uploadError.message}. We will try to save your other details.`,
              variant: "destructive" 
            });
          } else {
            const publicUrlData = supabase.storage.from('kyc-documents').getPublicUrl(path);
            studentIdUrl = publicUrlData.data?.publicUrl || studentIdUrl;
            console.log("ID Upload successful. URL retrieved:", studentIdUrl);
          }
        } catch (uploadInnerErr: any) {
          console.error("Catastrophic ID Upload error:", uploadInnerErr);
        }
      }

      console.log("Starting DB UPDATE for profile ID:", profile.id);
      const updateData = {
        phone_number: kycForm.phoneNumber || profile?.phone_number,
        matric_number: kycForm.matricNumber || profile?.matric_number,
        bvn: kycForm.bvn || profile?.bvn,
        bank_name: kycForm.bankName || profile?.bank_name,
        bank_account_number: kycForm.accountNumber || profile?.bank_account_number,
        semester_gpa: kycForm.semesterGpa ? parseFloat(kycForm.semesterGpa) : (profile?.semester_gpa || null),
        cgpa: kycForm.cgpa ? parseFloat(kycForm.cgpa) : (profile?.cgpa || null),
        address: kycForm.address || profile?.address,
        state: kycForm.state || profile?.state,
        date_of_birth: kycForm.dateOfBirth || profile?.date_of_birth,
        national_id_number: kycForm.nationalIdNumber || profile?.national_id_number,
        instagram_handle: kycForm.instagramHandle || profile?.instagram_handle,
        twitter_handle: kycForm.twitterHandle || profile?.twitter_handle,
        facebook_handle: kycForm.facebookHandle || profile?.facebook_handle,
        school_entry_year: kycForm.schoolEntryYear || profile?.school_entry_year,
        course_duration: kycForm.courseDuration || profile?.course_duration,
        graduation_year: kycForm.graduationYear || profile?.graduation_year,
        course_of_study: kycForm.courseOfStudy || profile?.course_of_study,
        student_id_url: studentIdUrl,
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
      {/* Ported theme variables from 03 template */}
      <style>{`
        :root {
          --pu: #534ab7;
          --put: #eeedfe;
          --pud: #3c3489;
          --gn: #1a7a4a;
          --gnt: #e6f4ed;
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
          <header className="bg-gradient-to-r from-violet-600 via-[#534ab7] to-indigo-600 px-6 md:px-12 py-3 flex items-center justify-between text-white w-full shadow-md">
            <div className="flex items-center gap-3">
              <img src={myLogo} alt="StudentBIZ Logo" className="h-10 w-auto object-contain bg-white rounded-2xl p-1.5 shadow-sm rotate-[-2deg] hover:rotate-0 transition-all" />
              <div className="font-extrabold text-2xl tracking-tight leading-none flex items-center">
                <span className="text-white drop-shadow-sm">Student</span>
                <span className="text-[#2ee879] drop-shadow-sm">BIZ</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">

              <div className="hidden md:flex flex-col items-end mr-3">
                <span className="text-[10px] text-violet-200 uppercase font-black tracking-widest leading-none mb-1">Available Balance 💰</span>
                <span className="text-xl font-black tabular-nums leading-none tracking-tight text-white drop-shadow-md">{formatNaira(45500)}</span>
              </div>
              
              <div className="hidden md:block w-px h-8 bg-white/20 mr-2 rounded-full"></div>

              <div className="hidden sm:flex items-center gap-2 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-[13px] font-bold whitespace-nowrap shadow-sm hover:bg-white/20 transition-all cursor-pointer">
                <span>🎓</span> Student Investor
              </div>
              <div className="hidden sm:block whitespace-nowrap font-bold text-[15px] ml-2">
                {profile?.full_name || "Nkem Bakoms"}
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-violet-600 shadow-md transform hover:scale-105 transition-all text-lg border-2 border-violet-200">
                {profile?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || "NK"}
              </div>
            </div>
          </header>

          {/* NAV TABS */}
          <nav className="bg-white border-b-2 border-violet-100 flex items-center gap-6 px-6 md:px-12 overflow-x-auto no-scrollbar w-full shadow-sm">
            {[
              { id: "overview", label: "Overview 🏠" },
              { id: "guide", label: "Guide 💡" },
              { id: "ventures", label: "Peer Ventures 🚀" },
              { id: "portfolio", label: "My Portfolio 📈" },
              { id: "savings", label: "Student Vault 🏦" },
              { id: "kyc", label: "KYC Registration 🛡️" },
              { id: "notifications", label: "Updates 🔔" },
              { id: "profile", label: "My Vibe 👤" }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudentTab)}
                className={`py-5 text-[13px] font-extrabold uppercase tracking-wide whitespace-nowrap transition-all relative ${
                  activeTab === tab.id ? "text-violet-600" : "text-slate-400 hover:text-violet-400 hover:-translate-y-0.5"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#534ab7]"
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
                {activeTab === "guide" && <StudentGuide setActiveTab={setActiveTab} />}
                {activeTab === "overview" && <StudentOverview formatNaira={formatNaira} profile={profile} setActiveTab={setActiveTab} />}
                {activeTab === "ventures" && <StudentVentures formatNaira={formatNaira} onSelect={setSelectedVenture} />}
                {activeTab === "portfolio" && <StudentPortfolio formatNaira={formatNaira} />}
                {activeTab === "savings" && <StudentSavings formatNaira={formatNaira} />}
                {activeTab === "kyc" && (
                  <StudentKYC 
                    profile={profile}
                    showForm={showKycForm}
                    setShowForm={setShowKycForm}
                    isSubmitting={isSubmittingKyc}
                    formData={kycForm}
                    setFormData={setKycForm}
                    onSubmit={handleKycSubmit}
                    setFile={setStudentIdFile}
                  />
                )}
                {activeTab === "notifications" && <StudentNotifications />}
                {activeTab === "profile" && (
                  <StudentProfile 
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

      {/* MODAL: Profile Details */}
      <AnimatePresence>
        {selectedVenture && (
          <VentureModal 
            venture={selectedVenture} 
            formatNaira={formatNaira} 
            onClose={() => setSelectedVenture(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- VIEWS ---

const StudentGuide = ({ setActiveTab }: { setActiveTab: (tab: StudentTab) => void }) => {
  const { toast } = useToast();
  const steps = [
    {
      emoji: "🛡️",
      title: "Complete Your KYC",
      desc: "Start by verifying your identity with your student ID, matric number, and BVN. This unlocks full access to peer ventures.",
      cta: "Go to KYC",
      tab: "kyc" as StudentTab,
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-600",
      btnBg: "bg-orange-500 hover:bg-orange-600",
    },
    {
      emoji: "🔍",
      title: "Browse Peer Ventures",
      desc: "Explore verified student businesses from universities across Nigeria. Each listing shows ROI, tenure, and a trust score.",
      cta: "Explore Ventures",
      tab: "ventures" as StudentTab,
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
      btnBg: "bg-blue-500 hover:bg-blue-600",
    },
    {
      emoji: "💸",
      title: "Fund a Peer",
      desc: "Pick a venture that matches your risk appetite and invest from as low as ₦5,000. Funds go directly to the student entrepreneur.",
      cta: "View Portfolio",
      tab: "portfolio" as StudentTab,
      bg: "bg-violet-50",
      border: "border-violet-100",
      text: "text-violet-600",
      btnBg: "bg-violet-600 hover:bg-violet-700",
    },
    {
      emoji: "📈",
      title: "Earn Returns",
      desc: "Get your principal + agreed ROI repaid directly into your StudentBIZ balance at the end of the tenure. Track it live.",
      cta: "My Portfolio",
      tab: "portfolio" as StudentTab,
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-600",
      btnBg: "bg-green-600 hover:bg-green-700",
    },
  ];

  const faqs = [
    {
      q: "Is my money safe?",
      a: "All ventures are verified through StudentBIZ's academic portal integration. In addition, every borrower undergoes a credit check before listing.",
    },
    {
      q: "What is the minimum investment?",
      a: "You can start funding a peer venture from as low as ₦5,000. There's no maximum cap per venture.",
    },
    {
      q: "When do I get paid back?",
      a: "Returns are credited at the end of the agreed tenure (e.g. 6 months). You'll receive principal + ROI in your StudentBIZ balance.",
    },
    {
      q: "What if a peer defaults?",
      a: "StudentBIZ has a Student Protection Fund that covers up to 70% of your investment in verified default cases.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden shadow-2xl shadow-violet-500/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Sparkles size={400} className="absolute -right-20 -top-20 text-white" />
        </div>
        <div className="relative z-10">
          <div className="text-5xl mb-4">💡</div>
          <h2 className="text-3xl font-black tracking-tight mb-3">How StudentBIZ Works</h2>
          <p className="text-indigo-200 font-medium text-lg max-w-xl mx-auto leading-relaxed">
            You're a <strong className="text-white">Student Investor</strong>. That means you can back your peers' businesses and earn real returns — all within a verified, campus-safe ecosystem.
          </p>
          <button 
            onClick={() => setActiveTab("ventures")}
            className="mt-8 bg-white text-violet-700 font-black text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full shadow-xl hover:-translate-y-1 transition-all"
          >
            Start Investing Now
          </button>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-1">Your Journey — 4 Simple Steps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map((step, i) => (
            <div key={i} className={`${step.bg} border-2 ${step.border} rounded-[2rem] p-7 flex flex-col gap-4 hover:-translate-y-1 transition-all shadow-sm`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm`}>
                  {step.emoji}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${step.text}`}>Step {i + 1}</span>
              </div>
              <h4 className="text-base font-black text-slate-800 tracking-tight leading-tight">{step.title}</h4>
              <p className="text-sm font-medium text-slate-600 leading-relaxed flex-1">{step.desc}</p>
              <button 
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
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-1">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border-2 border-slate-100 rounded-[1.5rem] p-6 shadow-sm">
              <h4 className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                <span className="text-violet-500">Q.</span> {faq.q}
              </h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentOverview = ({ formatNaira, profile, setActiveTab }: any) => {
  const { toast } = useToast();
  const chartData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Active Investments",
        data: [12000, 15000, 22000, 31000, 38000, 45500],
        backgroundColor: "rgba(83, 74, 183, 0.7)",
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { display: true, color: 'rgba(0,0,0,0.03)' }, ticks: { font: { size: 9, weight: 'bold' } } },
      x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Friendly Greeting section */}
      <div className="bg-gradient-to-br from-violet-100 to-indigo-50 border-2 border-violet-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-indigo-950 mb-2">
            What's up, {profile?.full_name?.split(' ')[0] || "Investor"}! 👋
          </h2>
          <p className="text-indigo-800 font-medium text-lg max-w-lg">
            Ready to back up your peers today? The campus ecosystem is buzzing with <strong>12 new ventures</strong> looking for support this week!
          </p>
          
          <div className="mt-8 flex gap-4">
            <button onClick={() => setActiveTab("ventures")} className="bg-[#534ab7] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-violet-500/30 hover:-translate-y-1 transition-all">Support Now</button>
            <button onClick={() => setActiveTab("guide")} className="bg-white text-violet-600 border-2 border-violet-100 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-violet-50 transition-all">How it works</button>
          </div>
        </div>
        <div className="hidden lg:block absolute -right-10 -bottom-10 opacity-10 transform rotate-12 pointer-events-none">
          <Sparkles size={300} className="text-[#534ab7]" />
        </div>
      </div>

      {profile?.kyc_status !== 'verified' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 border border-orange-200 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="text-base font-black text-orange-900 leading-tight">Verification Needed</h4>
              <p className="text-sm text-orange-800/70 font-bold mt-0.5">Complete your identity profile to unlock premium student venture access.</p>
            </div>
          </div>
          <button onClick={() => setActiveTab("kyc")} className="relative z-10 bg-orange-600 text-white border-0 px-8 py-3.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all">
            Start Digital KYC
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { icon: "💸", label: "Total Invested", val: formatNaira(45500), sub: "3 Peers funded", bg: "bg-purple-100", text: "text-purple-700" },
          { icon: "📈", label: "Earned Returns", val: formatNaira(8200), sub: "+12.4% ROI", bg: "bg-emerald-100", text: "text-emerald-700" },
          { icon: "🏦", label: "Vault Balance", val: formatNaira(12000), sub: "Savings Goal: 40%", bg: "bg-blue-100", text: "text-blue-700" },
          { icon: "🔥", label: "Impact Score", val: "740", sub: "Top 15% on campus", bg: "bg-orange-100", text: "text-orange-700" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs text-slate-400 font-black tracking-widest mb-1.5">{stat.label}</p>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">{stat.val}</h4>
            <p className="text-[11px] text-slate-500 font-bold mt-2 bg-slate-50 inline-block px-2 py-1 rounded-lg">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 flex items-center gap-3 text-lg">
              <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><BarChart3 size={20} /></span>
              Your Money Moves 📊
            </h3>
            <select className="bg-slate-50 border border-slate-200 text-sm font-bold rounded-xl px-3 py-2 text-slate-600 outline-none">
              <option>Last 6 Months</option>
              <option>This Semester</option>
            </select>
          </div>
          <div className="h-[250px]">
            <Bar data={chartData} options={chartOptions as any} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/30 relative overflow-hidden group">
            <ShieldCheck size={120} className="absolute -right-6 -bottom-6 opacity-20 transform group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="bg-white/20 w-fit p-2 rounded-xl mb-4 backdrop-blur-sm">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <h3 className="font-black text-xl mb-2">Student Protection 🛡️</h3>
              <p className="text-sm font-medium text-indigo-100 mb-6 leading-relaxed">
                Sleep easy! Every peer venture is verified by studentBiz and the University portal.
              </p>
              <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="w-full bg-white text-indigo-600 py-3.5 rounded-2xl font-black tracking-wide shadow-lg hover:bg-indigo-50 transition-colors">
                Learn The Process
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 text-sm mb-6 flex items-center gap-2">
              <span className="text-xl">💸</span> Incoming Returns
            </h3>
            <div className="space-y-4">
              {[
                { name: "FarmFresh Abuja", amt: "4.5k", date: "Mar 30", color: "bg-green-100 text-green-700" },
                { name: "StyleHub Lagos", amt: "2.1k", date: "Apr 5", color: "bg-pink-100 text-pink-700" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${item.color}`}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Due {item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800 text-lg">₦{item.amt}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="w-full py-3 mt-2 text-sm font-black text-violet-600 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors">
                View All Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentVentures = ({ formatNaira, onSelect }: any) => {
  const { toast } = useToast();
  const [ventures, setVentures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("All Schools");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    const fetchVentures = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("ventures")
          .select("*")
          .in("status", ["listed", "submitted"]);

        if (error) throw error;
        
        // Map real data to the Peer Venture UI structure
        const mappedVentures = (data || []).map((v: any) => ({
          ...v,
          studentName: v.student_name,
          year: "Enrolled",
          loanGoal: v.funding_goal,
          roi: v.interest_rate,
          tenure: `${v.duration_days} days`,
          creditScore: v.risk_level === "low" ? 740 + Math.floor(Math.random() * 50) : 580 + Math.floor(Math.random() * 50),
          risk: v.risk_level.toUpperCase(),
          riskVal: v.risk_level === "low" ? 20 : 55,
        }));

        setVentures(mappedVentures);
      } catch (err: any) {
        console.error("Error fetching ventures:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVentures();
  }, []);

  const schools = ["All Schools", ...new Set(ventures.map(v => v.university))];
  const categories = ["All Categories", ...new Set(ventures.map(v => v.category))];

  const filteredVentures = ventures.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSchool = selectedSchool === "All Schools" || v.university === selectedSchool;
    const matchesCategory = selectedCategory === "All Categories" || v.category === selectedCategory;
    return matchesSearch && matchesSchool && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search peer ventures..."
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-[#534ab7] outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 outline-none focus:border-[#534ab7]"
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
        >
          {schools.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select 
          className="px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 outline-none focus:border-[#534ab7]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-slate-100">
           <div className="w-12 h-12 border-4 border-slate-100 border-t-[#534ab7] rounded-full animate-spin mb-4" />
           <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Finding Peers...</p>
        </div>
      ) : filteredVentures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredVentures.map((v) => (
        <div key={v.id} className="bg-white rounded-2xl border border-black/5 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-black text-slate-800 text-sm tracking-tight">{v.name}</h4>
            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase">
              {v.risk} RISK
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">
             {v.university} &middot; {v.studentName} ({v.year})
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50/50 p-3 rounded-xl">
             <div>
               <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">Goal</p>
               <p className="text-xs font-black text-slate-800">₦{v.loanGoal/1000}k</p>
             </div>
             <div>
               <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">ROI</p>
               <p className="text-xs font-black text-green-600">{v.roi}%</p>
             </div>
             <div>
               <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">Tenure</p>
               <p className="text-xs font-black text-slate-800">{v.tenure}</p>
             </div>
          </div>

          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#534ab7]/20 flex flex-col items-center justify-center bg-white">
               <span className="text-[11px] font-black text-[#534ab7] leading-none">{v.creditScore}</span>
               <span className="text-[6px] text-slate-300 font-bold tracking-widest">/850</span>
            </div>
            <div className="flex-1">
               <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[#534ab7] mb-1">
                  <span>Trust Score</span>
                  <span>{v.creditScore > 700 ? 'High' : 'Med'}</span>
               </div>
               <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#534ab7]" style={{ width: `${(v.creditScore/850)*100}%` }} />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onSelect(v)}
              className="py-2.5 text-[9px] font-black uppercase tracking-widest text-[#534ab7] bg-[#eeedfe] rounded-xl hover:bg-[#534ab7]/10 transition-all"
            >
              Verify Profile
            </button>
            <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="py-2.5 text-[9px] font-black uppercase tracking-widest bg-[#534ab7] text-white rounded-xl shadow-lg shadow-[#534ab7]/20">
              Fund Peer
            </button>
          </div>
        </div>
        ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-slate-100">
          <div className="text-4xl mb-4">🔍</div>
          <h4 className="font-black text-slate-800 text-lg mb-2">No Peers Found</h4>
          <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};

const StudentPortfolio = ({ formatNaira }: any) => {
  const { toast } = useToast();
  return (
    <div className="bg-white rounded-[1.5rem] border border-black/5 overflow-hidden">
      <div className="p-6 border-b border-black/5 bg-slate-50/30 flex justify-between items-center">
         <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
           <Briefcase size={16} className="text-[#534ab7]" />
           Investment Ledger
         </h3>
         <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="bg-white border border-black/5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
           Download Report <ArrowLeft size={12} className="rotate-90" />
         </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <th className="px-6 py-4">Venture</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Returns</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {[
            { name: "Adaeze Accessories", amt: 15000, ret: 2700, status: "Active" },
            { name: "Enugu EduBox", amt: 10000, ret: 1500, status: "Settled" },
            { name: "Abuja Poultry", amt: 20000, ret: 4000, status: "Active" }
          ].map((item, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-xs font-black text-slate-800">{item.name}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-xs font-black text-slate-800">₦{item.amt.toLocaleString()}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-xs font-black text-green-600">+₦{item.ret.toLocaleString()}</p>
              </td>
              <td className="px-6 py-4 text-left">
                <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md 
                  ${item.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StudentSavings = ({ formatNaira }: any) => {
  const { toast } = useToast();
  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-[#534ab7] p-8 rounded-[2.5rem] text-white text-center shadow-2xl shadow-[#534ab7]/30 relative overflow-hidden">
         <Wallet size={120} className="absolute -left-10 -bottom-10 opacity-10 rotate-12" />
         <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60 mb-2">Vault Balance</p>
         <h2 className="text-4xl font-black mb-6 tracking-tight tracking-naira">₦12,000</h2>
         <div className="flex justify-center gap-2">
           <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="flex-1 bg-white text-[#534ab7] py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Deposit</button>
           <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="flex-1 bg-black/20 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20">Invest from Vault</button>
         </div>
      </div>
      
      <div className="bg-white p-6 rounded-[2rem] border border-black/5">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-black text-xs uppercase tracking-widest">Savings Goals</h3>
           <span className="text-[10px] font-black text-[#534ab7] bg-[#eeedfe] px-3 py-1 rounded-full">+ Create New</span>
        </div>
        <div className="space-y-6">
           <div>
              <div className="flex justify-between mb-2">
                 <span className="text-xs font-black text-slate-800">Next Semester Project</span>
                 <span className="text-[10px] font-black text-slate-500">₦25k / ₦50k</span>
              </div>
              <div className="h-2 bg-slate-50 rounded-full border border-black/5 overflow-hidden">
                 <div className="h-full bg-orange-500" style={{ width: '50%' }} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StudentNotifications = () => {
  const { toast } = useToast();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
         <h3 className="font-black text-sm uppercase tracking-widest">Recent Updates</h3>
         <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="text-[10px] font-black uppercase text-slate-400">Mark all read</button>
      </div>
      {[
        { title: "Investment Credited", body: "Adaeze Accessories paid ₦4,500 into your balance.", time: "2h ago", color: "green" },
        { title: "New Peer Venture", body: "FarmFresh Abuja is looking for its first investor.", time: "1d ago", color: "purple" }
      ].map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-black/5 flex items-start gap-4">
           <div className={`w-2 h-2 rounded-full mt-1.5 
             ${item.color === 'green' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-[#534ab7] shadow-[0_0_10px_#534ab7]'}`} />
           <div className="flex-1">
              <h4 className="text-xs font-black text-slate-800 mb-0.5">{item.title}</h4>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{item.body}</p>
           </div>
           <span className="text-[9px] font-black text-slate-300 uppercase">{item.time}</span>
        </div>
      ))}
    </div>
  );
};

const StudentProfile = ({ 
  profile, 
  isEditing, 
  setIsEditing, 
  isSaving, 
  editForm, 
  setEditForm, 
  startEditing, 
  onUpdate 
}: any) => {
  const { toast } = useToast();
  const displayName = profile?.full_name || "Student Investor";
  return (
    <div className="space-y-6">
      <div className="bg-white border text-left border-black/5 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
           <div className="w-20 h-20 rounded-full bg-[#eeedfe] flex items-center justify-center text-3xl font-bold text-[#534ab7] mb-4 ring-4 ring-[#534ab7]/5">
             {displayName.substring(0, 2).toUpperCase()}
           </div>
           <h3 className="text-xl font-black text-slate-800 tracking-tight">{displayName}</h3>
           <p className="text-xs font-black text-[#534ab7] uppercase tracking-[0.2em] mt-1 bg-[#eeedfe] px-3 py-1 rounded-full">Student Investor</p>
           
           <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
             {profile?.kyc_status === 'verified' && <TrustBadge type="id" />}
             {profile?.kyc_status === 'verified' && <TrustBadge type="investor" />}
             {Number(profile?.cgpa) >= 3.5 && <TrustBadge type="academic" />}
             {profile?.school_name && <TrustBadge type="alma" />}
             {(!profile?.kyc_status || profile?.kyc_status === 'pending') && (
               <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Not Verified</span>
             )}
           </div>
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
                <span className="text-slate-500 font-semibold tracking-wide">University</span>
                <span className="text-slate-800 font-black">{profile?.school_name || "Not provided"}</span>
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

            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-8 mb-1">Financial & Academic</h4>
            <div className="space-y-0 divide-y divide-black/5">
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Matric Number</span>
                <span className="text-slate-800 font-black">{profile?.matric_number || "Pending"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">BVN (KYC)</span>
                <span className="text-slate-800 font-black">{profile?.bvn ? `XXXXXX${profile.bvn.slice(-4)}` : "Pending"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Bank Details</span>
                <span className="text-slate-800 font-black">{profile?.bank_name ? `${profile.bank_name} - ${profile.bank_account_number}` : "Pending"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Department & Course</span>
                <span className="text-slate-800 font-black">{profile?.course_of_study || "Pending"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Academic CGPA</span>
                <span className="text-slate-800 font-black">{profile?.cgpa || "N/A"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Year of Entry</span>
                <span className="text-slate-800 font-black">{profile?.school_entry_year || "N/A"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Program Duration</span>
                <span className="text-slate-800 font-black">{profile?.course_duration || "N/A"}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500 font-semibold tracking-wide">Graduation Year</span>
                <span className="text-green-600 font-black">{profile?.graduation_year || "N/A"}</span>
              </div>
            </div>

            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-8 mb-1">Social Handles</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-black/5 text-[11px] font-black tracking-wide text-slate-500 flex items-center gap-2">
                <span className="text-[#534ab7]">Instagram:</span> {profile?.instagram_handle || "None"}
              </div>
              <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-black/5 text-[11px] font-black tracking-wide text-slate-500 flex items-center gap-2">
                <span className="text-[#534ab7]">X/Twitter:</span> {profile?.twitter_handle || "None"}
              </div>
            </div>

            <button 
              onClick={startEditing}
              className="w-full py-4 mt-8 border-2 border-[#534ab7] text-[#534ab7] font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#eeedfe]/50 transition-all shadow-sm"
            >
              Edit Complete Profile
            </button>
          </div>
        ) : (
          <form onSubmit={onUpdate} className="space-y-8 max-h-[60vh] overflow-y-auto px-2 pr-4 custom-scrollbar text-left">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#534ab7] mb-3">Basic Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <input required type="text" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone</label>
                  <input type="text" value={editForm.phoneNumber} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">University</label>
                  <input type="text" value={editForm.schoolName} onChange={(e) => setEditForm({...editForm, schoolName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#534ab7] mb-3">KYC Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Matric Number</label>
                  <input type="text" value={editForm.matricNumber} onChange={(e) => setEditForm({...editForm, matricNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">11-Digit BVN</label>
                  <input type="text" value={editForm.bvn} onChange={(e) => setEditForm({...editForm, bvn: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Bank Name</label>
                  <input type="text" value={editForm.bankName} onChange={(e) => setEditForm({...editForm, bankName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Account Number</label>
                  <input type="text" value={editForm.accountNumber} onChange={(e) => setEditForm({...editForm, accountNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Residential Address</label>
                  <input type="text" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">State</label>
                  <input type="text" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">NIN (11 Digits)</label>
                  <input type="text" maxLength={11} value={editForm.nationalIdNumber} onChange={(e) => setEditForm({...editForm, nationalIdNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Date of Birth</label>
                  <input type="date" value={editForm.dateOfBirth} onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#534ab7] mb-3">Academic Performance</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Department & Course of Study</label>
                  <input type="text" value={editForm.courseOfStudy} onChange={(e) => setEditForm({...editForm, courseOfStudy: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Year of Entry</label>
                  <input type="text" value={editForm.schoolEntryYear} onChange={(e) => setEditForm({...editForm, schoolEntryYear: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Course Duration</label>
                  <input type="text" value={editForm.courseDuration} onChange={(e) => setEditForm({...editForm, courseDuration: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Graduation Year</label>
                  <input type="text" value={editForm.graduationYear} onChange={(e) => setEditForm({...editForm, graduationYear: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Semester GPA</label>
                  <input type="number" step="0.01" min="0" max="5" value={editForm.semesterGpa} onChange={(e) => setEditForm({...editForm, semesterGpa: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">CGPA</label>
                  <input type="number" step="0.01" min="0" max="5" value={editForm.cgpa} onChange={(e) => setEditForm({...editForm, cgpa: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#534ab7] mb-3">Professional Socials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Instagram</label>
                  <input type="text" value={editForm.instagram} onChange={(e) => setEditForm({...editForm, instagram: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">X/Twitter</label>
                  <input type="text" value={editForm.twitter} onChange={(e) => setEditForm({...editForm, twitter: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Facebook</label>
                  <input type="text" value={editForm.facebook} onChange={(e) => setEditForm({...editForm, facebook: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-[#534ab7]/10 outline-none text-sm font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8 sticky bottom-0 bg-white pb-4">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-[1] py-4 border-2 border-slate-200 text-slate-500 font-black tracking-widest uppercase text-[10px] rounded-2xl hover:bg-slate-50 transition-all"
              >
                Discard
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-[2] py-4 bg-[#534ab7] text-white font-black tracking-widest uppercase text-[10px] rounded-2xl shadow-xl shadow-[#534ab7]/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:-translate-y-0"
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

const PitchDeckModal = ({ venture, onClose, formatNaira }: any) => {
  const { toast } = useToast();
  const [activeSlide, setActiveSlide] = useState("overview");

  // Chart datasets mappings (Using real data where available, fallback to mock trend if missing)
  const revData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        data: venture.monthly_revenue
          ? [
              venture.monthly_revenue * 0.7,
              venture.monthly_revenue * 0.8,
              venture.monthly_revenue * 0.75,
              venture.monthly_revenue * 0.9,
              venture.monthly_revenue * 0.85,
              venture.monthly_revenue,
            ]
          : [0, 0, 0, 0, 0, 0],
        borderColor: "#1a56db",
        backgroundColor: "rgba(26,86,219,0.05)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#1a56db",
        pointRadius: 3,
      },
    ],
  };

  const slides = [
    { id: "overview", label: "Overview", icon: <Layers size={14} /> },
    { id: "traction", label: "Traction", icon: <TrendingUp size={14} /> },
    { id: "roadmap", label: "Roadmap", icon: <Calendar size={14} /> },
    { id: "financials", label: "Financials", icon: <Wallet size={14} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 py-10 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#f8fafc] w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative my-auto overflow-hidden border border-white/20"
      >
        {/* Header Section */}
        <div className="bg-white p-8 pt-10 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 z-10 bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
            <div className="relative group">
              {venture.image ? (
                <img
                  src={venture.image}
                  alt={venture.name}
                  className="w-24 h-24 rounded-3xl object-cover shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white ${venture.avatarBg || "bg-blue-100 text-blue-600"}`}
                >
                  {venture.avatar || venture.name[0]}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-[#1a7a4a] text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                <ShieldCheck size={12} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {venture.name}
                </h2>
                <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                  {venture.category}
                </span>
              </div>
              <p className="text-lg font-bold text-slate-500 mb-4 italic">
                "{venture.tagline || "Innovating for the future"}"
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                  <User size={12} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">
                    {venture.student_name || venture.studentName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                  <School size={12} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">
                    {venture.university || venture.school?.split(" · ")[0]}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a7a4a] to-emerald-700 p-5 rounded-[2rem] text-white text-center shadow-lg shadow-emerald-900/20 min-w-[140px]">
              <div className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">
                Trust Score
              </div>
              <div className="text-3xl font-black leading-none mb-1">
                {venture.sV || 720}
                <span className="text-xs opacity-50 ml-1">/850</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block">
                {venture.tag || "Gold Tier"}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center md:justify-start gap-1 mt-10">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeSlide === slide.id
                    ? "bg-slate-800 text-white shadow-lg shadow-slate-900/20 -translate-y-0.5"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                {slide.icon}
                {slide.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slide Content */}
        <div className="p-8 h-[450px] overflow-y-auto custom-scrollbar bg-white/50 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {activeSlide === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#1a7a4a] flex items-center gap-2">
                        <Sparkles size={14} /> The Vision
                      </h4>
                      <p className="text-lg font-medium text-slate-700 leading-relaxed">
                        {venture.description}
                      </p>
                    </div>
                    <div className="space-y-3 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                        <AlertCircle size={14} /> The Problem
                      </h4>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed">
                        {venture.problem_statement ||
                          "This student is currently finalizing their problem-solution narrative for the marketplace."}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#1a7a4a] flex items-center gap-2">
                        <CheckCircle2 size={14} /> The Solution
                      </h4>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed">
                        {venture.solution ||
                          "The solution narrative is verified and under review by the StudentBIZ accreditation team."}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                          Since
                        </span>
                        <span className="text-sm font-black text-slate-800">
                          {venture.operating_since
                            ? new Date(
                                venture.operating_since,
                              ).toLocaleDateString("en-NG", {
                                month: "short",
                                year: "numeric",
                              })
                            : "New Launch"}
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                          Team
                        </span>
                        <span className="text-sm font-black text-slate-800">
                          {venture.employees || 1} Employee(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSlide === "traction" && (
              <motion.div
                key="traction"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-black text-slate-800">
                        Revenue Performance
                      </h4>
                      <p className="text-xs font-bold text-slate-400">
                        Monthly trend (Verified via bank statements)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-black uppercase text-slate-400">
                        Current Avg.
                      </span>
                      <span className="text-lg font-black text-[#1a7a4a]">
                        {formatNaira(venture.monthly_revenue || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="h-[250px] w-full">
                    <Line
                      data={revData}
                      options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: { font: { size: 10, weight: "bold" } },
                          },
                          y: {
                            ticks: {
                              callback: (v: any) => "₦" + v / 1000 + "k",
                              font: { size: 10, weight: "bold" },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                    <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Profit Margin
                    </span>
                    <span className="text-xl font-black text-blue-600">
                      {venture.profit_margin || 15}%
                    </span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                    <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Repeat Cust.
                    </span>
                    <span className="text-xl font-black text-blue-600">
                      42%
                    </span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                    <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">
                      Growth Rate
                    </span>
                    <span className="text-xl font-black text-[#1a7a4a]">
                      +12%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSlide === "roadmap" && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="max-w-2xl mx-auto space-y-6">
                  {(venture.milestones && venture.milestones.length > 0
                    ? venture.milestones
                    : [
                        {
                          title: "Accreditation Phase",
                          date: "2026-03-01",
                          status: "completed",
                        },
                        {
                          title: "Marketplace Listing",
                          date: "2026-04-15",
                          status: "pending",
                        },
                        {
                          title: "Inventory Expansion",
                          date: "2026-06-01",
                          status: "pending",
                        },
                      ]
                  ).map((m: any, idx: number) => (
                    <div key={idx} className="flex gap-6 items-start relative">
                      {idx < (venture.milestones?.length || 3) - 1 && (
                        <div className="absolute left-4 top-10 bottom-[-24px] w-0.5 bg-slate-200" />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${m.status === "completed" ? "bg-[#1a7a4a] text-white" : "bg-white border-2 border-slate-200 text-slate-300"}`}
                      >
                        {m.status === "completed" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                      </div>
                      <div
                        className={`flex-1 p-5 rounded-2xl border-2 transition-all ${m.status === "completed" ? "bg-white border-emerald-100 shadow-sm" : "bg-slate-50/50 border-slate-100"}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="font-black text-slate-800">
                            {m.title}
                          </h5>
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {new Date(m.date).toLocaleDateString("en-NG", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          {m.status === "completed"
                            ? "Verified achievement by StudentBIZ team."
                            : "Target milestone for upcoming growth phase."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSlide === "financials" && (
              <motion.div
                key="financials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Wallet size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-800">
                            Funding Goal
                          </h4>
                          <p className="text-xs font-bold text-slate-400">
                            Total required capital
                          </p>
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-800 mb-6 tracking-tight">
                        {formatNaira(venture.funding_goal)}
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-t border-slate-50">
                          <span className="text-sm font-bold text-slate-500">
                            Fixed ROI
                          </span>
                          <span className="text-sm font-black text-[#1a7a4a]">
                            {venture.interest_rate || 9}% Per Annum
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t border-slate-50">
                          <span className="text-sm font-bold text-slate-500">
                            Repayment Term
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            {venture.duration_days || 45} Days
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t border-slate-50">
                          <span className="text-sm font-bold text-slate-500">
                            Risk Rating
                          </span>
                          <span className="text-sm font-black text-blue-600 uppercase">
                            {venture.risk_level || "Low Risk"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-800 p-8 rounded-[2rem] text-white shadow-xl">
                      <h4 className="text-xs font-black uppercase tracking-widest opacity-50 mb-4">
                        Use of Funds
                      </h4>
                      <p className="text-sm font-bold leading-relaxed mb-8">
                        {venture.use_of_funds ||
                          "Investment will be used to scale inventory, improve marketing reach across campus, and upgrade logistics equipment for faster delivery."}
                      </p>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[60%]" />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                          <span>Inventory</span>
                          <span>60%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1a7a4a] flex items-center justify-center">
                          <ShieldCheck size={20} />
                        </div>
                        <span className="text-sm font-black text-slate-800">
                          Identity Verified
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#1a7a4a] bg-emerald-50 px-3 py-1 rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
          >
            Close Deck
          </button>
          <button
            onClick={() =>
              toast({
                title: "Investment Protocol Initiated",
                description: "Contacting the venture founder...",
              })
            }
            className="flex-[2] py-5 bg-[#1a7a4a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:-translate-y-1 transition-all"
          >
            Support {venture.name}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StudentKYC = ({ 
  profile, 
  showForm, 
  setShowForm, 
  isSubmitting, 
  formData, 
  setFormData, 
  onSubmit, 
  setFile 
}: any) => {
  const { toast } = useToast();
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {profile?.kyc_status !== 'verified' && !showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 border border-orange-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-orange-100 flex items-center justify-center flex-shrink-0 animate-pulse border-2 border-white">
              <ShieldAlert size={28} className="text-orange-600" /> 
            </div>
            <div>
              <h3 className="font-black text-orange-900 text-xl tracking-tight leading-none mb-1">Identity Under Check</h3>
              <p className="text-orange-700/60 text-xs font-bold uppercase tracking-[0.1em]">Verification required to trade ventures</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-black text-[11px] uppercase tracking-[0.2em] px-10 py-5 rounded-2xl shadow-xl shadow-orange-900/10 transition-all hover:-translate-y-1"
          >
            Open Verification Form
          </button>
        </motion.div>
      )}

      {showForm ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
          
          <button 
            onClick={() => setShowForm(false)} 
            className="absolute top-8 right-8 text-slate-300 hover:bg-slate-50 p-2 rounded-full transition-all z-10"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 relative z-10 tracking-tight">
            <ShieldCheck size={28} className="text-[#534ab7]" /> 
            Verify Student Identity
          </h3>
          
          <form onSubmit={onSubmit} className="space-y-10 relative z-10 text-left">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Personal Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Phone Number</label>
                  <input required type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} placeholder="081 2345 6789" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Date of Birth</label>
                  <input required type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">11-Digit BVN</label>
                  <input required type="text" maxLength={11} value={formData.bvn} onChange={(e) => setFormData({...formData, bvn: e.target.value})} placeholder="00011122233" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Academic Verification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Department & Course of Study</label>
                  <input required type="text" value={formData.courseOfStudy} onChange={(e) => setFormData({...formData, courseOfStudy: e.target.value})} placeholder="Faculty of Science - Computer Science" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Matric Number</label>
                  <input required type="text" value={formData.matricNumber} onChange={(e) => setFormData({...formData, matricNumber: e.target.value})} placeholder="CSC/2021/045" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Year of Entry</label>
                  <input required type="text" value={formData.schoolEntryYear} onChange={(e) => setFormData({...formData, schoolEntryYear: e.target.value})} placeholder="2021" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Course Duration</label>
                  <input required type="text" value={formData.courseDuration} onChange={(e) => setFormData({...formData, courseDuration: e.target.value})} placeholder="4 Years" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Expected Graduation</label>
                  <input required type="text" value={formData.graduationYear} onChange={(e) => setFormData({...formData, graduationYear: e.target.value})} placeholder="2025" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Cumulative CGPA</label>
                  <input required type="number" step="0.01" min="0" max="5" value={formData.cgpa} onChange={(e) => setFormData({...formData, cgpa: e.target.value})} placeholder="e.g. 4.5" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-500/5 text-sm font-bold" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Identity Document</h4>
              <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center hover:bg-slate-50/50 transition-all group">
                <input type="file" accept="image/*,.pdf" className="hidden" id="student_id_investor" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <label htmlFor="student_id_investor" className="cursor-pointer flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-violet-500/5 font-black text-xl">
                    <Upload className="w-10 h-10 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-800 tracking-tight">Upload Student ID Image</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">PNG, JPG or PDF (Max 5MB)</p>
                  </div>
                </label>
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-[#534ab7] text-white rounded-3xl font-black text-[13px] uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={24} />
                  <span>Seal Verification</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-10 border-b border-black/5 pb-6">
              <h3 className="font-black text-slate-800 text-xl tracking-tight">Identity Checklist</h3>
              <div className="px-5 py-2 bg-violet-50 text-violet-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Verification Protocol</div>
            </div>
            
            <div className="space-y-0 divide-y divide-black/5">
              {[
                { label: "Student ID Attachment", stat: profile?.student_id_url ? "Uploaded" : "Pending", confirmed: !!profile?.student_id_url },
                { label: "Matriculation Number", stat: profile?.matric_number ? "Confirmed" : "Required", confirmed: !!profile?.matric_number },
                { label: "Phone & Mobile Security", stat: profile?.phone_number ? "Verified" : "Required", confirmed: !!profile?.phone_number },
                { label: "BVN Integration", stat: profile?.bvn ? "Submitted" : "Required", confirmed: !!profile?.bvn },
                { label: "Academic Standing (CGPA)", stat: profile?.cgpa ? "Verified" : "Pending", confirmed: !!profile?.cgpa },
                { label: "Graduation Details", stat: profile?.graduation_year ? "Verified" : "Pending", confirmed: !!profile?.graduation_year },
                { label: "Bank Account Settlement", stat: profile?.bank_account_number ? "Linked" : "Required", confirmed: !!profile?.bank_account_number },
                { label: "Social Media Identity", stat: (profile?.instagram_handle || profile?.twitter_handle) ? "Linked" : "Pending", confirmed: (!!profile?.instagram_handle || !!profile?.twitter_handle) }
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center py-5 group transition-all text-left">
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${row.confirmed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {row.confirmed ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <span className="text-sm font-black text-slate-800 tracking-tight leading-none">{row.label}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-black tracking-[0.2em] px-4 py-1.5 rounded-full ${row.confirmed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {row.stat}
                  </span>
                </div>
              ))}
            </div>
            
            {profile?.kyc_status !== 'verified' && (
              <button 
                onClick={() => setShowForm(true)}
                className="w-full py-6 mt-10 border-4 border-dashed border-violet-100 text-[#534ab7] font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl hover:bg-violet-50 transition-all font-sans"
              >
                Access Digital Form
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentInvestorDashboard;
