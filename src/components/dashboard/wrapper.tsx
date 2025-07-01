import React from "react";
import Navbar from "./nav";
import Sidebar from "./sidebar";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="size-full px-10 flex flex-col items-center">
      <div className="flex flex-col gap-6 items-center max-w-[1440px] w-full">
        <Navbar />
        <main className="flex gap-5 w-full">
          <Sidebar />
          {children}
        </main>
      </div>
    </div>
  );
}
