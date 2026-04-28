import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessCard, { Venture } from "@/components/BusinessCard";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = ["All", "Agriculture", "Technology", "Fashion", "Food & Beverage", "Retail", "Services", "EdTech", "Health & Wellness", "Other"];
const riskLevels = ["All", "Low", "Medium", "High"];

const Businesses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const { data, error } = await supabase
          .from('ventures')
          .select('*')
          .in('status', ['submitted', 'listed']); // Fetching both for demo purposes, ideally just 'listed'
        
        if (error) throw error;
        setVentures((data || []) as Venture[]);
      } catch (error) {
        console.error("Error fetching ventures:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVentures();
  }, []);

  const filteredBusinesses = ventures.filter((venture) => {
    const matchesSearch = venture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venture.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || venture.category === selectedCategory;
    const matchesRisk = selectedRisk === "All" || 
                       venture.risk_level.toLowerCase() === selectedRisk.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    const aRaised = a.amount_raised || 0;
    const bRaised = b.amount_raised || 0;
    
    switch (sortBy) {
      case "funded":
        return (bRaised / b.funding_goal) - (aRaised / a.funding_goal);
      case "return":
        return b.interest_rate - a.interest_rate;
      case "goal":
        return a.funding_goal - b.funding_goal;
      default:
        // Newest (assuming larger ID or sorting by a date field if existed)
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#1a7a4a]" />
              <p className="font-semibold text-lg">Loading ventures...</p>
            </div>
          ) : sortedBusinesses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBusinesses.map((business, index) => (
                <BusinessCard key={business.id} venture={business} delay={index * 0.05} />
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
