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
  ArrowRight,
  PlusCircle,
  Send,
  FileText,
  Percent,
  Users,
  Store,
  Globe,
  Phone,
  ChevronLeft,
  Clock,
  Star,
  Layers,
  Lock,
  Award,
  Zap
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

// ── UTILITIES ──
const formatCurrency = (amt: any) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(Number(amt) || 0);
};

// ── INTERNAL COMPONENTS ──
const TrustBadge = ({ type }: { type: 'id' | 'academic' | 'founder' }) => {
  const configs = {
    id: { label: 'ID Verified', icon: <ShieldCheck className="w-3 h-3" />, color: 'bg-green-50 text-green-700 border-green-200' },
    academic: { label: 'Top Tier GPA', icon: <Award className="w-3 h-3" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    founder: { label: 'Venture Founder', icon: <Zap className="w-3 h-3" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };
  const config = configs[type];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.color} shadow-sm animate-fade-in`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const VenturePreviewCard = ({ form, profile, step, localImage }: any) => {
  const imageUrl = localImage || form.image || null;
  
  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden sticky top-8 animate-scale-in">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2 bg-gradient-to-br from-slate-50 to-slate-100">
            <Store size={48} className="opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Your Business Image Here</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a56db]">Marketplace Preview</span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1a56db] bg-blue-50 px-2 py-0.5 rounded">
              {form.category || 'Category'}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${
              form.risk_level === 'low' ? 'bg-green-50 text-green-600' : 
              form.risk_level === 'high' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
            }`}>
              {form.risk_level ? `${form.risk_level} Risk` : 'Risk Level'}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-800 leading-tight">
            {form.name || 'Your Venture Name'}
          </h3>
          <p className="text-xs font-bold text-slate-400 mt-0.5">
            Founder: {profile?.full_name || 'Entrepreneur Name'}
          </p>
        </div>

        <p className="text-[13px] font-medium text-slate-600 leading-relaxed line-clamp-3">
          {form.description || 'Provide a compelling description in Step 2 to attract investors...'}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Funding Goal</div>
            <div className="text-sm font-black text-slate-800">{formatCurrency(form.funding_goal)}</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fixed ROI</div>
            <div className="text-sm font-black text-slate-800">{form.interest_rate || '0'}%</div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Student</span>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Duration</div>
            <div className="text-[11px] font-black text-slate-800">{form.duration_days || '—'} days</div>
          </div>
        </div>

        <button disabled className="w-full py-3 bg-[#1a56db] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl opacity-50">
          Support Student
        </button>
      </div>

      {/* Shimmer Effect when data is missing */}
      {(!form.name || !form.description) && (
        <div className="absolute inset-0 bg-white/10 pointer-events-none animate-shimmer opacity-30" />
      )}
    </div>
  );
};

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

  // ── VENTURE STATE ──────────────────────────────────────────────────────────
  interface Venture {
    id: string;
    entrepreneur_id: string;
    name: string;
    description: string;
    category: string;
    funding_goal: number;
    amount_raised: number;
    interest_rate: number;
    duration_days: number;
    risk_level: 'low' | 'medium' | 'high' | 'pending';
    image: string | null;
    student_name: string;
    university: string;
    tagline: string | null;
    problem_statement: string | null;
    solution: string | null;
    monthly_revenue: number | null;
    profit_margin: number | null;
    operating_since: string | null;
    employees: number;
    pitch_deck_url: string | null;
    business_website: string | null;
    whatsapp_number: string | null;
    status: 'draft' | 'submitted' | 'under_review' | 'listed' | 'rejected';
    rejection_reason: string | null;
    submitted_at: string | null;
    created_at: string;
  }

  const VENTURE_CATEGORIES = [
    'Fashion & Retail', 'Food & Catering', 'Tech & Software', 'EdTech',
    'Agriculture', 'Logistics', 'Creative Arts', 'Health & Beauty',
    'Education/Tutoring', 'Finance/Fintech', 'Other'
  ];

  const [venture, setVenture] = useState<Venture | null>(null);
  const [ventureLoading, setVentureLoading] = useState(true);
  const [showVentureForm, setShowVentureForm] = useState(false);
  const [ventureStep, setVentureStep] = useState(1);
  const [isSubmittingVenture, setIsSubmittingVenture] = useState(false);
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [ventureForm, setVentureForm] = useState({
    name: '', tagline: '', category: '', operating_since: '',
    employees: '1', whatsapp_number: '', description: '',
    problem_statement: '', solution: '', business_website: '',
    funding_goal: '', interest_rate: '', duration_days: '',
    risk_level: '', monthly_revenue: '', profit_margin: '',
  });

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

  // ── VENTURE FETCH ───────────────────────────────────────────────────────────
  React.useEffect(() => {
    const userId = user?.id || profile?.id;
    if (!userId) { setVentureLoading(false); return; }
    const loadVenture = async () => {
      try {
        const { data, error } = await supabase
          .from('ventures')
          .select('*')
          .eq('entrepreneur_id', userId)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setVenture(data as Venture);
          // Pre-fill form so user can edit their existing venture
          setVentureForm({
            name: data.name || '',
            tagline: data.tagline || '',
            category: data.category || '',
            operating_since: data.operating_since || '',
            employees: String(data.employees || 1),
            whatsapp_number: data.whatsapp_number || '',
            description: data.description || '',
            problem_statement: data.problem_statement || '',
            solution: data.solution || '',
            business_website: data.business_website || '',
            funding_goal: String(data.funding_goal || ''),
            interest_rate: String(data.interest_rate || ''),
            duration_days: String(data.duration_days || ''),
            risk_level: data.risk_level || '',
            monthly_revenue: String(data.monthly_revenue || ''),
            profit_margin: String(data.profit_margin || ''),
          });
        }
      } catch (err: any) {
        console.error('Venture fetch error:', err.message);
      } finally {
        setVentureLoading(false);
      }
    };
    loadVenture();
  }, [user?.id, profile?.id]);

  const handleSaveDraft = async () => {
    const userId = user?.id || profile?.id;
    if (!userId || !ventureForm.name.trim()) {
      toast({ title: 'Business name required', description: 'Please enter your business name before saving a draft.', variant: 'destructive' });
      return;
    }
    setIsSubmittingVenture(true);
    try {
      const payload: any = {
        entrepreneur_id: userId,
        status: 'draft',
        student_name: profile?.full_name || user?.user_metadata?.full_name || 'Entrepreneur',
        university: profile?.school_name || 'University',
        name: ventureForm.name.trim(),
        description: ventureForm.description.trim() || 'Draft — not yet complete',
        category: ventureForm.category || 'Other',
        funding_goal: ventureForm.funding_goal ? parseFloat(ventureForm.funding_goal) : 50000,
        interest_rate: ventureForm.interest_rate ? parseFloat(ventureForm.interest_rate) : 9,
        duration_days: ventureForm.duration_days ? parseInt(ventureForm.duration_days) : 45,
        risk_level: ventureForm.risk_level || 'low',
        tagline: ventureForm.tagline.trim() || null,
        problem_statement: ventureForm.problem_statement.trim() || null,
        solution: ventureForm.solution.trim() || null,
        business_website: ventureForm.business_website.trim() || null,
        whatsapp_number: ventureForm.whatsapp_number.trim() || null,
        monthly_revenue: ventureForm.monthly_revenue ? parseFloat(ventureForm.monthly_revenue) : null,
        profit_margin: ventureForm.profit_margin ? parseFloat(ventureForm.profit_margin) : null,
        operating_since: ventureForm.operating_since || null,
        employees: ventureForm.employees ? parseInt(ventureForm.employees) : 1,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from('ventures').upsert(payload, { onConflict: 'entrepreneur_id' }).select().single();
      if (error) throw error;
      setVenture(data as Venture);
      setShowVentureForm(false);
      toast({ title: 'Draft saved! ✅', description: 'Your venture has been saved. Submit it when you\'re ready.' });
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmittingVenture(false);
    }
  };

  const handleVentureSubmit = async () => {
    console.log("handleVentureSubmit: Start");
    const userId = user?.id || profile?.id;
    if (!userId) {
      console.error("handleVentureSubmit: No userId found");
      toast({ title: 'Authentication Error', description: 'Please log in again.', variant: 'destructive' });
      return;
    }

    // KYC Gate
    if (!profile?.kyc_status || profile.kyc_status === 'pending') {
      console.log("handleVentureSubmit: KYC Required");
      toast({ title: 'KYC Required 🔒', description: 'Complete your KYC verification before submitting a venture.', variant: 'destructive' });
      setActiveTab('credit');
      return;
    }

    // Validation
    const f = ventureForm;
    if (!f.name.trim() || !f.description.trim() || !f.category || !f.funding_goal) {
      console.log("handleVentureSubmit: Missing fields");
      toast({ title: 'Missing required fields', description: 'Please fill all required fields before submitting.', variant: 'destructive' });
      return;
    }

    const goal = parseFloat(f.funding_goal);
    if (isNaN(goal) || goal < 50000 || goal > 300000) {
      console.log("handleVentureSubmit: Invalid goal", goal);
      toast({ title: 'Invalid funding goal', description: 'Funding goal must be between ₦50,000 and ₦300,000.', variant: 'destructive' });
      return;
    }

    setIsSubmittingVenture(true);
    console.log("handleVentureSubmit: Processing...");

    try {
      let imageUrl = venture?.image || null;
      let pitchDeckUrl = venture?.pitch_deck_url || null;

      // Helper for uploads with timeout
      const uploadWithTimeout = async (bucket: string, path: string, file: File) => {
        const uploadPromise = supabase.storage.from(bucket).upload(path, file, { upsert: true });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Upload timed out after 15 seconds")), 15000)
        );
        return Promise.race([uploadPromise, timeoutPromise]) as Promise<{ data: any, error: any }>;
      };

      if (productImageFile) {
        console.log("handleVentureSubmit: Uploading image to 'kyc-documents'...");
        try {
          const ext = productImageFile.name.split('.').pop();
          const path = `${userId}/vimg-${Date.now()}.${ext}`;
          const { error: imgErr } = await uploadWithTimeout('kyc-documents', path, productImageFile);
          
          if (imgErr) {
            console.error("Image upload error response:", imgErr);
          } else {
            const { data: { publicUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(path);
            imageUrl = publicUrl;
            console.log("Image uploaded successfully:", imageUrl);
          }
        } catch (e: any) { 
          console.error("Image upload catch block:", e.message);
          toast({ title: 'Image Upload Failed', description: e.message + ". Continuing with submission...", variant: 'destructive' });
        }
      }

      if (pitchDeckFile) {
        console.log("handleVentureSubmit: Uploading pitch deck to 'kyc-documents'...");
        try {
          const ext = pitchDeckFile.name.split('.').pop();
          const path = `${userId}/pdeck-${Date.now()}.${ext}`;
          const { error: pdfErr } = await uploadWithTimeout('kyc-documents', path, pitchDeckFile);
          
          if (pdfErr) {
            console.error("Pitch deck upload error response:", pdfErr);
          } else {
            const { data: { publicUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(path);
            pitchDeckUrl = publicUrl;
            console.log("Pitch deck uploaded successfully:", pitchDeckUrl);
          }
        } catch (e: any) {
          console.error("Pitch deck upload catch block:", e.message);
          toast({ title: 'Pitch Deck Upload Failed', description: e.message + ". Continuing...", variant: 'destructive' });
        }
      }

      const payload = {
        entrepreneur_id: userId,
        student_name: profile?.full_name || user?.user_metadata?.full_name || 'Entrepreneur',
        university: profile?.school_name || 'University',
        name: f.name.trim(),
        description: f.description.trim(),
        category: f.category,
        funding_goal: goal,
        interest_rate: f.interest_rate && !isNaN(parseFloat(f.interest_rate)) ? parseFloat(f.interest_rate) : 0,
        duration_days: f.duration_days && !isNaN(parseInt(f.duration_days)) ? parseInt(f.duration_days) : 0,
        risk_level: f.risk_level || 'pending',
        image: imageUrl,
        pitch_deck_url: pitchDeckUrl,
        tagline: f.tagline.trim() || null,
        problem_statement: f.problem_statement.trim() || null,
        solution: f.solution.trim() || null,
        business_website: f.business_website.trim() || null,
        whatsapp_number: f.whatsapp_number.trim() || null,
        monthly_revenue: f.monthly_revenue && !isNaN(parseFloat(f.monthly_revenue)) ? parseFloat(f.monthly_revenue) : null,
        profit_margin: f.profit_margin && !isNaN(parseFloat(f.profit_margin)) ? parseFloat(f.profit_margin) : null,
        operating_since: f.operating_since || null,
        employees: f.employees && !isNaN(parseInt(f.employees)) ? parseInt(f.employees) : 1,
        status: 'submitted' as const,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("handleVentureSubmit: Upserting payload", payload);
      
      const upsertWithTimeout = async () => {
        const upsertPromise = supabase.from('ventures').upsert(payload, { onConflict: 'entrepreneur_id' }).select().single();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Database save timed out after 15 seconds")), 15000)
        );
        return Promise.race([upsertPromise, timeoutPromise]) as Promise<{ data: any, error: any }>;
      };

      const { data, error } = await upsertWithTimeout();
      
      if (error) {
        console.error("Supabase upsert error:", error);
        throw error;
      }

      console.log("handleVentureSubmit: Success!");
      setVenture(data as Venture);
      setShowVentureForm(false);
      setVentureStep(1);
      toast({ title: 'Venture submitted! 🚀', description: 'Your proposal is now under review. We\'ll notify you shortly.' });
    } catch (err: any) {
      console.error("handleVentureSubmit: Catch block error:", err);
      toast({ title: 'Submission failed', description: err.message || 'An unknown error occurred', variant: 'destructive' });
    } finally {
      console.log("handleVentureSubmit: Cleaning up");
      setIsSubmittingVenture(false);
    }
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
              className={`max-w-7xl mx-auto space-y-6 ${activeTab === 'business' && showVentureForm ? 'max-w-[1400px]' : ''}`}
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

              {/* TAB: BUSINESS — Dynamic Venture Onboarding */}
              {activeTab === "business" && (
                <div className="space-y-6">

                  {/* ── LOADING ── */}
                  {ventureLoading && (
                    <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-10 shadow-sm flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-[#1a56db]/20 border-t-[#1a56db] rounded-full animate-spin border-4" />
                        <p className="text-sm font-medium text-muted-foreground">Loading your venture...</p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── MULTI-STEP FORM ── */}
                  {!ventureLoading && showVentureForm && (
                    <motion.div variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border/60 rounded-2xl shadow-md overflow-hidden">
                      {/* Step Progress Bar */}
                      <div className="bg-[#f3f6fb] border-b border-border/60 px-6 py-4 flex items-center justify-between">
                        <button onClick={() => { if (ventureStep > 1) setVentureStep(s => s - 1); else setShowVentureForm(false); }} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                          <ChevronLeft className="w-4 h-4" /> {ventureStep === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <div className="flex items-center gap-2">
                          {[1,2,3].map(s => (
                            <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s <= ventureStep ? 'bg-[#1a56db] w-8' : 'bg-slate-200 w-4'}`} />
                          ))}
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="p-8">
                        <AnimatePresence mode="wait">
                          {/* ── STEP 1: Business Identity ── */}
                          {ventureStep === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                              <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                  <div>
                                    <h3 className="text-xl font-black text-foreground flex items-center gap-2 transition-all group">
                                      <Store className="w-5 h-5 text-[#1a56db] group-hover:scale-110 transition-transform" /> 
                                      Business Identity
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">Tell us who you are and what you do.</p>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 sm:col-span-2">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Business Name <span className="text-red-500">*</span></label>
                                      <input value={ventureForm.name} onChange={e => setVentureForm({...ventureForm, name: e.target.value})} placeholder="e.g. EcoSnacks Campus" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tagline</label>
                                      <input value={ventureForm.tagline} onChange={e => setVentureForm({...ventureForm, tagline: e.target.value})} placeholder="One catchy line about your business" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Category <span className="text-red-500">*</span></label>
                                      <select value={ventureForm.category} onChange={e => setVentureForm({...ventureForm, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all">
                                        <option value="">Select category...</option>
                                        {VENTURE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                      </select>
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Operating Since</label>
                                      <input type="date" value={ventureForm.operating_since} onChange={e => setVentureForm({...ventureForm, operating_since: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Team Size</label>
                                      <input type="number" min="1" value={ventureForm.employees} onChange={e => setVentureForm({...ventureForm, employees: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">WhatsApp Contact</label>
                                      <input type="tel" value={ventureForm.whatsapp_number} onChange={e => setVentureForm({...ventureForm, whatsapp_number: e.target.value})} placeholder="e.g. 08012345678" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>
                                  </div>
                                  <button onClick={() => {
                                    if (!ventureForm.name.trim() || !ventureForm.category) { toast({ title: 'Required fields missing', description: 'Enter a business name and select a category.', variant: 'destructive' }); return; }
                                    setVentureStep(2);
                                  }} className="w-full py-4 bg-[#1a56db] text-white font-bold rounded-xl hover:bg-[#1a56db]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group">
                                    Next: The Pitch <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </button>
                                </div>
                                <div className="hidden lg:block w-80 shrink-0">
                                  <VenturePreviewCard form={ventureForm} profile={profile} step={1} />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* ── STEP 2: The Pitch ── */}
                          {ventureStep === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                              <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                  <div>
                                    <h3 className="text-xl font-black text-foreground flex items-center gap-2 transition-all"><Layers className="w-5 h-5 text-[#1a56db]" /> The Pitch</h3>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">Describe your venture. This is what investors will read on your listing card.</p>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Short Description <span className="text-red-500">*</span> <span className="normal-case font-medium text-muted-foreground/70">(shown to investors)</span></label>
                                      <textarea rows={3} value={ventureForm.description} onChange={e => setVentureForm({...ventureForm, description: e.target.value})} placeholder="In 1-3 sentences, what does your business do and why does it matter?" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium resize-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Problem Statement</label>
                                      <textarea rows={2} value={ventureForm.problem_statement} onChange={e => setVentureForm({...ventureForm, problem_statement: e.target.value})} placeholder="What problem are you solving?" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium resize-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Solution</label>
                                      <textarea rows={2} value={ventureForm.solution} onChange={e => setVentureForm({...ventureForm, solution: e.target.value})} placeholder="How does your product/service solve it?" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium resize-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Business Website / Link</label>
                                      <input type="url" value={ventureForm.business_website} onChange={e => setVentureForm({...ventureForm, business_website: e.target.value})} placeholder="https://yourbusiness.com or Instagram link" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product / Business Image <span className="normal-case font-medium text-muted-foreground/70">(shown on investor card)</span></label>
                                      <div className="border-2 border-dashed border-border/40 rounded-xl p-6 text-center hover:bg-white/50 hover:border-[#1a56db]/50 transition-all group">
                                        <input type="file" accept="image/*" className="hidden" id="venture_image_upload" onChange={e => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            setProductImageFile(file);
                                            // Real-time local preview update
                                            const url = URL.createObjectURL(file);
                                            setPreviewImageUrl(url);
                                          }
                                        }} />
                                        <label htmlFor="venture_image_upload" className="cursor-pointer flex flex-col items-center gap-2">
                                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#1a56db] group-hover:text-white transition-all">
                                            <Upload className="w-5 h-5" />
                                          </div>
                                          <span className="text-sm font-bold text-[#1a56db] hover:underline">
                                            {productImageFile ? productImageFile.name : (venture?.image ? '✅ Image already uploaded — click to replace' : 'Click to upload product image')}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">JPG, PNG, WebP (Max 2MB)</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <button onClick={() => {
                                    if (!ventureForm.description.trim()) { toast({ title: 'Description required', description: 'Add a short description for investors.', variant: 'destructive' }); return; }
                                    setVentureStep(3);
                                  }} className="w-full py-4 bg-[#1a56db] text-white font-bold rounded-xl hover:bg-[#1a56db]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group">
                                    Next: Financials <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </button>
                                </div>
                                <div className="hidden lg:block w-80 shrink-0">
                                  <VenturePreviewCard form={ventureForm} profile={profile} step={2} localImage={previewImageUrl} />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* ── STEP 3: Financials & Investment Terms ── */}
                          {ventureStep === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                              <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                  <div>
                                    <h3 className="text-xl font-black text-foreground flex items-center gap-2 transition-all"><TrendingUp className="w-5 h-5 text-[#1a56db]" /> Financials & Investment Terms</h3>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">These figures will appear on your investor marketplace listing.</p>
                                  </div>

                                  {/* KYC Warning */}
                                  {(!profile?.kyc_status || profile.kyc_status === 'pending') && (
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#fef3c7] border border-[#d97706]/40 rounded-xl p-4 flex items-start gap-3">
                                      <Lock className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-bold text-[#b45309]">KYC Required to Submit</p>
                                        <p className="text-xs text-[#92400e] mt-0.5">You can save a draft, but submitting requires KYC verification. <button onClick={() => setActiveTab('credit')} className="underline font-black hover:text-[#b45309] transition-colors">Complete KYC →</button></p>
                                      </div>
                                    </motion.div>
                                  )}

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 sm:col-span-2">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Funding Goal (₦) <span className="text-red-500">*</span> <span className="normal-case font-medium text-muted-foreground/70">₦50,000 – ₦300,000</span></label>
                                      <input type="number" min="50000" max="300000" value={ventureForm.funding_goal} onChange={e => setVentureForm({...ventureForm, funding_goal: e.target.value})} placeholder="e.g. 150000" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monthly Revenue (₦)</label>
                                      <input type="number" min="0" value={ventureForm.monthly_revenue} onChange={e => setVentureForm({...ventureForm, monthly_revenue: e.target.value})} placeholder="e.g. 80000" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#1a56db]/40 text-sm font-medium transition-all" />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pitch Deck (PDF — Optional)</label>
                                      <div className="border-2 border-dashed border-border/40 rounded-xl p-6 text-center hover:bg-white/50 hover:border-[#1a56db]/50 transition-all group">
                                        <input type="file" accept=".pdf" className="hidden" id="pitch_deck_upload" onChange={e => setPitchDeckFile(e.target.files?.[0] || null)} />
                                        <label htmlFor="pitch_deck_upload" className="cursor-pointer flex flex-col items-center gap-2">
                                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#1a56db] group-hover:text-white transition-all">
                                            <FileText className="w-5 h-5" />
                                          </div>
                                          <span className="text-sm font-bold text-[#1a56db] hover:underline">
                                            {pitchDeckFile ? pitchDeckFile.name : (venture?.pitch_deck_url ? '✅ Pitch deck uploaded — click to replace' : 'Click to upload pitch deck PDF')}
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button 
                                      onClick={() => {
                                        console.log("Saving draft...");
                                        handleSaveDraft();
                                      }} 
                                      disabled={isSubmittingVenture} 
                                      className="flex-1 py-4 border-2 border-[#1a56db] text-[#1a56db] font-extrabold rounded-xl hover:bg-[#e8f0fe]/80 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
                                    >
                                      {isSubmittingVenture ? 'Processing...' : 'Save as Draft'}
                                    </button>
                                    <div className="flex-1 flex flex-col gap-1">
                                      <button
                                        onClick={() => {
                                          console.log("Submit for Review clicked");
                                          if (!profile?.kyc_status || profile.kyc_status === 'pending') {
                                            toast({ title: 'KYC Required 🔒', description: 'Complete your KYC first to submit to marketplace.', variant: 'destructive' });
                                            return;
                                          }
                                          handleVentureSubmit();
                                        }}
                                        disabled={isSubmittingVenture}
                                        className={`w-full py-4 font-extrabold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest ${
                                          (!profile?.kyc_status || profile.kyc_status === 'pending') 
                                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none' 
                                          : 'bg-[#1a56db] text-white hover:bg-[#1a56db]/90 shadow-blue-500/30'
                                        }`}
                                      >
                                        {isSubmittingVenture ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Submit for Review</>}
                                      </button>
                                      {(!profile?.kyc_status || profile.kyc_status === 'pending') && (
                                        <p className="text-[10px] text-orange-600 font-bold text-center animate-pulse italic">KYC is required for marketplace listing</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="hidden lg:block w-80 shrink-0">
                                  <VenturePreviewCard form={ventureForm} profile={profile} step={3} localImage={previewImageUrl} />
                                </div>
                              </div>
                            </motion.div>
                          )}

                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* ── NO VENTURE YET — CTA ── */}
                  {!ventureLoading && !showVentureForm && !venture && (
                    <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#1a56db] to-blue-700 rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
                      <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none"><Sparkles size={220} /></div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">🚀</div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">Launch Your Venture</h3>
                        <p className="text-blue-100 font-medium text-sm max-w-sm mx-auto leading-relaxed mb-8">
                          Submit your business proposal and get it in front of hundreds of alumni and community investors on the StudentBIZ marketplace.
                        </p>
                        <button
                          onClick={() => { setShowVentureForm(true); setVentureStep(1); }}
                          className="bg-white text-[#1a56db] font-black text-xs uppercase tracking-[0.15em] px-10 py-4 rounded-full shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
                        >
                          <PlusCircle className="w-4 h-4" /> Start Your Pitch
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── VENTURE EXISTS — Status Cards ── */}
                  {!ventureLoading && !showVentureForm && venture && (
                    <>
                      {/* Header card with venture info + status badge */}
                      <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {venture.image
                              ? <img src={venture.image} alt={venture.name} className="w-14 h-14 rounded-2xl object-cover border border-border/60 flex-shrink-0" />
                              : <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] flex items-center justify-center text-2xl flex-shrink-0"><Store className="w-6 h-6 text-[#1a56db]" /></div>
                            }
                            <div>
                              <h3 className="text-lg font-black text-foreground">{venture.name}</h3>
                              {venture.tagline && <p className="text-sm text-muted-foreground font-medium">{venture.tagline}</p>}
                              <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#e8f0fe] text-[#1a56db]">{venture.category}</span>
                            </div>
                          </div>
                          {/* Status Badge */}
                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                              venture.status === 'listed' ? 'bg-[#e6f4ed] text-[#1a7a4a]' :
                              venture.status === 'rejected' ? 'bg-red-50 text-red-600' :
                              venture.status === 'draft' ? 'bg-slate-100 text-slate-500' :
                              'bg-[#fef3c7] text-[#d97706]'
                            }`}>
                              {venture.status === 'listed' ? '✅ Live on Marketplace' :
                               venture.status === 'rejected' ? '❌ Rejected' :
                               venture.status === 'submitted' ? '⏳ Submitted' :
                               venture.status === 'under_review' ? '🔍 Under Review' : '📝 Draft'}
                            </span>
                            <button onClick={() => { setShowVentureForm(true); setVentureStep(1); }} className="text-[11px] font-bold text-[#1a56db] hover:underline flex items-center gap-1">
                              {venture.status === 'rejected' ? '✏️ Revise & Resubmit' : '✏️ Edit Venture'}
                            </button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Rejection reason card */}
                      {venture.status === 'rejected' && venture.rejection_reason && (
                        <motion.div variants={itemVariants} className="bg-red-50 border border-red-200 rounded-2xl p-5">
                          <h4 className="text-sm font-black text-red-700 mb-1 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Admin Feedback</h4>
                          <p className="text-sm text-red-600 font-medium">{venture.rejection_reason}</p>
                        </motion.div>
                      )}

                      {/* Submitted / Under Review — Progress timeline */}
                      {(venture.status === 'submitted' || venture.status === 'under_review') && (
                        <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                          <h4 className="text-sm font-bold text-foreground mb-5">Review Progress</h4>
                          <div className="flex items-start gap-0">
                            {[
                              { label: 'Submitted', done: true },
                              { label: 'Under Review', done: venture.status === 'under_review' },
                              { label: 'Listed on Marketplace', done: false },
                            ].map((step, i, arr) => (
                              <div key={i} className="flex-1 flex flex-col items-center">
                                <div className="flex items-center w-full">
                                  {i > 0 && <div className={`flex-1 h-0.5 ${step.done || arr[i-1].done ? 'bg-[#1a56db]' : 'bg-slate-200'}`} />}
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black ${
                                    step.done ? 'bg-[#1a56db] text-white' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                  </div>
                                  {i < arr.length - 1 && <div className={`flex-1 h-0.5 ${step.done ? 'bg-[#1a56db]' : 'bg-slate-200'}`} />}
                                </div>
                                <span className={`text-[10px] font-bold mt-2 text-center leading-tight ${
                                  step.done ? 'text-[#1a56db]' : 'text-slate-400'
                                }`}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Venture details summary */}
                      <motion.div variants={itemVariants} className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                        <h4 className="text-sm font-bold text-foreground mb-4">Venture Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-[#e8f0fe]/60 rounded-xl p-4 text-center">
                            <div className="text-lg font-black text-[#1a56db]">₦{venture.funding_goal?.toLocaleString()}</div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-1">Funding Goal</div>
                          </div>
                          <div className="bg-[#e6f4ed]/60 rounded-xl p-4 text-center">
                            <div className={`text-lg font-black ${venture.interest_rate > 0 ? 'text-[#1a7a4a]' : 'text-slate-400 text-sm'}`}>{venture.interest_rate > 0 ? `${venture.interest_rate}%` : 'Pending'}</div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-1">Interest Rate</div>
                          </div>
                          <div className="bg-[#fef3c7]/60 rounded-xl p-4 text-center">
                            <div className={`text-lg font-black ${venture.duration_days > 0 ? 'text-[#d97706]' : 'text-slate-400 text-sm'}`}>{venture.duration_days > 0 ? `${venture.duration_days} days` : 'Pending'}</div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-1">Loan Term</div>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-4 text-center">
                            <div className={`text-lg font-black capitalize ${venture.risk_level !== 'pending' ? 'text-foreground' : 'text-slate-400 text-sm'}`}>{venture.risk_level}</div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-1">Risk Level</div>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-4 text-center">
                            <div className={`text-lg font-black ${venture.monthly_revenue ? 'text-foreground' : 'text-slate-400 text-sm'}`}>{venture.monthly_revenue ? `₦${venture.monthly_revenue.toLocaleString()}` : 'Pending'}</div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-1">Monthly Revenue</div>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-4 text-center">
                            <div className={`text-lg font-black ${venture.profit_margin ? 'text-foreground' : 'text-slate-400 text-sm'}`}>{venture.profit_margin ? `${venture.profit_margin}%` : 'Pending'}</div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-1">Profit Margin</div>
                          </div>
                        </div>
                        {venture.description && (
                          <div className="mt-4 pt-4 border-t border-border/40">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Pitch</p>
                            <p className="text-sm font-medium text-foreground leading-relaxed">{venture.description}</p>
                          </div>
                        )}
                        {venture.pitch_deck_url && (
                          <a href={venture.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="mt-4 pt-4 border-t border-border/40 flex items-center gap-2 text-sm font-bold text-[#1a56db] hover:underline">
                            <FileText className="w-4 h-4" /> View Pitch Deck
                          </a>
                        )}
                      </motion.div>
                    </>
                  )}

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

                      {/* Dynamic Admin Terms Alert */}
                      {venture && venture.risk_level !== 'pending' && venture.interest_rate > 0 && (
                        <div className="flex gap-4">
                          <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#1a56db] flex-shrink-0 shadow-[0_0_8px_rgba(26,86,219,0.5)]"></div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Admin has set your Venture's terms!</p>
                            <p className="text-sm text-muted-foreground font-medium mt-0.5">Your pitch now shows a <span className="font-bold text-[#1a7a4a]">{venture.interest_rate}% Return Rate</span>, <span className="font-bold text-[#d97706]">{venture.duration_days} Day Loan Term</span>, and a <span className="font-bold capitalize">{venture.risk_level} Risk Level</span>.</p>
                            <p className="text-xs text-muted-foreground font-medium mt-1">Recently</p>
                          </div>
                        </div>
                      )}
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
                        
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                          {profile?.kyc_status === 'verified' && <TrustBadge type="id" />}
                          {Number(profile?.cgpa) >= 3.5 && <TrustBadge type="academic" />}
                          {venture && <TrustBadge type="founder" />}
                          {(!profile?.kyc_status || profile?.kyc_status === 'pending') && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Not Verified</span>
                          )}
                        </div>

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
