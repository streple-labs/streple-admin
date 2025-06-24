import Signup from "@/components/auth/signup";
import Image from "next/image";
import Link from "next/link";
import { anton } from "../fonts";

export default function page() {
  return (
    <main className="flex w-full h-screen hero-section-bg">
      <div className="hidden md:block md:w-1/2 relative px-[5.76%] py-[120px] h-screen">
        <div className="bg-[url('../../public/bg-eclipse.png')] absolute top-0 -left-0 bg-center bg-cover bg-no-repeat size-[796px]" />
        <div className="flex justify-between flex-col relative size-full">
          <Link href="">
            <Image
              src="/streple-logo.png"
              alt="streple logo"
              width={112}
              height={34}
            />
          </Link>

          <div className="space-y-4">
            <h2
              className={`font-normal leading-[150%] tracking-[2%] text-2xl xs:text-[27px] sm:text-3xl md:text-5xl lg:text-[52px] text-gradient-copy-top-traders ${anton.className} max-w-x`}
            >
              Learn, Grow and Earn
            </h2>
            <p className="text-sm md:text-base font-normal leading-6 tracking-[1px] max-w-[470px]">
              No need to &quot;know the market.&quot; Streple simplifies
              everything
            </p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 md:h-screen flex items-center justify-center px-[5.76%] py-[120px] overflow-y-auto bg-[#1B191C]">
        <Signup />
      </div>
    </main>
  );
}
