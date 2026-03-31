import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <AppSidebar />
      <main className="flex-1 md:ml-60 min-w-0 bg-[#f8faf9]">
        {children}
      </main>
    </div>
  );
}
