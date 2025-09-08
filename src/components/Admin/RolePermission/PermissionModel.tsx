import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Permission } from "@types";
import React, { useEffect, useState } from "react";

type Props = {
  onClose: () => void;
  onSubmit: (permission: Permission) => void;
  editingPermission?: Permission | null;
};

const PermissionModal: React.FC<Props> = ({
  onClose,
  onSubmit,
  editingPermission,
}) => {
  const [permissionData, setPermissionData] = useState<Permission | null>(null);

  useEffect(() => {
    if (editingPermission) {
      setPermissionData(editingPermission);
    }
  }, [editingPermission]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Permission</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Permission Name"
            value={permissionData?.name}
            onChange={(e) =>
              setPermissionData(
                (pre) => ({ ...pre, name: e.target.value }) as Permission
              )
            }
            autoFocus
          />
          <Input
            placeholder="Permission Key"
            value={permissionData?.key}
            onChange={(e) =>
              setPermissionData(
                (pre) => ({ ...pre, key: e.target.value }) as Permission
              )
            }
          />
          <Textarea
            placeholder="Description"
            value={permissionData?.description}
            onChange={(e) =>
              setPermissionData(
                (pre) => ({ ...pre, description: e.target.value }) as Permission
              )
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
              if (permissionData) {
                onSubmit(permissionData);
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
};

export default PermissionModal;
