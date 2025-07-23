"use client";

import { anton, dmSans } from "@/app/fonts";
import { TextEditorProvider } from "@/components/editor/context";
import MailEditorComponent from "@/components/editor/mail-editor-component";
import Loader from "@/components/loader";
import Search from "@/components/search";
import api from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { GoFile, GoFilter, GoX } from "react-icons/go";
import { HiOutlineUserGroup } from "react-icons/hi";
import { ImCancelCircle } from "react-icons/im";
import { LuSend } from "react-icons/lu";
import { MdDeleteOutline, MdOutlineMailOutline } from "react-icons/md";
import { PiClockClockwiseLight, PiPencilSimpleLineBold } from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";
import { toast } from "sonner";

const side_options = [
  { label: "All emails", icon: MdOutlineMailOutline },
  {
    label: "Recipient",
    icon: HiOutlineUserGroup,
    sub_options: ["Copiers", "Protraders", "Users"],
  },
  { label: "Sent", icon: LuSend },
  { label: "Scheduled", icon: PiClockClockwiseLight },
  { label: "Draft", icon: GoFile },
  { label: "Failed", icon: ImCancelCircle },
];

const initialState = {
  schedule: false,
  draft: false,
  subject: "",
  message: "",
  recipient: "All users" as Recipient,
  selected: [],
  scheduleDate: null,
};

