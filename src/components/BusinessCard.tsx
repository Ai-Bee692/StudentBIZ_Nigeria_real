import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, TrendingUp, Store, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export interface Venture {
  id: string;
  entrepreneur_id: string;
  name: string;
  description: string;
  tagline?: string;
  category: string;
  funding_goal: number;
  amount_raised?: number;
  interest_rate: number;
  duration_days: number;
  risk_level: "low" | "medium" | "high" | "pending";
  image?: string;
  student_name: string;
  university: string;
  status: string;
}

interface BusinessCardProps {
  venture: Venture;
  delay?: number;
}

const BusinessCard = ({ venture, delay = 0 }: BusinessCardProps) => {
  if (!venture) return null;
  
  const amountRaised = venture.amount_raised || 0;
  const fundingProgress = (amountRaised / venture.funding_goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
        {/* Image / Gradient */}
        <div className="relative h-48 bg-gradient-to-br from-[#3b82f6] to-[#2dd4bf] overflow-hidden shrink-0">
          {venture.image ? (
            <img
              src={venture.image}
              alt={venture.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-bold text-white/30">
                {venture.name ? venture.name.charAt(0).toUpperCase() : "V"}
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-white text-slate-800 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
              {venture.category || "Category"}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-sm ${
                venture.risk_level === "low"
                  ? "text-[#4ade80]" // Emerald 400
                  : venture.risk_level === "high"
                  ? "text-[#f87171]" // Red 400
                  : "text-[#fbbf24]" // Amber 400
              }`}
            >
              {venture.risk_level
                ? `${venture.risk_level.charAt(0).toUpperCase() + venture.risk_level.slice(1)} Risk`
                : "Risk Level"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="font-bold text-[17px] text-slate-800 mb-1.5 line-clamp-1">
              {venture.name}
            </h3>
            <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
              {venture.description || "No description provided."}
            </p>
          </div>

          {/* Funding Progress */}
          <div className="mb-5 mt-auto">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-500 font-medium">Raised</span>
              <span className="font-bold text-slate-800">
                ₦{(venture.amount_raised || 0).toLocaleString()} / ₦{(venture.funding_goal || 0).toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10b981] rounded-full"
                style={{
                  width: `${Math.min(
                    ((venture.amount_raised || 0) / (venture.funding_goal || 1)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className="bg-[#f8fafc] rounded-xl p-3 text-center border border-slate-100 flex flex-col items-center">
              <TrendingUp className="w-4 h-4 text-[#10b981] mb-1" />
              <span className="font-bold text-[13px] text-slate-800">
                {venture.interest_rate}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Return</span>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3 text-center border border-slate-100 flex flex-col items-center">
              <Clock className="w-4 h-4 text-[#3b82f6] mb-1" />
              <span className="font-bold text-[13px] text-slate-800">
                {venture.duration_days}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Days</span>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3 text-center border border-slate-100 flex flex-col items-center">
              <Target className="w-4 h-4 text-[#2563eb] mb-1" />
              <span className="font-bold text-[13px] text-slate-800">
                {Math.round(
                  Math.min(((venture.amount_raised || 0) / (venture.funding_goal || 1)) * 100, 100)
                )}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Funded</span>
            </div>
          </div>

          <Link to={`/businesses/${venture.id}`} className="block">
            <button className="w-full py-2.5 bg-[#0066FF] text-white font-semibold text-[13px] rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessCard;
