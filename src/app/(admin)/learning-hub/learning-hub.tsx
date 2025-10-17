"use client";

import { anton, dmSans } from "@/app/fonts";
import { TextEditorProvider } from "@/components/editor/context";
import TextEditor from "@/components/editor/text-editor";
import ToolPanel from "@/components/editor/tool-panel";
import UploadCourseModal from "@/components/modals/upload-course";
import Loader from "@/components/ui/loader";
import Search from "@/components/ui/search";
import api from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GoFilter, GoX } from "react-icons/go";
import { GrUpload } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { toast } from "sonner";

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

export default function LearningHub() {
  const params = useSearchParams();

  const queryClient = useQueryClient();

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const toggleFilterOptions = () => {
    setShowFilterOptions((prev) => !prev);
  };

  const [level, setLevel] = useState<null | "Beginner" | "Advanced">(null);
  const handleTrackChange = (newTrack: "Beginner" | "Advanced") => {
    if (level === newTrack) setLevel(null);
    else setLevel(newTrack);
  };

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const toggleUploadModal = () => {
    setOpenUploadModal((prev) => !prev);
  };

  const [courseDetails, setCourseDetails] =
    useState<FileCourseDetails>(initialState);

  const [fillCouseDetails, setFillCourseDetails] = useState(false);

  const { data: courses, isPending: isCoursesLoading } =
    useQuery<LearningResponse>({
      queryKey: ["courses-data", params.get("query"), level],
      queryFn: async () =>
        (
          await api.get("/learnings", {
            params: {
              ...(params.get("query") ? { title: params.get("query") } : {}),
              ...(level ? { level } : {}),
            },
          })
        ).data,
    });

  const [editCourse, setEditCourse] = useState(false);
  const { mutate: handleEditCourse, isPending: isEditingCourse } = useMutation({
    mutationKey: ["edit-course"],
    mutationFn: async (courseid: string) => {
      const formData = new FormData();
      for (const key in courseDetails) {
        const value = courseDetails[key as keyof typeof courseDetails];
        if (value !== null && value !== undefined) formData.append(key, value);
      }

      return await api.patch(`/learning/${courseid}`, formData);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["courses-data", params.get("query"), level],
      });
      toast.success(res.data.message || "Course updated successfully!");
      setOpenUploadModal(false);
      setEditCourse(false);
      setCourseDetails(initialState);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Course update failed. Please try again later.";

      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message))
          errorMessage = error.response.data.message.join(", ");
        else errorMessage = error.response.data.message;
      } else if (error?.userMessage) errorMessage = error.userMessage;
      else if (error?.message) errorMessage = error.message;

      toast.error(errorMessage);
      setOpenUploadModal(false);
      setEditCourse(false);
      setCourseDetails(initialState);
    },
  });

  const { mutate: handleUploadCourse, isPending: isUploadingCourse } =
    useMutation({
      mutationKey: ["upload-course"],
      mutationFn: async () => {
        const formData = new FormData();
        for (const key in courseDetails) {
          const value = courseDetails[key as keyof typeof courseDetails];
          if (value !== null && value !== undefined)
            formData.append(key, value);
        }

        return api.post("/learning", formData);
      },
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ["courses-data", params.get("query"), level],
        });
        toast.success(res.data.message || "Course uploaded successfully!");
        setCourseDetails(initialState);
        setFillCourseDetails(false);
        setOpenUploadModal(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        let errorMessage = "Course upload failed. Please try again later.";

        if (error?.response?.data?.message) {
          if (Array.isArray(error.response.data.message))
            errorMessage = error.response.data.message.join(", ");
          else errorMessage = error.response.data.message;
        } else if (error?.userMessage) errorMessage = error.userMessage;
        else if (error?.message) errorMessage = error.message;

        toast.error(errorMessage);
      },
    });

  const { mutate: handleDeleteCourse } = useMutation({
    mutationKey: ["delete-course"],
    mutationFn: async (id: string) => await api.delete(`/learning/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses-data", params.get("query"), level],
      });
      toast.success("Course deleted successfully!");
      setCourseDetails(initialState);
      setFillCourseDetails(false);
      setOpenUploadModal(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Course update failed. Please try again later.";

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
        {courseDetails.type === "article" && !editCourse && !isEditingCourse ? (
          <TextEditorProvider>
            <ToolPanel
              title={courseDetails.title}
              setTitle={(title: string) => {
                setCourseDetails((prev) => ({
                  ...prev,
                  title,
                }));
              }}
              close={() => {
                setCourseDetails(initialState);
                setFillCourseDetails(false);
              }}
              saveAsDraft={(content: string) => {
                setCourseDetails((prev) => ({
                  ...prev,
                  status: "Draft",
                  type: "article",
                  content,
                }));
                setOpenUploadModal(true);
                setFillCourseDetails(true);
              }}
              handlePublish={(content: string) => {
                setCourseDetails((prev) => ({
                  ...prev,
                  type: "article",
                  status: "Published",
                  content,
                }));
                setOpenUploadModal(true);
                setFillCourseDetails(true);
              }}
              isEditing={editCourse && courseDetails.type === "article"}
              content={courseDetails.content || ""}
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
                <div className="w-full max-w-[400px]">
                  <Search placeholder="search for courses" />
                </div>

                <div className="relative">
                  {level ? (
                    <button
                      className="border-2 border-[#F4E90E4D] rounded-[15px] h-[50px] py-1 px-2 flex items-center justify-center gap-2 text-white/70 text-sm leading-[100%] font-normal"
                      onClick={() => handleTrackChange(level)}
                    >
                      <GoX className="stroke-white/70" size={16} /> {level}
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
                          level === "Beginner"
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
                          level === "Advanced"
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

            {isCoursesLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <Loader />
              </div>
            ) : courses?.data.length === 0 ? (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-white/50 text-sm font-normal">
                  No courses found. Create your first course!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto hide-scrollbar h-full">
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
                    {courses?.data.map((course, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 ? "" : "bg-white/[2%]"
                        } [&>td]:text-xs [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:text-nowrap`}
                      >
                        <td className=" max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {course.title}
                        </td>
                        <td>{course.level}</td>
                        <td>
                          {new Date(course.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            {/* <span
                              className={`rotate-45 size-2.5 ${
                                course.completion >= 70
                                  ? "bg-[#1C7E0F]"
                                  : course.completion >= 40
                                  ? "bg-[#6F760D]"
                                  : "bg-[#C83232]"
                              }`}
                            />
                            <span className="text-xs">
                              {course.completion}%
                            </span> */}
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
                                onClick={() => {
                                  setCourseDetails({
                                    title: course.title,
                                    description: course.description,
                                    level: course.level,
                                    thumbnail: course.thumbnail,
                                    document: course.document,
                                    content: course.content,
                                    type: course.type,
                                    status: "Published",
                                  });
                                  handleEditCourse(course.id);
                                  setEditCourse(true);
                                }}
                                className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                                  dmSans.className
                                } cursor-pointer ${
                                  course.status === "Published"
                                    ? "bg-[#A082F9] text-[#2b2b37]"
                                    : "hover:bg-white/5 text-white/60"
                                }`}
                              >
                                Published
                              </p>
                              <p
                                onClick={() => {
                                  setCourseDetails({
                                    title: course.title,
                                    description: course.description,
                                    level: course.level,
                                    thumbnail: course.thumbnail,
                                    document: course.document,
                                    content: course.content,
                                    type: course.type,
                                    status: "Draft",
                                  });
                                  handleEditCourse(course.id);
                                  setEditCourse(true);
                                }}
                                className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                                  dmSans.className
                                } cursor-pointer ${
                                  course.status === "Draft"
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
                            <button
                              onClick={() => {
                                setCourseDetails({
                                  id: course.id,
                                  title: course.title,
                                  description: course.description,
                                  level: course.level,
                                  thumbnail: course.thumbnail,
                                  document: course.document,
                                  content: course.content,
                                  status: course.status,
                                  type: course.type,
                                });
                                setFillCourseDetails(true);
                                setEditCourse(true);
                                toggleUploadModal();
                              }}
                            >
                              <PiPencilSimpleLineBold size={15} />
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteCourse(course.id);
                              }}
                            >
                              <MdDeleteOutline size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <UploadCourseModal
        isOpen={openUploadModal}
        toggleModal={toggleUploadModal}
        courseDetails={courseDetails}
        setCourseDetails={setCourseDetails}
        fillCourseDetails={fillCouseDetails}
        setFillCourseDetails={setFillCourseDetails}
        handleUploadCourse={handleUploadCourse}
        isLoading={isEditingCourse || isUploadingCourse}
        isEditingCourse={editCourse}
        handleEditCourse={(courseid: string) => {
          handleEditCourse(courseid);
          setEditCourse(false);
          toggleUploadModal();
        }}
      />
    </>
  );
}
