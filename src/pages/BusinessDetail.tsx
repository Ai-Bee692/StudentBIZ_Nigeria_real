import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Target,
  User,
  GraduationCap,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

import { supabase } from "@/lib/supabase";
import { Loader2, Download, ExternalLink } from "lucide-react";
import { Venture } from "@/components/BusinessCard";

const BusinessDetail = () => {
  const { id } = useParams();
  const [investAmount, setInvestAmount] = useState("");
  const { toast } = useToast();
  const [business, setBusiness] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("ventures")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setBusiness(data);
      } catch (err) {
        console.error("Error fetching venture:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navbar />
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-semibold text-lg text-muted-foreground">Loading pitch deck...</p>
        <Footer />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Navbar />
        <h2 className="text-2xl font-bold text-foreground">Venture not found</h2>
        <Link to="/businesses" className="mt-4 text-primary hover:underline">Return to marketplace</Link>
        <Footer />
      </div>
    );
  }

  const amountRaised = business.amount_raised || 0;
  const fundingProgress = (amountRaised / business.funding_goal) * 100;
  const remainingAmount = business.funding_goal - amountRaised;

  const handleInvest = () => {
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid investment amount.",
        variant: "destructive"
      });
      return;
    }

    if (amount > remainingAmount) {
      toast({
        title: "Amount exceeds remaining goal",
        description: `Maximum investment is ₦${remainingAmount.toLocaleString()}`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Investment simulated!",
      description: `You've expressed interest to invest ₦${amount.toLocaleString()} in ${business.name}. Payment gateway integration coming in Phase 4.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-24 lg:pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link 
            to="/businesses" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Businesses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{business.category}</Badge>
                  <RiskBadge level={business.risk_level} />
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {business.name}
                </h1>
                <p className="text-xl font-medium text-foreground mb-2">
                  {business.tagline}
                </p>
                <p className="text-lg text-muted-foreground">{business.description}</p>
              </motion.div>

              {/* Founder Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl overflow-hidden">
                        {business.student_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{business.student_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="w-4 h-4" />
                          {business.university}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pitch Deck Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Interactive Pitch Deck
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {business.problem_statement && (
                    <div>
                      <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" /> The Problem
                      </h3>
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line bg-muted/30 p-4 rounded-xl">
                        {business.problem_statement}
                      </div>
                    </div>
                  )}
                  {business.solution && (
                    <div>
                      <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-success" /> The Solution
                      </h3>
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line bg-muted/30 p-4 rounded-xl">
                        {business.solution}
                      </div>
                    </div>
                  )}
                  {business.business_website && (
                    <div className="flex items-center gap-2 mt-4">
                      <a href={business.business_website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline font-semibold">
                        <ExternalLink className="w-4 h-4" /> View Business Website
                      </a>
                    </div>
                  )}
                  {business.pitch_deck_url && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <a href={business.pitch_deck_url} target="_blank" rel="noreferrer">
                        <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 border-primary text-primary hover:bg-primary/5">
                          <Download className="w-4 h-4" /> Download Full Pitch Deck (PDF)
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Financial Context */}
              {(business.monthly_revenue || business.profit_margin) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Financial Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {business.monthly_revenue && (
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <div className="text-sm text-muted-foreground mb-1">Avg. Monthly Revenue</div>
                          <div className="text-2xl font-bold text-foreground">₦{business.monthly_revenue.toLocaleString()}</div>
                        </div>
                      )}
                      {business.profit_margin && (
                        <div className="bg-muted/50 p-4 rounded-xl">
                          <div className="text-sm text-muted-foreground mb-1">Est. Profit Margin</div>
                          <div className="text-2xl font-bold text-success">{business.profit_margin}%</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Repayment Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Repayment Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Installments over {business.duration_days} days with a {business.interest_rate}% total return to investors.
                  </p>
                </CardContent>
              </Card>


            </div>

            {/* Sidebar - Investment Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                <Card variant="elevated" className="overflow-hidden">
                  <div className="gradient-hero p-6 text-primary-foreground">
                    <div className="text-3xl font-bold mb-1">
                      ₦{amountRaised.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-80">
                      raised of ₦{business.funding_goal.toLocaleString()} goal
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <Progress value={fundingProgress} variant="success" size="lg" />
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
                        <div className="font-bold text-lg text-foreground">{business.interest_rate}%</div>
                        <div className="text-xs text-muted-foreground">Return</div>
                      </div>
                      <div>
                        <Clock className="w-5 h-5 mx-auto mb-1 text-info" />
                        <div className="font-bold text-lg text-foreground">{business.duration_days}</div>
                        <div className="text-xs text-muted-foreground">Days</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="amount">Investment Amount (₦)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="50000"
                          className="pl-7"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum investment: ₦5,000 • ₦{remainingAmount.toLocaleString()} remaining
                      </p>
                    </div>

                    {investAmount && parseFloat(investAmount) > 0 && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Your investment</span>
                          <span className="text-foreground">₦{parseFloat(investAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expected return ({business.interest_rate}%)</span>
                          <span className="text-success">
                            +₦{(parseFloat(investAmount) * business.interest_rate / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-semibold">
                          <span className="text-foreground">Total at maturity</span>
                          <span className="text-foreground">
                            ₦{(parseFloat(investAmount) * (1 + business.interest_rate / 100)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button 
                      variant="hero" 
                      className="w-full" 
                      size="lg"
                      onClick={handleInvest}
                    >
                      Invest Now
                    </Button>

                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Your investment is protected by our verification process. 
                        All funds are held in escrow until the funding goal is reached.
                      </span>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg text-xs">
                      <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                      <span className="text-warning">
                        Investing involves risk. You may lose some or all of your investment. 
                        Please read our risk disclaimer before investing.
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessDetail;
