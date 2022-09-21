import { format, sub } from 'date-fns';
import type { CranDownloadsResponse, CranResponse } from '../types/cran';

function formatted(source: Date) {
  return format(source, 'yyyy-MM-dd');
}

/**
 * Tagged template literal for the CRAN statistics API
 * that creates the correct url and turns any date into
 * the correct format.
 *
 * @param template
 * @param params
 * @returns
 */
function endpoint(template: TemplateStringsArray, ...params: (string | Date)[]) {
  // Zip template and params together and remove the last empty ''.
  const zipped = template.slice(0, -1).reduce((acc, part, i) => {
    return acc.concat(part, params[i]);
  }, [] as (string | Date)[]);
  // Replace all dates with formatted dates.
  const stringified = zipped.map((part) => {
    if (typeof part === 'string') return part;
    return formatted(part);
  });

  return 'https://cranlogs.r-pkg.org' + stringified.join('');
}

/**
 * Tagged template literal for the CRAN downloads endpoint that
 * fetches the statistics for the provided url.
 *
 * @param template
 * @param params
 * @returns
 */
async function load<R extends CranResponse>(
  template: TemplateStringsArray,
  ...params: (string | Date)[]
): Promise<R> {
  const url = endpoint(template, ...params);
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .catch(() => undefined);
}

/**
 * Get the downloads for a package in the last n days, starting
 * from today.
 *
 * @param params
 * @returns
 */
export async function getPackageDownloadsLastNDays(params: { name: string; days: number }) {
  const { name, days } = params;
  const now = new Date();
  const past = sub(now, { days });

  return load<CranDownloadsResponse>`/downloads/total/${past}:${now}/${name}`;
}
