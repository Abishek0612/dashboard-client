import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Header from "./components/layout/Header";
import FilterSidebar from "./components/filters/FilterSidebar";
import MobileMenu from "./components/layout/MobileMenu";
import DashboardGrid from "./components/dashboard/DashboardGrid";
import StatsCards from "./components/dashboard/StatsCards";
import { useTheme } from "./hooks/useTheme";
import { useFilters } from "./hooks/useFilters";
import { useDashboardData } from "./hooks/useDashboardData";
import ConnectionStatus from "./components/layout/ConnectionStatus";

function App() {
  const { isDark, toggleTheme } = useTheme();
  const { filters, handleFilterChange, resetFilters } = useFilters();
  const { data, filterOptions, statistics, loading } =
    useDashboardData(filters);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "dark" : ""
      }`}
    >
      <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 min-h-screen">
        <Header isDark={isDark} toggleTheme={toggleTheme} data={data} />

        <div className="flex relative">
          <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-40">
            <FilterSidebar
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          <MobileMenu
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FilterSidebar
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={(newFilters) => {
                handleFilterChange(newFilters);
                setIsMobileMenuOpen(false);
              }}
              onReset={() => {
                resetFilters();
                setIsMobileMenuOpen(false);
              }}
            />
          </MobileMenu>

          <main className="flex-1 w-full lg:ml-80 p-4 lg:p-6 custom-scrollbar overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {statistics && (
                <StatsCards statistics={statistics} dataCount={data.length} />
              )}
              <DashboardGrid data={data} isDark={isDark} />
              <ConnectionStatus />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
