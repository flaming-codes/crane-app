// ./app/utils/createOGImage.server.tsx

import { Resvg } from "@resvg/resvg-js";
import { CSSProperties, ReactNode } from "react";
import type { SatoriOptions } from "satori";
import satori from "satori";
import { SyneLogo } from "./svg";
import { randomInt } from "es-toolkit";

const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_WIDTH = 1200;

const OG_DEFAULT_GRADIENTS = [
  "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
  "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)",
  "linear-gradient(-20deg, #ddd6f3 0%, #faaca8 50%, #faaca8 100%)",
  "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 50%, #c2e9fb 100%)",
  "linear-gradient(120deg, #84fab0 0%, #8fd3f4 50%, #8fd3f4 100%)",
  "linear-gradient(45deg, #93a5cf 0%, #e4efe9 50%, #e4efe9 100%)",
  "linear-gradient(to top, #c1dfc4 0%, #deecdd 50%, #deecdd 100%)",
  "linear-gradient(to top, #dbdcd7 0%, #dddcd7 24%, #e2c9cc 30%, #e7627d 46%, #b8235a 59%, #801357 71%, #3d1635 84%, #1c1a27 100%)",
  "linear-gradient(to top, #a8edea 0%, #fed6e3 50%, #fed6e3 100%)",
  "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 50%, #a6c1ee 100%)",
  "linear-gradient(to right, #ffecd2 0%, #fcb69f 50%, #fcb69f 100%)",
  "linear-gradient(to right, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
  "linear-gradient(to right, #f6d365 0%, #fda085 50%, #fda085 100%)",
  "linear-gradient(to right, #a1c4fd 0%, #c2e9fb 50%, #c2e9fb 100%)",
  "linear-gradient(to right, #84fab0 0%, #8fd3f4 50%, #8fd3f4 100%)",
  "linear-gradient(to right, #cfd9df 0%, #e2ebf0 50%, #e2ebf0 100%)",
  "linear-gradient(to right, #e0c3fc 0%, #8ec5fc 50%, #8ec5fc 100%)",
  "linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #00f2fe 100%)",
  "linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)",
  "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
  "linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)",
  "linear-gradient(to top, #feada6 0%, #f5efef 100%)",
  "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)",
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
];

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

export async function composeIndexOGImage(params: { requestUrl: string }) {
  const { requestUrl } = params;

  const backgroundImage =
    OG_DEFAULT_GRADIENTS[randomInt(0, OG_DEFAULT_GRADIENTS.length)];

  const svg = await satori(
    <div
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        height: "100%",
        width: "100%",
        paddingTop: 40,
        backgroundImage,
      }}
    >
      <SyneLogo style={{ transform: "scale(1.5)" }} />
      <p style={{ fontSize: 50, color: "#000" }}>
        The R Packages & Authors Search Engine
      </p>
    </div>,
    await getBaseOptions(requestUrl),
  );

  return new Resvg(svg).render().asPng();
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
