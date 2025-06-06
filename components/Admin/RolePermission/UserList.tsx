import { Button } from "@/components/ui/button";
import { Role, User } from "@/types/rolePermission";
import { Edit2, RollerCoaster, Users } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  users: User[];
  selectedUser?: User;
  onSelectUser: Dispatch<SetStateAction<User | null>>;
  onEditRole: (user: User) => void;
};

const UserList: React.FC<Props> = ({ users, selectedUser, onSelectUser, onEditRole }) => {

  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-bold text-gray-800">Users</h2>
        </div>
       
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users && users.map((user) => (
          <div
            key={user._id}
            className={`
                p-4 border rounded-lg bg-white shadow-sm relative cursor-pointer transition
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
            <div className="flex gap-2 absolute top-2 right-5 ">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRole(user);
                }}
                className="flex-1 flex items-center justify-center gap-1 h-8 text-xs hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>

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
