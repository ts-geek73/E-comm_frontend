import { useEffect, useState } from "react";
import PermissionGrid from "./PermissionGrid";
import RoleList from "./RoleList";

import { Permission, Role, User } from "@/types/rolePermission";
import PermissionModal from "./PermissionModel";
import RoleModal from "./RoleModel";

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
} from "@/components/Functions/role-permission";
import UserList from "./UserList";
import { usePermission } from "@/hooks/usePermission";

const RolePermissionManager = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(new Set());
    const [originalPermissions, setOriginalPermissions] = useState<Set<string>>(new Set());
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { reloadPermissions } = usePermission()

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

    // Fetch roles & permissions initially
    useEffect(() => {
        const dataFetch = async () => {
            const rolesData = await fetchRoles();
            const permissionData = await fetchPermissions();

            setRoles(rolesData);
            reloadPermissions()
            setPermissions(permissionData);
        };

        dataFetch();
    }, []);

    // const handleAssignRoles = async () => {
    //     if (selectedUser && selectedRole) {
    //         await assignRolesToUser(selectedUser.userId, [selectedRole?._id]);
    //     }
    // };

    // const handleRemoveRole = async (roleId: string) => {
    //     if (selectedUser) {
    //         await removeRoleFromUser(selectedUser.userId, roleId);
    //     }
    // };

    useEffect(() => {
        const fetchAccess = async () => {
            if (selectedUser && selectedUser.userId) {
                console.log(selectedUser.name);

                const data = await getUserAccessDetails(selectedUser.userId);
                console.log("User Data:=", data.data.user.roles);
                setSelectedRole(data.data.user.roles[0] as Role)
                // setPermissions(data.data.permissions);
                // setPermissionKeys(data.permissionKeys);
            } else {

                console.log("not selected USer");

                const data = await getUserAccessDetails();
                console.log(data.data.users);

                setUsers(data.data.users)
                // setPermissions(data.permissions);
            }
        };
        fetchAccess();
    }, [selectedUser]);


    // Fetch permissions assigned to selected role
    useEffect(() => {
        const roleSelectFun = async () => {
            if (selectedRole) {
                let data = await getPermissionsOfRole(selectedRole._id);
                const permIds = new Set<string>(data.map((perm: Permission) => perm._id));
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
        if (id) {
            await handleUpdateRole(id, name, desc);
        } else {
            await handleAddRole(name, desc);
        }
        const rolesData = await fetchRoles();
        setRoles(rolesData);
        setShowRoleModal(false);
        setEditingRole(null);
    };

    const hasChanges = () => {

        return checkedPermissions.size !== originalPermissions.size ||
            [...checkedPermissions].some((id) => !originalPermissions.has(id));
    }


    // Submit handler for Permission add or update
    const handlePermissionSubmit = async (permission: Permission) => {
        const { _id, name, key, description } = permission;
        if (_id) {
            await updatePermission(_id, name, key, description);
        } else {
            await handleAddPermission(name, key, description);
        }
        const permissionData = await fetchPermissions();
        reloadPermissions()
        setPermissions(permissionData);
        setShowPermissionModal(false);
        setEditingPermission(null);
    };

    // Handle role delete
    const handleRoleDelete = async (roleId: string) => {
        await handleDeleteRole(roleId);
        const rolesData = await fetchRoles();
        setRoles(rolesData);
        if (selectedRole?._id === roleId) setSelectedRole(null);
    };

    // Handle permission delete
    const handlePermissionDelete = async (id: string) => {
        await deletePermission(id);
        const permissionData = await fetchPermissions();
        setPermissions(permissionData);
    };

    return (
        <div className="p-4 container">
            <UserList
                users={users}
                selectedUser={selectedUser ?? undefined}
                onSelectUser={setSelectedUser}
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
                onSave={() => selectedRole && handleSavePermissions(selectedRole._id, Array.from(checkedPermissions))}
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
