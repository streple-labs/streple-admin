"use client";

import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { toast } from "sonner";

export default function Page() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  return (
    <div className="relative w-full">
      <CreateUserForm
        isOpen={isCreateUserModalOpen}
        close={() => {
          setIsCreateUserModalOpen(false);
        }}
      />
      <div className="flex items-center justify-between">
        <p>Users</p>

        <button
          onClick={() => {
            setIsCreateUserModalOpen(true);
          }}
          className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
        >
          Create User
        </button>
      </div>
    </div>
  );
}

const initialState = {
  fullName: "",
  email: "",
  role: "",
};
function CreateUserForm({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) {
  const [formData, setFormData] = useState(initialState);

  const { mutate: createUser } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: async () => await api.post("/users/create-admins", formData),
    onSuccess: (res) => {
      toast.success(res.data.message || "user created successfully");
      close();
      setFormData(initialState);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      let errorMessage = "user creation failed. Please try again later.";

      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message))
          errorMessage = error.response.data.message.join(", ");
        else errorMessage = error.response.data.message;
      } else if (error?.userMessage) errorMessage = error.userMessage;
      else if (error?.message) errorMessage = error.message;

      toast.error(errorMessage);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full p-10">
      <div onClick={close} className="bg-black/90 absolute inset-0" />

      <form
        className="w-full space-y-6 max-w-xl bg-[#242324] relative shadow-sm rounded-[20px] p-8"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
      >
        <div className="w-full space-y-3">
          <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
            Full Name
          </p>
          <input
            // readOnly={isLoading}
            name="fullName"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
            title="fullName"
            type="text"
            placeholder="John Doe"
            className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
          />
        </div>

        <div className="w-full space-y-3">
          <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
            Email
          </p>
          <input
            // readOnly={isLoading}
            pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}"
            name="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            title="Email"
            type="email"
            placeholder="johndoe@gmail.com"
            className={`h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] bg-white/5`}
          />
        </div>

        <div className="w-full space-y-3">
          <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
            Select role
          </p>
          <label className="relative cursor-pointer group flex items-center justify-between h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] outline-0 ring-0 caret-[#B39FF0] bg-white/5">
            <p className={!formData.role ? "text-white/50" : ""}>
              {formData.role || "Select user role"}
            </p>

            <FaChevronDown size={18} fill="#fff" />

            <div className="absolute z-10 top-14 left-0 w-full rounded-[20px] border border-white/10 px-3 py-4 hidden group-hover:flex flex-col gap-2 bg-[#242324]">
              {["ADMIN", "PRO_TRADER", "PUBLISHER"].map((role, i) => (
                <p
                  key={i}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      role,
                    }));
                  }}
                  className="cursor-pointer text-sm font-normal leading-[150%] tracking-[2px] hover:bg-white/10 rounded-full py-2 px-4"
                >
                  {role}
                </p>
              ))}
            </div>
          </label>
        </div>

        <div className="w-full flex justify-end mt-4">
          <button
            type="submit"
            className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
