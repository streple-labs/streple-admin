import Navbar from "@/components/dashboard/nav";
import Sidebar from "@/components/dashboard/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="size-full px-10 flex flex-col items-center">
      <div className="flex flex-col gap-6 items-center max-w-[1440px] w-full">
        <Navbar />
        <main className="flex gap-5 w-full pb-4 [height:calc(100vh-85px-32px)]">
          <Sidebar />
          {children}
        </main>
      </div>
    </div>
  );
}
