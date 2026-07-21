export interface QrScannerProps {
    onScan: (result: string) => void  // dipanggil saat QR terbaca
    onClose: () => void               // untuk tombol tutup scanner
}