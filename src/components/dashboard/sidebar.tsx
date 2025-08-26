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
import { FaChevronDown } from "react-icons/fa6";

const routes: Record<
  ROLE,
  {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
    sub_routes?: {
      name: string;
      href: string;
    }[];
  }[]
> = {
  FOLLOWER: [],
  SUPER_ADMIN: [
    {
      name: "Users",
      icon: UsersIcon,
      href: "/users",
    },
    {
      name: "Manage Roles",
      icon: UsersIcon,
      href: "/manage-roles",
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
      sub_routes: [
        { name: "Overview", href: "/protraders" },
        { name: "Trader management", href: "/protraders/trader-management" },
        { name: "Profile", href: "/protraders/profile" },
      ],
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
      name: "Protraders",
      icon: ProtradersIcon,
      href: "/protraders",
      sub_routes: [
        { name: "Overview", href: "/protraders" },
        { name: "Trader management", href: "/protraders/trader-management" },
        { name: "Profile", href: "/protraders/profile" },
      ],
    },
  ],
  PUBLISHER: [
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
      sub_routes: [
        { name: "Overview", href: "/protraders" },
        { name: "Trader management", href: "/protraders/trader-management" },
        { name: "Profile", href: "/protraders/profile" },
      ],
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
  MARKETER: [
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
      name: "Email Center",
      icon: EmailIcon,
      href: "/email-center",
    },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();

  const { user } = useAuth();

  return (
    <aside className="hide-scrollbar flex shrink-0 py-8 px-6 w-full max-w-[249px] h-full overflow-y-auto rounded-[20px] bg-[#5A555C1A]">
      <nav className="flex flex-col gap-4 w-full">
        <Link
          href={"/"}
          title={"Overview"}
          aria-label={"Overview"}
          className={`flex rounded-[10px] h-[43px] p-3 gap-2.5 items-center ${
            pathname === "/"
              ? "text-[#2b2b37] bg-[#A082F9]"
              : "text-[#F8F5FF80]"
          }`}
        >
          <OverviewIcon
            className={`${
              pathname === "/" ? "fill-[#2B2B37]" : "fill-[#F8F5FF80]"
            }`}
          />
          <span className="text-sm/[19px] font-normal leading-[100%] tracking-normal">
            Overview
          </span>
        </Link>

        {user &&
          routes[user.role].map((item) => (
            <>
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                aria-label={item.name}
                className={`flex items-center cursor-pointer justify-between p-3 h-[43px] gap-4 rounded-[10px] ${
                  pathname === item.href && item.name !== "Protraders"
                    ? "bg-[#A082F9] text-[#2b2b37]"
                    : "text-[#F8F5FF80]"
                }`}
              >
                <div className="flex gap-2.5 items-center">
                  <item.icon
                    className={`${
                      pathname === item.href && item.name !== "Protraders"
                        ? "fill-[#2B2B37]"
                        : "fill-[#F8F5FF80]"
                    }`}
                  />
                  <span className="text-sm/[19px] font-normal leading-[100%] tracking-normal">
                    {item.name}
                  </span>
                </div>

                {item.sub_routes && (
                  <FaChevronDown
                    className={`${
                      pathname.startsWith("/protraders") && "rotate-180"
                    } fill-[#F8F5FF80] cursor-pointer`}
                    width={11}
                  />
                )}
              </Link>

              {pathname === item.href && item.sub_routes && (
                <div className="flex flex-col gap-4 w-full">
                  {item.sub_routes.map((sub_item) => (
                    <Link
                      key={sub_item.name}
                      href={sub_item.href}
                      title={sub_item.name}
                      aria-label={sub_item.name}
                      className={`flex items-center pl-[30px] ${
                        pathname === sub_item.href
                          ? "text-[#2b2b37] bg-[#A082F9] rounded-[10px] h-[36px]"
                          : "text-[#F8F5FF80]"
                      }`}
                    >
                      <span className="text-sm/[19px] font-normal leading-[100%] tracking-normal">
                        {sub_item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ))}

        <button
          className="flex rounded-[10px] h-[43px] p-3 gap-2.5 items-center"
          title="Logout"
          onClick={async () => {
            await clearToken();
          }}
        >
          <LogoutIcon />

          <span className="text-sm/[19px] font-normal leading-[100%] tracking-normal text-[#F8F5FF80]">
            Logout
          </span>
        </button>
      </nav>
    </aside>
  );
}
