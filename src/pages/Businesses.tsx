import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard, { Business } from "@/components/BusinessCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allBusinesses: Business[] = [
  {
    id: "1",
    name: "EcoSnacks Campus",
    description: "Sustainable snack vending machines on university campuses, offering healthy and eco-friendly options to students.",
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
  },
  {
    id: "4",
    name: "StudyBuddy VR",
    description: "Virtual reality study rooms for remote collaboration, making distance learning more engaging and interactive.",
    category: "EdTech",
    fundingGoal: 12000,
    amountRaised: 5400,
    interestRate: 15,
    duration: 90,
    riskLevel: "high",
    studentName: "Alex Thompson",
    university: "Georgia Tech"
  },
  {
    id: "5",
    name: "GreenPrint Labs",
    description: "Affordable 3D printing service for engineering students with sustainable, recycled materials.",
    category: "Technology",
    fundingGoal: 6000,
    amountRaised: 4800,
    interestRate: 12,
    duration: 60,
    riskLevel: "low",
    studentName: "David Park",
    university: "Carnegie Mellon"
  },
  {
    id: "6",
    name: "Campus Fitness App",
    description: "Gamified fitness app designed for students, with campus-specific challenges and social features.",
    category: "Health & Wellness",
    fundingGoal: 7500,
    amountRaised: 2250,
    interestRate: 12,
    duration: 60,
    riskLevel: "medium",
    studentName: "Emma Wilson",
    university: "UCLA"
  },
  {
    id: "7",
    name: "QuickLaundry",
    description: "On-demand laundry pickup and delivery service specifically for busy college students.",
    category: "Services",
    fundingGoal: 4000,
    amountRaised: 3600,
    interestRate: 10,
    duration: 45,
    riskLevel: "low",
    studentName: "Michael Lee",
    university: "NYU"
  },
  {
    id: "8",
    name: "CampusEats Delivery",
    description: "Student-run food delivery from local restaurants to dormitories and campus buildings.",
    category: "Food & Beverage",
    fundingGoal: 5500,
    amountRaised: 1650,
    interestRate: 15,
    duration: 90,
    riskLevel: "high",
    studentName: "Jessica Brown",
    university: "University of Michigan"
  },
  {
    id: "9",
    name: "NoteShare Pro",
    description: "Premium note-sharing platform with AI-powered summaries and study guides for university courses.",
    category: "EdTech",
    fundingGoal: 9000,
    amountRaised: 7200,
    interestRate: 12,
    duration: 60,
    riskLevel: "medium",
    studentName: "Ryan Martinez",
    university: "UT Austin"
  }
];

const categories = ["All", "EdTech", "Food & Beverage", "Marketplace", "Technology", "Health & Wellness", "Services"];
const riskLevels = ["All", "Low", "Medium", "High"];

const Businesses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredBusinesses = allBusinesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || business.category === selectedCategory;
    const matchesRisk = selectedRisk === "All" || 
                       business.riskLevel.toLowerCase() === selectedRisk.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case "funded":
        return (b.amountRaised / b.fundingGoal) - (a.amountRaised / a.fundingGoal);
      case "return":
        return b.interestRate - a.interestRate;
      case "goal":
        return a.fundingGoal - b.fundingGoal;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse Student <span className="text-gradient">Ventures</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover verified student businesses seeking funding. Filter by category, 
              risk level, and returns to find opportunities that match your investment goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl p-4 md:p-6 shadow-card">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search businesses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Risk Filter */}
              <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                <SelectTrigger className="w-full lg:w-[150px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  {riskLevels.map((risk) => (
                    <SelectItem key={risk} value={risk}>{risk} Risk</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-[160px]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="funded">Most Funded</SelectItem>
                  <SelectItem value="return">Highest Return</SelectItem>
                  <SelectItem value="goal">Lowest Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "All" || selectedRisk !== "All" || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">×</button>
                  </Badge>
                )}
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} className="ml-1 hover:text-destructive">×</button>
                  </Badge>
                )}
                {selectedRisk !== "All" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedRisk} Risk
                    <button onClick={() => setSelectedRisk("All")} className="ml-1 hover:text-destructive">×</button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedRisk("All");
                  }}
                  className="text-muted-foreground"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{sortedBusinesses.length}</span> ventures
            </p>
          </div>

          {sortedBusinesses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBusinesses.map((business, index) => (
                <BusinessCard key={business.id} business={business} delay={index * 0.05} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No businesses found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedRisk("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Businesses;
