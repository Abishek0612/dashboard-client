import { useState, useCallback } from "react";
import { Filters } from "../types";

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
    city: "",
  });

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      end_year: "",
      topic: "",
      sector: "",
      region: "",
      pestle: "",
      source: "",
      country: "",
      city: "",
    });
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((value) => value !== "");
  }, [filters]);

  return {
    filters,
    handleFilterChange,
    resetFilters,
    hasActiveFilters: hasActiveFilters(),
  };
};
