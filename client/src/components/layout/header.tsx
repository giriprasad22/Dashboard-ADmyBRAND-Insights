import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { exportToPDF, exportToCSV } from "@/lib/export-utils";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "@shared/schema";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [dateRange, setDateRange] = useState("7d");

  const { data: campaigns } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const handleExport = () => {
    if (!campaigns) return;
    
    const exportData = campaigns.map(campaign => ({
      Campaign: campaign.name,
      Channel: campaign.channel,
      Spend: `$${campaign.spend}`,
      Conversions: campaign.conversions,
      ROI: `${campaign.roi}%`,
      Status: campaign.status,
    }));

    // Export to CSV by default, could add modal to choose format
    exportToCSV(exportData, 'campaigns-report.csv');
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <motion.header 
      className="glass-card border-b border-slate-200/50 dark:border-slate-700/50 px-8 py-6 backdrop-blur-md shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">Monitor your digital marketing performance</p>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Date Range Picker */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-44 glass-card border-0 shadow-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Animated Theme Toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="glass-card border-0 shadow-md hover-lift relative overflow-hidden group w-12 h-12"
            >
              <AnimatePresence mode="wait">
                {theme === "light" ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0, rotate: -180 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: -20, opacity: 0, rotate: -180 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="h-5 w-5 text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Enhanced Export Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleExport} 
              className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white border-0 px-6"
            >
              <motion.div
                className="flex items-center"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
