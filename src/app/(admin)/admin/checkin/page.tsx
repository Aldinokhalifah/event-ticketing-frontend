import { Metadata } from "next";
import CheckinPageAdminClient from "./CheckinClient";

export const metadata: Metadata = {
    title: "Admin Checkin Tiket",
    description: "Halaman admin untuk melihat status tiket yang sudah checkin",
};

export default function CheckinPageAdmin() {
    return(
        <CheckinPageAdminClient />
    )
}