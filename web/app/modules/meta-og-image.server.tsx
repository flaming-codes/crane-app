// ./app/utils/createOGImage.server.tsx

import { Resvg } from "@resvg/resvg-js";
import { CSSProperties, ReactNode } from "react";
import type { SatoriOptions } from "satori";
import satori from "satori";
import { SyneLogo } from "./svg";
import { McpIcon } from "./mcp-icon";
import { gradients } from "./gradients.server";
import { randomInt } from "es-toolkit";

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

export async function composeIndexOGImage(params: {
  requestUrl: string;
  packageCount?: string;
  authorCount?: string;
  version?: string;
}) {
  const {
    requestUrl,
    packageCount = "22,266",
    authorCount = "34,363",
    version = "3.0.0",
  } = params;

  const gradient = gradients[randomInt(0, gradients.length)];

  const svg = await satori(
    <div
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "#000",
        color: "white",
        fontFamily: "Inter",
      }}
    >
      {/* Background Gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80%",
          background: gradient,
          opacity: 0.5,
        }}
      />
      {/* Gradient Overlay for dark bottom */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          backgroundImage: "linear-gradient(to bottom, transparent, #000 80%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          zIndex: 10,
        }}
      >
        <SyneLogo style={{ width: 600, color: "white" }} />
        <p
          style={{
            fontSize: 32,
            color: "#d1d5db", // gray-300
            marginTop: 40,
            textAlign: "center",
          }}
        >
          Search for {packageCount} R packages and {authorCount} authors hosted
          on CRAN
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 80,
            fontSize: 22,
            color: "#9ca3af", // gray-400
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            Click on the
            <span style={{ color: "white", marginLeft: 6 }}>
              top search bar
            </span>
            <span style={{ marginLeft: 6 }}>to start searching</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            Or press
            <span style={{ color: "white", marginLeft: 6 }}>⌘ + K</span>
            <span style={{ marginLeft: 6 }}>to open search from anywhere</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            Use the
            <McpIcon
              style={{
                width: 24,
                height: 24,
                marginLeft: 8,
                marginRight: 8,
                color: "white",
              }}
            />
            <span style={{ color: "white" }}>remote MCP-server</span>
            <span style={{ marginLeft: 6 }}>for agents</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 30,
          fontSize: 16,
          color: "#6b7280", // gray-500
        }}
      >
        <span>About</span>
        <span>MCP</span>
        <span>Privacy</span>
        <span>Statistics</span>
        <span>Newsroom</span>
        <span>Magazine</span>
        <span style={{ color: "#4b5563" }}>v{version}</span>
      </div>
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
