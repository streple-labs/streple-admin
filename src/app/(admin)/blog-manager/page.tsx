"use client";

import { anton, dmSans } from "@/app/fonts";
import { TextEditorProvider } from "@/components/editor/context";
import TextEditor from "@/components/editor/text-editor";
import ToolPanel from "@/components/editor/tool-panel";
import Loader from "@/components/loader";
import api from "@/utils/axios";
import { fileToBase64 } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
import { IoImageOutline, IoSearch } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { toast } from "sonner";

const dummy_blogs = [
  {
    title: "Intro to Trading",
    track: "Beginner",
    date: "01 May 2024",
    author: "Jane Doe",
    views: 1200,
    status: "Published",
  },
  {
    title: "Advanced Chart Analysis",
    track: "Advanced",
    date: "15 Apr 2024",
    author: "John Smith",
    views: 850,
    status: "Draft",
  },
  {
    title: "Risk Management Basics",
    track: "Beginner",
    date: "20 Mar 2024",
    author: "Alice Johnson",
    views: 430,
    status: "Sheduled",
  },
  {
    title: "Options Strategies",
    track: "Advanced",
    date: "12 May 2025",
    author: "Bob Lee",
    views: 670,
    status: "Published",
  },
  {
    title: "Technical Indicators 101",
    track: "Beginner",
    date: "05 Feb 2025",
    author: "Emily Clark",
    views: 390,
    status: "Draft",
  },
  {
    title: "Market Psychology",
    track: "Beginner",
    date: "17 Sep 2024",
    author: "David Kim",
    views: 2100,
    status: "Published",
  },
];

const initialState = {
  title: "",
  tags: [],
  thumbnail: null,
  metatitle: "",
  description: "",
  content: "",
  status: null,
};

