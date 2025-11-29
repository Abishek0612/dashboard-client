import { motion } from "framer-motion";
import { DataItem } from "../../types";
import IntensityGauge from "../charts/IntensityGauge";
import LikelihoodDistribution from "../charts/LikelihoodDistribution";
import IntensityBySectorChart from "../charts/IntensityBySectorChart";
import RegionChart from "../charts/RegionChart";
import YearTrendChart from "../charts/YearTrendChart";
import CountryChart from "../charts/CountryChart";
import TopicChart from "../charts/TopicChart";
import PESTLEChart from "../charts/PESTLEChart";

interface DashboardGridProps {
  data: DataItem[];
  isDark: boolean;
}

const DashboardGrid = ({ data, isDark }: DashboardGridProps) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <IntensityGauge data={data} isDark={isDark} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LikelihoodDistribution data={data} isDark={isDark} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <IntensityBySectorChart isDark={isDark} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <RegionChart isDark={isDark} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <YearTrendChart isDark={isDark} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <CountryChart isDark={isDark} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <TopicChart isDark={isDark} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <PESTLEChart isDark={isDark} />
      </motion.div>
    </div>
  );
};

export default DashboardGrid;
