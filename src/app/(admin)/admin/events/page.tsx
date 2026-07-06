import { Metadata } from "next";
import EventPageAdminClient from "./EventClient";

export const metadata: Metadata= {
    title: "Admin Events",
    description: "Halaman admin untuk melihat events yang sedang berlangsung",
};

export default function EventPageAdmin() {
    return(
        <EventPageAdminClient />
    )
}