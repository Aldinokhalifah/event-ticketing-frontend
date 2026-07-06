import { Metadata } from "next";
import LaporanPageAdminClient from "./LaporanClient";

export const metadata: Metadata = {
    title: "Admin Laporan Events",
    description: "Halaman admin untuk melihat laporan dari semua events",
};

export default function LaporanPageAdmin() {
    return(
        <LaporanPageAdminClient />
    )
}