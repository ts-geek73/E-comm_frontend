import React from "react";
import { Permission, Role } from "@/types/rolePermission";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Edit2, Trash2, Save } from "lucide-react";

type Props = {
  permissions: Permission[];
  selectedRole: Role | null;
  checkedPermissions: Set<string>;
  setCheckedPermissions: (permissions: Set<string>) => void;
  onSave: () => void;
  onAddPermission: () => void;
  onDeletePermission: (id: string) => void;
  onUpdatePermissionClick: (permission: Permission) => void;
  isSaveDisabled: boolean;
};

const PermissionGrid: React.FC<Props> = ({
  permissions,
  selectedRole,
  checkedPermissions,
  setCheckedPermissions,
  onSave,
  onAddPermission,
  onDeletePermission,
  onUpdatePermissionClick,
  isSaveDisabled
}) => {

  const toggleCheck = (id: string) => {
    const updated = new Set(checkedPermissions);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setCheckedPermissions(updated);
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Permissions</h2>
          {selectedRole && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              for {selectedRole.name}
            </span>
          )}
        </div>
        <Button
          onClick={onAddPermission}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Permission
        </Button>
      </div>

      {/* No Role Selected State */}
      {!selectedRole && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600 mb-2">Select a role first</p>
          <p className="text-sm text-gray-500">Choose a role from above to manage its permissions</p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {permissions.map((perm) => (
              <div
                key={perm._id}
                className={`
                  border relative rounded-lg p-4 transition-all duration-200 hover:shadow-md
                  ${checkedPermissions.has(perm._id)
                    ? "bg-green-50 border-green-300 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {/* Permission Content */}
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={checkedPermissions.has(perm._id)}
                    readOnly
                    className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 mb-1 truncate" title={perm.name}>
                      {perm.name}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2" title={perm.description}>
                      {perm.description}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex absolute top-4 right-5 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdatePermissionClick(perm)}
                    className="flex-1 flex items-center justify-center gap-1 h-8 text-xs hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeletePermission(perm._id)}
                    className="flex-1 flex items-center justify-center gap-1 h-8 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Grid */}
      {selectedRole && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {permissions.map((perm) => (
              <div
                key={perm._id}
                onChange={() => toggleCheck(perm._id)}
                className={`
                  border relative rounded-lg p-4 transition-all duration-200 hover:shadow-md
                  ${checkedPermissions.has(perm._id)
                    ? "bg-green-50 border-green-300 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {/* Permission Content */}
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={checkedPermissions.has(perm._id)}
                    onChange={() => toggleCheck(perm._id)}
                    className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 mb-1 truncate" title={perm.name}>
                      {perm.name}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2" title={perm.description}>
                      {perm.description}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex absolute top-4 right-5 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdatePermissionClick(perm)}
                    className="flex-1 flex items-center justify-center gap-1 h-8 text-xs hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeletePermission(perm._id)}
                    className="flex-1 flex items-center justify-center gap-1 h-8 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end ">
            <Button
              onClick={onSave}
              disabled={isSaveDisabled}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow-sm transition 
    ${isSaveDisabled
                  ? 'bg-blue-300 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <Save className="w-4 h-4" />
              Save Permissions
            </Button>

          </div>

          {/* Empty Permissions State */}
          {permissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No permissions found</p>
              <p className="text-sm">Create your first permission to get started</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PermissionGrid;