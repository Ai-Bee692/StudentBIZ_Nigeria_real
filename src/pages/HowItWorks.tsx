import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  GraduationCap, 
  Users, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp,
  Search,
  PieChart,
  Calendar,
  Shield,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  const studentSteps = [
    {
      icon: FileText,
      title: "Submit Your Idea",
      description: "Create a detailed business profile with your funding requirements, timeline, and business plan."
    },
    {
      icon: CheckCircle2,
      title: "Verification & Assessment",
      description: "Our team reviews your submission, verifies your student status, and assesses risk level."
    },
    {
      icon: DollarSign,
      title: "Receive Funding",
      description: "Once approved, investors can fund your venture. Receive funds when your goal is reached."
    },
    {
      icon: TrendingUp,
      title: "Grow & Repay",
      description: "Build your business and repay investors according to the agreed schedule with interest."
    }
  ];

  const investorSteps = [
    {
      icon: Users,
      title: "Create Account",
      description: "Sign up and complete identity verification (KYC) to ensure platform security."
    },
    {
      icon: Search,
      title: "Browse Ventures",
      description: "Explore approved student businesses filtered by category, risk level, and return rate."
    },
    {
      icon: PieChart,
      title: "Invest & Track",
      description: "Invest any amount and monitor your portfolio with real-time updates and analytics."
    },
    {
      icon: Calendar,
      title: "Earn Returns",
      description: "Receive your principal plus fixed returns (up to 15%) when loans mature."
    }
  ];

  const riskLevels = [
    {
      level: "Low Risk",
      color: "bg-success/10 text-success border-success/20",
      rate: "10%",
      description: "Established businesses with proven revenue and low default probability."
    },
    {
      level: "Medium Risk",
      color: "bg-warning/10 text-warning border-warning/20",
      rate: "12%",
      description: "Growing ventures with promising traction and moderate uncertainty."
    },
    {
      level: "High Risk",
      color: "bg-destructive/10 text-destructive border-destructive/20",
      rate: "15%",
      description: "Early-stage ideas with high potential but greater uncertainty."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              How <span className="text-gradient">StudentBIZ</span> Works
            </h1>
            <p className="text-lg text-muted-foreground">
              A transparent, secure process designed to connect student entrepreneurs 
              with impact-driven investors. Here's everything you need to know.
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Students */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                For Student Entrepreneurs
              </h2>
              <p className="text-muted-foreground">Get funding for your venture in 4 simple steps</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card rounded-2xl p-6 shadow-card h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < studentSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/auth?type=student">
              <Button variant="hero" size="lg" className="gap-2">
                Apply for Funding <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Investors */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-14 h-14 rounded-xl gradient-success flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                For Investors
              </h2>
              <p className="text-muted-foreground">Start earning returns in 4 easy steps</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card rounded-2xl p-6 shadow-card h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full gradient-success flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <step.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < investorSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/businesses">
              <Button variant="success" size="lg" className="gap-2">
                Start Investing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Returns & Risk */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Returns & Risk Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every student venture is assessed and categorized by risk level. 
              Higher risk means higher potential returns.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {riskLevels.map((risk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card text-center"
              >
                <div className={`inline-block px-4 py-2 rounded-full border text-sm font-semibold mb-4 ${risk.color}`}>
                  {risk.level}
                </div>
                <div className="font-display text-4xl font-bold text-foreground mb-2">
                  {risk.rate}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Return Rate (60 days)</div>
                <p className="text-sm text-muted-foreground">{risk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Loan Duration Options
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose investment durations that match your financial goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { days: 45, label: "Short Term", icon: Clock },
              { days: 60, label: "Standard", icon: Calendar, featured: true },
              { days: 90, label: "Extended", icon: Shield }
            ].map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-card rounded-2xl p-6 shadow-card text-center ${
                  option.featured ? "ring-2 ring-primary" : ""
                }`}
              >
                {option.featured && (
                  <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                )}
                <option.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <div className="font-display text-3xl font-bold text-foreground mb-1">
                  {option.days} Days
                </div>
                <div className="text-sm text-muted-foreground">{option.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 md:p-12 shadow-xl text-center"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Join StudentBIZ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you're a student with a vision or an investor seeking impact, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?type=student">
                <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                  <GraduationCap className="w-5 h-5" />
                  Apply as Student
                </Button>
              </Link>
              <Link to="/auth?type=investor">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Users className="w-5 h-5" />
                  Join as Investor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