export default function EmailCenter() {
  const params = useSearchParams();

  const queryClient = useQueryClient();

  const [emailData, setEmailData] = useState<EmailType>(initialState);

  const [sendEmail, setSendEmail] = useState(false);

  const [emailType, setEmailType] = useState("All emails");
  const [showRecipients, setShowRecipients] = useState(false);
  const toggleShowRecipients = () => {
    setShowRecipients((prev) => !prev);
  };

  const [filterOption, setFilterOption] = useState<null | string>(null);
  const selectFilterOption = (option: null | string) => {
    setFilterOption(option === filterOption ? null : option);
    setOpenFilterOptions(false);
  };
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [filterOptionType, setFilterOptionType] = useState<
    null | "recipient" | "status"
  >(null);
  const resetFilterOptions = () => {
    setOpenFilterOptions(false);
    setFilterOptionType(null);
  };
  const filterOptions = useMemo(
    () => ({
      status: ["Sent", "Draft", "Scheduled", "Failed"],
      recipient: ["Copiers", "Protraders"],
    }),
    []
  );

  const { data: emails, isPending: isEmailLoading } = useQuery<EmailResponse>({
    queryKey: ["email-data", params.get("query"), filterOption],
    queryFn: async () =>
      (
        await api.get("/emails", {
          params: {
            ...(params.get("query") ? { search: params.get("query") } : {}),
            ...(filterOptionType === "recipient"
              ? { recipient: filterOption }
              : {}),
            ...(filterOptionType === "status" ? { status: filterOption } : {}),
          },
        })
      ).data,
  });

  const [editEmail, setEditEmail] = useState(false);
  const { mutate: handleEditEmail, isPending: isEditingMail } = useMutation({
    mutationKey: ["edit-mail"],
    mutationFn: async (id: string) =>
      await api.patch(`/email/${id}`, emailData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["email-data", params.get("query"), filterOption],
      });
      toast.success("Email updated successfully!");
      setEmailData(initialState);
      setSendEmail(false);
      setEditEmail(false);
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

  const { mutate: handleDeleteEmail } = useMutation({
    mutationKey: ["delete-email"],
    mutationFn: async (id: string) => await api.delete(`/email/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["email-data"],
      });
      toast.success("Email deleted successfully!");
      setEmailData(initialState);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "Email update failed. Please try again later.";

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
      {sendEmail ? (
        <TextEditorProvider>
          <MailEditorComponent
            close={() => {
              setSendEmail(false);
            }}
            emailData={emailData}
            setEmailData={setEmailData}
            handleEditEmail={() => handleEditEmail(emailData.id!)}
            isEditing={editEmail}
            isEditingEmail={isEditingMail}
          />
        </TextEditorProvider>
      ) : (
        <>
          <h4
            className={`${anton.className} text-base font-normal leading-4 tracking-normal`}
          >
            Email Center
          </h4>
          <div className="flex w-full items-center justify-between gap-8">
            <div className="flex items-center gap-6 w-full">
              <Search title="search for email" placeholder="search for email" />

              <div className="relative">
                {filterOption ? (
                  <button
                    className="border-2 border-[#F4E90E4D] rounded-[15px] h-[50px] py-1 px-2 flex items-center justify-center gap-2 text-white/70 text-sm leading-[100%] font-normal"
                    onClick={() => selectFilterOption(filterOption)}
                  >
                    <GoX className="stroke-white/70" size={16} /> {filterOption}
                  </button>
                ) : (
                  <button
                    className="border border-white/20 rounded-[15px] h-[50px] py-1 px-2 flex items-center justify-center gap-2 text-white/80 text-sm leading-[100%] font-normal"
                    onClick={() => setOpenFilterOptions(true)}
                  >
                    <GoFilter className="stroke-white/80 w-4" /> Filter
                  </button>
                )}
                {openFilterOptions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={resetFilterOptions}
                    />

                    <div className="absolute z-20 top-14 left-0 flex gap-2">
                      <div className="w-40 h-fit rounded-[20px] border border-white/5 px-3 py-4 flex flex-col gap-3 bg-[#252326]">
                        <p
                          onClick={() => {
                            setFilterOptionType("status");
                          }}
                          className={`p-2 rounded-[10px] h-8 w-full flex items-center justify-between text-xs font-normal ${
                            dmSans.className
                          } cursor-pointer text-white/60 ${
                            filterOptionType === "status"
                              ? "bg-white/5"
                              : "hover:bg-white/5"
                          }`}
                        >
                          Status
                          <FaChevronRight height={10} />
                        </p>
                        <p
                          onClick={() => {
                            setFilterOptionType("recipient");
                          }}
                          className={`p-2 rounded-[10px] h-8 w-full flex items-center justify-between text-white/60 text-xs font-normal ${
                            dmSans.className
                          } cursor-pointer ${
                            filterOptionType === "recipient"
                              ? "bg-white/5"
                              : "hover:bg-white/5"
                          }`}
                        >
                          Group
                          <FaChevronRight height={10} />
                        </p>
                      </div>
                      {filterOptionType && (
                        <div className="w-40 rounded-[20px] border border-white/5 px-3 py-4 flex flex-col gap-3 bg-[#252326]">
                          {filterOptions[filterOptionType].map((option) => (
                            <p
                              key={Math.random()}
                              onClick={() => {
                                selectFilterOption(option);
                              }}
                              className={`p-2 rounded-[10px] h-8 w-full flex items-center justify-between text-xs font-normal cursor-pointer text-white/60 ${
                                dmSans.className
                              }
                          ${
                            filterOption === option
                              ? "bg-white/5"
                              : "hover:bg-white/5"
                          }
                          `}
                            >
                              {option}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex w-full items-center justify-end">
              <button
                onClick={() => {
                  setSendEmail(true);
                }}
                className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
              >
                <RiEdit2Line size={12} color="#2B2B37" />
                Compose
              </button>
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex flex-col shrink-0 gap-3 py-3 px-2 w-[160px]">
              {side_options.map((option) => (
                <>
                  <div
                    className={`h-10 w-full cursor-pointer p-3 flex items-center gap-2.5 rounded-[20px] text-xs leading-4 tracking-[1px] font-normal ${
                      emailType === option.label
                        ? "bg-[#A894E5] text-[#3A393F]"
                        : "text-white/70"
                    }`}
                    key={option.label}
                    onClick={() => {
                      if (option.label === "Recipient" || showRecipients)
                        toggleShowRecipients();
                      else setEmailType(option.label);
                    }}
                  >
                    <option.icon
                      width={12}
                      color={
                        emailType === option.label ? "#3A393F" : "#FFFFFFB2"
                      }
                    />
                    <p>{option.label}</p>

                    {option.sub_options && (
                      <FaChevronDown
                        className={`${
                          showRecipients ? "rotate-180" : "rotate-0"
                        } ml-auto w-3 stroke-white/80`}
                      />
                    )}
                  </div>
                  {option.sub_options &&
                    showRecipients &&
                    option.sub_options.map((option) => (
                      <div
                        onClick={() => setEmailType(option)}
                        className={`w-full cursor-pointer h-10 p-3 flex items-center gap-2.5 rounded-[20px] text-xs leading-4 tracking-[1px] font-normal ${
                          emailType === option
                            ? "bg-[#A894E5] text-[#3A393F]"
                            : "text-white/70"
                        }`}
                        key={Math.random()}
                      >
                        <p>{option}</p>
                      </div>
                    ))}
                </>
              ))}
            </div>
            {isEmailLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <Loader />
              </div>
            ) : emails?.data.length === 0 ? (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-white/50 text-sm font-normal">
                  No emails found. Create your first email!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto size-full hide-scrollbar bg-[#242324] rounded-[15px]">
                <table className="min-w-full text-left text-xs font-normal text-white">
                  <thead>
                    <tr className="[&>th]:text-xs [&>td]:leading-3 [&>td]:tracking-0 [&>th]:font-normal [&>th]:p-4 [&>th]:text-nowrap border-b border-b-white/5">
                      <th>Subject</th>
                      <th>Recipient</th>
                      <th>Date Added</th>
                      <th>Status</th>
                      <th>Open rate</th>
                      <th>Click rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails?.data.map((email) => (
                      <tr
                        key={Math.random()}
                        className="[&>td]:text-xs [&>td]:leading-3 [&>td]:tracking-0 [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:h-[72px] border-b border-b-white/5"
                      >
                        <td className="flex flex-col justify-center gap-2">
                          <span className="font-semibold max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                            {email.subject}
                          </span>
                          <span className="text-white/80 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                            {email.message}
                          </span>
                        </td>
                        <td>{email.recipient}</td>
                        <td>
                          {new Date(email.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>
                          <span
                            className={`px-2 py-1 h-6 w-fit flex items-center justify-center cursor-pointer rounded-[14px] group ${
                              email.status === "Sent"
                                ? "bg-[#A082F9] text-[#313127CC]"
                                : email.status === "Draft"
                                ? "bg-[#807C8B] text-[#141315]"
                                : email.status === "Failed"
                                ? "bg-[#F06E6E] text-[#251D1D]"
                                : "bg-[#F4E90ECC] text-[#171716CC]"
                            }`}
                          >
                            {email.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            {email.openRate ? (
                              <>
                                <span
                                  className={`rotate-45 size-2.5 ${
                                    Number(email.openRate) >= 70
                                      ? "bg-[#1C7E0F]"
                                      : Number(email.openRate) >= 40
                                      ? "bg-[#6F760D]"
                                      : "bg-[#C83232]"
                                  }`}
                                />
                                <span>{email.openRate}%</span>
                              </>
                            ) : (
                              "--"
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            {email.clickRate ? (
                              <>
                                <span
                                  className={`rotate-45 size-2.5 ${
                                    Number(email.clickRate) >= 70
                                      ? "bg-[#1C7E0F]"
                                      : Number(email.clickRate) >= 40
                                      ? "bg-[#6F760D]"
                                      : "bg-[#C83232]"
                                  }`}
                                />
                                <span>{email.clickRate}%</span>
                              </>
                            ) : (
                              "--"
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-4 items-center">
                            <button
                              onClick={() => {
                                setEmailData({
                                  subject: email.subject,
                                  message: email.message,
                                  recipient: email.recipient,
                                  selected: email.selected,
                                  schedule: Boolean(
                                    email.status === "Scheduled"
                                  ),
                                  draft: Boolean(email.status === "Draft"),
                                  scheduleDate: email.scheduleDate,
                                  id: email.id,
                                });

                                setEditEmail(true);
                                setSendEmail(true);
                              }}
                            >
                              <PiPencilSimpleLineBold size={15} />
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteEmail(email.id);
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
          </div>
        </>
      )}
    </div>
  );
}
