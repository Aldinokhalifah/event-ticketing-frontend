import Sidebar from "../components/admin/ui/Sidebar";

export default function AdminLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}