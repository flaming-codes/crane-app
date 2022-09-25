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
  const getDownloads = async (days: number, from = new Date()) => {
    const res = await getPackageDownloadsLastNDays({ name: item.name, days, from });
    return res?.[0]?.downloads;
  };

  // Fetch all statistics in parallel.
  const stats = await Promise.all([
    getDownloads(1),
    getDownloads(7),
    getDownloads(30),
    getDownloads(90),
    getDownloads(365)
  ]);

  const trendReferences = await Promise.all([
    getDownloads(1, sub(new Date(), { days: 1 })),
    getDownloads(7, sub(new Date(), { days: 7 })),
    getDownloads(30, sub(new Date(), { days: 30 })),
    getDownloads(90, sub(new Date(), { days: 90 })),
    getDownloads(365, sub(new Date(), { days: 365 }))
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
  const labels = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days'];
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
