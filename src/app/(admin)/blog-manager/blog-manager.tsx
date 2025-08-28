"use client";

import { anton, dmSans } from "@/app/fonts";
import { TextEditorProvider } from "@/components/editor/context";
import TextEditor from "@/components/editor/text-editor";
import ToolPanel from "@/components/editor/tool-panel";
import Loader from "@/components/ui/loader";
import FillBlogDetailsModal from "@/components/modals/upload-blog";
import Search from "@/components/ui/search";
import api from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { toast } from "sonner";

const initialState = {
  draft: false,
  schedule: false,
  title: "",
  tags: [],
  thumbnail: null,
  metatitle: "",
  description: "",
  content: "",
  status: null,
  scheduleDate: new Date(Date.now()),
};

export default function BlogManager() {
  const params = useSearchParams();

  const queryClient = useQueryClient();

  const [writeBlog, setWriteBlog] = useState(false);
  const toggle = () => {
    setWriteBlog((prev) => !prev);
  };

  const [blogData, setBlogData] = useState<BlogDataType>(initialState);

  const [openBlogDetailsModal, setOpenBlogDetailsModal] = useState(false);
  const toggleBlogDetailsModal = () => {
    setOpenBlogDetailsModal((prev) => !prev);
  };

  const { data: blogs, isPending: isBlogsLoading } = useQuery<BlogsResponse>({
    queryKey: ["blog-data", params.get("query")],
    queryFn: async () =>
      (
        await api.get("/blogs", {
          params: params.get("query") ? { search: params.get("query") } : {},
        })
      ).data,
  });

  const [editBlog, setEditBlog] = useState(false);
  const { mutate: handleEditBlog, isPending: isEditingBlog } = useMutation({
    mutationKey: ["edit-blog"],
    mutationFn: async (blogId: string) =>
      await api.patch(`/blog/${blogId}`, {
        ...blogData,
        draft: Boolean(blogData.status === "Draft"),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["blog-data", params.get("query")],
      });
      toast.success(res.data.message || "Blog updated successfully!");
      setBlogData(initialState);
      setWriteBlog(false);
      setOpenBlogDetailsModal(false);
      setEditBlog(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Blog update failed. Please try again later.";

      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message))
          errorMessage = error.response.data.message.join(", ");
        else errorMessage = error.response.data.message;
      } else if (error?.userMessage) errorMessage = error.userMessage;
      else if (error?.message) errorMessage = error.message;

      toast.error(errorMessage);
      setBlogData(initialState);
      setEditBlog(false);
      setWriteBlog(false);
    },
  });

  const { mutate: handleUploadBlog, isPending: isUploadingBlog } = useMutation({
    mutationKey: ["upload-blog"],
    mutationFn: async () => {
      const formData = new FormData();
      for (const key in blogData) {
        const value = blogData[key as keyof typeof blogData];
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
          continue;
        } else if (value !== null && value !== undefined) {
          if (value instanceof Date) formData.append(key, value.toISOString());
          else if (Array.isArray(value))
            value.forEach((item) => {
              formData.append(`${key}[]`, item);
            });
          else if (value instanceof File) formData.append(key, value);
          else formData.append(key, String(value));
        }
      }

      return api.post("/blog", formData);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["blog-data", params.get("query")],
      });
      toast.success(res.data.message || "Blog uploaded successfully!");
      setBlogData(initialState);
      setWriteBlog(false);
      setOpenBlogDetailsModal(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "blog upload failed. Please try again later.";

      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message))
          errorMessage = error.response.data.message.join(", ");
        else errorMessage = error.response.data.message;
      } else if (error?.userMessage) errorMessage = error.userMessage;
      else if (error?.message) errorMessage = error.message;

      toast.error(errorMessage);
    },
  });

  const { mutate: handleDeleteBlog } = useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: async (id: string) => await api.delete(`/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blog-data", params.get("query")],
      });
      toast.success("Blog deleted successfully!");
      setBlogData(initialState);
      setWriteBlog(false);
      setOpenBlogDetailsModal(false);
      setEditBlog(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Blog update failed. Please try again later.";

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
        {writeBlog ? (
          <TextEditorProvider>
            <ToolPanel
              title={blogData.title}
              setTitle={(title: string) => {
                setBlogData((prev) => ({ ...prev, title }));
              }}
              close={toggle}
              saveAsDraft={(content: string) => {
                setBlogData((prev) => ({
                  ...prev,
                  status: "Draft",
                  content,
                }));
                toggleBlogDetailsModal();
              }}
              handlePublish={(content: string) => {
                setBlogData((prev) => ({
                  ...prev,
                  status: "Published",
                  content,
                }));
                toggleBlogDetailsModal();
              }}
              isEditing={editBlog}
              content={blogData.content}
            />
            <TextEditor />
          </TextEditorProvider>
        ) : (
          <>
            <h4
              className={`${anton.className} text-base font-normal leading-4 tracking-normal`}
            >
              Blogs manager
            </h4>
            <div className="flex w-full items-center justify-between gap-8">
              <Search title="search for blogs" placeholder="search for blogs" />

              <div className="flex w-full items-center justify-end">
                <button
                  onClick={() => {
                    setBlogData(initialState);
                    setEditBlog(false);
                    toggle();
                  }}
                  className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
                >
                  <FaPlus size={12} color="#2B2B37" />
                  Create new
                </button>
              </div>
            </div>

            {isBlogsLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <Loader />
              </div>
            ) : blogs?.data.length === 0 ? (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-white/50 text-sm font-normal">
                  No blogs found. Start creating your first blog!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto h-full">
                <table className="min-w-full text-left text-xs font-normal text-white">
                  <thead>
                    <tr className="[&>th]:text-xs [&>th]:font-normal [&>th]:py-3 [&>th]:px-4 [&>th]:text-nowrap">
                      <th>Blog Title</th>
                      <th>Tags</th>
                      <th>Date Added</th>
                      <th>Author</th>
                      <th>Views</th>
                      <th>Status</th>
                      <th>Quick actions</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {blogs?.data.map((blog, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 ? "" : "bg-white/[2%]"
                        } [&>td]:text-xs [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:text-nowrap`}
                      >
                        <td className="max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {blog.title}
                        </td>
                        <td className="max-w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {blog.tags.join(", ")}
                        </td>
                        <td>
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>{blog.creatorId}</td>
                        <td>{blog.view}</td>
                        <td className="relative">
                          <span
                            className={`px-2 py-1 h-6 w-fit flex items-center justify-center cursor-pointer rounded-[14px] group ${
                              blog.status === "Published"
                                ? "bg-[#A082F9] text-[#313127CC]"
                                : blog.status === "Draft"
                                ? "bg-[#807C8B] text-[#141315]"
                                : "bg-[#F4E90ECC] text-[#171716CC]"
                            }`}
                          >
                            {blog.status}

                            <span className="z-10 hidden group-hover:flex flex-col items-center justify-center gap-3 absolute top-8 left-0 w-40 rounded-[20px] border border-white/5 px-3 py-4 bg-[#252326]">
                              <p
                                onClick={() => {
                                  setBlogData({
                                    title: blog.title,
                                    tags: blog.tags,
                                    thumbnail: blog.thumbnail,
                                    metatitle: blog.metatitle,
                                    description: blog.description,
                                    content: blog.content,
                                    scheduleDate: blog.scheduleDate,
                                    status: "Published",
                                  });
                                  handleEditBlog(blog.id);
                                }}
                                className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                                  dmSans.className
                                } cursor-pointer ${
                                  blog.status === "Published"
                                    ? "bg-[#A082F9] text-[#2b2b37]"
                                    : "hover:bg-white/5 text-white/60"
                                }`}
                              >
                                Published
                              </p>
                              <p
                                onClick={() => {
                                  setBlogData({
                                    title: blog.title,
                                    tags: blog.tags,
                                    thumbnail: blog.thumbnail,
                                    metatitle: blog.metatitle,
                                    description: blog.description,
                                    content: blog.content,
                                    scheduleDate: blog.scheduleDate,
                                    status: "Draft",
                                  });
                                  handleEditBlog(blog.id);
                                }}
                                className={`p-2 rounded-[10px] h-8 w-full flex items-center text-xs font-normal ${
                                  dmSans.className
                                } cursor-pointer ${
                                  blog.status === "Draft"
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
                                setBlogData({
                                  title: blog.title,
                                  tags: blog.tags,
                                  thumbnail: blog.thumbnail,
                                  metatitle: blog.metatitle,
                                  description: blog.description,
                                  content: blog.content,
                                  scheduleDate: blog.scheduleDate,
                                  status: blog.status,
                                  id: blog.id,
                                });
                                setEditBlog(true);
                                setWriteBlog(true);
                              }}
                            >
                              <PiPencilSimpleLineBold size={15} />
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteBlog(blog.id);
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

      <FillBlogDetailsModal
        isOpen={openBlogDetailsModal}
        toggleModal={toggleBlogDetailsModal}
        blogData={blogData}
        setBlogData={setBlogData}
        handleBlogUpload={handleUploadBlog}
        isLoading={isUploadingBlog || isEditingBlog}
        isEditingBlog={editBlog}
        handleEditBlog={(blogId: string) => {
          handleEditBlog(blogId);
          setEditBlog(false);
          toggleBlogDetailsModal();
        }}
      />
    </>
  );
}
