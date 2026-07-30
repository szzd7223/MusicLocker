"use client";

import { ChartPoint } from "../types";
import { COLORS } from "../utils/api";

interface LegendLikeProps {
  data: ChartPoint[];
}

export function LegendLike({ data }: LegendLikeProps) {
  return (
    <div className="custom-legend">
      {data.slice(0, 6).map((point, index) => (
        <div key={point.label} className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
          <span className="legend-text">
            {point.label} ({point.value})
          </span>
        </div>
      ))}
    </div>
  );
}
