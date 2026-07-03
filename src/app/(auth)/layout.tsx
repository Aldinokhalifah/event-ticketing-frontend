export default function LayoutAuth({children,}: Readonly<{children: React.ReactNode;}>) 
{
    return(
        <div className="bg-slate-950 flex min-h-screen items-center justify-center">
            {children}
        </div>
    );
}