export default function Page() {
  const router = useRouter();

  const [writeBlog, setWriteBlog] = useState(false);
  const toggle = () => {
    setWriteBlog((prev) => !prev);
  };

  const [blogData, setBlogData] = useState<BlogDataType>(initialState);

  const [openBlogDetailsModal, setOpenBlogDetailsModal] = useState(false);
  const toggleBlogDetailsModal = () => {
    setOpenBlogDetailsModal((prev) => !prev);
  };

  const { mutate: handleUploadBlog, isPending: isUploadingBlog } = useMutation({
    mutationKey: ["upload-blog"],
    mutationFn: async () =>
      await api.post("/blog-manager", {
        ...blogData,
        thumbnail: await fileToBase64(blogData.thumbnail as File),
        draft: Boolean(blogData.status === "draft"),
      }),
    onSuccess: (res) => {
      router.refresh();
      toast.success(res.data.message || "Course uploaded successfully!");
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

  return (
    <div className="px-6 py-8 rounded-[20px] flex flex-col gap-6 w-full bg-[#211F22] overflow-y-auto hide-scrollbar">
      {writeBlog ? (
        <TextEditorProvider>
          <ToolPanel
            close={toggle}
            saveAsDraft={(content: string) => {
              setBlogData((prev) => ({
                ...prev,
                status: "draft",
                content,
              }));
              toggleBlogDetailsModal();
            }}
            handlePublish={(content: string) => {
              setBlogData((prev) => ({
                ...prev,
                status: "published",
                content,
              }));
              toggleBlogDetailsModal();
            }}
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
            <div className="flex w-full max-w-[400px]">
              <div className="w-full relative">
                <input
                  name="search"
                  title="search for blogs"
                  type="text"
                  placeholder="search for blogs"
                  className={`h-[50px] w-full text-base font-normal py-5 px-4 rounded-[15px] border border-white/10 gap-4 leading-4 tracking-normal placeholder:text-xs placeholder:text-white/60 outline-0 ring-0 caret-[#B39FF0]`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                  <IoSearch size={20} color="#FFFFFF99" />
                </span>
              </div>
            </div>

            <div className="flex w-full items-center justify-end">
              <button
                onClick={toggle}
                className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
              >
                <FaPlus size={12} color="#2B2B37" />
                Create new
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs font-normal text-white">
              <thead>
                <tr className="[&>th]:text-xs [&>th]:font-normal [&>th]:py-3 [&>th]:px-4 [&>th]:text-nowrap">
                  <th>Course Title</th>
                  <th>Track</th>
                  <th>Date Added</th>
                  <th>Author</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Quick actions</th>
                </tr>
              </thead>
              <tbody>
                {dummy_blogs.map((course, idx) => (
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
                    <td>{course.author}</td>
                    <td>{course.views}</td>
                    <td className="relative">
                      <span
                        className={`px-2 py-1 h-6 w-fit flex items-center justify-center cursor-pointer rounded-[14px] group ${
                          course.status === "Published"
                            ? "bg-[#A082F9] text-[#313127CC]"
                            : course.status === "Draft"
                            ? "bg-[#807C8B] text-[#141315]"
                            : "bg-[#F4E90ECC] text-[#171716CC]"
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

      {openBlogDetailsModal && (
        <FillBlogDetailsModal
          toggleModal={toggleBlogDetailsModal}
          blogData={blogData}
          setBlogData={setBlogData}
          handleBlogUpload={handleUploadBlog}
          isUploadingBlog={isUploadingBlog}
        />
      )}
    </div>
  );
}

const tag_options = [
  "Bitcoin",
  "Ethereum",
  "Altcoins",
  "DeFi",
  "NFTs",
  "Blockchain",
  "Technical Analysis",
  "Fundamental Analysis",
  "Trading Strategies",
  "Market News",
  "Crypto Regulations",
  "Risk Management",
  "Portfolio Management",
  "Web3",
  "Metaverse",
  "Crypto Security",
  "Tokenomics",
  "ICO",
  "Trading Psychology",
  "On-chain Analysis",
  "Yield Farming",
  "Staking",
  "Crypto Wallets",
  "Exchanges",
  "Futures & Derivatives",
  "Scalping",
  "Swing Trading",
  "Day Trading",
  "HODL",
  "Airdrops",
  "Crypto Taxes",
];

const FillBlogDetailsModal = ({
  toggleModal,
  blogData,
  setBlogData,
  handleBlogUpload,
  isUploadingBlog,
}: {
  toggleModal: () => void;
  blogData: BlogDataType;
  setBlogData: Dispatch<SetStateAction<BlogDataType>>;
  handleBlogUpload: () => void;
  isUploadingBlog: boolean;
}) => {
  const [searchTag, setSearchTag] = useState("");

  return (
    <div className="fixed inset-0 flex p-[5%] justify-center items-center">
      <div className="absolute inset-0 bg-black/70" onClick={toggleModal} />

      <form
        className="bg-[#242324] w-full max-w-3xl overflow-y-auto max-h-[90vh] rounded-[20px] p-8  space-y-10 relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleBlogUpload();
        }}
      >
        <span
          className="absolute top-8 left-8 cursor-pointer"
          onClick={toggleModal}
        >
          <FaArrowLeft />
        </span>

        <h4
          className={`${anton.className} text-base text-center w-full font-normal leading-[150%] tracking-[2px]`}
        >
          Add blog details
        </h4>

        <div className="flex flex-col gap-4 w-full">
          <label htmlFor="title" className="space-y-3">
            <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
              Title
            </p>
            <input
              readOnly={isUploadingBlog}
              name="title"
              required
              value={blogData.title}
              onChange={(e) =>
                setBlogData((prev) => ({
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

          <div className="space-y-3">
            <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
              Tags
            </p>
            <div
              title="Select learning track"
              className={`h-[55px] cursor-pointer w-full py-5 px-4 rounded-[10px] bg-white/5 flex items-center gap-4 relative`}
            >
              {!!blogData.tags.length && (
                <div className="flex items-center gap-2.5">
                  {blogData.tags.map((tag, i) => (
                    <p
                      key={i}
                      className="bg-white/5 py-1 px-2 rounded-[5px] flex items-center gap-2.5 text-white/60"
                    >
                      {tag}
                      <span
                        onClick={() => {
                          setBlogData((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((_, idx) => idx !== i),
                          }));
                        }}
                      >
                        <FiX width={12} color="#FFFFFF99" />
                      </span>
                    </p>
                  ))}
                </div>
              )}

              <input
                value={searchTag}
                readOnly={isUploadingBlog}
                className="p-0 bg-transparent text-sm font-semibold leading-[150%] tracking-[2px] text-white border-0 ring-0 outline-0"
                style={{
                  width: `${searchTag.length + 1 || 1}ch`,
                  minWidth: "2ch",
                  maxWidth: "100%",
                }}
                onChange={(e) => setSearchTag(e.target.value.trim())}
              />

              {searchTag && (
                <div className="absolute top-14 left-0 w-full rounded-[20px] border border-white/10 px-3 py-4 flex flex-col gap-3 bg-[#242324] pb-5">
                  {tag_options
                    .filter((tag) => tag.includes(searchTag))
                    .map((tag, i) => (
                      <p
                        key={i}
                        onClick={() => {
                          setBlogData((prev) => ({
                            ...prev,
                            tags: Array.from(new Set([...prev.tags, tag])),
                          }));
                          setSearchTag("");
                        }}
                        className="cursor-pointer text-sm font-normal leading-[150%] tracking-[2px]"
                      >
                        {tag}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </div>

          <label htmlFor="cover_img" className="space-y-3">
            <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
              Cover Image
            </p>
            {blogData.thumbnail ? (
              <div className="relative w-full h-[194px] rounded-[10px] overflow-hidden cursor-pointer active:scale-95 active:opacity-25">
                <Image
                  src={URL.createObjectURL(blogData.thumbnail)}
                  alt="cover image"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-[194px] flex items-center justify-center flex-col gap-4 border-dashed border border-white/20 p-3 rounded-[10px] cursor-pointer active:scale-95 active:opacity-25">
                <IoImageOutline size={24} color="#FFFFFF80" />
                <p className="text-base leading-6 tracking-[1px] font-normal">
                  Drag and drop or browse (Max. 10MB)
                </p>
                <p className="text-base leading-6 tracking-[1px] font-normal -mt-2">
                  Recommended size: 1200 x 600
                </p>
              </div>
            )}
            <input
              type="file"
              id="cover_img"
              accept="image/*"
              readOnly={isUploadingBlog}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) {
                  setBlogData((prev) => ({
                    ...prev,
                    thumbnail: file,
                  }));
                  toast.success(`selected cover image: ${file.name}`);
                } else toast.error("No cover image selected");
              }}
              className="hidden"
            />
          </label>

          <h5 className="font-bold leading-6 text-base tracking-[1px] text-white/80">
            SEO Optimazation
          </h5>

          <label htmlFor="title" className="space-y-3">
            <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
              Meta title
            </p>
            <input
              name="metatitle"
              readOnly={isUploadingBlog}
              required
              value={blogData.metatitle}
              onChange={(e) =>
                setBlogData((prev) => ({
                  ...prev,
                  metatitle: e.target.value,
                }))
              }
              title="Add meta title"
              type="text"
              placeholder="Add meta title"
              className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
            />
          </label>

          <label htmlFor="title" className="space-y-3">
            <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
              Meta description
            </p>
            <textarea
              name="metadescription"
              readOnly={isUploadingBlog}
              value={blogData.description}
              onChange={(e) =>
                setBlogData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              title="Add description"
              placeholder="Add description"
              className={`h-[120px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
            />
          </label>
        </div>

        <div className="flex items-center justify-end w-full">
          <button
            type="submit"
            className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 h-[50px] w-[188px] text-sm leading-[150%] tracking-[2px] font-semibold text-[#2C2C26]"
          >
            {isUploadingBlog ? <Loader /> : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};
