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
import { useAuth } from "@/context/auth-context";
import { clearToken } from "@/utils/queries";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes: Record<
  ROLE,
  {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
  }[]
> = {
  FOLLOWER: [
    {
      name: "Overview",
      icon: OverviewIcon,
      href: "/",
    },
  ],
  SUPER_ADMIN: [
    {
      name: "Overview",
      icon: OverviewIcon,
      href: "/",
    },
    {
      name: "Users",
      icon: UsersIcon,
      href: "/users",
    },
    {
      name: "Learning hub",
      icon: LearningHubIcon,
      href: "/learning-hub",
    },
    {
      name: "Blog manager",
      icon: BlogManagerIcon,
      href: "/blog-manager",
    },
    {
      name: "Protraders",
      icon: ProtradersIcon,
      href: "/protraders",
    },
    {
      name: "Trading simulator",
      icon: TradingSimulatorIcon,
      href: "/trading-simulator",
    },
    {
      name: "Email Center",
      icon: EmailIcon,
      href: "/email-center",
    },
    {
      name: "Feedback page",
      icon: FeedbackIcon,
      href: "/feedback-page",
    },
    {
      name: "Analytics",
      icon: AnalyticsIcon,
      href: "/analytics",
    },
  ],
  PRO_TRADER: [
    {
      name: "Overview",
      icon: OverviewIcon,
      href: "/",
    },
    {
      name: "Protraders",
      icon: ProtradersIcon,
      href: "/protraders",
    },
  ],
  PUBLISHER: [
    {
      name: "Overview",
      icon: OverviewIcon,
      href: "/",
    },
    {
      name: "Learning hub",
      icon: LearningHubIcon,
      href: "/learning-hub",
    },
    {
      name: "Blog manager",
      icon: BlogManagerIcon,
      href: "/blog-manager",
    },
  ],
  ADMIN: [
    {
      name: "Overview",
      icon: OverviewIcon,
      href: "/",
    },
    {
      name: "Users",
      icon: UsersIcon,
      href: "/users",
    },
    {
      name: "Learning hub",
      icon: LearningHubIcon,
      href: "/learning-hub",
    },
    {
      name: "Blog manager",
      icon: BlogManagerIcon,
      href: "/blog-manager",
    },
    {
      name: "Protraders",
      icon: ProtradersIcon,
      href: "/protraders",
    },
    {
      name: "Trading simulator",
      icon: TradingSimulatorIcon,
      href: "/trading-simulator",
    },
    {
      name: "Email Center",
      icon: EmailIcon,
      href: "/email-center",
    },
    {
      name: "Feedback page",
      icon: FeedbackIcon,
      href: "/feedback-page",
    },
    {
      name: "Analytics",
      icon: AnalyticsIcon,
      href: "/analytics",
    },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();

  const { user } = useAuth();

  return (
    <aside className="hide-scrollbar flex shrink-0 py-8 px-6 w-full max-w-[249px] h-full overflow-y-auto rounded-[20px] bg-[#5A555C1A]">
      <nav className="flex flex-col gap-4 w-full">
        {user &&
          routes[user.role].map((item) => (
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
          onClick={async () => {
            await clearToken();
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
