"use client";

import { anton, dmSans } from "@/app/fonts";
import { useState } from "react";
import { GoFilter, GoX } from "react-icons/go";
import { GrUpload } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { RxText } from "react-icons/rx";
import { toast } from "sonner";
import { FaRegFileAlt } from "react-icons/fa";
import { formatFileSize } from "@/utils/utils";

const dummy_courses = [
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
];

export default function Page() {
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const toggleFilterOptions = () => {
    setShowFilterOptions((prev) => !prev);
  };

  const [track, setTracks] = useState<null | "Beginner" | "Advanced">(null);
  const handleTrackChange = (newTrack: "Beginner" | "Advanced") => {
    if (track === newTrack) setTracks(null);
    else setTracks(newTrack);
  };

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const toggleUploadModal = () => {
    setOpenUploadModal((prev) => !prev);
  };

  return (
    <>
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

            <div className="relative">
              {track ? (
                <button
                  className="border-2 border-[#F4E90E4D] rounded-[15px] h-[50px] py-1 px-2 flex items-center justify-center gap-2 text-white/70 text-sm leading-[100%] font-normal"
                  onClick={() => handleTrackChange(track)}
                >
                  <GoX className="stroke-white/70" size={16} /> {track}
                </button>
              ) : (
                <button
                  className="border border-white/20 rounded-[15px] h-[50px] py-1 px-2 flex items-center justify-center gap-2 text-white/80 text-sm leading-[100%] font-normal"
                  onClick={toggleFilterOptions}
                >
                  <GoFilter className="stroke-white/80" /> Filter
                </button>
              )}
              {showFilterOptions && (
                <div className="absolute top-8 left-0 w-40 rounded-[20px] border border-white/5 px-3 py-4 flex flex-col gap-3 bg-[#252326]">
                  <p
                    onClick={() => {
                      handleTrackChange("Beginner");
                      toggleFilterOptions();
                    }}
                    className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                      dmSans.className
                    } cursor-pointer ${
                      track === "Beginner"
                        ? "bg-[#A082F9] text-[#2b2b37]"
                        : "hover:bg-white/5 text-white/60"
                    }`}
                  >
                    Beginner
                  </p>
                  <p
                    onClick={() => {
                      handleTrackChange("Advanced");
                      toggleFilterOptions();
                    }}
                    className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                      dmSans.className
                    } cursor-pointer ${
                      track === "Advanced"
                        ? "bg-[#A082F9] text-[#2b2b37]"
                        : "hover:bg-white/5 text-white/60"
                    }`}
                  >
                    Advanced
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              onClick={toggleUploadModal}
              className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
            >
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
              {(track
                ? dummy_courses.filter((course) => course.track === track)
                : dummy_courses
              ).map((course, idx) => (
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

      {openUploadModal && <UploadCourseModal toggleModal={toggleUploadModal} />}
    </>
  );
}

const UploadCourseModal = ({ toggleModal }: { toggleModal: () => void }) => {
  const [uploadFormat, setUploadFormat] = useState<"pdf" | "text" | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      toast.success(`selected file: ${file.name}`);
      setUploadFormat(file.type.includes("pdf") ? "pdf" : null);
    } else {
      toast.error("No file selected");
      setSelectedFile(null);
      setUploadFormat(null);
    }
  };

  if (uploadFormat === "pdf") {
    if (selectedFile)
      return (
        <div className="fixed inset-0 p-[10%] flex justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setSelectedFile(null);
              setUploadFormat(null);
              toggleModal();
            }}
          />

          <div className="bg-[#242324] w-full h-fit max-w-3xl rounded-[20px] p-8 flex flex-col gap-6 items-center justify-center relative">
            <h4
              className={`${anton.className} text-base font-normal leading-[150%] tracking-[2px]`}
            >
              Uploaded file
            </h4>

            <div className="flex flex-col gap-10 items-center w-full">
              <div className="w-full flex items-center justify-between h-[100px] rounded-[10px] border border-white/10 py-3 px-6">
                <div className="flex items-center gap-3">
                  <FaRegFileAlt size={16} className="stroke-white/70" />
                  <div className="space-y-1 text-white/70">
                    <p className="text-xs leading-4 tracking-[1px] font-normal">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs leading-4 tracking-[1px] font-normal">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadFormat(null);
                  }}
                >
                  <GoX className="stroke-white/50" size={16} />
                </span>
              </div>

              <div className="flex w-full items-center justify-between gap-8">
                <label
                  htmlFor="pdf-upload"
                  className="text-xs leading-[150%] tracking-[2px] font-bold text-[#DBD7E6] cursor-pointer"
                >
                  Edit
                  <input
                    type="file"
                    id="pdf-upload"
                    name="pdf-upload"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>

                <button className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 h-10 w-[126px] text-xs leading-[150%] tracking-[2px] font-bold text-[#2C2C26]">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 p-[10%] flex justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={toggleModal} />

      <div className="bg-[#242324] w-full h-fit max-w-3xl rounded-[20px] p-8 flex flex-col gap-6 items-center justify-center relative">
        <h4
          className={`${anton.className} text-base font-normal leading-[150%] tracking-[2px]`}
        >
          Choose upload format
        </h4>

        <div className="flex items-center gap-6 h-[126px] w-full">
          <label
            htmlFor="pdf-upload"
            className="size-full flex items-center justify-center flex-col gap-4 border-dashed border border-white/30 p-3 rounded-[10px] cursor-pointer active:scale-95 active:opacity-25"
          >
            <input
              type="file"
              id="pdf-upload"
              name="pdf-upload"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            <GrUpload size={24} color="#A79DC4" />
            <p className="text-xs leading-4 tracking-[1px] font-normal">
              Drag and drop or browse
            </p>
          </label>
          <label
            htmlFor="text-upload"
            className="size-full flex items-center justify-center flex-col gap-4 border-dashed border border-white/30 p-3 rounded-[10px] cursor-pointer active:scale-95 active:opacity-25"
          >
            <input
              type="file"
              id="text-upload"
              name="text-upload"
              accept="application/pdf"
              className="hidden"
            />
            <RxText size={24} color="#A79DC4" />
            <p className="text-xs leading-4 tracking-[1px] font-normal">
              Write with editor
            </p>
          </label>
        </div>
      </div>
    </div>
  );
};
