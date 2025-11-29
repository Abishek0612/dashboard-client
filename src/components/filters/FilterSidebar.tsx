import { Filter, X } from "lucide-react";
import { FilterOptions, Filters } from "../../types";
import Select from "react-select";

interface FilterSidebarProps {
  filters: Filters;
  filterOptions: FilterOptions | null;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
}

const FilterSidebar = ({
  filters,
  filterOptions,
  onFilterChange,
  onReset,
}: FilterSidebarProps) => {
  const handleChange = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const isDarkMode = document.documentElement.classList.contains("dark");

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDarkMode
        ? "rgba(15, 23, 42, 0.8)"
        : "rgba(255, 255, 255, 0.95)",
      borderColor: isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(156, 163, 175, 0.5)",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      minHeight: "42px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(14, 165, 233, 0.2)" : "none",
      "&:hover": {
        borderColor: "rgba(14, 165, 233, 0.5)",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode
        ? "rgba(15, 23, 42, 0.95)"
        : "rgba(255, 255, 255, 0.98)",
      backdropFilter: "blur(10px)",
      border: isDarkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(156, 163, 175, 0.3)",
      zIndex: 9999,
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "rgba(14, 165, 233, 0.3)"
        : "transparent",
      color: isDarkMode ? "#ffffff" : "#1f2937",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(14, 165, 233, 0.3)",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDarkMode ? "#ffffff" : "#1f2937",
    }),
    input: (base: any) => ({
      ...base,
      color: isDarkMode ? "#ffffff" : "#1f2937",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDarkMode ? "#9ca3af" : "#6b7280",
    }),
  };

  const getSelectOptions = (options: string[]) =>
    options.map((opt) => ({ value: opt, label: opt }));

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== ""
  ).length;

  return (
    <aside
      className="h-full w-full lg:w-80 overflow-y-auto custom-scrollbar"
      style={{
        backgroundColor: isDarkMode
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderRight: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(229, 231, 235, 1)",
      }}
    >
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-400" />
            <h2
              className="text-lg font-bold"
              style={{ color: isDarkMode ? "#ffffff" : "#1f2937" }}
            >
              Filters
            </h2>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 text-xs bg-primary-600 text-white rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              End Year
            </label>
            <Select
              options={getSelectOptions(filterOptions?.endYears || [])}
              value={
                filters.end_year
                  ? { value: filters.end_year, label: filters.end_year }
                  : null
              }
              onChange={(option) =>
                handleChange("end_year", option?.value || "")
              }
              styles={customSelectStyles}
              placeholder="Select year..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              Topic
            </label>
            <Select
              options={getSelectOptions(filterOptions?.topics || [])}
              value={
                filters.topic
                  ? { value: filters.topic, label: filters.topic }
                  : null
              }
              onChange={(option) => handleChange("topic", option?.value || "")}
              styles={customSelectStyles}
              placeholder="Select topic..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              Sector
            </label>
            <Select
              options={getSelectOptions(filterOptions?.sectors || [])}
              value={
                filters.sector
                  ? { value: filters.sector, label: filters.sector }
                  : null
              }
              onChange={(option) => handleChange("sector", option?.value || "")}
              styles={customSelectStyles}
              placeholder="Select sector..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              Region
            </label>
            <Select
              options={getSelectOptions(filterOptions?.regions || [])}
              value={
                filters.region
                  ? { value: filters.region, label: filters.region }
                  : null
              }
              onChange={(option) => handleChange("region", option?.value || "")}
              styles={customSelectStyles}
              placeholder="Select region..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              PESTLE
            </label>
            <Select
              options={getSelectOptions(filterOptions?.pestles || [])}
              value={
                filters.pestle
                  ? { value: filters.pestle, label: filters.pestle }
                  : null
              }
              onChange={(option) => handleChange("pestle", option?.value || "")}
              styles={customSelectStyles}
              placeholder="Select PESTLE..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              Source
            </label>
            <Select
              options={getSelectOptions(filterOptions?.sources || [])}
              value={
                filters.source
                  ? { value: filters.source, label: filters.source }
                  : null
              }
              onChange={(option) => handleChange("source", option?.value || "")}
              styles={customSelectStyles}
              placeholder="Select source..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              Country
            </label>
            <Select
              options={getSelectOptions(filterOptions?.countries || [])}
              value={
                filters.country
                  ? { value: filters.country, label: filters.country }
                  : null
              }
              onChange={(option) =>
                handleChange("country", option?.value || "")
              }
              styles={customSelectStyles}
              placeholder="Select country..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
            >
              City
            </label>
            <Select
              options={getSelectOptions(filterOptions?.cities || [])}
              value={
                filters.city
                  ? { value: filters.city, label: filters.city }
                  : null
              }
              onChange={(option) => handleChange("city", option?.value || "")}
              styles={customSelectStyles}
              placeholder="Select city..."
              isClearable
              menuPortalTarget={document.body}
            />
          </div>
        </div>

        <div
          className="mt-6 pt-6 border-t"
          style={{
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(229, 231, 235, 1)",
          }}
        >
          <p
            className="text-xs"
            style={{ color: isDarkMode ? "#6b7280" : "#9ca3af" }}
          >
            {activeFiltersCount > 0
              ? `${activeFiltersCount} filter${
                  activeFiltersCount > 1 ? "s" : ""
                } active`
              : "No filters applied"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
