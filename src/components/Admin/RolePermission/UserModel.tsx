import { Role, User } from "@types";
import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select"



type Props = {
    onClose: () => void;
    onSubmit: (user: User, roel: string) => void;
    roles: Role[]
    user?: User | null
};

const UserModel: React.FC<Props> = ({ user, roles, onClose, onSubmit }) => {
    const [userData, setUserData] = useState<User | null>(null)
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

    useEffect(() => {
        if (user && (userData?._id !== user._id))
            setUserData(user)
    }, [user])

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Add Role</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        placeholder="Role Name"
                        value={userData?.email}
                        readOnly
                    />
                    <Select
                        defaultValue={userData?.roles?.[0]?._id ?? undefined}
                        onValueChange={(value) => setSelectedRoleId(value)}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select the ROle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                <SelectItem value="none">No Role (Normal User)</SelectItem> 
                                {roles && roles.map((role: Role) => (
                                    <SelectItem key={role._id} value={role._id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>

                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (userData?.userId && selectedRoleId) {
                                onSubmit(userData, selectedRoleId);
                                onClose();
                            }
                        }}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UserModel;