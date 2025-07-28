import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Charts } from "@/components/dashboard/charts";
import { DataTable } from "@/components/dashboard/data-table";
import { DatePicker, type DateRange } from "@/components/dashboard/date-picker";

import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, TrendingUp, BarChart3 } from "lucide-react";
import type { Metrics, Campaign } from "@shared/schema";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date()
  });

  const formatDateParam = (date: Date) => date.toISOString().split('T')[0];

  const { data: metrics, isLoading: metricsLoading } = useQuery<Metrics>({
    queryKey: ["/api/metrics", formatDateParam(dateRange.from), formatDateParam(dateRange.to)],
    queryFn: () => 
      fetch(`/api/metrics?from=${formatDateParam(dateRange.from)}&to=${formatDateParam(dateRange.to)}`)
        .then(res => res.json())
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns", formatDateParam(dateRange.from), formatDateParam(dateRange.to)],
    queryFn: () => 
      fetch(`/api/campaigns?from=${formatDateParam(dateRange.from)}&to=${formatDateParam(dateRange.to)}`)
        .then(res => res.json())
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This would typically refetch data or use WebSocket for real-time updates
      console.log("Simulating real-time update...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <motion.div 
          className="flex-1 p-8 space-y-8 overflow-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Date Range Picker */}
          <motion.div 
            className="glass-card hover-lift rounded-2xl p-8 shadow-lg"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Date Range</h3>
              <DatePicker 
                dateRange={dateRange} 
                onDateChange={setDateRange}
              />
            </div>
          </motion.div>

          {/* Metric Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              {metricsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="neu-card rounded-2xl p-8 skeleton-pulse"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Skeleton className="h-10 w-10 rounded-xl mb-6" />
                    <Skeleton className="h-10 w-32 mb-3" />
                    <Skeleton className="h-5 w-20" />
                  </motion.div>
                ))
              ) : (
                [
                  {
                    title: "Total Revenue",
                    value: metrics ? `$${Number(metrics.revenue).toLocaleString()}` : "$0",
                    change: "+12.5%",
                    icon: DollarSign,
                    color: "green" as const,
                    progress: 75
                  },
                  {
                    title: "Active Users",
                    value: metrics ? metrics.users.toLocaleString() : "0",
                    change: "+8.2%",
                    icon: Users,
                    color: "blue" as const,
                    progress: 80
                  },
                  {
                    title: "Conversion Rate",
                    value: metrics ? `${metrics.conversions}%` : "0%",
                    change: "+15.3%",
                    icon: BarChart3,
                    color: "purple" as const,
                    progress: 33
                  },
                  {
                    title: "Growth Rate",
                    value: metrics ? `+${metrics.growth}%` : "+0%",
                    change: "+22.1%",
                    icon: TrendingUp,
                    color: "orange" as const,
                    progress: 85
                  }
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <MetricCard {...card} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants}>
            <Charts dateRange={dateRange} />
          </motion.div>

          {/* Data Table */}
          <motion.div variants={itemVariants}>
            <DataTable campaigns={campaigns || []} isLoading={campaignsLoading} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
