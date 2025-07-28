import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Settings } from "lucide-react";

const quickActions = [
  {
    title: "New Campaign",
    description: "Create a new marketing campaign",
    icon: Plus,
    color: "blue",
  },
  {
    title: "Generate Report",
    description: "Export detailed analytics report",
    icon: FileText,
    color: "green",
  },
  {
    title: "Automate Tasks",
    description: "Set up automated workflows",
    icon: Settings,
    color: "purple",
  },
];

const colorClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
};

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="flex items-center space-x-3 p-4 h-auto justify-start hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClasses[action.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-900 dark:text-white">{action.title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
