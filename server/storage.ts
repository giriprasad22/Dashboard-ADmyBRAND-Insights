import { type User, type InsertUser, type Campaign, type InsertCampaign, type Metrics, type InsertMetrics, type ChartData, type InsertChartData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Campaign methods
  getCampaigns(from?: string, to?: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: string): Promise<boolean>;
  
  // Metrics methods
  getLatestMetrics(from?: string, to?: string): Promise<Metrics | undefined>;
  createMetrics(metrics: InsertMetrics): Promise<Metrics>;
  
  // Chart data methods
  getChartData(type: string, from?: string, to?: string): Promise<ChartData | undefined>;
  createChartData(data: InsertChartData): Promise<ChartData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private campaigns: Map<string, Campaign>;
  private metrics: Map<string, Metrics>;
  private chartData: Map<string, ChartData>;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.metrics = new Map();
    this.chartData = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample campaigns
    const sampleCampaigns: Campaign[] = [
      {
        id: "cp001",
        name: "Summer Sale 2024",
        channel: "Google Ads",
        spend: "2450.00",
        conversions: 147,
        roi: "285.00",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "cp002",
        name: "Holiday Campaign",
        channel: "Facebook",
        spend: "1890.00",
        conversions: 92,
        roi: "312.00",
        status: "paused",
        createdAt: new Date(),
      },
      {
        id: "cp003",
        name: "Brand Awareness",
        channel: "Instagram",
        spend: "3200.00",
        conversions: 203,
        roi: "245.00",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "cp004",
        name: "Product Launch",
        channel: "LinkedIn",
        spend: "1560.00",
        conversions: 78,
        roi: "198.00",
        status: "completed",
        createdAt: new Date(),
      },
    ];

    sampleCampaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });

    // Sample metrics
    const sampleMetrics: Metrics = {
      id: "m001",
      date: new Date(),
      revenue: "24567.00",
      users: 12456,
      conversions: "3.20",
      growth: "18.70",
    };

    this.metrics.set(sampleMetrics.id, sampleMetrics);

    // Sample chart data
    const lineChartData: ChartData = {
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
    };

    const barChartData: ChartData = {
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
    };

    const pieChartData: ChartData = {
      id: "pie001",
      type: "pie",
      data: {
        labels: ["Organic", "Paid", "Social"],
        datasets: [{
          data: [45, 30, 25]
        }]
      },
      createdAt: new Date(),
    };

    this.chartData.set("line", lineChartData);
    this.chartData.set("bar", barChartData);
    this.chartData.set("pie", pieChartData);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCampaigns(from?: string, to?: string): Promise<Campaign[]> {
    const campaigns = Array.from(this.campaigns.values());
    
    // If no date range provided, return all campaigns
    if (!from || !to) {
      return campaigns;
    }
    
    // Simulate filtering by date range by modifying campaign values
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
    
    // Simulate different performance based on date range
    return campaigns.map(campaign => ({
      ...campaign,
      // Adjust metrics based on date range
      spend: (parseFloat(campaign.spend) * (daysDiff / 30)).toFixed(2),
      conversions: Math.floor(campaign.conversions * (daysDiff / 30)),
      roi: (parseFloat(campaign.roi) * (0.8 + (daysDiff / 30) * 0.4)).toFixed(2)
    }));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = { ...insertCampaign, id, createdAt: new Date() };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, updateData: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updateData };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  async getLatestMetrics(from?: string, to?: string): Promise<Metrics | undefined> {
    const metricsArray = Array.from(this.metrics.values());
    const baseMetrics = metricsArray[metricsArray.length - 1];
    
    if (!baseMetrics || !from || !to) {
      return baseMetrics;
    }
    
    // Simulate different metrics based on date range
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
    
    // Adjust metrics based on date range
    const multiplier = daysDiff / 30; // 30 days as baseline
    
    return {
      ...baseMetrics,
      date: new Date(),
      revenue: (parseFloat(baseMetrics.revenue) * multiplier).toFixed(2),
      users: Math.floor(baseMetrics.users * multiplier),
      conversions: (parseFloat(baseMetrics.conversions) * (0.5 + multiplier * 0.5)).toFixed(2),
      growth: (parseFloat(baseMetrics.growth) * (0.6 + multiplier * 0.8)).toFixed(2)
    };
  }

  async createMetrics(insertMetrics: InsertMetrics): Promise<Metrics> {
    const id = randomUUID();
    const metrics: Metrics = { ...insertMetrics, id };
    this.metrics.set(id, metrics);
    return metrics;
  }

  async getChartData(type: string, from?: string, to?: string): Promise<ChartData | undefined> {
    const baseChart = this.chartData.get(type);
    
    if (!baseChart || !from || !to) {
      return baseChart;
    }
    
    // Simulate different chart data based on date range
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
    
    // Generate dynamic data based on date range
    const multiplier = daysDiff / 30;
    
    if (type === "line") {
      const chartData = baseChart.data as any;
      return {
        ...baseChart,
        data: {
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: chartData.datasets[0].data.map((value: number) => 
              Math.floor(value * multiplier * (0.7 + Math.random() * 0.6))
            )
          }]
        }
      };
    }
    
    if (type === "bar") {
      const chartData = baseChart.data as any;
      return {
        ...baseChart,
        data: {
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: chartData.datasets[0].data.map((value: number) => 
              Math.floor(value * multiplier * (0.8 + Math.random() * 0.4))
            )
          }]
        }
      };
    }
    
    return baseChart;
  }

  async createChartData(insertChartData: InsertChartData): Promise<ChartData> {
    const id = randomUUID();
    const data: ChartData = { ...insertChartData, id, createdAt: new Date() };
    this.chartData.set(insertChartData.type, data);
    return data;
  }
}

export const storage = new MemStorage();
