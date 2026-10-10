import { ImageResponse } from "next/og";
import { portfolioCopy, portfolioData } from "@/data/portfolio";

export const runtime = "edge";
export const alt = `${portfolioData.personal.name} | ${portfolioData.personal.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#f3f1e9",
        color: "#24261f",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "45px 100px 40px 55px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
        }}
      >
        <span>{portfolioData.personal.name}</span>
        <span style={{ color: "#656b5d", fontSize: 15 }}>
          {portfolioCopy.hero.discipline}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 105,
          letterSpacing: "-6px",
          lineHeight: 0.95,
          fontWeight: 500,
        }}
      >
        {portfolioCopy.hero.lines.map((line, index) => (
          <div key={line} style={{ display: "flex" }}>
            {line}
            {index === portfolioCopy.hero.lines.length - 1 && (
              <span style={{ color: "#53682d" }}>.</span>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #d8dacf",
          paddingTop: 22,
          color: "#656b5d",
          fontSize: 15,
        }}
      >
        <span>{portfolioData.personal.email}</span>
        <span>{portfolioCopy.hero.availability}</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 55,
          borderLeft: "1px solid #d8dacf",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "20px 0",
        }}
      >
        {[0, 25, 50, 75, 100].map((value) => (
          <div
            key={value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              color: "#656b5d",
              fontSize: 9,
            }}
          >
            <span>{value}</span>
            <span style={{ height: 1, width: 12, background: "#bdc1b3" }} />
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
