import { anton } from "@/app/fonts";
import { GoFilter } from "react-icons/go";
import { GrUpload } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { PiPencilSimpleLineBold } from "react-icons/pi";

export default function page() {
  return (
    <div className="px-6 py-8 rounded-[20px] flex flex-col gap-6 w-full bg-[#211F22]">
      <h1
        className={`${anton.className} text-base font-normal leading-4 tracking-normal`}
      >
        Courses view
      </h1>
      <div className="flex w-full items-center justify-between gap-8">
        <div className="flex items-center gap-6 w-full">
          <div className="flex w-full max-w-[400px]">
            <div className="w-full relative">
              <input
                name="search"
                title="search for traders"
                type="text"
                placeholder="search for traders"
                className={`h-[50px] w-full text-base font-normal py-5 px-4 rounded-[15px] border border-white/10 gap-4 leading-4 tracking-normal placeholder:text-xs placeholder:text-white/60 outline-0 ring-0 caret-[#B39FF0]`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                <IoSearch size={20} color="#FFFFFF99" />
              </span>
            </div>
          </div>

          <button className="border border-white/20 rounded-[15px] h-[50px] py-1 px-2 flex items-center justify-center gap-2 text-white/80 text-sm leading-[100%] font-normal">
            <GoFilter className="stroke-white/80" /> Filter
          </button>
        </div>
        <div className="flex w-full items-center justify-end">
          <button className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]">
            <GrUpload size={10} color="#2B2B37" />
            Upload course
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs font-normal text-white">
          <thead>
            <tr className="[&>th]:text-xs [&>th]:font-normal [&>th]:py-3 [&>th]:px-4">
              <th>Course Title</th>
              <th>Track</th>
              <th>Date Added</th>
              <th>Completion Rate</th>
              <th>Status</th>
              <th>Quick actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                title: "Intro to Trading",
                track: "Beginner",
                date: "01 May 2024",
                completion: 80,
                status: "Published",
              },
              {
                title: "Advanced Chart Analysis",
                track: "Advanced",
                date: "15 Apr 2024",
                completion: 45,
                status: "Draft",
              },
              {
                title: "Risk Management Basics",
                track: "Beginner",
                date: "20 Mar 2024",
                completion: 20,
                status: "Published",
              },
              {
                title: "Options Strategies",
                track: "Advanced",
                date: "12 May 2025",
                completion: 60,
                status: "Published",
              },
              {
                title: "Technical Indicators 101",
                track: "Beginner",
                date: "05 Feb 2025",
                completion: 35,
                status: "Draft",
              },
              {
                title: "Market Psychology",
                track: "Beginner",
                date: "17 Sep 2024",
                completion: 100,
                status: "Published",
              },
            ].map((course, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 ? "" : "bg-white/[2%]"
                } [&>td]:text-xs [&>td]:font-normal [&>td]:py-3 [&>td]:px-4`}
              >
                <td className=" max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {course.title}
                </td>
                <td>{course.track}</td>
                <td>{course.date}</td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`rotate-45 size-2.5 ${
                        course.completion >= 70
                          ? "bg-[#1C7E0F]"
                          : course.completion >= 40
                          ? "bg-[#6F760D]"
                          : "bg-[#C83232]"
                      }`}
                    />
                    <span className="text-xs">{course.completion}%</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`px-2 py-1 h-6 w-fit flex items-center justify-center rounded-[14px] ${
                      course.status === "Published"
                        ? "bg-[#7A5FCA33]"
                        : "bg-[#66646C33]"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-4 items-center">
                    <button className="">
                      <PiPencilSimpleLineBold size={15} />
                    </button>
                    <button className="">
                      <MdDeleteOutline size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
