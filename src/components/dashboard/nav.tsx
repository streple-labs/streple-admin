import Image from "next/image";
import Link from "next/link";
import { GoBell } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa6";

export default function Navbar() {
  return (
    <header className="py-4 w-full h-[85px] flex items-center justify-center">
      <div className="flex items-center justify-between max-w-[1440px] w-full">
        <Link href="">
          <Image
            src="/streple-logo.png"
            alt="streple logo"
            width={112}
            height={33}
          />
        </Link>

        <div className="flex w-full max-w-[593px]">
          <div className="w-full relative">
            <input
              name="search"
              title="search for traders"
              type="text"
              placeholder="search for traders"
              className={`h-[50px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-xs placeholder:text-white/70 outline-0 ring-0 caret-[#B39FF0] bg-[#242324]`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
              <IoSearch size={20} color="#FFFFFF99" />
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="rounded-[10px] flex items-center justify-center bg-[#242324] cursor-pointer h-[50px] w-[45px]">
            <GoBell size={12} color="#FFFFFFB2" />
          </div>

          <div className="flex gap-2 items-center cursor-pointer">
            <Image
              src={"/test-png.jpg"}
              alt="test image"
              width={40}
              height={40}
              className="rounded-full object-cover object-center"
            />
            <FaChevronDown color="#FFFFFF99" width={12} />
          </div>
        </div>
      </div>
    </header>
  );
}
