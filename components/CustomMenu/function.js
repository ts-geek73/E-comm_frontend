import { useClerk, useUser } from '@clerk/nextjs';

export const useCustomMenu = () => {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return {
    isLoaded,
    user,
    signOut,
    openUserProfile,
  };
};
