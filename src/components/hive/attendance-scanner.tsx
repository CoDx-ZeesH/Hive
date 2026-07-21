"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CheckCircle, XCircle, Scan } from "lucide-react";
import { markAttendanceAction } from "@/actions/events";

interface AttendanceScannerProps {
  eventId: string;
  eventTitle: string;
}

type ScanResult =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "success"; name: string; token: string }
  | { status: "error"; message: string };

/**
 * AttendanceScanner — Client Component.
 * Uses the BarcodeDetector Web API (Chrome 83+, Edge 83+) to scan QR codes
 * from a video stream. Falls back to a manual-entry input on unsupported browsers.
 */
export function AttendanceScanner({ eventId, eventTitle }: AttendanceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [result, setResult] = useState<ScanResult>({ status: "idle" });
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [manualToken, setManualToken] = useState("");
  const [scannedTokens] = useState<Set<string>>(new Set());
  const [attendanceLog, setAttendanceLog] = useState<
    Array<{ name: string; time: string }>
  >([]);
  const scanningRef = useRef(false);

  useEffect(() => {
    setIsSupported("BarcodeDetector" in window);
  }, []);

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const handleScanResult = useCallback(
    async (token: string) => {
      if (scannedTokens.has(token)) return; // dedupe
      scannedTokens.add(token);
      setResult({ status: "scanning" });

      const res = await markAttendanceAction(eventId, token);
      if (res.success) {
        const timeStr = new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
        setResult({ status: "success", name: res.memberName!, token });
        setAttendanceLog((prev) => [
          { name: res.memberName!, time: timeStr },
          ...prev.slice(0, 49),
        ]);
        setTimeout(() => setResult({ status: "idle" }), 2500);
      } else {
        setResult({ status: "error", message: res.message });
        setTimeout(() => setResult({ status: "idle" }), 3000);
      }
    },
    [eventId, scannedTokens]
  );

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setResult({ status: "idle" });
      scanningRef.current = true;

      // BarcodeDetector scan loop
      const detector = new (window as unknown as {
        BarcodeDetector: new (opts: { formats: string[] }) => {
          detect: (img: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
        };
      }).BarcodeDetector({ formats: ["qr_code"] });

      const scan = async () => {
        if (!scanningRef.current || !videoRef.current) return;
        if (videoRef.current.readyState >= 2) {
          try {
            const codes = await detector.detect(videoRef.current);
            for (const code of codes) {
              if (code.rawValue) {
                await handleScanResult(code.rawValue);
              }
            }
          } catch {
            /* ignore individual frame errors */
          }
        }
        if (scanningRef.current) requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    } catch (err) {
      setResult({
        status: "error",
        message: "Camera access denied. Please allow camera permissions.",
      });
    }
  }, [handleScanResult]);

  const handleManualSubmit = async () => {
    if (!manualToken.trim()) return;
    await handleScanResult(manualToken.trim());
    setManualToken("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div
        className="rounded-2xl p-4 border flex items-center gap-3"
        style={{ background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
      >
        <Scan size={20} style={{ color: "var(--hive-primary)" }} />
        <div>
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-primary)" }}
          >
            ATTENDANCE_SCANNER
          </p>
          <p className="text-xs" style={{ color: "var(--hive-text)" }}>
            {eventTitle}
          </p>
        </div>
        <div
          className="ml-auto text-right"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--hive-primary)" }}>
            {attendanceLog.length}
          </p>
          <p className="text-[10px] uppercase" style={{ color: "var(--hive-muted)" }}>
            CHECKED_IN
          </p>
        </div>
      </div>

      {/* Scan result status */}
      {result.status !== "idle" && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold"
          style={{
            background:
              result.status === "success"
                ? "#f0fdf4"
                : result.status === "error"
                ? "#fef2f2"
                : "var(--hive-primary-light)",
            borderColor:
              result.status === "success"
                ? "#86efac"
                : result.status === "error"
                ? "#fecaca"
                : "var(--hive-primary-light)",
            color:
              result.status === "success"
                ? "var(--hive-success)"
                : result.status === "error"
                ? "#dc2626"
                : "var(--hive-primary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {result.status === "success" && <CheckCircle size={18} />}
          {result.status === "error" && <XCircle size={18} />}
          {result.status === "scanning" && (
            <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
          )}
          <span>
            {result.status === "success" && `✓ ${result.name} MARKED_PRESENT`}
            {result.status === "error" && result.message}
            {result.status === "scanning" && "VERIFYING..."}
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera / scanner area */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            CAMERA_SCAN
          </h3>
          <div
            className="relative rounded-2xl overflow-hidden border aspect-square flex items-center justify-center"
            style={{ background: "#0f172a", borderColor: "var(--hive-border)" }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {!streamRef.current && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Camera size={32} className="text-white opacity-40" />
                <p
                  className="text-xs text-white opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  CAMERA_OFF
                </p>
              </div>
            )}
            {/* Scan overlay corners */}
            {streamRef.current && (
              <div className="absolute inset-6 pointer-events-none">
                <div className="w-full h-full border-2 border-white/30 rounded-xl" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={startCamera}
              disabled={!isSupported || !!streamRef.current}
              className="hive-btn flex-1 py-3 text-sm text-white flex items-center justify-center gap-2"
              style={{
                background: "var(--hive-primary)",
                opacity: !isSupported || streamRef.current ? 0.5 : 1,
                cursor: !isSupported || streamRef.current ? "not-allowed" : "pointer",
              }}
            >
              <Camera size={15} />
              {isSupported === false ? "NOT_SUPPORTED" : "START_SCAN"}
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="hive-btn px-4 py-3 text-sm"
              style={{
                background: "var(--hive-surface)",
                color: "var(--hive-muted)",
                border: "1px solid var(--hive-border)",
              }}
            >
              STOP
            </button>
          </div>
        </div>

        {/* Manual entry + log */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              MANUAL_ENTRY
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                placeholder="userId:eventId"
                className="hive-input flex-1 px-3 py-2.5 text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "var(--hive-text)" }}
              />
              <button
                type="button"
                onClick={handleManualSubmit}
                className="hive-btn px-4 py-2.5 text-xs text-white"
                style={{ background: "var(--hive-primary)" }}
              >
                MARK
              </button>
            </div>
          </div>

          {/* Attendance log */}
          <div className="flex flex-col gap-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              ATTENDANCE_LOG
            </h3>
            <div
              className="hive-card p-0 overflow-hidden"
              style={{ maxHeight: "260px", overflowY: "auto" }}
            >
              {attendanceLog.length === 0 ? (
                <div className="p-4 text-center">
                  <p
                    className="text-xs"
                    style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    NO_SCANS_YET
                  </p>
                </div>
              ) : (
                attendanceLog.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0"
                    style={{ borderColor: "var(--hive-border)" }}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        size={14}
                        style={{ color: "var(--hive-success)" }}
                      />
                      <span className="text-xs font-semibold" style={{ color: "var(--hive-text)" }}>
                        {entry.name}
                      </span>
                    </div>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      {entry.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
