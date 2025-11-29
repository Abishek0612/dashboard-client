export const getChartColors = (isDark: boolean) => ({
  text: isDark ? "#9ca3af" : "#4b5563",
  textPrimary: isDark ? "#ffffff" : "#1f2937",
  grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
  background: isDark ? "#1e293b" : "#f1f5f9",
  tooltipBg: isDark ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.95)",
  tooltipText: isDark ? "#ffffff" : "#1f2937",
  tooltipBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
});

export const getGradientColors = (isDark: boolean) => ({
  primary: isDark ? ["#3b82f6", "#8b5cf6"] : ["#2563eb", "#7c3aed"],
  success: isDark ? ["#10b981", "#059669"] : ["#059669", "#047857"],
  warning: isDark ? ["#f59e0b", "#ef4444"] : ["#d97706", "#dc2626"],
  rainbow: isDark ? "#1f2937" : "#f8fafc",
});
