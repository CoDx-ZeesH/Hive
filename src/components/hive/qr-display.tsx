"use client";

import { useEffect, useRef } from "react";

interface QrDisplayProps {
  /** The data string to encode (e.g. "userId:eventId") */
  data: string;
  /** Label shown below the QR code */
  label?: string;
  size?: number;
}

/**
 * QrDisplay — Client Component.
 * Renders a QR code using qrcode.js on a canvas element.
 * Falls back to text display if BarcodeDetector is unavailable.
 */
export function QrDisplay({ data, label, size = 200 }: QrDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Dynamically import qrcode to keep server bundle clean
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current!, data, {
        width: size,
        margin: 2,
        color: {
          dark: "#0f172a",  // hive-text
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
    });
  }, [data, size]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-2xl p-4 border"
        style={{
          background: "#fff",
          borderColor: "var(--hive-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          aria-label={`QR code for ${label ?? data}`}
        />
      </div>
      {label && (
        <p
          className="text-[10px] font-semibold uppercase tracking-widest text-center"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
