import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const StatsCard = ({ icon: Icon, label, value, trend = 0, color = "blue", unit = "" }) => {
  const colorVariants = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    pink: "bg-pink-100 text-pink-600",
  };

  const trendColor = trend >= 0 ? "text-green-600" : "text-red-600";
  const trendArrow = trend >= 0 ? <FiArrowUp /> : <FiArrowDown />;

  return (
    <div className={`${colorVariants[color]} bg-opacity-10 rounded-lg shadow-md p-6 border border-opacity-20 border-current`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-semibold">{label}</p>
          <div className="flex items-baseline gap-2 mt-3">
            <p className="text-3xl font-bold">{value}</p>
            {unit && <span className="text-lg text-gray-500">{unit}</span>}
          </div>
          {trend !== 0 && (
            <div className={`flex items-center gap-1 mt-3 font-semibold text-sm ${trendColor}`}>
              {trendArrow}
              <span>{Math.abs(trend)}% from last period</span>
            </div>
          )}
        </div>
        {Icon && <Icon className={`w-10 h-10 ${colorVariants[color]} opacity-50`} />}
      </div>
    </div>
  );
};

export default StatsCard;
