import { toast } from "react-toastify";
import api from '@/lib/axios'
import { AxiosError } from "axios";

export const fetchRoles = async () => {
    try {
        const response = await api.get("role-permission/roles?page=1&limit=100");
        // console.log(response.data.data);

        return response.data.data.roles;
    } catch (error) {
        console.error("Fetch Roles Error:", error);
        toast.error("Failed to fetch roles.");
        return [];
    }
};

export const fetchPermissions = async () => {
    try {
        const response = await api.get("role-permission/permissions?page=1&limit=100");
        // console.log();

        return response.data.data.permissions;
    } catch (error) {
        console.error("Fetch Permissions Error:", error);
        toast.error("Failed to fetch permissions.");
        return [];
    }
};

export const getPermissionsOfRole = async (roleId: string) => {
    try {
        const response = await api.get(`role-permission/roles/${roleId}/permissions`);
        // console.log(response.data.data);

        return response.data.data.permissions;
    } catch (error) {
        console.error("Get Role Permissions Error:", error);
        toast.error("Failed to fetch role permissions.");
        return [];
    }
};

export const handleSavePermissions = async (
    roleId: string,
    permissionIds: string[],
    userId: string
) => {
    try {
        if (!roleId) {
            toast.error("Select the Role");
            return
        }
        if (!permissionIds || permissionIds.length === 0) {
            toast.error("Permission are Required, Must atleast One Permission");
            return
        }

        await api.post(`role-permission/roles/${roleId}/permissions`, {
            permissionIds,
            user_id: userId
        });
        toast.success("Permissions updated successfully.");
    } catch (error) {
        console.error("Update Role Permissions Error:", error);
        toast.error("Failed to update permissions.");
    }
};

export const handleAddRole = async (
    name: string,
    description: string,
    userId: string
) => {
    try {
        await api.post("role-permission/roles", {
            name,
            description,
            user_id: userId
        });
        toast.success("Role created successfully.");
    } catch (error) {
        console.error("Add Role Error:", error);
        toast.error("Failed to create role.");
    }
};

export const handleAddPermission = async (
    name: string,
    key: string,
    description: string,
    user_id: string,
) => {
    try {
        await api.post("role-permission/permissions", {
            name,
            key,
            description,
            user_id,
        });
        toast.success("Permission created successfully.");
    } catch (error) {
        console.error("Add Permission Error:", error);
        toast.error("Failed to create permission.");
    }
};

export const handleUpdateRole = async (
    roleId: string,
    updatedName: string,
    updatedDesc: string,
    userId: string
) => {
    try {
        await api.put(`role-permission/roles/${roleId}`, {
            name: updatedName,
            description: updatedDesc,
            user_id: userId,
        });
        toast.success("Role updated successfully.");
    } catch (error) {
        console.error("Update Role Error:", error);
        toast.error("Failed to update role.");
    }
};

export const handleDeleteRole = async (roleId: string, userId: string) => {
    try {
        await api.delete(`role-permission/roles/${roleId}`,
            { data: { user_id: userId } }
        );
        toast.success("Role deleted successfully.");
    } catch (error) {
        console.error("Delete Role Error:", error);
        toast.error("Failed to delete role.");
    }
};

export const deletePermission = async (permissionId: string, userId :string) => {
    try {
        await api.delete(`role-permission/permissions/${permissionId}`,
            { data:{ user_id: userId}}
        );
        toast.success("Permission deleted successfully.");
    } catch (error) {
        console.error("Delete Permission Error:", error);
        toast.error("Failed to delete permission.");
    }
};

export const fetchUserPermissions = async (userId: string): Promise<string[]> => {
    try {
        const response = await api.get(`role-permission/users?userId=${userId}`);
        const { data } = response.data;

        if (Array.isArray(data.permissionKeys)) {
            return data.permissionKeys;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch the Permissions:", error);
        return [];
    }
};

export const syncUserPermissions = async (userId: string): Promise<string[]> => {
    const storedUserId = localStorage.getItem("userId");

    //   if (storedUserId !== userId) {
    //     localStorage.removeItem("permissions");
    //     localStorage.setItem("userId", userId);
    //   }

    const existing = localStorage.getItem("permissions");
    if (existing && storedUserId === userId) {
        return JSON.parse(existing);
    }

    const permissions = await fetchUserPermissions(userId);
    localStorage.setItem("permissions", JSON.stringify(permissions));
    return permissions;
};

export const updatePermission = async (
    permissionId: string,
    name: string,
    key: string,
    description: string,
    userId: string,
) => {
    try {
        await api.put(`role-permission/permissions/${permissionId}`, {
            name,
            key,
            description,
            user_id: userId
        });
        toast.success("Permission updated successfully.");
    } catch (error) {
        console.error("Update Permission Error:", error);
        // toast.error(error?.response?.data?.message ||"Failed to update permission.");
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message);
        } else {
            toast.error("Failed to update permission.");
        }
    }
};

export const assignRolesToUser = async (userId: string, roleIds: string[]) => {
    try {
        const res = await api.post(`role-permission/users/${userId}/roles`, { roleIds });
        toast.success(res.data.message || "Roles assigned successfully");
        return res.data.user;
    } catch (error) {
        console.error("Assign Roles Error:", error);
        toast.error("Failed to assign roles to user");
        throw error;
    }
};

export const getUserAccessDetails = async (userId?: string) => {
    try {
        let res;
        if (userId) {
            res = await api.get(`role-permission/users/?userId=${userId}`);
        }
        else {
            res = await api.get(`role-permission/users`);
        }
        // console.log("user Data", res.data.data);

        return res.data;
    } catch (error) {
        console.error("Get User Access Error:", error);
        toast.error("Failed to fetch user access details");
        throw error;
    }
};

export const removeRoleFromUser = async (userId: string, roleId: string) => {
    try {
        const res = await api.delete(`role-permission/users/${userId}/roles/${roleId}`);
        toast.success(res.data.message || "Role removed from user");
        return res.data.user;
    } catch (error) {
        console.error("Remove Role Error:", error);
        toast.error("Failed to remove role from user");
        throw error;
    }
};
