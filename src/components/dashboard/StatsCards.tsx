import { motion } from "framer-motion";
import { TrendingUp, Activity, Target, Database } from "lucide-react";
import { Statistics } from "../../types";

interface StatsCardsProps {
  statistics: Statistics;
  dataCount: number;
}

const StatsCards = ({ statistics, dataCount }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Records",
      value: dataCount.toLocaleString(),
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      change: "+12.5%",
    },
    {
      title: "Avg Intensity",
      value: statistics.avgIntensity?.toFixed(2) || "0",
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      change: "+8.2%",
    },
    {
      title: "Avg Likelihood",
      value: statistics.avgLikelihood?.toFixed(2) || "0",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      change: "+15.3%",
    },
    {
      title: "Avg Relevance",
      value: statistics.avgRelevance?.toFixed(2) || "0",
      icon: Target,
      color: "from-orange-500 to-red-500",
      change: "+5.7%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs lg:text-sm stat-text-secondary mb-1">
                {card.title}
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold gradient-text">
                {card.value}
              </h3>
              <div className="flex items-center mt-2 space-x-1">
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-400 dark:text-green-400" />
                <span className="text-xs lg:text-sm text-green-400 dark:text-green-400">
                  {card.change}
                </span>
              </div>
            </div>
            <div
              className={`bg-gradient-to-br ${card.color} p-3 lg:p-4 rounded-xl shadow-lg`}
            >
              <card.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
