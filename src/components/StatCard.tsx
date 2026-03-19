import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, value, label, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="text-center p-6 rounded-2xl bg-card shadow-card hover:shadow-lg transition-all"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-hero flex items-center justify-center shadow-md">
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>
      <div className="font-display font-bold text-3xl md:text-4xl text-foreground mb-1">
        {value}
      </div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </motion.div>
  );
};

export default StatCard;
