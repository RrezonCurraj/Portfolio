import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 800,
          fontSize: 100,
          color: "#ffffff",
          letterSpacing: "-4px",
          borderRadius: 36,
        }}
      >
        RC<span style={{ color: "#ccff00" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
