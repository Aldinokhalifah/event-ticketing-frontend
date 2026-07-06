import Navbar from "../components/public/Navbar";

export default function PublicLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return(
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <main>{children}</main>
        </div>
    )
}