const TrackingTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return <p className="text-gray-500 text-center py-8">No tracking data available</p>;
  }

  return (
    <div className="space-y-4">
      {timeline.map((step, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition ${
                step.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {step.completed ? "✓" : index + 1}
            </div>
            {index < timeline.length - 1 && (
              <div
                className={`w-1 h-16 mt-1 ${
                  step.completed ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>

          {/* Timeline content */}
          <div className="flex-1 pt-1">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={`font-semibold text-base transition ${
                    step.completed ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </p>
                {step.location && (
                  <p className="text-sm text-gray-600 mt-1">📍 {step.location}</p>
                )}
              </div>
              <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                {new Date(step.date).toLocaleString()}
              </p>
            </div>
            {step.description && (
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            )}
            {step.completed && (
              <p className="text-xs text-green-600 font-semibold mt-2">✓ Completed</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackingTimeline;
