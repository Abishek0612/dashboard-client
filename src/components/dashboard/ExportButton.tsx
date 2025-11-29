import { useState } from "react";
import { Download, FileText, Table } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ExportButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    { icon: FileText, label: "Export as PDF", action: "pdf" },
    { icon: Table, label: "Export as CSV", action: "csv" },
    { icon: Download, label: "Export as JSON", action: "json" },
  ];

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    // Implement export logic here
    alert(`Export as ${format.toUpperCase()} - Feature ready to implement!`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Export</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 w-48 glass-morphism rounded-lg shadow-xl overflow-hidden z-50"
          >
            {exportOptions.map((option, index) => (
              <motion.button
                key={option.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleExport(option.action)}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-colors"
              >
                <option.icon className="w-4 h-4 text-primary-400" />
                <span className="text-sm">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton;
