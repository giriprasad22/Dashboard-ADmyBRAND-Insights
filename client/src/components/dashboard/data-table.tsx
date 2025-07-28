import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { exportToCSV } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Campaign } from "@shared/schema";

interface DataTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 10;

const statusStyles = {
  active: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
  paused: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
  completed: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
};

const channelIcons = {
  "Google Ads": "🔍",
  "Facebook": "📘",
  "Instagram": "📷",
  "LinkedIn": "💼",
  "Twitter": "🐦",
};

export function DataTable({ campaigns, isLoading }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Campaign>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: (campaignId: string) => apiRequest(`/api/campaigns/${campaignId}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update campaign status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      apiRequest(`/api/campaigns/${id}`, "PUT", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Status updated",
        description: "Campaign status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update campaign status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns.filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      const matchesChannel = channelFilter === "all" || campaign.channel === channelFilter;
      
      return matchesSearch && matchesStatus && matchesChannel;
    });

    // Sort campaigns
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return filtered;
  }, [campaigns, searchTerm, statusFilter, channelFilter, sortField, sortDirection]);

  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCampaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCampaigns, currentPage]);

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);

  const handleSort = (field: keyof Campaign) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    const exportData = filteredCampaigns.map(campaign => ({
      Campaign: campaign.name,
      Channel: campaign.channel,
      Spend: `$${campaign.spend}`,
      Conversions: campaign.conversions,
      ROI: `${campaign.roi}%`,
      Status: campaign.status,
    }));
    
    exportToCSV(exportData, "campaigns-table.csv");
  };

  const handleDelete = (campaign: Campaign) => {
    deleteMutation.mutate(campaign.id);
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditDialogOpen(true);
  };

  const handleView = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: campaignId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Recent Campaigns</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleExport} className="text-blue-600 dark:text-blue-400">
            Export Table
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="Google Ads">Google Ads</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th 
                  className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Campaign {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("channel")}
                >
                  Channel {sortField === "channel" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("spend")}
                >
                  Spend {sortField === "spend" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("conversions")}
                >
                  Conversions {sortField === "conversions" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort("roi")}
                >
                  ROI {sortField === "roi" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900 dark:text-white">{campaign.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">ID: {campaign.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{channelIcons[campaign.channel as keyof typeof channelIcons] || "📊"}</span>
                      <span className="text-slate-700 dark:text-slate-300">{campaign.channel}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-900 dark:text-white font-medium">${Number(campaign.spend).toLocaleString()}</td>
                  <td className="p-4 text-slate-900 dark:text-white">{campaign.conversions}</td>
                  <td className="p-4">
                    <span className="text-green-600 dark:text-green-400 font-medium">{campaign.roi}%</span>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant="secondary" 
                      className={statusStyles[campaign.status as keyof typeof statusStyles]}
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleView(campaign)}
                        title="View campaign details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => handleEdit(campaign)}
                        title="Edit campaign"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-auto text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(campaign)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCampaigns.length)} of {filteredCampaigns.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={currentPage === pageNumber ? "bg-blue-600 text-white" : ""}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* View Campaign Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
            <DialogDescription>
              View comprehensive information about the selected campaign including performance metrics and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Campaign Name</label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedCampaign.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</label>
                  <Badge className={statusStyles[selectedCampaign.status as keyof typeof statusStyles]}>
                    {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Channel</label>
                  <p className="text-slate-900 dark:text-white">{selectedCampaign.channel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Spend</label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">${Number(selectedCampaign.spend).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversions</label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedCampaign.conversions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">ROI</label>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">{selectedCampaign.roi}%</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Campaign ID</label>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{selectedCampaign.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Campaign Status</DialogTitle>
            <DialogDescription>
              Change the status of the selected campaign. This will affect its active state and performance tracking.
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Campaign Name</label>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedCampaign.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Status</label>
                <Select 
                  value={selectedCampaign.status} 
                  onValueChange={(value) => handleStatusChange(selectedCampaign.id, value)}
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
