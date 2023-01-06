import 'dotenv/config';
import http from 'node:http';
import { send, serve } from 'micro';
import puppeteer from 'puppeteer-core';

/** @type {import('micro').RequestHandler} */
async function handler(req, res) {
  let path = req.url.split('?')[0];
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  const [domain, ...rest] = path.split('/');
  if (!domain || !rest.length) {
    console.warn(`Invalid request: domain=${domain} rest=${rest}`);
    send(res, 400, `Invalid request: domain=${domain} rest=${rest}`);
    return;
  }

  const allowedDomains = ['package', 'author', 'statistic'];
  if (!allowedDomains.includes(domain)) {
    console.warn(`Invalid domain: ${domain}`);
    send(res, 400, `Invalid domain: ${domain}`);
    return;
  }

  try {
    const urlPath = [process.env.FE_BASE_URL, domain, ...rest].join('/');
    const url = new URL(urlPath);

    console.log(`Generating screenshot for ${url}`);

    const imageBuffer = await getScreenshot(url.toString());

    res.setHeader('Content-Type', 'image/jpeg');
    res.end(imageBuffer);
  } catch (error) {
    console.error(error);
    send(res, 500, error.message);
  }
}

/**
 * @param {string} url          URL to take screenshot of.
 * @returns {Promise<Buffer>}   Screenshot as image buffer.
 */
async function getScreenshot(url) {
  const width = 1200;
  const height = 630;

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
      `--window-size=${width},${height}`
    ],
    defaultViewport: {
      width,
      height
    }
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait for the fonts to load.
  await new Promise((resolve) => setTimeout(resolve, 200));

  const imageBuffer = await page.screenshot({ type: 'jpeg', quality: 70 });
  await browser.close();

  return imageBuffer;
}

const server = new http.Server(serve(handler));
server.listen(Number(process.env.PORT) || 8080);
