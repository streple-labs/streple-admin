import Loader from "@/components/loader";
import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { toast } from "sonner";

const initialState = {
  fullName: "",
  email: "",
  role: "",
  roleLevel: "",
  type: "",
};
export default function CreateUserForm({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) {
  const [formData, setFormData] = useState(initialState);

  const { mutate: createUser, isPending: loading } = useMutation({
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

  const [openRoles, setOpenRoles] = useState(false);

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

        <div className="w-full space-y-3 relative">
          <p className="font-normal text-base leading-6 tracking-[1px] text-white/80">
            Select role
          </p>
          <label
            onClick={() => {
              setOpenRoles((prev) => !prev);
            }}
            className="relative cursor-pointer flex items-center justify-between h-[55px] w-full text-base font-normal py-5 px-4 rounded-[10px] gap-4 leading-6 tracking-[1px] outline-0 ring-0 caret-[#B39FF0] bg-white/5"
          >
            <p className={!formData.role ? "text-white/50" : ""}>
              {formData.role || "Select user role"}
            </p>

            <FaChevronDown size={18} fill="#fff" />
          </label>
          {openRoles && (
            <div className="absolute z-10 top-24 left-0 w-full rounded-[20px] border border-white/10 px-3 py-4 flex flex-col gap-2 bg-[#242324]">
              {[
                {
                  label: "ADMIN",
                  id: "ADMIN",
                  type: "Internal",
                  roleLevel: "3",
                },
                {
                  label: "PRO TRADER",
                  id: "PRO_TRADER",
                  type: "External",
                  roleLevel: "1",
                },
                {
                  label: "PUBLISHER",
                  id: "PUBLISHER",
                  type: "Internal",
                  roleLevel: "2",
                },
                {
                  label: "MARKETER",
                  id: "MARKETER",
                  type: "External",
                  roleLevel: "2",
                },
              ].map((role, i) => (
                <p
                  key={i}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      role: role.id,
                      roleLevel: role.roleLevel,
                      type: role.type,
                    }));
                    setOpenRoles(false);
                  }}
                  className="cursor-pointer text-sm font-normal leading-[150%] tracking-[2px] hover:bg-white/10 rounded-full py-2 px-4"
                >
                  {role.label}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="w-full flex justify-end mt-4">
          <button
            disabled={loading}
            type="submit"
            className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
          >
            {loading ? <Loader /> : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
