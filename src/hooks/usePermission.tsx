import { useUser } from "@clerk/nextjs";
import { syncUserPermissions } from "@components/Functions";
import { useCallback, useEffect, useState } from "react";

type PermissionState = {
  permissions: string[];
  ready: boolean;
};

type UsePermissionReturn = {
  hasPermission: (key: string) => boolean;
  loading: boolean;
  reloadPermissions: () => void;
};

const usePermission = (): UsePermissionReturn => {
  const { user } = useUser();
  const [state, setState] = useState<PermissionState>({
    permissions: [],
    ready: false,
  });

  const loadPermissions = useCallback(async () => {
    if (user?.id) {
      const permissions = await syncUserPermissions(user.id);
      setState({ permissions, ready: true });
    }
  }, [user?.id]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const hasPermission = (key: string) => state.permissions.includes(key);

  // Expose reload function
  const reloadPermissions = () => {
    setState((prev) => ({ ...prev, ready: false }));
    loadPermissions();
  };

  return {
    hasPermission,
    loading: !state.ready,
    reloadPermissions,
  };
};

export default usePermission;
