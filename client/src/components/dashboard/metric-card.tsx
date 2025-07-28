import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "green" | "blue" | "purple" | "orange";
  progress: number;
}

const colorClasses = {
  green: {
    icon: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/20",
    change: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
    progress: "bg-green-500",
  },
  blue: {
    icon: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    change: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
    progress: "bg-blue-500",
  },
  purple: {
    icon: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/20",
    change: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20",
    progress: "bg-purple-500",
  },
  orange: {
    icon: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/20",
    change: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20",
    progress: "bg-orange-500",
  },
};

export function MetricCard({ title, value, change, icon: Icon, color, progress }: MetricCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="glass-card hover-lift border-0 shadow-xl backdrop-blur-sm group">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              className={`p-4 rounded-2xl ${colors.iconBg} group-hover:scale-110 transition-transform duration-300`}
              whileHover={{ rotate: 5 }}
            >
              <Icon className={`h-6 w-6 ${colors.icon}`} />
            </motion.div>
            <motion.span 
              className={`text-sm font-semibold px-3 py-1.5 rounded-full ${colors.change} backdrop-blur-sm`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {change}
            </motion.span>
          </div>
          
          <motion.h3 
            className="text-3xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.h3>
          
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">{title}</p>
          
          <div className="relative">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${colors.progress} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
            <motion.span 
              className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {progress}% completion
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
