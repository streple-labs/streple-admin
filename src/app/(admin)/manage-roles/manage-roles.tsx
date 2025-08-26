"use client";

import Loader from "@/components/loader";
import CreateUserForm from "@/components/modals/create-user";
import { getAllUsers } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ManageRoles() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const {
    data: users,
    error,
    isPending,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getAllUsers();

      return res.users;
    },
  });

  return (
    <div className="relative w-full">
      <CreateUserForm
        isOpen={isCreateUserModalOpen}
        close={() => {
          setIsCreateUserModalOpen(false);
        }}
      />
      <div className="flex items-center justify-between mb-6">
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

      {error && (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-sm font-normal text-red-600">
            Error fetching users {error.message}
          </p>
        </div>
      )}

      {isPending ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader />
        </div>
      ) : users?.data.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-white/50 text-sm font-normal">
            No users found. Create a user!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto hide-scrollbar h-full">
          <table className="min-w-full text-left text-xs font-normal text-white">
            <thead>
              <tr className="[&>th]:text-xs [&>th]:font-normal [&>th]:py-3 [&>th]:px-4 [&>th]:text-nowrap">
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users?.data.map((users, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 ? "" : "bg-white/[2%]"
                  } [&>td]:text-xs [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:text-nowrap`}
                >
                  <td className=" max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {users.fullName}
                  </td>
                  <td className=" max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {users.email}
                  </td>
                  <td>{users.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
