import { anton, dmSans } from "@/app/fonts";
import Loader from "@/components/ui/loader";
import { compressImageToTargetSize, formatFileSize } from "@/utils/utils";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa6";
import { GoX } from "react-icons/go";
import { GrUpload } from "react-icons/gr";
import { IoImageOutline } from "react-icons/io5";
import { RxText } from "react-icons/rx";
import { toast } from "sonner";

export default function UploadCourseModal({
  isOpen,
  toggleModal,
  courseDetails,
  setCourseDetails,
  fillCourseDetails,
  setFillCourseDetails,
  handleUploadCourse,
  isLoading,
  isEditingCourse,
  handleEditCourse,
}: {
  isOpen: boolean;
  toggleModal: () => void;
  courseDetails: FileCourseDetails;
  setCourseDetails: Dispatch<SetStateAction<FileCourseDetails>>;
  fillCourseDetails: boolean;
  setFillCourseDetails: Dispatch<SetStateAction<boolean>>;
  handleUploadCourse: () => void;
  isLoading: boolean;
  isEditingCourse: boolean;
  handleEditCourse: (courseid: string) => void;
}) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`selected file: ${file.name}`);
      setCourseDetails((prev) => ({
        ...prev,
        document: file,
        type: file.type.includes("pdf") ? "pdf" : null,
        content: null,
      }));
    } else {
      toast.error("No file selected");
      setCourseDetails((prev) => ({
        ...prev,
        document: null,
        type: null,
        content: null,
      }));
    }
  };

  const reset = () => {
    setCourseDetails({
      title: "",
      description: "",
      level: null,
      thumbnail: null,
      document: null,
      content: null,
      status: null,
      type: null,
    });
    setFillCourseDetails(false);
    toggleModal();
  };

  const [showTrackOptions, setShowTrackOptions] = useState(false);
  const toggleTrackOptions = () => {
    setShowTrackOptions((prev) => !prev);
  };

  if (!isOpen) return null;

  if (fillCourseDetails)
    return (
      <div className="fixed inset-0 flex p-[5%] justify-center items-center">
        <div className="absolute inset-0 bg-black/70" onClick={reset} />

        <form
          className="bg-[#242324] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[20px] p-8 space-y-10 relative"
          onSubmit={(e) => {
            e.preventDefault();

            if (!courseDetails.level) {
              toast.error("Please select a learning track");
              return;
            }

            if (isEditingCourse) handleEditCourse(courseDetails.id!);
            else handleUploadCourse();
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
                readOnly={isLoading}
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
                readOnly={isLoading}
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
                  if (isLoading) return;
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
                  <div className="absolute z-10 top-16 left-0 w-full rounded-[20px] border border-white/5 px-3 py-4 flex flex-col gap-3 bg-[#252326]">
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
                          level: "Advanced",
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
                    src={
                      typeof courseDetails.thumbnail === "string"
                        ? courseDetails.thumbnail
                        : URL.createObjectURL(courseDetails.thumbnail)
                    }
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
                readOnly={isLoading}
                onChange={async (e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    const thumbnail = await compressImageToTargetSize(
                      file,
                      295
                    );

                    setCourseDetails((prev) => ({
                      ...prev,
                      thumbnail,
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
                  if (isLoading) return;
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
                  if (isLoading) return;
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
              disabled={isLoading}
              type="submit"
              title="upload course"
              className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 h-[50px] w-[188px] text-sm leading-[150%] tracking-[2px] font-bold text-[#2C2C26]"
            >
              {isLoading ? (
                <Loader />
              ) : isEditingCourse ? (
                "Edit Course"
              ) : (
                "Upload"
              )}
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
              setCourseDetails((prev) => ({
                ...prev,
                type: "article",
                document: null,
              }));
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
}
