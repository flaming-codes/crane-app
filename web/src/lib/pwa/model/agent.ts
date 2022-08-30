import { browser } from '$app/environment';

export type HostOS = 'mac' | 'ios' | 'windows' | 'android' | 'linux';

/**
 *
 */
export function isWebKit() {
  if (!browser) {
    return false;
  }

  // is safari
  const ua = window.navigator.userAgent;
  return ua.match(/safari/i) && ua.match(/version\/([\d.]+)/i);
  const webkit = !!ua.match(/WebKit/i);
  return webkit && !ua.match(/CriOS/i);
}

/**
 * Get best-effort determination of what
 * OS the current device is using.
 */
export function getHostOS(): HostOS | undefined {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return 'mac';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return 'ios';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return 'windows';
  } else if (/Android/.test(userAgent)) {
    return 'android';
  } else if (/Linux/.test(platform)) {
    return 'linux';
  }
}
