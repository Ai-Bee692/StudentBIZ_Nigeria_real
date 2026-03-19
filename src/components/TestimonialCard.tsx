import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  image?: string;
  delay?: number;
}

const TestimonialCard = ({ quote, name, role, image, delay = 0 }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card variant="elevated" className="h-full">
        <CardContent className="p-6">
          <Quote className="w-8 h-8 text-primary/30 mb-4" />
          <p className="text-foreground mb-6 leading-relaxed">"{quote}"</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
              {image ? (
                <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                name.charAt(0)
              )}
            </div>
            <div>
              <div className="font-semibold text-foreground">{name}</div>
              <div className="text-sm text-muted-foreground">{role}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
