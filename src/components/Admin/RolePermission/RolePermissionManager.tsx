import { useEffect, useState } from "react";
import PermissionGrid from "./PermissionGrid";
import RoleList from "./RoleList";

import { Permission, Role, User } from "@types";
import PermissionModal from "./PermissionModel";
import RoleModal from "./RoleModel";

import { usePermission } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import {
    assignRolesToUser,
    deletePermission,
    fetchPermissions,
    fetchRoles,
    getPermissionsOfRole,
    getUserAccessDetails,
    handleAddPermission,
    handleAddRole,
    handleDeleteRole,
    handleSavePermissions,
    handleUpdateRole,
    removeRoleFromUser,
    updatePermission,
} from "@components/Functions";
import { toast } from "react-toastify";
import UserList from "./UserList";
import UserModel from "./UserModel";

const RolePermissionManager = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [originalPermissions, setOriginalPermissions] = useState<Set<string>>(
    new Set()
  );
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { reloadPermissions } = usePermission();
  const userId = useUser().user?.id;

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );

  // Fetch roles & permissions initially
  useEffect(() => {
    const dataFetch = async () => {
      const rolesData = await fetchRoles();
      const permissionData = await fetchPermissions();

      setRoles(rolesData);
      reloadPermissions();
      setPermissions(permissionData);
    };

    dataFetch();
  });

  const fetchAccess = async () => {
    if (selectedUser && selectedUser.userId) {
      // console.log(selectedUser.name);

      const data = await getUserAccessDetails(selectedUser.userId);
      console.log("User Data:=", data.data.user.roles);
      setSelectedRole(data.data.user.roles[0] as Role);
    } else {
      // console.log("not selected USer");

      const data = await getUserAccessDetails();
      // console.log(data.data.users);

      setUsers(data.data.users);
      // setPermissions(data.permissions);
    }
  };
  useEffect(() => {
    fetchAccess();
  }, [selectedUser]);

  // Fetch permissions assigned to selected role
  useEffect(() => {
    const roleSelectFun = async () => {
      if (selectedRole) {
        const data = await getPermissionsOfRole(selectedRole._id);
        const permIds = new Set<string>(
          data.map((perm: Permission) => perm._id)
        );
        setCheckedPermissions(permIds);
        setOriginalPermissions(permIds);
      } else {
        setCheckedPermissions(new Set());
        setOriginalPermissions(new Set());
      }
    };
    roleSelectFun();
  }, [selectedRole]);

  // Handle opening Role modal for update
  const handleRoleUpdateClick = (role: Role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  // Handle opening Permission modal for update
  const handlePermissionUpdateClick = (permission: Permission) => {
    setEditingPermission(permission);
    setShowPermissionModal(true);
  };

  // Submit handler for Role add or update
  const handleRoleSubmit = async (name: string, desc: string, id?: string) => {
    if (userId) {
      if (id) {
        await handleUpdateRole(id, name, desc, userId);
      } else {
        await handleAddRole(name, desc, userId);
      }
    }
    const rolesData = await fetchRoles();
    setRoles(rolesData);
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const assignUserRole = async (user: User, roleId: string) => {
    console.log(user, roleId);
    if (user.userId && roleId !== "none" && user.roles?.[0]?._id !== roleId) {
      await assignRolesToUser(user.userId, [roleId]);

      const data = await getUserAccessDetails(user.userId);
      // console.log("User Data:=", data.data.user.roles);
      setSelectedRole(data.data.user.roles[0] as Role);
    }
    if (roleId === "none") {
      await removeRoleFromUser(user.userId, user.roles?.[0]._id as string);
      setSelectedRole(null);
    }
    const allUsersData = await getUserAccessDetails();
    setUsers(allUsersData.data.users);
    setSelectedUser(user);
  };

  const hasChanges = () => {
    return (
      checkedPermissions.size !== originalPermissions.size ||
      [...checkedPermissions].some((id) => !originalPermissions.has(id))
    );
  };

  // Submit handler for Permission add or update
  const handlePermissionSubmit = async (permission: Permission) => {
    const { _id, name, key, description } = permission;
    if (userId) {
      const isDuplicateKey = permissions.some(
        (prms: Permission) => prms.key === key
      );
      if (!key || isDuplicateKey) {
        toast.error(
          isDuplicateKey
            ? "Sorry, this key is already taken. Use another."
            : "Key is required."
        );
        return;
      }

      if (_id) {
        await updatePermission(_id, name, key, description, userId);
      } else {
        await handleAddPermission(name, key, description, userId);
      }
    }

    const permissionData = await fetchPermissions();
    reloadPermissions();
    setPermissions(permissionData);
    setShowPermissionModal(false);
    setEditingPermission(null);
  };

  // Handle role delete
  const handleRoleDelete = async (roleId: string) => {
    if (userId) {
      await handleDeleteRole(roleId, userId);
      const rolesData = await fetchRoles();
      setRoles(rolesData);
      if (selectedRole?._id === roleId) setSelectedRole(null);
    }
  };

  // Handle permission delete
  const handlePermissionDelete = async (id: string) => {
    if (userId) {
      deletePermission(id, userId);
      const permissionData = await fetchPermissions();
      setPermissions(permissionData);
    }
  };

  return (
    <div className="p-4 container">
      <UserList
        users={users}
        selectedUser={selectedUser ?? undefined}
        onSelectUser={setSelectedUser}
        onEditRole={(user: User) => {
          setEditingUser(user);
          setShowUserModal(true);
        }}
      />

      <RoleList
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onUpdateRoleClick={handleRoleUpdateClick}
        onDeleteRole={handleRoleDelete}
        onAddRole={() => {
          setEditingRole(null);
          setShowRoleModal(true);
        }}
      />

      <PermissionGrid
        permissions={permissions}
        selectedRole={selectedRole}
        checkedPermissions={checkedPermissions}
        setCheckedPermissions={setCheckedPermissions}
        onSave={() =>
          selectedRole &&
          userId &&
          handleSavePermissions(
            selectedRole._id,
            Array.from(checkedPermissions),
            userId
          )
        }
        onAddPermission={() => {
          setEditingPermission(null);
          setShowPermissionModal(true);
        }}
        onDeletePermission={handlePermissionDelete}
        onUpdatePermissionClick={handlePermissionUpdateClick}
        isSaveDisabled={!hasChanges()}
      />

      {showRoleModal && (
        <RoleModal
          onClose={() => {
            setShowRoleModal(false);
            setEditingRole(null);
          }}
          onSubmit={handleRoleSubmit}
          editingRole={editingRole}
        />
      )}

      {showUserModal && (
        <UserModel
          user={editingUser}
          roles={roles}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSubmit={assignUserRole}
        />
      )}

      {showPermissionModal && (
        <PermissionModal
          onClose={() => {
            setShowPermissionModal(false);
            setEditingPermission(null);
          }}
          onSubmit={handlePermissionSubmit}
          editingPermission={editingPermission}
        />
      )}
    </div>
  );
};

export default RolePermissionManager;
