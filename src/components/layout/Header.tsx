import { motion } from "framer-motion";
import { BarChart3, Moon, Sun, Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { DataItem } from "../../types";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  data: DataItem[];
}

const Header = ({ isDark, toggleTheme, data }: HeaderProps) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportToCSV = () => {
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = [
      "Sector",
      "Topic",
      "Region",
      "Country",
      "Intensity",
      "Likelihood",
      "Relevance",
      "Year",
      "Source",
      "PESTLE",
      "Title",
    ];

    const rows = data.map((item) => [
      item.sector || "",
      item.topic || "",
      item.region || "",
      item.country || "",
      item.intensity || 0,
      item.likelihood || 0,
      item.relevance || 0,
      item.end_year || "",
      item.source || "",
      item.pestle || "",
      `"${item.title?.replace(/"/g, '""') || ""}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `blackcoffer-data-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportMenu(false);
  };

  const exportToJSON = () => {
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `blackcoffer-data-${Date.now()}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportMenu(false);
  };

  const exportToPDF = async () => {
    alert(
      "PDF Export: Install jsPDF library for full implementation\n\nRun: npm install jspdf jspdf-autotable\n\nFor now, use CSV or JSON export."
    );
    setShowExportMenu(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass-morphism border-b border-white/10"
    >
      <div className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="bg-gradient-to-br from-primary-500 to-blue-600 p-2 lg:p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold gradient-text">
                Blackcoffer Analytics
              </h1>
              <p className="text-xs lg:text-sm text-gray-400 hidden sm:block">
                Data Visualization Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="text-xs lg:text-sm font-medium hidden sm:inline">
                  Export
                </span>
              </motion.button>

              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-40 lg:w-48 glass-morphism rounded-lg shadow-xl overflow-hidden border border-white/10"
                >
                  <button
                    onClick={exportToCSV}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                    <span className="text-xs lg:text-sm">Export as CSV</span>
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
                    <span className="text-xs lg:text-sm">Export as JSON</span>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-3 h-3 lg:w-4 lg:h-4 text-red-400" />
                    <span className="text-xs lg:text-sm">Export as PDF</span>
                  </button>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
