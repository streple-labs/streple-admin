"use client";

import AnalyticsIcon from "@/assets/analytics-icon";
import BlogManagerIcon from "@/assets/blog-mamager-icon";
import EmailIcon from "@/assets/email-icon";
import FeedbackIcon from "@/assets/feedback-icon";
import LearningHubIcon from "@/assets/learning-hub-icon";
import LogoutIcon from "@/assets/logout-icon";
import OverviewIcon from "@/assets/overview-icon";
import ProtradersIcon from "@/assets/protraders-icon";
import TradingSimulatorIcon from "@/assets/trading-simulator-icon";
import UsersIcon from "@/assets/users-icon";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav_items = [
  {
    name: "Overview",
    icon: OverviewIcon,
    href: "/admin",
  },
  {
    name: "Users",
    icon: UsersIcon,
    href: "/admin/users",
  },
  {
    name: "Learning hub",
    icon: LearningHubIcon,
    href: "/admin/learning-hub",
  },
  {
    name: "Blog manager",
    icon: BlogManagerIcon,
    href: "/admin/blog-manager",
  },
  {
    name: "Protraders",
    icon: ProtradersIcon,
    href: "/admin/protraders",
  },
  {
    name: "Trading simulator",
    icon: TradingSimulatorIcon,
    href: "/admin/trading-simulator",
  },
  {
    name: "Email Center",
    icon: EmailIcon,
    href: "/admin/email-center",
  },
  {
    name: "Feedback page",
    icon: FeedbackIcon,
    href: "/admin/feedback-page",
  },
  {
    name: "Analytics",
    icon: AnalyticsIcon,
    href: "/admin/analytics",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex py-8 px-6 w-full max-w-[249px] rounded-[20px] bg-[#5A555C1A]">
      <nav className="flex flex-col gap-4 w-full">
        {nav_items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            title={item.name}
            aria-label={item.name}
            className={`flex rounded-[10px] h-[43px] p-3 gap-3 items-center ${
              pathname === item.href
                ? "text-[#2b2b37] bg-[#A082F9]"
                : "text-[#F8F5FF80]"
            }`}
          >
            <item.icon
              className={`${
                pathname === item.href ? "fill-[#2B2B37]" : "fill-[#F8F5FF80]"
              }`}
            />
            <span className="text-sm font-normal leading-[100%] tracking-normal">
              {item.name}
            </span>
          </Link>
        ))}

        <button
          className="flex rounded-[10px] h-[43px] p-3 gap-3 items-center"
          title="Logout"
          onClick={() => {
            deleteCookie("streple_auth_token");
            router.push("/login");
          }}
        >
          <LogoutIcon />

          <span className="text-sm font-normal leading-[100%] tracking-normal text-[#F8F5FF80]">
            Logout
          </span>
        </button>
      </nav>
    </aside>
  );
}
