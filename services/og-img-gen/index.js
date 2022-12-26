import 'dotenv/config';
import puppeteer from 'puppeteer-core';

/** @type {import('micro').RequestHandler} */
export default async function (req, res) {
  let path = req.url.split('?')[0];
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  const [domain, id] = path.split('/');

  try {
    const url = new URL(`${process.env.FE_BASE_URL}/${domain}/${id}/poster`);
    console.log(`Generating screenshot for ${url}`);

    const imageBuffer = await getScreenshot(url.toString());

    res.setHeader('Content-Type', 'image/jpeg');
    res.end(imageBuffer);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.send(`Error fetching ${url}`);
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

  const imageBuffer = await page.screenshot({ type: 'jpeg', quality: 80 });
  await browser.close();

  return imageBuffer;
}
