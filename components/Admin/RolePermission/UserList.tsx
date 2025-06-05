import { Role, User } from "@/types/rolePermission";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  users: User[];
  selectedUser?: User;
  onSelectUser: Dispatch<SetStateAction<User | null>>;
};

const UserList: React.FC<Props> = ({ users, selectedUser, onSelectUser }) => {

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">


        {users && users.map((user) => (
          <div
            key={user._id}
            className={`
                p-4 border rounded-lg bg-white shadow-sm cursor-pointer transition
                hover:shadow-md ${(selectedUser && selectedUser?._id === user._id) ? "border-blue-500 shadow-lg bg-blue-50" : "border-gray-200"}
              `} 
              onClick={() => user && onSelectUser(user)}
          >
            <div className="font-semibold text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>

            {user.roles && (
              <div className="mt-2 flex flex-wrap gap-2">
                {user.roles.map((role: Role) => (
                  <span
                    key={role._id}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
            )}


          </div>
        ))}
      </div>

      {!users &&
        <>
          <p>NO Users get</p>
        </>}
    </div>
  );
};

export default UserList;
