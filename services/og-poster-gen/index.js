import 'dotenv/config';
import captureWebsite from 'capture-website';

/** @type {import('micro').RequestHandler} */
export default async function (req, res) {
  let path = req.url.split('?')[0];
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  const [domain, id] = path.split('/');

  // https://github.com/fly-apps/puppeteer-js-renderer/blob/master/index.js

  const url = new URL(`${process.env.BASE_URL}/${domain}/${id}/poster`);
  const imageBuffer = await captureWebsite.buffer(url.toString(), {
    type: 'jpeg',
    width: 1200,
    height: 630,
    delay: 0.2,
    quality: 0.8
  });

  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
  res.end(imageBuffer);
}
