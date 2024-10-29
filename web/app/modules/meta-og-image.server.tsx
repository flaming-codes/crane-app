// ./app/utils/createOGImage.server.tsx

import { Resvg } from "@resvg/resvg-js";
import type { SatoriOptions } from "satori";
import satori from "satori";

const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_WIDTH = 1200;

function getRegularSans(baseUrl: string) {
  return fetch(new URL(`${baseUrl}/fonts/Inter-Regular.ttf`)).then(
    async (res) => {
      return res.arrayBuffer();
    },
  );
}

async function getBaseOptions(
  requestUrl: string,
  partial: Partial<SatoriOptions> = {},
): Promise<SatoriOptions> {
  const fontSansData = await getRegularSans(requestUrl);

  return {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: [
      {
        name: "Inter",
        data: fontSansData,
        weight: 400,
        style: "normal",
      },
    ],
    ...partial,
  };
}

export async function composeAuthorOGImage(params: {
  name: string;
  requestUrl: string;
}) {
  const { name, requestUrl } = params;

  // Design the image and generate an SVG with "satori"
  const svg = await satori(
    <div
      style={{
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        background: "linear-gradient(to bottom left, #208368, #000)",
        color: "white",
        fontFamily: "Inter",
        fontSize: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        textAlign: "center",
        padding: 40,
      }}
    >
      {name}
    </div>,
    await getBaseOptions(requestUrl),
  );

  return new Resvg(svg).render().asPng();
}

export async function composePackageOGImage(params: {
  name: string;
  requestUrl: string;
}) {
  const { name, requestUrl } = params;

  // Design the image and generate an SVG with "satori"
  const svg = await satori(
    <div
      style={{
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        background: "linear-gradient(to bottom left, #5151cd, #000)",
        color: "white",
        fontFamily: "Inter",
        fontSize: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        textAlign: "center",
        padding: 40,
      }}
    >
      {name}
    </div>,
    await getBaseOptions(requestUrl),
  );

  return new Resvg(svg).render().asPng();
}

export async function composeNewsArticleOGImage(params: {
  headline: string;
  subline?: string;
  requestUrl: string;
}) {
  const { headline, subline, requestUrl } = params;

  // Design the image and generate an SVG with "satori"
  const svg = await satori(
    <div
      style={{
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        background: "linear-gradient(to top left, #953ea3, #2f265f,#000 )",
        color: "white",
        fontFamily: "Inter",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        textAlign: "center",
        padding: 40,
      }}
    >
      <span style={{ fontSize: 80 }}>{headline}</span>
      {subline ? (
        <span style={{ fontSize: 60, opacity: 80 }}>{subline}</span>
      ) : null}
    </div>,
    await getBaseOptions(requestUrl),
  );

  return new Resvg(svg).render().asPng();
}
