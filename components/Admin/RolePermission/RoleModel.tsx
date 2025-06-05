import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/rolePermission";

type Props = {
  onClose: () => void;
  onSubmit: (name: string, desc: string) => void;
  editingRole?: Role | null
};

const RoleModal: React.FC<Props> = ({ onClose, onSubmit, editingRole }) => {
  const [roleData, setRoleData] = useState<Role | null>(null)

  useEffect(() => {
    if (editingRole) {
      setRoleData(editingRole)
    }
  }, [editingRole]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Role</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Role Name"
            value={roleData?.name}
            onChange={(e) =>
              setRoleData((prev) => ({ ...prev, name: e.target.value } as Role))
            }
            autoFocus
          />
          <Textarea
            placeholder="Description"
            value={roleData?.description}
            onChange={(e) =>
              setRoleData((prev) => ({ ...prev, description: e.target.value } as Role))
            }
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(roleData?.name ?? "", roleData?.description ?? "");
              onClose();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
