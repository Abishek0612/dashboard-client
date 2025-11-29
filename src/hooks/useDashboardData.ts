import { useState, useEffect } from "react";
import {
  fetchAllData,
  fetchFilterOptions,
  fetchStatistics,
} from "../services/api.service";
import { DataItem, FilterOptions, Statistics, Filters } from "../types";

export const useDashboardData = (filters: Filters) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filterOptions) {
      loadFilteredData();
    }
  }, [filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading filter options...");
      const filtersRes = await fetchFilterOptions();
      setFilterOptions(filtersRes.filters);

      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("Loading data...");
      const dataRes = await fetchAllData();
      setData(dataRes.data);

      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("Loading statistics...");
      const statsRes = await fetchStatistics();
      setStatistics(statsRes.statistics);
    } catch (error: any) {
      console.error("Error loading data:", error);
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      setError(null);
      const response = await fetchAllData(filters);
      setData(response.data);
    } catch (error: any) {
      console.error("Error loading filtered data:", error);
      setError(error.message || "Failed to load filtered data");
    }
  };

  return { data, filterOptions, statistics, loading, error };
};
