export interface Ad {
  _id: string;
  name: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  isPaid: boolean;
  createdAt: Date;
}

export interface AdStats {
  ad: Ad;
  stats: {
    views: number;
    clicks: number;
    ctr: string;
    daily: DailyStats[];
  };
}

export interface DailyStats {
  _id: string;
  views: number;
  clicks: number;
}

// Interface pour la réponse du endpoint /analytics/overview
export interface OverviewResponse {
  success: boolean;
  data: {
    overview: {
      totalUsers: number;
      totalAds: number;
      totalViews: number;
      totalClicks: number;
      globalCTR: string;
    };
    adPerformance: AdPerformance[];
  };
}

export interface AdPerformance {
  _id: string;
  adName: string;
  adTitle: string;
  views: number;
  clicks: number;
  ctr: string;
}