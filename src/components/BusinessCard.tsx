import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, TrendingUp } from "lucide-react";
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
      <Card variant="interactive" className="h-full overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {venture.image ? (
            <img src={venture.image} alt={venture.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 gradient-hero opacity-80" />
          )}
          {!venture.image && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-display font-bold text-primary-foreground/30">
                {venture.name.charAt(0)}
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="bg-card/90 text-foreground">
              {venture.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <RiskBadge level={venture.risk_level} />
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {venture.name}
            </h3>
            <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-2 py-1 rounded-md whitespace-nowrap">
              {venture.university}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {venture.tagline || venture.description}
          </p>

          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-semibold text-foreground">
                ₦{amountRaised.toLocaleString()} / ₦{venture.funding_goal.toLocaleString()}
              </span>
            </div>
            <Progress value={fundingProgress} variant="success" size="sm" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-success" />
              <div className="font-semibold text-sm text-foreground">{venture.interest_rate}%</div>
              <div className="text-xs text-muted-foreground">Return</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <Clock className="w-4 h-4 mx-auto mb-1 text-info" />
              <div className="font-semibold text-sm text-foreground">{venture.duration_days}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <Target className="w-4 h-4 mx-auto mb-1 text-primary" />
              <div className="font-semibold text-sm text-foreground">{fundingProgress.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Funded</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Link to={`/businesses/${venture.id}`} className="w-full">
            <Button variant="default" className="w-full">
              View Pitch Deck
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BusinessCard;
