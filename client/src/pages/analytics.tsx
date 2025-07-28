import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Charts } from "@/components/dashboard/charts";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import type { Metrics } from "@shared/schema";

const conversionData = [
  { name: 'Mon', conversions: 24, clicks: 800 },
  { name: 'Tue', conversions: 31, clicks: 950 },
  { name: 'Wed', conversions: 28, clicks: 750 },
  { name: 'Thu', conversions: 45, clicks: 1200 },
  { name: 'Fri', conversions: 52, clicks: 1400 },
  { name: 'Sat', conversions: 38, clicks: 980 },
  { name: 'Sun', conversions: 29, clicks: 720 },
];

const performanceMetrics = [
  { title: "Click-Through Rate", value: "3.45%", change: "+0.12%", trend: "up", icon: Activity },
  { title: "Cost Per Click", value: "$2.34", change: "-$0.08", trend: "down", icon: Target },
  { title: "Return on Ad Spend", value: "4.2x", change: "+0.3x", trend: "up", icon: TrendingUp },
  { title: "Bounce Rate", value: "24.5%", change: "-2.1%", trend: "down", icon: TrendingDown },
];

export default function Analytics() {
  const { data: metrics } = useQuery<Metrics>({
    queryKey: ["/api/metrics"],
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Deep dive into your campaign performance</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title} className="metric-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${
                        metric.trend === "up" 
                          ? "bg-green-100 dark:bg-green-900/20" 
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          metric.trend === "up" 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        }`} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        metric.trend === "up" 
                          ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20"
                          : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20"
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{metric.value}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{metric.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Conversion Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      name="Conversions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                      name="Clicks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Additional Charts */}
          <Charts />
        </div>
      </main>
    </div>
  );
}