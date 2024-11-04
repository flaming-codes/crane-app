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
  "bg-gray-2 dark:bg-gray-12",
  "bg-iris-1 dark:bg-iris-12",
  "bg-iris-2 dark:bg-iris-11",
  "bg-iris-3 dark:bg-iris-10",
  "bg-iris-4 dark:bg-iris-9",
  "bg-iris-5 dark:bg-iris-8",
  "bg-iris-6 dark:bg-iris-12",
  "bg-iris-7 dark:bg-iris-11",
  "bg-iris-8 dark:bg-iris-10",
  "bg-iris-9 dark:bg-iris-8",
  "bg-iris-10 dark:bg-iris-6",
  "bg-iris-11 dark:bg-iris-4",
  "bg-iris-12 dark:bg-iris-2",
];

// Generate color based on min-max scaling
const getColor = (downloads: number, min: number, max: number) => {
  if (max === min || !downloads) {
    return "bg-gray-ui";
  }

  const intensity = Math.min(Math.max((downloads - min) / (max - min), 0), 1);
  const level = Math.ceil(intensity * 7) + 5;
  const color = colorClasses[level];

  return color || "bg-gray-ui";
};

export const Heatmap = memo((props: HeatmapProps) => {
  const { downloads, start, end } = props;

  const nrFormat = new Intl.NumberFormat("en-US");

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
        <div className="text-gray-normal mb-2 grid grid-cols-7 gap-1 text-center text-sm">
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
                    className={clsx(
                      "group flex aspect-square w-full flex-col items-center justify-center overflow-visible rounded-md",
                      getColor(downloads, minDownloads, maxDownloads),
                    )}
                    aria-label={`${nrFormat.format(downloads)} downloads on ${dateLabel}`}
                    title={`${nrFormat.format(downloads)} downloads on ${dateLabel}`}
                  >
                    <span
                      className={clsx(
                        "bg-gray-app text-gray-normal flex flex-col items-center rounded-full p-2 md:rounded-lg",
                        "opacity-0 transition-opacity group-hover:opacity-100",
                        "z-10 text-center text-xs",
                      )}
                    >
                      <span>{nrFormat.format(downloads)} downloads</span>
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
          <span className="mx-2">{nrFormat.format(minDownloads)}</span>
          <div className="size-6 rounded-md bg-iris-7 dark:bg-iris-12" />
          <div className="size-6 rounded-md bg-iris-8 dark:bg-iris-11" />
          <div className="size-6 rounded-md bg-iris-9 dark:bg-iris-10" />
          <div className="size-6 rounded-md bg-iris-10 dark:bg-iris-8" />
          <div className="size-6 rounded-md bg-iris-11 dark:bg-iris-6" />
          <div className="size-6 rounded-md bg-iris-12 dark:bg-iris-4" />
          <span className="ml-2">{nrFormat.format(maxDownloads)}</span>
        </div>
      </div>
    </div>
  );
});

Heatmap.displayName = "Heatmap";
