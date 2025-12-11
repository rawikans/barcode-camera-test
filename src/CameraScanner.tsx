/** @format */

import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";

type Props = {
  onScan: (value: string) => void;
};

export default function CameraScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | undefined>(undefined);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current || !readerRef.current) return;

    try {
      setError(null);
      const controls = await readerRef.current.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
        if (result) {
          onScan(result.getText());
        }
        if (error) {
          console.error("Scan error:", error);
        }
      });
      controlsRef.current = controls;
      setIsScanning(true);
    } catch (err) {
      console.error("Error starting camera:", err);
      setError("ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึงกล้อง");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
    setError(null);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 16 }}>
        {!isScanning ? (
          <button
            onClick={startScanning}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
            เริ่มสแกน
          </button>
        ) : (
          <button
            onClick={stopScanning}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
            หยุดสแกน
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
            marginBottom: 16,
          }}>
          {error}
        </div>
      )}

      <video
        ref={videoRef}
        style={{
          width: "100%",
          borderRadius: "8px",
          display: isScanning ? "block" : "none",
        }}
      />
    </div>
  );
}
