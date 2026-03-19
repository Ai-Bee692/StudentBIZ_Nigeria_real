import { useState } from "react";
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

// Sample business data (in real app, would fetch by ID)
const businessData = {
  id: "1",
  name: "EcoSnacks Campus",
  description: "Sustainable snack vending machines on university campuses, offering healthy and eco-friendly options to students. Our mission is to provide convenient, nutritious snacks while reducing plastic waste through biodegradable packaging.",
  longDescription: `EcoSnacks Campus was born from a simple observation: students want healthy snacks, but campus vending machines are filled with processed junk food. We're changing that.

Our vending machines are strategically placed in high-traffic areas like libraries, dorms, and student centers. Each machine offers a curated selection of organic, locally-sourced snacks in fully compostable packaging.

What sets us apart:
• Partnership with local organic farms
• 100% biodegradable packaging
• Smart inventory management to reduce waste
• Student discount program
• Carbon-neutral delivery operations`,
  category: "Food & Beverage",
  fundingGoal: 5000,
  amountRaised: 3750,
  interestRate: 12,
  duration: 60,
  riskLevel: "low" as const,
  studentName: "Maya Chen",
  university: "Stanford University",
  investorCount: 24,
  daysLeft: 12,
  useOfFunds: [
    { item: "Vending Machine Equipment", percentage: 40 },
    { item: "Initial Inventory", percentage: 30 },
    { item: "Marketing & Launch", percentage: 20 },
    { item: "Operational Reserve", percentage: 10 }
  ],
  repaymentPlan: "Monthly installments over 60 days with 12% total return to investors.",
  milestones: [
    { title: "Phase 1: Equipment Purchase", status: "completed" },
    { title: "Phase 2: Location Agreements", status: "completed" },
    { title: "Phase 3: First Machine Installation", status: "in-progress" },
    { title: "Phase 4: Campus-Wide Rollout", status: "pending" }
  ]
};

const BusinessDetail = () => {
  const { id } = useParams();
  const [investAmount, setInvestAmount] = useState("");
  const { toast } = useToast();
  
  const business = businessData; // In real app, fetch by id
  const fundingProgress = (business.amountRaised / business.fundingGoal) * 100;
  const remainingAmount = business.fundingGoal - business.amountRaised;

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
        description: `Maximum investment is $${remainingAmount.toLocaleString()}`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Investment submitted!",
      description: `You've invested $${amount} in ${business.name}. Complete verification to finalize.`,
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
                  <RiskBadge level={business.riskLevel} />
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {business.name}
                </h1>
                <p className="text-lg text-muted-foreground">{business.description}</p>
              </motion.div>

              {/* Founder Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {business.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{business.studentName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        {business.university}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    About This Venture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {business.longDescription}
                  </div>
                </CardContent>
              </Card>

              {/* Use of Funds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Use of Funds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.useOfFunds.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground">{item.item}</span>
                        <span className="text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} variant="default" size="sm" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Project Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {business.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {milestone.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                        ) : milestone.status === "in-progress" ? (
                          <div className="w-5 h-5 rounded-full border-2 border-primary animate-pulse mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted mt-0.5" />
                        )}
                        <div>
                          <span className={`font-medium ${
                            milestone.status === "completed" ? "text-foreground" :
                            milestone.status === "in-progress" ? "text-primary" :
                            "text-muted-foreground"
                          }`}>
                            {milestone.title}
                          </span>
                          {milestone.status === "in-progress" && (
                            <Badge variant="info" className="ml-2 text-xs">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Repayment Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Repayment Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{business.repaymentPlan}</p>
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
                      ${business.amountRaised.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-80">
                      raised of ${business.fundingGoal.toLocaleString()} goal
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <Progress value={fundingProgress} variant="success" size="lg" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
                        <div className="font-bold text-lg text-foreground">{business.interestRate}%</div>
                        <div className="text-xs text-muted-foreground">Return</div>
                      </div>
                      <div>
                        <Clock className="w-5 h-5 mx-auto mb-1 text-info" />
                        <div className="font-bold text-lg text-foreground">{business.duration}</div>
                        <div className="text-xs text-muted-foreground">Days</div>
                      </div>
                      <div>
                        <User className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <div className="font-bold text-lg text-foreground">{business.investorCount}</div>
                        <div className="text-xs text-muted-foreground">Investors</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="amount">Investment Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="100"
                          className="pl-7"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum investment: $25 • ${remainingAmount.toLocaleString()} remaining
                      </p>
                    </div>

                    {investAmount && parseFloat(investAmount) > 0 && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Your investment</span>
                          <span className="text-foreground">${parseFloat(investAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expected return ({business.interestRate}%)</span>
                          <span className="text-success">
                            +${(parseFloat(investAmount) * business.interestRate / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-semibold">
                          <span className="text-foreground">Total at maturity</span>
                          <span className="text-foreground">
                            ${(parseFloat(investAmount) * (1 + business.interestRate / 100)).toFixed(2)}
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
