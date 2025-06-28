import { anton } from "@/app/fonts";
import CheckmarkIcon from "../../../public/checkmark-icon";
import Link from "next/link";

export default function Success({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="fixed inset-0 bg-[url('../../public/success-bg.png')] bg-center bg-cover bg-no-repeat">
      <div className="bg-[url('../../public/bg-eclipse.png')] absolute bottom-0 right-0 bg-center bg-cover bg-no-repeat size-[796px] rotate-180" />

      <div className="size-full flex items-center justify-center relative p-[5%]">
        <div className="flex flex-col justify-center items-center gap-8 md:gap-[40px] max-w-[480px]">
          <CheckmarkIcon />

          <div className="space-y-[60px] w-full">
            <div className="flex items-center justify-center flex-col gap-6">
              <h5
                className={`${anton.className} text-xl md:text-[27px] leading-[150%] tracking-[2px] text-center w-full`}
              >
                {title}
              </h5>

              <p className="text-sm md:text-base leading-6 w-full text-center tracking-[1px] font-normal">
                {description}
              </p>
            </div>

            <Link href={"/login"}>
              <button
                className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
                title="success"
                // type="submit"
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
