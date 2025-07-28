import type { Campaign, Metrics, ChartData } from "@shared/schema";

export const mockCampaigns: Campaign[] = [
  {
    id: "cp001",
    name: "Summer Sale 2024",
    channel: "Google Ads",
    spend: "2450.00",
    conversions: 147,
    roi: "285.00",
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "cp002",
    name: "Holiday Campaign",
    channel: "Facebook",
    spend: "1890.00",
    conversions: 92,
    roi: "312.00",
    status: "paused",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "cp003",
    name: "Brand Awareness",
    channel: "Instagram",
    spend: "3200.00",
    conversions: 203,
    roi: "245.00",
    status: "active",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "cp004",
    name: "Product Launch",
    channel: "LinkedIn",
    spend: "1560.00",
    conversions: 78,
    roi: "198.00",
    status: "completed",
    createdAt: new Date("2024-01-05"),
  },
];

export const mockMetrics: Metrics = {
  id: "m001",
  date: new Date(),
  revenue: "24567.00",
  users: 12456,
  conversions: "3.20",
  growth: "18.70",
};

export const mockChartData = {
  line: {
    id: "line001",
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [{
        label: "Revenue",
        data: [12000, 15000, 18000, 22000, 25000, 28000, 32000]
      }]
    },
    createdAt: new Date(),
  } as ChartData,
  
  bar: {
    id: "bar001",
    type: "bar",
    data: {
      labels: ["Google Ads", "Facebook", "Instagram", "LinkedIn", "Twitter"],
      datasets: [{
        label: "Conversions",
        data: [147, 92, 203, 78, 45]
      }]
    },
    createdAt: new Date(),
  } as ChartData,
  
  pie: {
    id: "pie001",
    type: "pie",
    data: {
      labels: ["Organic", "Paid", "Social"],
      datasets: [{
        data: [45, 30, 25]
      }]
    },
    createdAt: new Date(),
  } as ChartData,
};
