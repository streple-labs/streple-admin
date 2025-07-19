"use client";

import { anton, dmSans } from "@/app/fonts";
import { TextEditorProvider } from "@/components/editor/context";
import TextEditor from "@/components/editor/text-editor";
import ToolPanel from "@/components/editor/tool-panel";
import Loader from "@/components/loader";
import api from "@/utils/axios";
import { fileToBase64, formatFileSize } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa6";
import { GoFilter, GoX } from "react-icons/go";
import { GrUpload } from "react-icons/gr";
import { IoImageOutline, IoSearch } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { RxText } from "react-icons/rx";
import { toast } from "sonner";

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

const initialState = {
  title: "",
  description: "",
  level: null,
  thumbnail: null,
  document: null,
  content: null,
  status: null,
  type: null,
};

export default function Page() {
  const router = useRouter();

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

  const [courseDetails, setCourseDetails] =
    useState<FileCourseDetails>(initialState);

  const [fillCouseDetails, setFillCourseDetails] = useState(false);

  const { mutate: handleUploadCourse, isPending: isUploadingCourse } =
    useMutation({
      mutationKey: ["upload-course"],
      mutationFn: async () => {
        const payload = { ...courseDetails };

        if (courseDetails.thumbnail)
          payload.thumbnail = await fileToBase64(
            courseDetails.thumbnail as File
          );

        if (courseDetails.document)
          payload.document = await fileToBase64(courseDetails.document as File);

        return await api.post("/learning", payload);
      },
      onSuccess: (res) => {
        router.refresh();
        toast.success(res.data.message || "Course uploaded successfully!");
        setCourseDetails(initialState);
        setFillCourseDetails(false);
        setOpenUploadModal(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        let errorMessage = "Signup failed. Please try again later.";

        if (error?.response?.data?.message) {
          if (Array.isArray(error.response.data.message))
            errorMessage = error.response.data.message.join(", ");
          else errorMessage = error.response.data.message;
        } else if (error?.userMessage) errorMessage = error.userMessage;
        else if (error?.message) errorMessage = error.message;

        toast.error(errorMessage);
      },
    });

  return (
    <>
      <div className="px-6 py-8 rounded-[20px] flex flex-col gap-6 w-full bg-[#211F22] overflow-y-auto hide-scrollbar">
        {courseDetails.type === "article" ? (
          <TextEditorProvider>
            <ToolPanel
              close={() => {
                setCourseDetails((prev) => ({
                  ...prev,
                  type: null,
                  content: null,
                }));
                setFillCourseDetails(false);
              }}
              setText={(content: string) => {
                setCourseDetails((prev) => ({
                  ...prev,
                  type: "article",
                  content,
                }));
                setOpenUploadModal(true);
                setFillCourseDetails(true);
              }}
            />
            <TextEditor />
          </TextEditorProvider>
        ) : (
          <>
            <h4
              className={`${anton.className} text-base font-normal leading-4 tracking-normal`}
            >
              Courses view
            </h4>
            <div className="flex w-full items-center justify-between gap-8">
              <div className="flex items-center gap-6 w-full">
                <div className="flex w-full max-w-[400px]">
                  <div className="w-full relative">
                    <input
                      name="search"
                      title="search for courses"
                      type="text"
                      placeholder="search for courses"
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
            <div className="overflow-x-auto hide-scrollbar">
              <table className="min-w-full text-left text-xs font-normal text-white">
                <thead>
                  <tr className="[&>th]:text-xs [&>th]:font-normal [&>th]:py-3 [&>th]:px-4 [&>th]:text-nowrap">
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
                      } [&>td]:text-xs [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:text-nowrap`}
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
                      <td className="relative">
                        <span
                          className={`px-2 py-1 h-6 w-fit flex items-center justify-center cursor-pointer rounded-[14px] group ${
                            course.status === "Published"
                              ? "bg-[#F4E90ECC] text-[#313127CC]"
                              : "bg-[#807C8B] text-[#141315]"
                          }`}
                        >
                          {course.status}

                          <span className="z-10 hidden group-hover:flex flex-col gap-3 absolute top-8 left-0 w-40 rounded-[20px] border border-white/5 px-3 py-4 bg-[#252326]">
                            <p
                              onClick={() => {}}
                              className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                                dmSans.className
                              } cursor-pointer ${
                                false
                                  ? "bg-[#A082F9] text-[#2b2b37]"
                                  : "hover:bg-white/5 text-white/60"
                              }`}
                            >
                              Published
                            </p>
                            <p
                              onClick={() => {}}
                              className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                                dmSans.className
                              } cursor-pointer ${
                                false
                                  ? "bg-[#A082F9] text-[#2b2b37]"
                                  : "hover:bg-white/5 text-white/60"
                              }`}
                            >
                              Draft
                            </p>
                          </span>
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
          </>
        )}
      </div>

      {openUploadModal && (
        <UploadCourseModal
          toggleModal={toggleUploadModal}
          courseDetails={courseDetails}
          setCourseDetails={setCourseDetails}
          fillCourseDetails={fillCouseDetails}
          setFillCourseDetails={setFillCourseDetails}
          handleUploadCourse={handleUploadCourse}
          isUploadingCourse={isUploadingCourse}
        />
      )}
    </>
  );
}

const UploadCourseModal = ({
  toggleModal,
  courseDetails,
  setCourseDetails,
  fillCourseDetails,
  setFillCourseDetails,
  handleUploadCourse,
  isUploadingCourse,
}: {
  toggleModal: () => void;
  courseDetails: FileCourseDetails;
  setCourseDetails: Dispatch<SetStateAction<FileCourseDetails>>;
  fillCourseDetails: boolean;
  setFillCourseDetails: Dispatch<SetStateAction<boolean>>;
  handleUploadCourse: () => void;
  isUploadingCourse: boolean;
}) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      toast.success(`selected file: ${file.name}`);
      setCourseDetails((prev) => ({
        ...prev,
        document: file,
        type: file.type.includes("pdf") ? "pdf" : null,
      }));
    } else {
      toast.error("No file selected");
      setCourseDetails((prev) => ({ ...prev, document: null, type: null }));
    }
  };

  const reset = () => {
    setCourseDetails(initialState);
    setFillCourseDetails(false);
    toggleModal();
  };

  const [showTrackOptions, setShowTrackOptions] = useState(false);
  const toggleTrackOptions = () => {
    setShowTrackOptions((prev) => !prev);
  };

  if (fillCourseDetails)
    return (
      <div className="fixed inset-0 flex p-[5%] justify-center items-center">
        <div className="absolute inset-0 bg-black/70" onClick={reset} />

        <form
          className="bg-[#242324] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[20px] p-8 space-y-10 relative"
          onSubmit={(e) => {
            e.preventDefault();
            handleUploadCourse();
          }}
        >
          <span
            className="absolute top-8 left-8 cursor-pointer"
            onClick={() => setFillCourseDetails(false)}
          >
            <FaArrowLeft />
          </span>

          <h4
            className={`${anton.className} text-base w-full text-center font-normal leading-[150%] tracking-[2px]`}
          >
            Add course details
          </h4>

          <div className="flex flex-col gap-4 w-full">
            <label htmlFor="title" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Course title
              </p>
              <input
                name="title"
                readOnly={isUploadingCourse}
                required
                value={courseDetails.title}
                onChange={(e) =>
                  setCourseDetails((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                title="Add course title"
                type="text"
                placeholder="Add course title"
                className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>

            <label htmlFor="description" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Course description
              </p>
              <textarea
                name="description"
                readOnly={isUploadingCourse}
                value={courseDetails.description}
                onChange={(e) =>
                  setCourseDetails((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                title="Add course description"
                placeholder="Add course description"
                className={`h-[120px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
              />
            </label>
            <div className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Learning track
              </p>
              <div
                title="Select learning track"
                className={`h-[55px] cursor-pointer w-full text-base text-white/50 font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] bg-white/5 flex items-center justify-between relative`}
                onClick={() => {
                  if (isUploadingCourse) return;
                  toggleTrackOptions();
                }}
              >
                <p>
                  {courseDetails.level
                    ? courseDetails.level
                    : "Select learning track"}
                </p>
                <FaChevronDown className="w-4 stroke-white/50" />
                {showTrackOptions && (
                  <div className="absolute top-16 left-0 w-full rounded-[20px] border border-white/5 px-3 py-4 flex flex-col gap-3 bg-[#252326]">
                    <p
                      onClick={() => {
                        setCourseDetails((prev) => ({
                          ...prev,
                          level: "Beginner",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal ${
                        dmSans.className
                      } cursor-pointer ${
                        courseDetails.level === "Beginner"
                          ? "bg-[#A082F9] text-[#2b2b37]"
                          : "hover:bg-white/5 text-white/60"
                      }`}
                    >
                      Beginner
                    </p>
                    <p
                      onClick={() => {
                        setCourseDetails((prev) => ({
                          ...prev,
                          track: "Advanced",
                        }));
                      }}
                      className={`p-2 rounded-[10px] h-12 w-full flex items-center text-sm font-normal ${
                        dmSans.className
                      } cursor-pointer ${
                        courseDetails.level === "Advanced"
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

            <label htmlFor="thumbnail" className="space-y-3">
              <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
                Cover Image
              </p>
              {courseDetails.thumbnail ? (
                <div className="relative w-full h-[120px] rounded-[10px] overflow-hidden cursor-pointer active:scale-95 active:opacity-25">
                  <Image
                    src={URL.createObjectURL(courseDetails.thumbnail as File)}
                    alt="cover image"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-[120px] flex items-center justify-center flex-col gap-4 border-dashed border border-white/30 p-3 rounded-[10px] cursor-pointer active:scale-95 active:opacity-25">
                  <IoImageOutline size={24} color="#FFFFFF80" />
                  <p className="text-base leading-6 tracking-[1px] font-normal">
                    Drag and drop or browse
                  </p>
                </div>
              )}
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                readOnly={isUploadingCourse}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    setCourseDetails((prev) => ({
                      ...prev,
                      thumbnail: file,
                    }));
                    toast.success(`selected cover image: ${file.name}`);
                  } else toast.error("No cover image selected");
                }}
                className="hidden"
              />
            </label>

            <label className="flex items-center gap-6 text-white/80">
              <p
                onClick={() => {
                  if (isUploadingCourse) return;
                  setCourseDetails((prev) => ({
                    ...prev,
                    status: "Published",
                  }));
                }}
                className="flex gap-3 items-center text-base leading-6 tracking-[1px] cursor-pointer"
              >
                <span
                  className={`size-4 rounded-full ${
                    courseDetails.status === "Published"
                      ? "bg-[#B39FF0]"
                      : "border border-white/50"
                  }`}
                />
                Published
              </p>
              <p
                onClick={() => {
                  if (isUploadingCourse) return;
                  setCourseDetails((prev) => ({
                    ...prev,
                    status: "Draft",
                  }));
                }}
                className="flex gap-3 items-center text-base leading-6 tracking-[1px] cursor-pointer"
              >
                <span
                  className={`size-4 rounded-full ${
                    courseDetails.status === "Draft"
                      ? "bg-[#B39FF0]"
                      : "border border-white/50"
                  }`}
                />
                Draft
              </p>
            </label>
          </div>

          <div className="flex items-center justify-end w-full">
            <button
              disabled={isUploadingCourse}
              type="submit"
              title="upload course"
              className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 h-[50px] w-[188px] text-sm leading-[150%] tracking-[2px] font-bold text-[#2C2C26]"
            >
              {isUploadingCourse ? <Loader /> : "Upload"}
            </button>
          </div>
        </form>
      </div>
    );

  if (courseDetails.type === "pdf" && courseDetails.document)
    return (
      <div className="fixed inset-0 p-[10%] flex justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={reset} />

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
                    {(courseDetails.document as File).name}
                  </p>
                  <p className="text-xs leading-4 tracking-[1px] font-normal">
                    {formatFileSize((courseDetails.document as File).size)}
                  </p>
                </div>
              </div>
              <span
                className="cursor-pointer"
                onClick={() => {
                  setCourseDetails((prev) => ({
                    ...prev,
                    document: null,
                    type: null,
                  }));
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

              <button
                onClick={() => setFillCourseDetails(true)}
                className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 h-10 w-[126px] text-xs leading-[150%] tracking-[2px] font-bold text-[#2C2C26]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 p-[10%] flex justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={reset} />

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
            onClick={() => {
              setCourseDetails((prev) => ({ ...prev, type: "article" }));
              toggleModal();
            }}
            className="size-full flex items-center justify-center flex-col gap-4 border-dashed border border-white/30 p-3 rounded-[10px] cursor-pointer active:scale-95 active:opacity-25"
          >
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
