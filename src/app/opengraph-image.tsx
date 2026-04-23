import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rrezon Curraj | Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              border: "2px solid #22c55e",
              color: "#22c55e",
              fontFamily: "monospace",
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "8px 16px",
              background: "#1e293b",
            }}
          >
            // Frontend Developer
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              fontSize: "120px",
              fontWeight: 900,
              color: "#f8fafc",
              letterSpacing: "-4px",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            RREZON
          </div>
          <div
            style={{
              fontSize: "120px",
              fontWeight: 900,
              color: "#22c55e",
              letterSpacing: "-4px",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            CURRAJ
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              color: "rgba(248,250,252,0.5)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            React · Next.js · TypeScript · Tailwind
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#22c55e",
              letterSpacing: "0.1em",
            }}
          >
            rrezon.dev
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
