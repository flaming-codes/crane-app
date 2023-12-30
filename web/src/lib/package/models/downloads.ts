import { format1kDelimiter } from '$lib/display/models/format';
import { getPackageDownloadsLastNDays } from '$lib/statistics/models/cran';
import { sub } from 'date-fns';
import type { Pkg } from '../type';

/**
 * Get the downloads for a package in the last n days, starting
 * from today. The result is an array of objects with the number
 * of downloads, the relative trend for the respective time period
 * and the label.
 *
 * @param item
 * @returns
 */
export async function getDownloadsWithTrends(item: Pkg) {
  const getDownloads = async (days: number, from?: Date) => {
    const res = await getPackageDownloadsLastNDays({ name: item.name, days, from });
    return res?.[0]?.downloads;
  };

  // Fetch all statistics in parallel.
  const now = new Date();
  const [stats, trendReferences] = await Promise.all([
    Promise.all([
      getDownloads(1),
      getDownloads(7, now),
      getDownloads(30, now),
      getDownloads(90, now),
      getDownloads(365, now)
    ]),
    Promise.all([
      getDownloads(0, sub(now, { days: 2 })),
      getDownloads(7, sub(now, { days: 7 })),
      getDownloads(30, sub(now, { days: 30 })),
      getDownloads(90, sub(now, { days: 90 })),
      getDownloads(365, sub(now, { days: 365 }))
    ])
  ]);

  // Get rend in percentage.
  const trends = stats.map((stat, i) => {
    const ref = trendReferences[i];
    // No valid values.
    if (stat === undefined || ref === undefined || ref === 0) {
      return '';
    }
    const diff = stat - ref;
    return `${diff > 0 ? '+' : ''}${((diff / ref) * 100).toFixed(0)}%`;
  });

  // Aggregate the statistics into a single object.
  const labels = ['Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days'];
  const downloads = stats
    .map((value, i) => ({
      value,
      trend: trends[i],
      label: labels[i]
    }))
    .filter(({ value }) => value !== undefined)
    .map(({ value, ...rest }) => ({ value: format1kDelimiter(value), ...rest }));

  return downloads;
}
