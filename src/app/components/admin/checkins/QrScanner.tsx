'use client'

import { QrScannerProps } from "@/types/QrScannerProps"
import { useEffect, useRef } from "react"

export default function QrScanner({ onScan, onClose }: QrScannerProps) {
    const scannerRef = useRef<any>(null)
    // Ref tambahan untuk memastikan inisialisasi cuma berjalan 1 kali
    const initializingRef = useRef<boolean>(false)

    useEffect(() => {
        let html5QrCode: any

        // Kalau sudah diinisialisasi atau sedang proses inisialisasi, jangan lanjut
        if (initializingRef.current || (scannerRef.current && scannerRef.current.isScanning)) {
            return;
        }

        initializingRef.current = true; // Tandai sedang inisialisasi

        // Dynamic import html5-qrcode
        import('html5-qrcode').then(({ Html5Qrcode }) => {
            // Sebelum bikin instance baru, hapus content di div
            // Ini untuk memastikan tidak ada sisa elemen dari render sebelumnya
            const container = document.getElementById("qr-reader");
            if (container) container.innerHTML = "";

            html5QrCode = new Html5Qrcode("qr-reader")
            scannerRef.current = html5QrCode

            const config = {
                fps: 15,
                qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                    const minEdge = Math.min(viewfinderWidth, viewfinderHeight)
                    const qrboxSize = Math.floor(minEdge * 0.7)
                    return { width: qrboxSize, height: qrboxSize }
                },
                aspectRatio: 1.0,
            }

            // Jalankan kamera
            html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText: string) => {
                    // Cek isScanning sebelum stop untuk menghindari error
                    if (scannerRef.current && scannerRef.current.isScanning) {
                        scannerRef.current.stop()
                            .then(() => {
                                initializingRef.current = false; // Reset flag
                                onScan(decodedText)
                            })
                            .catch(() => {
                                initializingRef.current = false; // Reset flag
                                onScan(decodedText)
                            })
                    }
                },
                () => {
                    // Abaikan error per-frame
                }
            ).then(() => {
                // Berhasil start, reset flag inisialisasi
                initializingRef.current = false;
            }).catch((err: any) => {
                console.error("Gagal membuka kamera:", err)
                initializingRef.current = false; // Reset flag walau gagal
                // Jika container corrupted, clear lagi
                if (container) container.innerHTML = "";
            })
        })

        return () => {
            // Cleanup saat komponen unmount
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {})
            }
        }
    }, [onScan]) // Dependensi onScan saja cukup

    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-2">
            <div id="qr-reader" className="w-full overflow-hidden rounded-xl" />
            <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
                Tutup Kamera
            </button>
        </div>
    )
}