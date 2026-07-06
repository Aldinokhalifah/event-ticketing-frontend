import type { Metadata } from "next";
import EventPageClient from "./eventClient";

export const metadata: Metadata = {
    title: "Events",
    description: "Halaman untuk melihat events yang sedang berlangsung",
};

export default function EventPage() {
    return(
        <EventPageClient />
    )
}