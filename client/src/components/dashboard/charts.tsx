import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartData } from "@shared/schema";
import type { DateRange } from "./date-picker";

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

const pieData = [
  { name: 'Organic', value: 45, color: '#3b82f6' },
  { name: 'Paid', value: 30, color: '#10b981' },
  { name: 'Social', value: 25, color: '#8b5cf6' },
];

interface ChartsProps {
  dateRange: DateRange;
}

export function Charts({ dateRange }: ChartsProps) {
  const formatDateParam = (date: Date) => date.toISOString().split('T')[0];

  const { data: lineChartData, isLoading: lineLoading } = useQuery<ChartData>({
    queryKey: ["/api/charts/line", formatDateParam(dateRange.from), formatDateParam(dateRange.to)],
    queryFn: () => 
      fetch(`/api/charts/line?from=${formatDateParam(dateRange.from)}&to=${formatDateParam(dateRange.to)}`)
        .then(res => res.json())
  });

  const { data: barChartData, isLoading: barLoading } = useQuery<ChartData>({
    queryKey: ["/api/charts/bar", formatDateParam(dateRange.from), formatDateParam(dateRange.to)],
    queryFn: () => 
      fetch(`/api/charts/bar?from=${formatDateParam(dateRange.from)}&to=${formatDateParam(dateRange.to)}`)
        .then(res => res.json())
  });

  // Transform data for Recharts
  const lineData = lineChartData?.data?.labels?.map((label: string, index: number) => ({
    name: label,
    revenue: lineChartData.data.datasets[0].data[index],
  })) || [];

  const barData = barChartData?.data?.labels?.map((label: string, index: number) => ({
    name: label,
    conversions: barChartData.data.datasets[0].data[index],
  })) || [];

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="grid-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <motion.div variants={chartVariants} initial="hidden" animate="visible">
          <Card className="glass-card hover-lift shadow-xl border-0 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <motion.div 
                  className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </motion.div>
                Revenue Trend
              </CardTitle>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-28 glass-card border-0 shadow-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </CardHeader>
            <CardContent className="pt-6">
              {lineLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <Skeleton className="h-64 w-full rounded-xl skeleton-pulse" />
                </motion.div>
              ) : (
                <motion.div 
                  className="h-80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--popover))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          color: "hsl(var(--popover-foreground))",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}
                        labelStyle={{ 
                          color: "hsl(var(--popover-foreground))",
                          fontWeight: "600",
                          marginBottom: "8px"
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart */}
        <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card className="glass-card hover-lift shadow-xl border-0 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <motion.div 
                  className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </motion.div>
                Channel Performance
              </CardTitle>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  View all
                </Button>
              </motion.div>
            </CardHeader>
          <CardContent>
            {barLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        color: "#1e293b",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        fontSize: "14px",
                        fontWeight: "500",
                        zIndex: 9999,
                        position: "relative"
                      }}
                      labelStyle={{ 
                        color: "#1e293b",
                        fontWeight: "600",
                        marginBottom: "4px"
                      }}
                      wrapperStyle={{
                        zIndex: 9999,
                        outline: "none"
                      }}
                      cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      formatter={(value) => [value, "Conversions"]}
                    />
                    <Bar 
                      dataKey="conversions" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Traffic Sources */}
      <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
        <Card className="glass-card hover-lift shadow-xl border-0 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <motion.div 
                className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </motion.div>
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                    labelStyle={{ 
                      color: "hsl(var(--popover-foreground))",
                      fontWeight: "600",
                      marginBottom: "4px"
                    }}
                    formatter={(value) => [`${value}%`, "Traffic"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="w-full lg:w-1/2 space-y-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{item.value}%</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">of total traffic</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
