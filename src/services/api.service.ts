import axios, { AxiosError } from "axios";
import {
  DataItem,
  FilterOptions,
  Statistics,
  Filters,
  AggregatedData,
} from "../types";

const getApiUrl = () => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  }
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 429 && i < retries - 1) {
        console.warn(
          `Rate limited. Retrying in ${delayMs}ms... (${i + 1}/${retries})`
        );
        await delay(delayMs * (i + 1));
        continue;
      }

      if (i === retries - 1) {
        throw error;
      }

      await delay(delayMs);
    }
  }
  throw new Error("Max retries reached");
}

export const fetchAllData = async (filters?: Filters) => {
  return retryRequest(async () => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const response = await api.get<{
      success: boolean;
      data: DataItem[];
      count: number;
    }>(`/data?${params.toString()}`);
    return response.data;
  });
};

export const fetchFilterOptions = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      filters: FilterOptions;
    }>("/filters");
    return response.data;
  });
};

export const fetchStatistics = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      statistics: Statistics;
    }>("/statistics");
    return response.data;
  });
};

export const fetchIntensityBySector = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      data: AggregatedData[];
    }>("/analytics/sector");
    return response.data;
  });
};

export const fetchDataByRegion = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      data: AggregatedData[];
    }>("/analytics/region");
    return response.data;
  });
};

export const fetchDataByCountry = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      data: AggregatedData[];
    }>("/analytics/country");
    return response.data;
  });
};

export const fetchTopicAnalysis = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      data: AggregatedData[];
    }>("/analytics/topic");
    return response.data;
  });
};

export const fetchYearWiseTrend = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      data: AggregatedData[];
    }>("/analytics/year");
    return response.data;
  });
};

export const fetchPESTLEAnalysis = async () => {
  return retryRequest(async () => {
    const response = await api.get<{
      success: boolean;
      data: AggregatedData[];
    }>("/analytics/pestle");
    return response.data;
  });
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 429) {
      console.error(
        "Rate limit exceeded. Please wait before making more requests."
      );
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Server is taking too long to respond.");
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error. Please check if the backend is running.");
    }
    return Promise.reject(error);
  }
);
