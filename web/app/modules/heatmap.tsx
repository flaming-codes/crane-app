import clsx from "clsx";
import {
  format,
  addDays,
  parseISO,
  differenceInCalendarDays,
  addWeeks,
  startOfWeek,
} from "date-fns";
import { memo } from "react";

type DownloadData = {
  day: string;
  downloads: number;
};

type HeatmapProps = {
  downloads: DownloadData[];
  start: string;
  end: string;
};

// Generate color based on min-max scaling
const getColor = (downloads: number, min: number, max: number) => {
  if (max === min || !downloads) {
    return "bg-gray-ui";
  }

  const intensity = Math.min(Math.max((downloads - min) / (max - min), 0), 1);
  const level = Math.ceil(intensity * 7) + 5;

  return clsx({
    "bg-gray-12": level === 0,
    [`bg-iris-${level}`]: level > 0,
  });
};

export const Heatmap = memo(({ downloads, start, end }: HeatmapProps) => {
  // Calculate the number of days in the range
  const totalDays =
    differenceInCalendarDays(parseISO(end), parseISO(start)) + 1;

  // Fill missing days with 0 downloads and generate date range
  const daysInRange = Array.from({ length: totalDays }, (_, i) => {
    const date = format(addDays(parseISO(start), i), "yyyy-MM-dd");
    return {
      day: date,
      downloads: downloads.find((d) => d.day === date)?.downloads || 0,
    };
  });

  // Organize data into weeks and days
  const startDate = parseISO(start);
  const weeks = [];
  let weekStart = startOfWeek(startDate);

  while (weekStart <= parseISO(end)) {
    const week = Array.from({ length: 7 }, (_, i) => {
      const currentDay = addDays(weekStart, i);
      const formattedDay = format(currentDay, "yyyy-MM-dd");
      const downloadData = daysInRange.find((d) => d.day === formattedDay);
      return {
        day: formattedDay,
        downloads: downloadData ? downloadData.downloads : 0,
      };
    });
    weeks.push(week);
    weekStart = addWeeks(weekStart, 1);
  }

  // Calculate min and max for scaling
  const downloadValues = daysInRange.map((d) => d.downloads);
  const minDownloads = Math.min(...downloadValues);
  const maxDownloads = Math.max(...downloadValues);

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
              {week.map(({ day, downloads }, dayIndex) => (
                <div
                  key={dayIndex}
                  role="gridcell"
                  className={`${getColor(downloads, minDownloads, maxDownloads)} group flex aspect-square w-full flex-col items-center justify-center overflow-visible rounded-md`}
                  aria-label={`${downloads} downloads on ${format(parseISO(day), "MMM d, yyyy")}`}
                  title={`${downloads} downloads on ${format(parseISO(day), "MMM d, yyyy")}`}
                >
                  <span
                    className={clsx(
                      "bg-gray-app text-gray-normal flex flex-col items-center rounded-full p-2 text-center opacity-0 transition-opacity group-hover:opacity-100 md:rounded-lg",
                      "z-10 text-xs",
                    )}
                  >
                    <span>{downloads} downloads</span>
                    <span>{format(parseISO(day), "MMM d, yyyy")}</span>
                  </span>
                </div>
              ))}
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
