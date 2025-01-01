// ./app/utils/createOGImage.server.tsx

import { Resvg } from "@resvg/resvg-js";
import { CSSProperties, ReactNode } from "react";
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

function OGImage({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        color: "white",
        fontFamily: "Inter",
        fontSize: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
        textAlign: "center",
        padding: 40,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CategoryPill({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        textTransform: "uppercase",
        border: "2px solid white",
        borderRadius: 9999,
        padding: "10px 20px",
        fontSize: 25,
      }}
    >
      {children}
    </div>
  );
}

export async function composeAuthorOGImage(params: {
  name: string;
  requestUrl: string;
}) {
  const { name, requestUrl } = params;

  // Design the image and generate an SVG with "satori"
  const svg = await satori(
    <OGImage
      style={{
        background: "linear-gradient(to bottom left, #208368, #000)",
      }}
    >
      {name}
      <CategoryPill>CRAN Author</CategoryPill>
    </OGImage>,
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
    <OGImage
      style={{
        background: "linear-gradient(to bottom left, #5151cd, #000)",
      }}
    >
      {name}
      <CategoryPill>CRAN Package</CategoryPill>
    </OGImage>,
    await getBaseOptions(requestUrl),
  );

  return new Resvg(svg).render().asPng();
}

export async function composePressArticleOGImage(params: {
  headline: string;
  subline?: string;
  requestUrl: string;
  articleType: string;
}) {
  const { headline, subline, requestUrl, articleType } = params;

  // Design the image and generate an SVG with "satori"
  const svg = await satori(
    <OGImage
      style={{
        background:
          articleType === "news"
            ? "linear-gradient(to top left, #953ea3, #2f265f,#000 )"
            : "linear-gradient(to bottom left, #000, #090979, #00d4ff)",
      }}
    >
      <span style={{ fontSize: 80 }}>{headline}</span>
      {subline ? (
        <span style={{ fontSize: 50, color: "#b7b7b7" }}>{subline}</span>
      ) : null}
      <CategoryPill>CRAN/E {articleType}</CategoryPill>
    </OGImage>,
    await getBaseOptions(requestUrl),
  );

  return new Resvg(svg).render().asPng();
}
