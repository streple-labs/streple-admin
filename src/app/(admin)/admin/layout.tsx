import DashboardWrapper from "@/components/dashboard/wrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
