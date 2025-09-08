import { Button } from "@components/ui/button";
import { Role } from "@types";
import { Edit2, Plus, ShieldUser, Trash2, Users } from "lucide-react";
import React from "react";

type Props = {
  roles: Role[];
  selectedRole: Role | null;
  setSelectedRole: (role: Role | null) => void;
  onUpdateRoleClick: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onAddRole: () => void;
};

const RoleList: React.FC<Props> = ({
  roles,
  selectedRole,
  setSelectedRole,
  onUpdateRoleClick,
  onDeleteRole,
  onAddRole,
}) => {
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShieldUser className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Roles</h2>
        </div>
        <Button
          onClick={onAddRole}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div
            key={role._id}
            className={`
              relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg
              ${
                selectedRole?._id === role._id
                  ? "bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
            onClick={() => setSelectedRole(role)}
          >
            {/* Role Content */}
            <div className="mb-3">
              <div
                className="font-semibold text-gray-800 mb-1 truncate"
                title={role.name}
              >
                {role.name}
              </div>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                title={role.description}
              >
                {role.description}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 absolute top-2 right-5 ">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateRoleClick(role);
                }}
                className="flex-1 flex items-center justify-center gap-1 h-8 text-xs hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRole(role._id);
                }}
                className="flex-1 flex items-center justify-center gap-1 h-8 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {roles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No roles found</p>
          <p className="text-sm">Create your first role to get started</p>
        </div>
      )}
    </div>
  );
};

export default RoleList;
