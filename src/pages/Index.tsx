import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Shield, 
  Wallet, 
  CheckCircle,
  DollarSign,
  PieChart,
  Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatCard from "@/components/StatCard";
import TestimonialCard from "@/components/TestimonialCard";
import BusinessCard, { Business } from "@/components/BusinessCard";
import heroImage from "@/assets/hero-image.jpg";

// Sample businesses data
const featuredBusinesses: Business[] = [
  {
    id: "1",
    name: "EcoSnacks Campus",
    description: "Sustainable snack vending machines on university campuses, offering healthy and eco-friendly options.",
    category: "Food & Beverage",
    fundingGoal: 5000,
    amountRaised: 3750,
    interestRate: 12,
    duration: 60,
    riskLevel: "low",
    studentName: "Maya Chen",
    university: "Stanford University"
  },
  {
    id: "2",
    name: "TutorMatch Pro",
    description: "AI-powered platform connecting students with peer tutors based on learning style and subject expertise.",
    category: "EdTech",
    fundingGoal: 8000,
    amountRaised: 4200,
    interestRate: 15,
    duration: 90,
    riskLevel: "medium",
    studentName: "James Rodriguez",
    university: "MIT"
  },
  {
    id: "3",
    name: "Campus Thrift",
    description: "Mobile app for buying and selling second-hand textbooks and dorm essentials within university communities.",
    category: "Marketplace",
    fundingGoal: 3000,
    amountRaised: 2800,
    interestRate: 10,
    duration: 45,
    riskLevel: "low",
    studentName: "Sarah Kim",
    university: "UC Berkeley"
  }
];

const testimonials = [
  {
    quote: "StudentBIZ helped me turn my dorm room idea into a real business. The funding process was simple and the investor community has been incredibly supportive.",
    name: "Alex Thompson",
    role: "Student Founder, CampusEats"
  },
  {
    quote: "I love that my investments support student entrepreneurs while earning competitive returns. It's a win-win that creates real impact.",
    name: "Dr. Patricia Moore",
    role: "Impact Investor"
  },
  {
    quote: "The platform's transparency and risk assessment made me confident to invest. I've already seen returns on three student ventures.",
    name: "Michael Chang",
    role: "Angel Investor"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                🚀 Peer-to-Peer Lending for the Next Generation
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Empowering Student Entrepreneurs.{" "}
              <span className="text-gradient">Rewarding Investors.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Connect with innovative student ventures, fund the next big idea, 
              and earn competitive returns while making a real impact on education and entrepreneurship.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/auth?type=student">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  <GraduationCap className="w-5 h-5" />
                  Apply for Funding
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth?type=investor">
                <Button variant="heroOutline" size="xl" className="gap-2 w-full sm:w-auto">
                  <Users className="w-5 h-5" />
                  Start Investing
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={DollarSign} value="$2.4M+" label="Total Funded" delay={0} />
            <StatCard icon={Users} value="1,200+" label="Active Investors" delay={0.1} />
            <StatCard icon={GraduationCap} value="350+" label="Student Ventures" delay={0.2} />
            <StatCard icon={PieChart} value="94%" label="Success Rate" delay={0.3} />
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How StudentBIZ Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple, transparent process that connects student entrepreneurs with impact-driven investors.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Students */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-card"
            >
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                For Students
              </h3>
              <ul className="space-y-4">
                {[
                  "Submit your business idea and funding requirements",
                  "Complete verification and risk assessment",
                  "Get approved and receive funding from investors",
                  "Grow your business and repay with interest"
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ul>
              <Link to="/how-it-works" className="inline-block mt-6">
                <Button variant="outline" className="gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* For Investors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-card"
            >
              <div className="w-14 h-14 rounded-xl gradient-success flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                For Investors
              </h3>
              <ul className="space-y-4">
                {[
                  "Create an account and complete KYC verification",
                  "Browse approved student businesses by category",
                  "Invest any amount and track your portfolio",
                  "Earn fixed returns (up to 15%) on maturity"
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ul>
              <Link to="/businesses" className="inline-block mt-6">
                <Button variant="success" className="gap-2">
                  Browse Businesses <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Student Ventures
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover verified student businesses seeking funding. Each venture is carefully assessed for viability and risk.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredBusinesses.map((business, index) => (
              <BusinessCard key={business.id} business={business} delay={index * 0.1} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/businesses">
              <Button variant="outline" size="lg" className="gap-2">
                View All Businesses <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose StudentBIZ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on trust, transparency, and innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified & Secure",
                description: "All student ventures undergo thorough verification. Your investments are protected with industry-standard security."
              },
              {
                icon: TrendingUp,
                title: "Competitive Returns",
                description: "Earn up to 15% fixed returns based on risk categories. Clear terms, predictable income."
              },
              {
                icon: Clock,
                title: "Flexible Terms",
                description: "Choose from various loan durations (45-90 days) and investment amounts that fit your strategy."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-card shadow-card hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-hero flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from students and investors who've experienced the StudentBIZ difference.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 gradient-hero" />
            <div className="relative z-10 px-8 py-16 md:py-20 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of students and investors building the future of entrepreneurship together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?type=student">
                  <Button
                    size="xl"
                    className="gap-2 w-full sm:w-auto rounded-full bg-white/15 text-white border border-white/30 backdrop-blur-sm hover:bg-white/25 hover:border-white/50 hover:scale-[1.03] transition-all duration-200 shadow-lg font-semibold"
                  >
                    <GraduationCap className="w-5 h-5" />
                    I'm a Student
                  </Button>
                </Link>
                <Link to="/auth?type=investor">
                  <Button
                    size="xl"
                    className="gap-2 w-full sm:w-auto rounded-full bg-white text-primary hover:bg-white/90 hover:scale-[1.03] transition-all duration-200 shadow-xl font-bold"
                  >
                    <Wallet className="w-5 h-5" />
                    I'm an Investor
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
