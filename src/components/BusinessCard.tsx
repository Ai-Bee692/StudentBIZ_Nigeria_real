import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  fundingGoal: number;
  amountRaised: number;
  interestRate: number;
  duration: number;
  riskLevel: "low" | "medium" | "high";
  image?: string;
  studentName: string;
  university: string;
}

interface BusinessCardProps {
  business: Business;
  delay?: number;
}

const BusinessCard = ({ business, delay = 0 }: BusinessCardProps) => {
  const fundingProgress = (business.amountRaised / business.fundingGoal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card variant="interactive" className="h-full overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-display font-bold text-primary-foreground/30">
              {business.name.charAt(0)}
            </div>
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="bg-card/90 text-foreground">
              {business.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <RiskBadge level={business.riskLevel} />
          </div>
        </div>

        <CardContent className="p-5">
          <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {business.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {business.description}
          </p>

          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-semibold text-foreground">
                ${business.amountRaised.toLocaleString()} / ${business.fundingGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={fundingProgress} variant="success" size="sm" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-success" />
              <div className="font-semibold text-sm text-foreground">{business.interestRate}%</div>
              <div className="text-xs text-muted-foreground">Return</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <Clock className="w-4 h-4 mx-auto mb-1 text-info" />
              <div className="font-semibold text-sm text-foreground">{business.duration}</div>
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
          <Link to={`/businesses/${business.id}`} className="w-full">
            <Button variant="default" className="w-full">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BusinessCard;
