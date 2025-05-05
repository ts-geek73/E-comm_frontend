'use client';
import { useAuth, useClerk, useSession, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import api from '@/lib/axoins';
import { UserData } from '@/types/user';

export default function useSyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { session } = useSession();
  const clerk = useClerk();
  const [clerkId, setClerkId] = useState<string | null>(null);

  useEffect(() => {
    if (clerk?.client?.id) {
      setClerkId(clerk.client.id);
    }
  }, [clerk]);

  useEffect(() => {
    const processUser = async () => {
        // console.log("User: ", user);
        
      if (!isSignedIn || !user || !session || !clerkId) return;

      try {
        const token = await getToken();
        if (!token) throw new Error('Missing token');

        const data: UserData = {
          sessionId: session.id,
          userId: user.id,
          clerkId,
          name: user.firstName,
          email: user.primaryEmailAddress.emailAddress,
          reoles_id: user.publicMetadata?.roles_id,
        };

        console.log('Syncing user data:', data);
        

        const response = await api.put('/create', data);
        console.log('User synced successfully:', response.status);
      } catch (error: any) {
        if (error.response) {
          console.error('Sync error:', error.response.data.message);
        } else {
          console.error('Unexpected sync error:', error.message);
        }
      }
    };

    processUser();
  }, [isSignedIn, user, session, clerkId]);
}
