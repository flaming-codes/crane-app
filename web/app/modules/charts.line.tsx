import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

interface DataPoint {
  date: string;
  value: number;
}

interface LineGraphProps {
  data: DataPoint[];
  height?: number;
  padding?: number;
}

export function LineGraph({
  data,
  height = 400,
  padding = 16,
}: LineGraphProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Find min and max values for scaling
  const minValue = Math.min(...data.map((d) => d.value));
  const maxValue = Math.max(...data.map((d) => d.value));

  // Calculate x and y scaling functions
  const xScale = (index: number) =>
    padding + ((width - 2 * padding) / (data.length - 1)) * index;
  const yScale = (value: number) =>
    height -
    padding -
    ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding);

  // Generate path for smooth line using cubic Bezier curves
  const linePath = data.reduce((path, d, i, arr) => {
    const x = xScale(i);
    const y = yScale(d.value);
    if (i === 0) {
      return `M ${x},${y}`;
    }
    const prevX = xScale(i - 1);
    const prevY = yScale(arr[i - 1].value);
    const controlX1 = prevX + (x - prevX) / 3;
    const controlY1 = prevY;
    const controlX2 = x - (x - prevX) / 3;
    const controlY2 = y;
    return `${path} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${x},${y}`;
  }, "");

  const nrFormatter = new Intl.NumberFormat("en-US");

  return (
    <div ref={containerRef} className="text-gray-normal relative w-full">
      <svg width={width} height={height} className="bg-transparent">
        {/* Smooth Line Path */}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vertical hover areas */}
        {data.map((d, i) => (
          <rect
            key={i}
            x={xScale(i) - (width - 2 * padding) / (2 * (data.length - 1))}
            y={0}
            width={(width - 2 * padding) / (data.length - 1)}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHoveredPoint(d)}
            onMouseLeave={() => setHoveredPoint(null)}
            aria-label={`Date: ${format(new Date(d.date), "MMM dd, yyyy")}, Value: ${d.value}`}
          />
        ))}

        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(d.value)}
            r={1}
            fill="currentColor"
            className="cursor-pointer"
            aria-hidden="true"
          />
        ))}
      </svg>
      {/* Hover tooltip */}
      {hoveredPoint && (
        <div
          className="absolute cursor-auto rounded-md p-2 text-center text-sm shadow backdrop-blur-sm"
          style={{
            left: `${xScale(data.findIndex((d) => d === hoveredPoint))}px`,
            top: `${yScale(hoveredPoint.value) - 50}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-mono font-semibold">
            {nrFormatter.format(hoveredPoint.value)}
          </div>
          <div>{format(new Date(hoveredPoint.date), "MMM dd, yyyy")}</div>
        </div>
      )}
    </div>
  );
}
