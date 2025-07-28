import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, BarChart3, DollarSign, Target } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { Campaign } from "@shared/schema";

const campaignMetrics = [
  { title: "Active Campaigns", value: "8", change: "+2 this week", icon: Play, color: "green" },
  { title: "Total Spend", value: "$9,100", change: "+$1,200", icon: DollarSign, color: "blue" },
  { title: "Total Conversions", value: "520", change: "+67", icon: Target, color: "purple" },
  { title: "Avg. ROI", value: "260%", change: "+12%", icon: BarChart3, color: "orange" },
];

export default function Campaigns() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    channel: "",
    spend: "",
    conversions: "",
    roi: "",
    status: "active"
  });

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });
      if (!response.ok) throw new Error("Failed to create campaign");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setShowCreateForm(false);
      setNewCampaign({
        name: "",
        channel: "",
        spend: "",
        conversions: "",
        roi: "",
        status: "active"
      });
    },
  });

  const handleCreateCampaign = () => {
    createCampaignMutation.mutate({
      ...newCampaign,
      spend: parseFloat(newCampaign.spend),
      conversions: parseInt(newCampaign.conversions),
      roi: parseFloat(newCampaign.roi),
    });
  };

  const colorClasses = {
    green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Campaign Management</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Create, monitor, and optimize your marketing campaigns</p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>

          {/* Campaign Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {campaignMetrics.map((metric) => {
              const Icon = metric.icon;
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

          {/* Create Campaign Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Create New Campaign
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowCreateForm(false)}
                    className="text-slate-400"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Campaign Name
                    </label>
                    <Input
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      placeholder="Enter campaign name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Channel
                    </label>
                    <Select 
                      value={newCampaign.channel} 
                      onValueChange={(value) => setNewCampaign({...newCampaign, channel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Google Ads">Google Ads</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Budget ($)
                    </label>
                    <Input
                      type="number"
                      value={newCampaign.spend}
                      onChange={(e) => setNewCampaign({...newCampaign, spend: e.target.value})}
                      placeholder="Enter budget"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Expected Conversions
                    </label>
                    <Input
                      type="number"
                      value={newCampaign.conversions}
                      onChange={(e) => setNewCampaign({...newCampaign, conversions: e.target.value})}
                      placeholder="Expected conversions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target ROI (%)
                    </label>
                    <Input
                      type="number"
                      value={newCampaign.roi}
                      onChange={(e) => setNewCampaign({...newCampaign, roi: e.target.value})}
                      placeholder="Target ROI"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Status
                    </label>
                    <Select 
                      value={newCampaign.status} 
                      onValueChange={(value) => setNewCampaign({...newCampaign, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateCampaign}
                    disabled={createCampaignMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaigns Table */}
          <DataTable campaigns={campaigns || []} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}