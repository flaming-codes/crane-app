import clsx from "clsx";
import {
  format,
  addDays,
  parseISO,
  differenceInCalendarDays,
  addWeeks,
  startOfWeek,
} from "date-fns";
import { memo, useMemo } from "react";

type DownloadData = {
  day: string;
  downloads: number;
};

type HeatmapProps = {
  downloads: DownloadData[];
  start: string;
  end: string;
};

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
const getColor = (downloads: number, min: number, max: number) => {
  if (max === min || !downloads) {
    return "bg-gray-ui";
  }

  const intensity = Math.min(Math.max((downloads - min) / (max - min), 0), 1);
  const level = Math.ceil(intensity * 7) + 5;

  return colorClasses[level] || "bg-gray-ui";
};

export const Heatmap = memo(({ downloads, start, end }: HeatmapProps) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  // Calculate the number of days in the range
  const totalDays = differenceInCalendarDays(endDate, startDate) + 1;

  // Create a map for O(1) access
  const downloadsMap = useMemo(
    () =>
      downloads.reduce(
        (acc, { day, downloads }) => {
          acc[day] = downloads;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [downloads],
  );

  // Fill missing days with 0 downloads and generate date range
  const daysInRange = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const dateObj = addDays(startDate, i);
      const date = format(dateObj, "yyyy-MM-dd");
      return {
        day: date,
        dateObj,
        downloads: downloadsMap[date] || 0,
      };
    });
  }, [totalDays, startDate, downloadsMap]);

  // Organize data into weeks and days
  const weeks = useMemo(() => {
    const weeksArray = [];
    let weekStart = startOfWeek(startDate);

    while (weekStart <= endDate) {
      const week = Array.from({ length: 7 }, (_, i) => {
        const currentDay = addDays(weekStart, i);
        const formattedDay = format(currentDay, "yyyy-MM-dd");
        return {
          day: formattedDay,
          dateObj: currentDay,
          downloads: downloadsMap[formattedDay] || 0,
        };
      });
      weeksArray.push(week);
      weekStart = addWeeks(weekStart, 1);
    }
    return weeksArray;
  }, [startDate, endDate, downloadsMap]);

  // Calculate min and max for scaling
  const { minDownloads, maxDownloads } = useMemo(() => {
    const downloadValues = daysInRange.map((d) => d.downloads);
    return {
      minDownloads: Math.min(...downloadValues),
      maxDownloads: Math.max(...downloadValues),
    };
  }, [daysInRange]);

  return (
    <div className="flex flex-col gap-8">
      {/* Heatmap Grid */}
      <div role="grid" aria-label="Download heatmap grid">
        {/* X-axis Labels (Days of the Week) */}
        <div className="text-gray-700 mb-2 grid grid-cols-7 gap-1 text-center text-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Weeks */}
        <div className="grid grid-rows-5 gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map(({ downloads, dateObj }, dayIndex) => {
                const dateLabel = format(dateObj, "MMM d, yyyy");
                return (
                  <div
                    key={dayIndex}
                    role="gridcell"
                    className={`${getColor(downloads, minDownloads, maxDownloads)} group flex aspect-square w-full flex-col items-center justify-center overflow-visible rounded-md`}
                    aria-label={`${downloads} downloads on ${dateLabel}`}
                    title={`${downloads} downloads on ${dateLabel}`}
                  >
                    <span
                      className={clsx(
                        "bg-gray-app text-gray-normal flex flex-col items-center rounded-full p-2 text-center opacity-0 transition-opacity group-hover:opacity-100 md:rounded-lg",
                        "z-10 text-xs",
                      )}
                    >
                      <span>{downloads} downloads</span>
                      <span>{dateLabel}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex items-center gap-1">
        <div className="flex items-center gap-1 font-mono">
          <div className="bg-gray-ui size-6 rounded-md" />
          <span className="mx-2">{minDownloads}</span>
          <div className="size-6 rounded-md bg-iris-7" />
          <div className="size-6 rounded-md bg-iris-8" />
          <div className="size-6 rounded-md bg-iris-9" />
          <div className="size-6 rounded-md bg-iris-10" />
          <div className="size-6 rounded-md bg-iris-11" />
          <div className="size-6 rounded-md bg-iris-12" />
          <span className="ml-2">{maxDownloads}</span>
        </div>
      </div>
    </div>
  );
});

Heatmap.displayName = "Heatmap";
