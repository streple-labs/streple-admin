import { anton } from "@/app/fonts";
import Loader from "@/components/loader";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
import { IoImageOutline } from "react-icons/io5";
import { toast } from "sonner";

const tag_options = ["Crypto Basics"];

export default function FillBlogDetailsModal({
  isOpen,
  toggleModal,
  blogData,
  setBlogData,
  handleBlogUpload,
  isLoading,
  isEditingBlog,
  handleEditBlog,
}: {
  isOpen: boolean;
  toggleModal: () => void;
  blogData: BlogDataType;
  setBlogData: Dispatch<SetStateAction<BlogDataType>>;
  handleBlogUpload: () => void;
  isLoading: boolean;
  isEditingBlog: boolean;
  handleEditBlog: (blogId: string) => void;
}) {
  const [searchTag, setSearchTag] = useState("");
  const [isTagInputFocused, setTagInputFocus] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex p-[5%] justify-center items-center">
      <div className="absolute inset-0 bg-black/70" onClick={toggleModal} />

      <form
        className="bg-[#242324] w-full max-w-3xl overflow-y-auto max-h-[90vh] rounded-[20px] p-8 space-y-10 relative"
        onSubmit={(e) => {
          e.preventDefault();

          if (!blogData.tags.length) {
            toast.error("At least one tag is required");
            return;
          }

          if (isEditingBlog) handleEditBlog(blogData.id!);
          else handleBlogUpload();
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
          <h5 className="font-bold leading-6 text-base tracking-[1px] text-white/80">
            Blog details
          </h5>

          <label htmlFor="title" className="space-y-3">
            <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
              Title
            </p>
            <input
              readOnly={isLoading}
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
            {isTagInputFocused ? (
              <div
                title="Select learning track"
                className={`h-[55px] cursor-pointer w-full py-5 px-4 rounded-[10px] bg-white/5 flex items-center gap-4 relative`}
              >
                <input
                  autoFocus
                  value={searchTag}
                  readOnly={isLoading}
                  className="p-0 bg-transparent text-sm font-semibold leading-[150%] tracking-[2px] text-white border-0 ring-0 outline-0 w-full placeholder:text-white/50"
                  type="text"
                  placeholder="Add tags (e.g. Crypto Basics)"
                  onChange={(e) => setSearchTag(e.target.value.trim())}
                />

                <div className="absolute z-10 top-14 left-0 w-full rounded-[20px] border border-white/10 px-3 py-4 flex flex-col gap-3 bg-[#242324] pb-5">
                  {tag_options
                    .filter((tag) =>
                      tag.toLowerCase().includes(searchTag.toLowerCase())
                    )
                    .map((tag, i) => (
                      <p
                        key={i}
                        onClick={() => {
                          setBlogData((prev) => ({
                            ...prev,
                            tags: Array.from(new Set([...prev.tags, tag])),
                          }));
                          setSearchTag("");
                          setTagInputFocus(false);
                        }}
                        className="cursor-pointer text-sm font-normal leading-[150%] tracking-[2px]"
                      >
                        {tag}
                      </p>
                    ))}
                </div>
              </div>
            ) : (
              <div
                title="Select learning track"
                className={`h-[55px] cursor-pointer w-full py-5 px-4 rounded-[10px] bg-white/5 flex items-center gap-4 relative`}
                onClick={() => setTagInputFocus(true)}
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
              </div>
            )}
          </div>

          <label htmlFor="cover_img" className="space-y-3">
            <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
              Cover Image
            </p>
            {blogData.thumbnail ? (
              <div className="relative w-full h-[194px] rounded-[10px] overflow-hidden cursor-pointer active:scale-95 active:opacity-25">
                <Image
                  src={
                    typeof blogData.thumbnail === "string"
                      ? blogData.thumbnail
                      : URL.createObjectURL(blogData.thumbnail)
                  }
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
              readOnly={isLoading}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;

                if (file && file.size > 5 * 1024 * 1024) {
                  toast.error("File size exceeds 5MB limit");
                  return;
                }

                if (file) {
                  setBlogData((prev) => ({
                    ...prev,
                    thumbnail: file,
                  }));
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
              readOnly={isLoading}
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
              readOnly={isLoading}
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
            disabled={isLoading}
            title="Publish or edit blog"
            type="submit"
            className="flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 h-[50px] w-[188px] text-sm leading-[150%] tracking-[2px] font-semibold text-[#2C2C26]"
          >
            {isLoading ? <Loader /> : isEditingBlog ? "Edit Blog" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
