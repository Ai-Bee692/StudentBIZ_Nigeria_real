import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import myLogo from "@/assets/my-Logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  Info, 
  Upload, X,
  Wallet, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  Bell, 
  User, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  LogOut,
  CreditCard,
  Building,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StudentDashboardTemplate = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile, user, loading, signOut } = useAuth();
  
  // Optimization: Grab name directly from instantaneous local JWT token to bypass slow Postgres queries on refresh
  const displayName = profile?.full_name || user?.user_metadata?.full_name;
  const firstName = displayName ? displayName.split(' ')[0] : null;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showKycForm, setShowKycForm] = useState(false);
  const [kycForm, setKycForm] = useState({
    bvn: "",
    bankName: "",
    accountNumber: "",
    matricNumber: "",
    semesterGpa: "",
    cgpa: "",
    phoneNumber: "",
    instagramHandle: "",
    twitterHandle: "",
    facebookHandle: "",
    address: "",
    state: "",
    dateOfBirth: "",
    nationalIdNumber: "",
    schoolEntryYear: "",
    courseDuration: "",
    graduationYear: "",
    courseOfStudy: ""
  });
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [businessDocFile, setBusinessDocFile] = useState<File | null>(null);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    schoolName: "",
    address: "",
    state: "",
    matricNumber: "",
    bvn: "",
    bankName: "",
    accountNumber: "",
    cgpa: "",
    semesterGpa: "",
    instagram: "",
    twitter: "",
    facebook: "",
    dateOfBirth: "",
    nationalIdNumber: "",
    schoolEntryYear: "",
    courseDuration: "",
    graduationYear: "",
    courseOfStudy: ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const startEditing = () => {
    setEditForm({
      fullName: profile?.full_name || user?.user_metadata?.full_name || "",
      phoneNumber: profile?.phone_number || "",
      schoolName: profile?.school_name || "",
      address: profile?.address || "",
      state: profile?.state || "",
      matricNumber: profile?.matric_number || "",
      bvn: profile?.bvn || "",
      bankName: profile?.bank_name || "",
      accountNumber: profile?.bank_account_number || "",
      cgpa: profile?.cgpa?.toString() || "",
      semesterGpa: profile?.semester_gpa?.toString() || "",
      instagram: profile?.instagram_handle || "",
      twitter: profile?.twitter_handle || "",
      facebook: profile?.facebook_handle || "",
      dateOfBirth: profile?.date_of_birth || "",
      nationalIdNumber: profile?.national_id_number || "",
      schoolEntryYear: profile?.school_entry_year || "",
      courseDuration: profile?.course_duration || "",
      graduationYear: profile?.graduation_year || "",
      courseOfStudy: profile?.course_of_study || ""
    });
    setIsEditingProfile(true);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?.id || profile?.id;
    if (!userId) return;

    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.fullName,
          phone_number: editForm.phoneNumber,
          school_name: editForm.schoolName,
          address: editForm.address,
          state: editForm.state,
          matric_number: editForm.matricNumber,
          bvn: editForm.bvn,
          bank_name: editForm.bankName,
          bank_account_number: editForm.accountNumber,
          cgpa: editForm.cgpa ? parseFloat(editForm.cgpa) : null,
          semester_gpa: editForm.semesterGpa ? parseFloat(editForm.semesterGpa) : null,
          instagram_handle: editForm.instagram,
          twitter_handle: editForm.twitter,
          facebook_handle: editForm.facebook,
          date_of_birth: editForm.dateOfBirth,
          national_id_number: editForm.nationalIdNumber,
          school_entry_year: editForm.schoolEntryYear,
          course_duration: editForm.courseDuration,
          graduation_year: editForm.graduationYear,
          course_of_study: editForm.courseOfStudy,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      if (profile) {
        profile.full_name = editForm.fullName;
        profile.phone_number = editForm.phoneNumber;
        profile.school_name = editForm.schoolName;
        profile.address = editForm.address;
        profile.state = editForm.state;
        profile.matric_number = editForm.matricNumber;
        profile.bvn = editForm.bvn;
        profile.bank_name = editForm.bankName;
        profile.bank_account_number = editForm.accountNumber;
        profile.cgpa = editForm.cgpa ? parseFloat(editForm.cgpa) : profile.cgpa;
        profile.semester_gpa = editForm.semesterGpa ? parseFloat(editForm.semesterGpa) : profile.semester_gpa;
        profile.instagram_handle = editForm.instagram;
        profile.twitter_handle = editForm.twitter;
        profile.facebook_handle = editForm.facebook;
        profile.date_of_birth = editForm.dateOfBirth;
        profile.national_id_number = editForm.nationalIdNumber;
        profile.school_entry_year = editForm.schoolEntryYear;
        profile.course_duration = editForm.courseDuration;
        profile.graduation_year = editForm.graduationYear;
        profile.course_of_study = editForm.courseOfStudy;
      }

      setIsEditingProfile(false);
      toast({ title: "Profile Updated", description: "Your profile details have been saved successfully." });
    } catch (err: any) {
      toast({ title: "Update Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?.id || profile?.id;
    if (!userId) {
      toast({ title: "Not logged in", description: "Could not find your account. Please refresh and try again.", variant: "destructive" });
      return;
    }
    setIsSubmittingKyc(true);
    console.log("Starting Entrepreneur KYC submission for userId:", userId);

    try {
      let studentIdUrl = profile?.student_id_url;
      let businessDocUrl = profile?.business_reg_url;

      // Manual check for student ID since browser validation fails on hidden inputs
      if (!studentIdFile && !profile?.student_id_url) {
        toast({ 
          title: "Missing ID Document", 
          description: "A student ID is required for verification.", 
          variant: "destructive" 
        });
        setIsSubmittingKyc(false);
        return;
      }

      // File uploads are non-blocking: warn but don't prevent text data from saving
      if (studentIdFile) {
        try {
          console.log("Uploading Student ID:", studentIdFile.name);
          const ext = studentIdFile.name.split('.').pop();
          const path = `${userId}/student-id-${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(path, studentIdFile);
          if (uploadError) throw new Error(uploadError.message);
          const { data: { publicUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(path);
          studentIdUrl = publicUrl;
          console.log("Student ID uploaded:", studentIdUrl);
        } catch (uploadErr: any) {
          console.error("KYC ID Upload ERROR:", uploadErr);
          toast({ 
            title: "Student ID upload failed", 
            description: `Error: ${uploadErr.message || "Check bucket permissions"}. Your text data will still be attempted to be saved.`, 
            variant: "destructive" 
          });
        }
      }

      if (businessDocFile) {
        try {
          const ext = businessDocFile.name.split('.').pop();
          const path = `${userId}/business-doc-${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(path, businessDocFile);
          if (uploadError) throw new Error(uploadError.message);
          const { data: { publicUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(path);
          businessDocUrl = publicUrl;
        } catch (uploadErr: any) {
          // Non-blocking - skip silently for optional business doc
        }
      }

      // Debug: verify userId and form data are populated
      console.log("KYC Submit - userId:", userId);
      console.log("KYC Submit - form data:", kycForm);

      // Direct UPSERT — creates or modifies the profile row.
      // We include full_name and role as fallbacks in case the row doesn't exist yet.
      const updatePayload = {
        id: userId,
        full_name: profile?.full_name || user?.user_metadata?.full_name || "Entrepreneur",
        role: profile?.role || (user?.user_metadata?.role as any) || "student_entrepreneur",
        phone_number: kycForm.phoneNumber || null,
        bvn: kycForm.bvn || null,
        bank_name: kycForm.bankName || null,
        bank_account_number: kycForm.accountNumber || null,
        student_id_url: studentIdUrl || null,
        business_reg_url: businessDocUrl || null,
        kyc_status: 'under_review' as const,
        kyc_submitted_at: new Date().toISOString(),
        matric_number: kycForm.matricNumber || null,
        semester_gpa: kycForm.semesterGpa ? parseFloat(kycForm.semesterGpa) : null,
        cgpa: kycForm.cgpa ? parseFloat(kycForm.cgpa) : null,
        instagram_handle: kycForm.instagramHandle || null,
        twitter_handle: kycForm.twitterHandle || null,
        facebook_handle: kycForm.facebookHandle || null,
        address: kycForm.address || null,
        state: kycForm.state || null,
        date_of_birth: kycForm.dateOfBirth || null,
        national_id_number: kycForm.nationalIdNumber || null,
        school_entry_year: kycForm.schoolEntryYear || null,
        course_duration: kycForm.courseDuration || null,
        graduation_year: kycForm.graduationYear || null,
        course_of_study: kycForm.courseOfStudy || null,
      };
      
      console.log("KYC Upsert payload:", updatePayload);
      console.log("Starting Supabase upsert for profiles with ID:", userId);

      const { error } = await supabase
        .from('profiles')
        .upsert(updatePayload, { onConflict: 'id' });

      console.log("Supabase upsert complete. Error:", error);

      if (error) {
        console.error("KYC update error:", error);
        throw new Error(`Database update failed: ${error.message} (code: ${error.code})`);
      }

      console.log("KYC update was SUCCESSFUL on Supabase.");
      
      if (profile) {
        profile.kyc_status = 'under_review';
        profile.bvn = kycForm.bvn || profile.bvn;
        profile.student_id_url = studentIdUrl;
        profile.business_reg_url = businessDocUrl;
        profile.bank_name = kycForm.bankName || profile.bank_name;
        profile.bank_account_number = kycForm.accountNumber || profile.bank_account_number;
        profile.matric_number = kycForm.matricNumber || profile.matric_number;
        profile.phone_number = kycForm.phoneNumber || profile.phone_number;
        profile.semester_gpa = kycForm.semesterGpa ? parseFloat(kycForm.semesterGpa) : profile.semester_gpa;
        profile.cgpa = kycForm.cgpa ? parseFloat(kycForm.cgpa) : profile.cgpa;
        profile.instagram_handle = kycForm.instagramHandle || profile.instagram_handle;
        profile.twitter_handle = kycForm.twitterHandle || profile.twitter_handle;
        profile.facebook_handle = kycForm.facebookHandle || profile.facebook_handle;
        profile.address = kycForm.address || profile.address;
        profile.state = kycForm.state || profile.state;
        profile.date_of_birth = kycForm.dateOfBirth || profile.date_of_birth;
        profile.national_id_number = kycForm.nationalIdNumber || profile.national_id_number;
        profile.school_entry_year = kycForm.schoolEntryYear || profile.school_entry_year;
        profile.course_duration = kycForm.courseDuration || profile.course_duration;
        profile.graduation_year = kycForm.graduationYear || profile.graduation_year;
        profile.course_of_study = kycForm.courseOfStudy || profile.course_of_study;
      }
      setShowKycForm(false);
      toast({ title: "Verification Submitted", description: "Your documents are now under review." });
    } catch (err: any) {
      toast({ title: "Submission Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmittingKyc(false);
    }
  };

  const revenueData = React.useMemo(() => ({
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        fill: true,
        label: "Revenue",
        data: [45, 52, 48, 70, 65, 85],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  }), []);

  const repaymentData = React.useMemo(() => ({
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        data: [20, 35, 45, 50, 35, 25],
        backgroundColor: "rgba(26,122,74,.8)",
        borderRadius: 6,
      },
    ],
  }), []);

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: {
          callback: (v: any) => "₦" + v + "k",
          font: { size: 11, family: "Inter" },
          color: "#94a3b8"
        },
        grid: { color: "rgba(0,0,0,.03)" },
        border: { display: false }
      },
      x: { 
        ticks: { font: { size: 11, family: "Inter" }, color: "#94a3b8" }, 
        grid: { display: false },
        border: { display: false }
      },
    },
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: "overview", label: "Overview 🏠" },
    { id: "how-it-works", label: "Guide 💡" },
    { id: "loans", label: "Loans 💸" },
    { id: "repayments", label: "Repayments 📅" },
    { id: "business", label: "Business 🏢" },
    { id: "credit", label: "Credit & KYC 🛡️" },
    { id: "notifications", label: "Alerts 🔔" },
    { id: "profile", label: "My Vibe 👤" },
  ];

  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const, staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full font-sans bg-[#f3f6fb] min-h-screen text-[#1a1a1a] flex flex-col">
      
      <style>{`
        :root {
          --bl: #1a56db;
          --gn: #1a7a4a;
          --gd: #d97706;
          --rd: #dc2626;
        }
      `}</style>
      <div className="w-full flex flex-col flex-1">
        
        {/* Friendly Topbar with Gradient */}
        <header className="bg-[#1a56db] px-6 md:px-12 py-3 flex items-center justify-between text-white w-full shadow-md z-30 relative">
          <div className="flex items-center gap-3">
            <img src={myLogo} alt="StudentBIZ Logo" className="h-10 w-auto object-contain bg-white rounded-2xl p-1.5 shadow-sm rotate-[-2deg] hover:rotate-0 transition-all" />
            <div className="font-extrabold text-2xl tracking-tight leading-none flex items-center">
              <span className="text-white drop-shadow-sm">Student</span>
              <span className="text-[#cefbdf] drop-shadow-sm">BIZ</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm relative z-30">
            <div className="hidden sm:flex items-center gap-2 border-2 border-white/20 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 text-[13px] font-bold whitespace-nowrap shadow-sm hover:bg-white/20 transition-all cursor-pointer">
              <span>🚀</span> Student Entrepreneur
            </div>
            <div className="hidden sm:block whitespace-nowrap font-bold text-[15px] ml-2">
              {displayName || (loading ? "Loading..." : "Entrepreneur")}
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-[#1a56db] shadow-md transform hover:scale-105 transition-all text-lg border-2 border-blue-200">
              {!displayName && loading ? ".." : (displayName ? displayName.substring(0, 2).toUpperCase() : "SB")}
            </div>
            <button 
              onClick={handleLogout} 
              className="ml-1 w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all border border-white/20"
              title="Logout"
            >
              <LogOut size={16} className="relative -right-0.5" />
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="bg-white border-b-2 border-blue-100 flex items-center gap-6 px-6 md:px-12 overflow-x-auto no-scrollbar w-full shadow-sm relative z-20">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-5 text-[13px] font-extrabold uppercase tracking-wide whitespace-nowrap transition-all relative ${
                activeTab === tab.id ? "text-[#1a56db]" : "text-slate-400 hover:text-blue-400 hover:-translate-y-0.5"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicatorAdmin"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a56db]"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="px-6 md:px-12 py-8 bg-[#f3f6fb]/50 pb-20 flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-7xl mx-auto space-y-6"
            >
              
              {/* TAB: OVERVIEW */}
              {activeTab === "overview" && (
                <>
                  <motion.div variants={itemVariants} className="bg-[#e8f0fe] border-[#1a56db]/20 border-2 border-blue-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden mb-6">
                    <div className="relative z-10">
                      <h2 className="text-3xl font-black text-slate-900 mb-2">
                        What's up, {firstName || (loading ? <span className="w-24 h-6 rounded bg-blue-200/50 animate-pulse inline-block"></span> : "Entrepreneur")}! 👋
                      </h2>
                      <p className="text-[#1a56db] font-medium text-lg max-w-lg">
                        You're doing great! Keep building your business profile and explore new peer funding opportunities available on campus today.
                      </p>
                    </div>
                    <div className="relative z-10 bg-white shadow-sm border-2 border-white/50 rounded-2xl px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                        🏫
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{profile?.school_name || "University of Lagos"}</div>
                        <div className="text-sm font-black text-slate-800">Active Scholar</div>
                      </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 pointer-events-none">
                      <Sparkles size={200} className="text-[#1a56db]" />
                    </div>
                  </motion.div>

                  {profile?.kyc_status !== 'verified' && (
                    <motion.div variants={itemVariants} className="bg-[#fef3c7] border border-[#d97706]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-[#d97706]/20 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-[#d97706]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#b45309]">Action Required: Complete your KYC</h4>
                          <p className="text-xs text-[#92400e] mt-0.5 font-medium">Verify your student identity immediately to unlock higher loan limits.</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab("credit")} className="relative z-10 bg-[#d97706] text-white whitespace-nowrap border-0 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#d97706]/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        Complete Now
                      </button>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div whileHover={{ y: -4 }} className="bg-white border text-left border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#1a56db]">
                          <CreditCard className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total borrowed</div>
                      <div className="text-2xl font-bold text-foreground">₦350,000</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-[#e8f0fe] px-2.5 py-1 rounded-lg text-[#1a56db] text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1a56db]/60"></span> 2 active loans
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -4 }} className="bg-white border text-left border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f4ed] flex items-center justify-center text-[#1a7a4a]">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Amount repaid</div>
                      <div className="text-2xl font-bold text-foreground">₦210,000</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-[#e6f4ed] px-2.5 py-1 rounded-lg text-[#1a7a4a] text-xs font-bold">
                        <TrendingUp className="w-3 h-3" /> 60% cleared
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -4 }} className="bg-white border text-left border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-[#1a56db]">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Credit score</div>
                      <div className="text-2xl font-bold text-foreground">742</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-[#e8f0fe] px-2.5 py-1 rounded-lg text-[#1a56db] text-xs font-bold">
                        Excellent standing
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -4 }} className="bg-white border text-left border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#fef3c7] flex items-center justify-center text-[#d97706]">
                          <Calendar className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Next repayment</div>
                      <div className="text-2xl font-bold text-foreground">₦25,000</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-[#fef3c7] px-2.5 py-1 rounded-lg text-[#d97706] text-xs font-bold">
                        Due in 5 days
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Revenue Trend</h3>
                        <p className="text-sm text-muted-foreground font-medium">Tracking your venture progression over 6 months</p>
                      </div>
                    </div>
                    <div className="w-full h-[220px] relative">
                      <Line data={revenueData} options={chartOptions} />
                    </div>
                  </motion.div>
                </>
              )}

              {/* TAB: GUIDE */}
              {activeTab === "how-it-works" && (
                <EntrepreneurGuide setActiveTab={setActiveTab} />
              )}

              {/* TAB: LOANS */}
              {activeTab === "loans" && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="bg-white border text-left border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Active loan requests</h3>
                    <div className="space-y-0 divide-y divide-border/40">
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1a7a4a]"></div>
                          <span className="text-sm font-medium text-foreground">Business inventory</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e6f4ed] text-[#1a7a4a] hidden sm:inline-block">Approved</span>
                        </div>
                        <span className="text-sm font-bold">₦200,000</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#d97706]"></div>
                          <span className="text-sm font-medium text-foreground">Marketing push</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#d97706] hidden sm:inline-block">Pending</span>
                        </div>
                        <span className="text-sm font-bold">₦150,000</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1a56db]"></div>
                          <span className="text-sm font-medium text-foreground">Equipment upgrade</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a56db] hidden sm:inline-block">In review</span>
                        </div>
                        <span className="text-sm font-bold">₦80,000</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white border text-left border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Loan history</h3>
                    <div className="space-y-0 divide-y divide-border/40">
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1a7a4a]"></div>
                          <span className="text-sm font-medium text-foreground">Startup capital — Jan 2025</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e6f4ed] text-[#1a7a4a] hidden sm:inline-block">Fully repaid</span>
                        </div>
                        <span className="text-sm font-bold">₦100,000</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1a7a4a]"></div>
                          <span className="text-sm font-medium text-foreground">Stock purchase — Jun 2025</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e6f4ed] text-[#1a7a4a] hidden sm:inline-block">Fully repaid</span>
                        </div>
                        <span className="text-sm font-bold">₦75,000</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-8 text-center shadow-sm">
                    <p className="text-sm text-muted-foreground font-medium mb-4">Need more funding for your business?</p>
                    <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} className="bg-[#1a56db] text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      Apply for a new loan
                    </button>
                  </motion.div>
                </div>
              )}

              {/* TAB: REPAYMENTS */}
              {activeTab === "repayments" && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="bg-white border text-left border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Repayment progress</h3>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-1.5">
                          <span className="text-foreground">Business inventory loan</span><span>60%</span>
                        </div>
                        <div className="h-2.5 w-full bg-[#e6f4ed] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1a7a4a] rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-1.5">
                          <span className="text-foreground">Marketing loan</span><span>30%</span>
                        </div>
                        <div className="h-2.5 w-full bg-[#e8f0fe] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1a56db] rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-border/50 text-sm text-muted-foreground font-medium flex justify-between">
                      Outstanding: <span className="text-foreground font-bold text-base">₦140,000</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white border text-left border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Upcoming schedule</h3>
                    <div className="space-y-0 divide-y divide-border/40">
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#d97706]"></div>
                          <span className="text-sm font-medium text-foreground">Business inventory — instalment 4</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#d97706] hidden sm:inline-block">Due Mar 24</span>
                        </div>
                        <span className="text-sm font-bold">₦25,000</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1a56db]"></div>
                          <span className="text-sm font-medium text-foreground">Marketing loan — instalment 2</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a56db] hidden sm:inline-block">Due Apr 5</span>
                        </div>
                        <span className="text-sm font-bold">₦15,000</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-6">Repayment trend</h3>
                    <div className="w-full h-[220px] relative">
                      <Bar data={repaymentData} options={chartOptions} />
                    </div>
                  </motion.div>
                </div>
              )}

              {/* TAB: BUSINESS */}
              {activeTab === "business" && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Business performance snapshot</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-[#1a56db]">₦1.2M</div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium">Monthly revenue</div>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-[#1a56db]">38%</div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium">Profit margin</div>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-[#1a56db]">+22%</div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium">MoM growth</div>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-4 text-center">
                        <div className="text-xl font-bold text-[#1a56db]">4.7/5</div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium">Investor rating</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Business details</h3>
                    <div className="space-y-0 divide-y divide-border/40">
                      <div className="flex justify-between py-3 text-sm">
                        <span className="text-muted-foreground font-medium">Business name</span>
                        <span className="text-foreground font-bold">Adaeze's Accessories</span>
                      </div>
                      <div className="flex justify-between py-3 text-sm">
                        <span className="text-muted-foreground font-medium">Category</span>
                        <span className="text-foreground font-bold">Fashion & retail</span>
                      </div>
                      <div className="flex justify-between py-3 text-sm">
                        <span className="text-muted-foreground font-medium">Operating since</span>
                        <span className="text-foreground font-bold">March 2024</span>
                      </div>
                      <div className="flex justify-between py-3 text-sm">
                        <span className="text-muted-foreground font-medium">Location</span>
                        <span className="text-foreground font-bold">Lagos, Nigeria</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* TAB: CREDIT & KYC */}
              {activeTab === "credit" && (
                <div className="space-y-6">
                  {(!profile?.kyc_status || profile?.kyc_status === 'pending') && !showKycForm && (
                     <motion.div variants={itemVariants} className="bg-[#fef3c7] border border-[#d97706]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                       <div className="flex items-center gap-3">
                         <ShieldCheck className="w-5 h-5 text-[#d97706]" />
                         <div>
                           <h4 className="text-sm font-bold text-[#b45309]">Submit documents to complete KYC</h4>
                           <p className="text-xs text-[#b45309]/80 mt-0.5">Start your official verification to unlock maximum funding capacity.</p>
                         </div>
                       </div>
                       <button onClick={() => setShowKycForm(true)} className="bg-[#d97706] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#d97706]/90 transition-all shadow-sm">
                         Start Verification
                       </button>
                     </motion.div>
                  )}

                  {showKycForm && (
                    <motion.div variants={itemVariants} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-border/60 rounded-2xl p-6 shadow-md relative">
                      <button onClick={() => setShowKycForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-1 rounded-full"><X className="w-5 h-5" /></button>
                      <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#1a56db]" /> Complete KYC Submission</h3>
                      <form onSubmit={handleKycSubmit} className="space-y-8">

                        {/* Section 1: Identity */}
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">Identity & Banking</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Phone Number</label>
                              <input required disabled={isSubmittingKyc} type="tel" value={kycForm.phoneNumber} onChange={(e) => setKycForm({...kycForm, phoneNumber: e.target.value})} placeholder="e.g. 08012345678" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Matriculation Number</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.matricNumber} onChange={(e) => setKycForm({...kycForm, matricNumber: e.target.value})} placeholder="e.g. CSC/2021/045" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">11-Digit BVN</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.bvn} onChange={(e) => setKycForm({...kycForm, bvn: e.target.value})} placeholder="00000000000" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Bank Name</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.bankName} onChange={(e) => setKycForm({...kycForm, bankName: e.target.value})} placeholder="Guaranty Trust Bank" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Account Number</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.accountNumber} onChange={(e) => setKycForm({...kycForm, accountNumber: e.target.value})} placeholder="0123456789" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Section: Residence & ID */}
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">Residence & Identity</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-sm font-bold text-foreground">Residential Address</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.address} onChange={(e) => setKycForm({...kycForm, address: e.target.value})} placeholder="Full Residential Address" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">State</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.state} onChange={(e) => setKycForm({...kycForm, state: e.target.value})} placeholder="Lagos" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">National Identity Number (NIN)</label>
                              <input required disabled={isSubmittingKyc} type="text" maxLength={11} value={kycForm.nationalIdNumber} onChange={(e) => setKycForm({...kycForm, nationalIdNumber: e.target.value})} placeholder="11-Digit NIN" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-sm font-bold text-foreground">Date of Birth</label>
                              <input required disabled={isSubmittingKyc} type="date" value={kycForm.dateOfBirth} onChange={(e) => setKycForm({...kycForm, dateOfBirth: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Academic Performance */}
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">Academic Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Department & Course of Study</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.courseOfStudy} onChange={(e) => setKycForm({...kycForm, courseOfStudy: e.target.value})} placeholder="e.g. Faculty of Engineering - Electrical" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Year of Entry</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.schoolEntryYear} onChange={(e) => setKycForm({...kycForm, schoolEntryYear: e.target.value})} placeholder="e.g. 2021" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Course Duration</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.courseDuration} onChange={(e) => setKycForm({...kycForm, courseDuration: e.target.value})} placeholder="e.g. 4 Years" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Expected Graduation Year</label>
                              <input required disabled={isSubmittingKyc} type="text" value={kycForm.graduationYear} onChange={(e) => setKycForm({...kycForm, graduationYear: e.target.value})} placeholder="e.g. 2025" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Current Semester GPA</label>
                              <input required disabled={isSubmittingKyc} type="number" step="0.01" min="0" max="5" value={kycForm.semesterGpa} onChange={(e) => setKycForm({...kycForm, semesterGpa: e.target.value})} placeholder="e.g. 4.25" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Cumulative CGPA</label>
                              <input required disabled={isSubmittingKyc} type="number" step="0.01" min="0" max="5" value={kycForm.cgpa} onChange={(e) => setKycForm({...kycForm, cgpa: e.target.value})} placeholder="e.g. 3.87" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Business Social Media */}
                        <div>
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">Business Social Media <span className="text-[#1a56db]/60 normal-case tracking-normal font-medium">(at least one)</span></h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Instagram</label>
                              <input disabled={isSubmittingKyc} type="text" value={kycForm.instagramHandle} onChange={(e) => setKycForm({...kycForm, instagramHandle: e.target.value})} placeholder="@yourbusiness" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">X / Twitter</label>
                              <input disabled={isSubmittingKyc} type="text" value={kycForm.twitterHandle} onChange={(e) => setKycForm({...kycForm, twitterHandle: e.target.value})} placeholder="@yourbusiness" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-foreground">Facebook</label>
                              <input disabled={isSubmittingKyc} type="text" value={kycForm.facebookHandle} onChange={(e) => setKycForm({...kycForm, facebookHandle: e.target.value})} placeholder="yourbusiness" className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/50 text-sm" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <label className="text-sm font-bold text-foreground block mb-2">Upload Student ID (Required)</label>
                          <div className="border-2 border-dashed border-border/60 rounded-xl p-4 text-center hover:bg-muted/30 transition-colors">
                            <input disabled={isSubmittingKyc} type="file" accept="image/*,.pdf" className="hidden" id="student_id_upload" onChange={(e) => setStudentIdFile(e.target.files?.[0] || null)} />
                            <label htmlFor="student_id_upload" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                              <span className="text-sm font-medium text-[#1a56db] hover:underline">{studentIdFile ? studentIdFile.name : "Click to select ID image"}</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-bold text-foreground block mb-2">Upload Business Registration (Optional)</label>
                          <div className="border border-dashed border-border/60 rounded-xl p-4 text-center hover:bg-muted/30 transition-colors">
                            <input disabled={isSubmittingKyc} type="file" accept="image/*,.pdf" className="hidden" id="biz_doc_upload" onChange={(e) => setBusinessDocFile(e.target.files?.[0] || null)} />
                            <label htmlFor="biz_doc_upload" className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className="w-5 h-5 text-muted-foreground opacity-70" />
                              <span className="text-sm font-medium text-muted-foreground hover:underline">{businessDocFile ? businessDocFile.name : "Click to select business document"}</span>
                            </label>
                          </div>
                        </div>

                        <button disabled={isSubmittingKyc} type="submit" className="w-full py-3 bg-[#1a56db] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          {isSubmittingKyc ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit Application"}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">Credit eligibility</h3>
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="w-32 h-32 rounded-full border-8 border-[#1a7a4a]/20 flex flex-col items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-t-8 border-[#1a7a4a]" style={{ transform: 'rotate(25deg)' }}></div>
                        <span className="text-3xl font-bold text-[#1a7a4a]">742</span>
                        <span className="text-xs text-muted-foreground font-medium">/ 850</span>
                      </div>
                      <div className="flex-1 w-full space-y-0 divide-y divide-border/40">
                        <div className="flex justify-between py-3 text-sm">
                          <span className="text-muted-foreground font-medium">Repayment rate</span>
                          <span className="text-[#1a7a4a] font-bold">94%</span>
                        </div>
                        <div className="flex justify-between py-3 text-sm">
                          <span className="text-muted-foreground font-medium">KYC status</span>
                          <span className={`font-bold capitalize ${profile?.kyc_status === 'verified' ? 'text-[#1a7a4a]' : 'text-[#d97706]'}`}>{profile?.kyc_status || 'Pending'}</span>
                        </div>
                        <div className="flex justify-between py-3 text-sm">
                          <span className="text-muted-foreground font-medium">Max eligible</span>
                          <span className="text-[#1a56db] font-bold">₦500,000</span>
                        </div>
                        <div className="flex justify-between py-3 text-sm">
                          <span className="text-muted-foreground font-medium">Current limit</span>
                          <span className="text-[#d97706] font-bold">₦250,000</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-white border text-left border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4">KYC checklist</h3>
                    <div className="space-y-0 divide-y divide-border/40">

                      {/* Row: Student ID */}
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profile?.student_id_url ? 'bg-[#e6f4ed]' : 'bg-[#fef3c7]'}`}>
                            {profile?.student_id_url ? <CheckCircle2 className="w-4 h-4 text-[#1a7a4a]" /> : <AlertCircle className="w-4 h-4 text-[#d97706]" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">Student ID uploaded</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${profile?.student_id_url ? 'bg-[#e6f4ed] text-[#1a7a4a]' : 'bg-[#fef3c7] text-[#d97706]'}`}>{profile?.student_id_url ? 'Uploaded' : 'Pending'}</span>
                      </div>

                      {/* Row: Matric Number */}
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profile?.matric_number ? 'bg-[#e6f4ed]' : 'bg-[#fef3c7]'}`}>
                            {profile?.matric_number ? <CheckCircle2 className="w-4 h-4 text-[#1a7a4a]" /> : <AlertCircle className="w-4 h-4 text-[#d97706]" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">Matric number confirmed</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${profile?.matric_number ? 'bg-[#e6f4ed] text-[#1a7a4a]' : 'bg-[#fef3c7] text-[#d97706]'}`}>{profile?.matric_number ? 'Confirmed' : 'Pending'}</span>
                      </div>

                      {/* Row: BVN */}
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profile?.bvn ? 'bg-[#e6f4ed]' : 'bg-[#fef3c7]'}`}>
                            {profile?.bvn ? <CheckCircle2 className="w-4 h-4 text-[#1a7a4a]" /> : <AlertCircle className="w-4 h-4 text-[#d97706]" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">BVN submission</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${profile?.bvn ? 'bg-[#e6f4ed] text-[#1a7a4a]' : 'bg-[#fef3c7] text-[#d97706]'}`}>{profile?.bvn ? 'Submitted' : 'Pending'}</span>
                      </div>

                      {/* Row: Bank Account */}
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profile?.bank_account_number ? 'bg-[#e6f4ed]' : 'bg-[#fef3c7]'}`}>
                            {profile?.bank_account_number ? <CheckCircle2 className="w-4 h-4 text-[#1a7a4a]" /> : <AlertCircle className="w-4 h-4 text-[#d97706]" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">Bank account linkage</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${profile?.bank_account_number ? 'bg-[#e6f4ed] text-[#1a7a4a]' : 'bg-[#fef3c7] text-[#d97706]'}`}>{profile?.bank_account_number ? 'Linked' : 'Pending'}</span>
                      </div>

                      {/* Row: Academic Performance */}
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${profile?.cgpa ? 'bg-[#e6f4ed]' : 'bg-[#fef3c7]'}`}>
                            {profile?.cgpa ? <CheckCircle2 className="w-4 h-4 text-[#1a7a4a]" /> : <AlertCircle className="w-4 h-4 text-[#d97706]" />}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground">Academic performance</span>
                            {profile?.cgpa && <span className="block text-xs text-muted-foreground">CGPA: {profile.cgpa} | GPA: {profile.semester_gpa}</span>}
                          </div>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${profile?.cgpa ? 'bg-[#e6f4ed] text-[#1a7a4a]' : 'bg-[#fef3c7] text-[#d97706]'}`}>{profile?.cgpa ? 'Submitted' : 'Pending'}</span>
                      </div>

                      {/* Row: Social Media */}
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(profile?.instagram_handle || profile?.twitter_handle || profile?.facebook_handle) ? 'bg-[#e6f4ed]' : 'bg-[#fef3c7]'}`}>
                            {(profile?.instagram_handle || profile?.twitter_handle || profile?.facebook_handle) ? <CheckCircle2 className="w-4 h-4 text-[#1a7a4a]" /> : <AlertCircle className="w-4 h-4 text-[#d97706]" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">Business social media</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${(profile?.instagram_handle || profile?.twitter_handle || profile?.facebook_handle) ? 'bg-[#e6f4ed] text-[#1a7a4a]' : 'bg-[#fef3c7] text-[#d97706]'}`}>{(profile?.instagram_handle || profile?.twitter_handle || profile?.facebook_handle) ? 'Linked' : 'Pending'}</span>
                      </div>

                      {/* Row: Business Registration Doc (Optional) */}
                      <div className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center">
                            {profile?.business_reg_url ? <CheckCircle2 className="w-4 h-4 text-[#1a56db]" /> : <Info className="w-4 h-4 text-[#1a56db]" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">Business registration doc</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a56db]`}>{profile?.business_reg_url ? 'Uploaded' : 'Optional'}</span>
                      </div>

                    </div>
                  </motion.div>
                </div>
              )}

              {/* TAB: NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="bg-white border text-left border-border/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-6">Recent notifications</h3>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#1a7a4a] flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Loan approved — ₦200,000 disbursed</p>
                          <p className="text-xs text-muted-foreground font-medium mt-1">Today, 9:04 AM</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#d97706] flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Repayment of ₦25,000 due in 5 days</p>
                          <p className="text-xs text-muted-foreground font-medium mt-1">Yesterday, 3:15 PM</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* TAB: PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="bg-white border text-left border-border/60 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col items-center mb-8">
                       <div className="w-20 h-20 rounded-full bg-[#e8f0fe] flex items-center justify-center text-3xl font-bold text-[#1a56db] mb-4 ring-4 ring-[#1a56db]/5">
                         {displayName ? displayName.substring(0, 2).toUpperCase() : "SB"}
                       </div>
                       <h3 className="text-xl font-bold text-foreground">{displayName || "Adaeze Okonkwo"}</h3>
                       <p className="text-sm text-[#1a56db] font-medium mt-1 bg-[#e8f0fe] px-3 py-1 rounded-full">Student Entrepreneur</p>
                    </div>
                    
                    {!isEditingProfile ? (
                      <div className="space-y-4">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Basic Information</h4>
                        <div className="space-y-0 divide-y divide-border/40">
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Full Name</span>
                            <span className="text-foreground font-bold">{profile?.full_name || "Adaeze Okonkwo"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">University</span>
                            <span className="text-foreground font-bold">{profile?.school_name || "University of Lagos"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Phone Number</span>
                            <span className="text-foreground font-bold">{profile?.phone_number || "Not provided"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">KYC Status</span>
                            <span className={`font-bold capitalize ${profile?.kyc_status === 'verified' ? 'text-[#1a7a4a]' : 'text-[#d97706]'}`}>{profile?.kyc_status || "Pending"}</span>
                          </div>
                        </div>

                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mt-6 mb-1">Financial & Academic</h4>
                        <div className="space-y-0 divide-y divide-border/40">
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Matric Number</span>
                            <span className="text-foreground font-bold">{profile?.matric_number || "Pending"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">BVN (KYC)</span>
                            <span className="text-foreground font-bold">{profile?.bvn ? `XXXXXX${profile.bvn.slice(-4)}` : "Pending"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Bank Details</span>
                            <span className="text-foreground font-bold">{profile?.bank_name ? `${profile.bank_name} - ${profile.bank_account_number}` : "Pending"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Department & Course</span>
                            <span className="text-foreground font-bold">{profile?.course_of_study || "Pending"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Academic CGPA</span>
                            <span className="text-foreground font-bold">{profile?.cgpa || "N/A"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Year of Entry</span>
                            <span className="text-foreground font-bold">{profile?.school_entry_year || "N/A"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Program Duration</span>
                            <span className="text-foreground font-bold">{profile?.course_duration || "N/A"}</span>
                          </div>
                          <div className="flex justify-between py-2 text-sm">
                            <span className="text-muted-foreground font-medium">Graduation Year</span>
                            <span className="text-foreground font-bold text-[#1a7a4a]">{profile?.graduation_year || "N/A"}</span>
                          </div>
                        </div>

                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mt-6 mb-1">Social Handles</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs font-bold text-muted-foreground flex items-center gap-2">
                            <span className="text-[#1a56db]">Instagram:</span> {profile?.instagram_handle || "None"}
                          </div>
                          <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-xs font-bold text-muted-foreground flex items-center gap-2">
                            <span className="text-[#1a56db]">X/Twitter:</span> {profile?.twitter_handle || "None"}
                          </div>
                        </div>

                        <button 
                          onClick={startEditing}
                          className="w-full py-2.5 mt-8 border-2 border-[#1a56db] text-[#1a56db] font-bold rounded-xl hover:bg-[#e8f0fe]/50 transition-all shadow-sm"
                        >
                          Edit Complete Profile
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleProfileUpdate} className="space-y-6 max-h-[60vh] overflow-y-auto px-1 pr-3 custom-scrollbar">
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1a56db] mb-3">Basic Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Full Name</label>
                              <input required type="text" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Phone</label>
                              <input type="text" value={editForm.phoneNumber} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">University</label>
                              <input type="text" value={editForm.schoolName} onChange={(e) => setEditForm({...editForm, schoolName: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/40">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1a56db] mb-3">KYC Info</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Matric Number</label>
                              <input type="text" value={editForm.matricNumber} onChange={(e) => setEditForm({...editForm, matricNumber: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">11-Digit BVN</label>
                              <input type="text" value={editForm.bvn} onChange={(e) => setEditForm({...editForm, bvn: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Bank Name</label>
                              <input type="text" value={editForm.bankName} onChange={(e) => setEditForm({...editForm, bankName: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Account Number</label>
                              <input type="text" value={editForm.accountNumber} onChange={(e) => setEditForm({...editForm, accountNumber: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Residential Address</label>
                              <input type="text" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">State</label>
                              <input type="text" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">NIN (11 Digits)</label>
                              <input type="text" maxLength={11} value={editForm.nationalIdNumber} onChange={(e) => setEditForm({...editForm, nationalIdNumber: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Date of Birth</label>
                              <input type="date" value={editForm.dateOfBirth} onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/40">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1a56db] mb-3">Academic Performance</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Department & Course of Study</label>
                              <input type="text" value={editForm.courseOfStudy} onChange={(e) => setEditForm({...editForm, courseOfStudy: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Year of Entry</label>
                              <input type="text" value={editForm.schoolEntryYear} onChange={(e) => setEditForm({...editForm, schoolEntryYear: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Course Duration</label>
                              <input type="text" value={editForm.courseDuration} onChange={(e) => setEditForm({...editForm, courseDuration: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Graduation Year</label>
                              <input type="text" value={editForm.graduationYear} onChange={(e) => setEditForm({...editForm, graduationYear: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Semester GPA</label>
                              <input type="number" step="0.01" min="0" max="5" value={editForm.semesterGpa} onChange={(e) => setEditForm({...editForm, semesterGpa: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">CGPA</label>
                              <input type="number" step="0.01" min="0" max="5" value={editForm.cgpa} onChange={(e) => setEditForm({...editForm, cgpa: e.target.value})} className="w-full px-4 py-2.5 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/40">
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1a56db] mb-3">Business Socials</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Instagram</label>
                              <input type="text" value={editForm.instagram} onChange={(e) => setEditForm({...editForm, instagram: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">X/Twitter</label>
                              <input type="text" value={editForm.twitter} onChange={(e) => setEditForm({...editForm, twitter: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-muted-foreground">Facebook</label>
                              <input type="text" value={editForm.facebook} onChange={(e) => setEditForm({...editForm, facebook: e.target.value})} className="w-full px-4 py-2 bg-muted/10 border rounded-xl focus:ring-2 focus:ring-[#1a56db]/50 outline-none text-sm" />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-6 sticky bottom-0 bg-white pb-2">
                          <button 
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="flex-1 py-3 border-2 border-border text-muted-foreground font-bold rounded-xl hover:bg-muted/50 transition-all font-display text-xs"
                          >
                            Discard
                          </button>
                          <button onClick={() => toast({ title: "Feature in development", description: "This action will be available soon!" })} 
                            type="submit"
                            disabled={isSavingProfile}
                            className="flex-1 py-3 bg-[#1a56db] text-white font-bold rounded-xl shadow-lg border border-[#1a56db] hover:shadow-[#1a56db]/20 transition-all font-display text-xs disabled:opacity-50"
                          >
                            {isSavingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : "Apply Changes"}
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- VIEWS ---

const EntrepreneurGuide = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const { toast } = useToast();
  const steps = [
    {
      emoji: "🛡️",
      title: "Pass KYC Verification",
      desc: "Upload your student ID and verify your Matric Number. High-trust profiles get funded 3x faster and unlock larger loan limits.",
      cta: "Verify Account",
      tab: "credit",
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      btnBg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      emoji: "📊",
      title: "Build Your Pitch",
      desc: "Tell your business story. Use the 'Business' tab to show revenue, growth, and why investors should back your vision.",
      cta: "Setup Business",
      tab: "business",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      btnBg: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      emoji: "💰",
      title: "Get Funded",
      desc: "Request a peer loan. Investors will review your profile and fund your venture. Funds are disbursed instantly once backed.",
      cta: "Request Loan",
      tab: "loans",
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-700",
      btnBg: "bg-orange-600 hover:bg-orange-700",
    },
    {
      emoji: "💸",
      title: "Scale & Repay",
      desc: "Stay on track! Timely repayments skyrocket your Credit Score, making you eligible for ₦1,000,000+ scaling loans.",
      cta: "View Schedule",
      tab: "repayments",
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      btnBg: "bg-green-600 hover:bg-green-700",
    },
  ];

  const faqs = [
    {
      q: "Who can see my business pitch?",
      a: "Only verified Investors (Students, Alumni, and Community) on the StudentBIZ platform can see your venture details.",
    },
    {
      q: "How is my Credit Score calculated?",
      a: "It's based on your academic standing (CGPA), KYC status, and most importantly, your repayment consistency on previous loans.",
    },
    {
      q: "What happens if I'm late on a payment?",
      a: "Late payments lower your Credit Score and may restrict future funding. We encourage transparency — communicate with your investors via the dashboard.",
    },
    {
      q: "When can I ask for more money?",
      a: "As you repay and grow your revenue, the platform automatically raises your funding ceiling for your next business stage.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a56db] to-blue-800 rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-500/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Sparkles size={400} className="absolute -right-20 -top-20 text-white" />
        </div>
        <div className="relative z-10 text-left md:text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-black tracking-tight mb-3">Scale Your Vision</h2>
          <p className="text-blue-50 font-medium text-lg max-w-xl mx-auto leading-relaxed">
            Welcome, <strong className="text-white">Student Entrepreneur</strong>. This is your mission control. Follow these steps to unlock the capital you need to dominate the campus market.
          </p>
          <button 
            onClick={() => setActiveTab("loans")}
            className="mt-8 bg-white text-blue-700 font-black text-xs uppercase tracking-[0.2em] px-10 py-4 rounded-full shadow-xl hover:-translate-y-1 transition-all"
          >
            Start Your Pitch Now
          </button>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-1">Growth Roadmap — 4 Steps</h3>
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
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-1">Entrepreneur Guide FAQ</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border-2 border-slate-100 rounded-[1.5rem] p-6 shadow-sm text-left">
              <h4 className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                <span className="text-blue-500">Q.</span> {faq.q}
              </h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default StudentDashboardTemplate;
