import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import clsx from "clsx";

type DataPoint = {
  date: string;
  value: number;
};

type LineGraphProps = {
  data: DataPoint[];
  height?: number;
  padding?: number;
};

export function LineGraph({
  data,
  height = 400,
  padding = 16,
}: LineGraphProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
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

  // Calculate total downloads per month
  const downloadsPerMonth = data.reduce(
    (acc, d) => {
      const month = format(new Date(d.date), "MMM yyyy");
      acc[month] = (acc[month] || 0) + d.value;
      return acc;
    },
    {} as Record<string, number>,
  );

  const months = Object.keys(downloadsPerMonth);
  const minDownloads = Math.min(...Object.values(downloadsPerMonth));
  const maxDownloads = Math.max(...Object.values(downloadsPerMonth));

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
          className="text-gray-normal absolute cursor-auto rounded-md p-2 text-center text-sm shadow backdrop-blur-sm"
          style={{
            left: `${xScale(data.findIndex((d) => d === hoveredPoint))}px`,
            top: `${yScale(hoveredPoint.value) - 50}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-mono font-semibold">
            {nrFormatter.format(hoveredPoint.value)}{" "}
            {hoveredPoint.value === 1 ? "download" : "downloads"}
          </div>
          <div>{format(new Date(hoveredPoint.date), "MMM dd, yyyy")}</div>
        </div>
      )}

      {/* Monthly Downloads Distribution */}
      <div className="mt-8 flex w-full">
        {months.map((month, i) => {
          // 'month' is e.g. 'Jan 2022', we only want the
          // short month name to be 'Jan '22'.
          const shortMonth = month.slice(0, 3);
          const shortYear = month.slice(-2);
          const isFirst = i === 0;
          const isLast = i === months.length - 1;

          return (
            <div
              key={month}
              className={`text-gray-normal relative flex flex-col items-center justify-start gap-2 text-center text-xs first:rounded-s-md last:rounded-e-md`}
              style={{ flex: downloadsPerMonth[month] }}
              onMouseEnter={() => setHoveredMonth(month)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              <div
                className={clsx(
                  "h-4 w-full",
                  getColor(
                    downloadsPerMonth[month],
                    minDownloads,
                    maxDownloads,
                  ),
                  {
                    "rounded-s-full": isFirst,
                    "rounded-e-full": isLast,
                  },
                )}
              />
              <span className="text-gray-dim hidden lg:inline-block">
                {shortMonth}
                <br />
                &apos;{shortYear}
              </span>

              {hoveredMonth === month && (
                <div className="text-gray-normal absolute bottom-full mb-2 w-max rounded-md p-2 text-center text-xs shadow-lg backdrop-blur-md">
                  <div className="font-mono font-semibold">
                    {nrFormatter.format(downloadsPerMonth[month])}{" "}
                    {downloadsPerMonth[month] === 1 ? "download" : "downloads"}
                  </div>
                  <div>{month}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const colorClasses = [
  "bg-gray-12",
  "bg-iris-1",
  "bg-iris-2",
  "bg-iris-3",
  "bg-iris-4",
  "bg-iris-5",
  "bg-iris-6",
  "bg-iris-7",
  "bg-iris-8",
  "bg-iris-9",
  "bg-iris-10",
  "bg-iris-11",
  "bg-iris-12",
];

// Generate color based on min-max scaling
function getColor(downloads: number, min: number, max: number) {
  if (max === min || !downloads) {
    return "bg-gray-ui";
  }

  const intensity = Math.min(Math.max((downloads - min) / (max - min), 0), 1);
  const level = Math.ceil(intensity * 7) + 5;

  return colorClasses[level] || "bg-gray-ui";
}
