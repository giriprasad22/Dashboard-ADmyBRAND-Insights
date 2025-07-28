import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Users, Target, MapPin, Clock } from "lucide-react";

const audienceData = {
  demographics: [
    { name: '18-24', value: 18, color: '#3b82f6' },
    { name: '25-34', value: 35, color: '#10b981' },
    { name: '35-44', value: 28, color: '#8b5cf6' },
    { name: '45-54', value: 15, color: '#f59e0b' },
    { name: '55+', value: 4, color: '#ef4444' },
  ],
  interests: [
    { category: 'Technology', percentage: 85 },
    { category: 'Business', percentage: 72 },
    { category: 'Marketing', percentage: 68 },
    { category: 'E-commerce', percentage: 55 },
    { category: 'Finance', percentage: 43 },
  ],
  locations: [
    { city: 'New York', users: 2450, percentage: 24.5 },
    { city: 'Los Angeles', users: 1890, percentage: 18.9 },
    { city: 'Chicago', users: 1340, percentage: 13.4 },
    { city: 'Houston', users: 980, percentage: 9.8 },
    { city: 'Phoenix', users: 760, percentage: 7.6 },
  ],
  engagement: [
    { time: '00:00', sessions: 120 },
    { time: '04:00', sessions: 80 },
    { time: '08:00', sessions: 340 },
    { time: '12:00', sessions: 520 },
    { time: '16:00', sessions: 680 },
    { time: '20:00', sessions: 450 },
  ],
};

const audienceMetrics = [
  { title: "Total Audience", value: "12,456", change: "+8.2%", icon: Users, color: "blue" },
  { title: "Active Users", value: "8,234", change: "+12.5%", icon: Target, color: "green" },
  { title: "Top Location", value: "New York", change: "24.5%", icon: MapPin, color: "purple" },
  { title: "Peak Hour", value: "4-6 PM", change: "680 users", icon: Clock, color: "orange" },
];

export default function Audience() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audience Insights</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Understand your audience demographics and behavior</p>
            </div>
          </div>

          {/* Audience Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceMetrics.map((metric) => {
              const Icon = metric.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
              };

              return (
                <Card key={metric.title} className="metric-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Badge variant="secondary" className="text-green-600 dark:text-green-400">
                        {metric.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{metric.value}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{metric.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceData.demographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {audienceData.demographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value) => [`${value}%`, "Percentage"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {audienceData.demographics.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement by Time */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={audienceData.engagement}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value) => [value, "Sessions"]}
                      />
                      <Bar 
                        dataKey="sessions" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Top Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audienceData.interests.map((interest) => (
                  <div key={interest.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{interest.category}</span>
                      <span className="text-slate-900 dark:text-white font-medium">{interest.percentage}%</span>
                    </div>
                    <Progress value={interest.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceData.locations.map((location, index) => (
                    <div key={location.city} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{location.city}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{location.users.toLocaleString()} users</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{location.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}