export interface DataItem {
  _id?: string;
  end_year: string;
  intensity: number;
  sector: string;
  topic: string;
  insight: string;
  url: string;
  region: string;
  start_year: string;
  impact: string;
  added: string;
  published: string;
  country: string;
  relevance: number;
  pestle: string;
  source: string;
  title: string;
  likelihood: number;
  swot?: string;
  city?: string;
}

export interface FilterOptions {
  endYears: string[];
  topics: string[];
  sectors: string[];
  regions: string[];
  pestles: string[];
  sources: string[];
  countries: string[];
  cities: string[];
}

export interface Filters {
  end_year: string;
  topic: string;
  sector: string;
  region: string;
  pestle: string;
  source: string;
  country: string;
  city: string;
}

export interface Statistics {
  avgIntensity: number;
  avgLikelihood: number;
  avgRelevance: number;
  maxIntensity: number;
  maxLikelihood: number;
  maxRelevance: number;
  totalRecords: number;
}

export interface AggregatedData {
  _id: string;
  avgIntensity?: number;
  avgLikelihood?: number;
  avgRelevance?: number;
  count: number;
}

export interface ChartData {
  label: string;
  value: number;
  count?: number;
  intensity?: number;
  likelihood?: number;
  relevance?: number;
}
