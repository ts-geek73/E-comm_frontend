'use client';
import { useAuth, useClerk, useSession, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { UserData } from '@/types/user';
import { AxiosError } from 'axios';

export default function useSyncUser() {
  const { user, isSignedIn } = useUser();
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
          name: user.firstName ?? user.username ?? " ",
          email: user.primaryEmailAddress?.emailAddress ?? " ",
          // reoles_id: user.publicMetadata?.roles_id,
        };

        console.log('Syncing user data:', data);
        

        const response = await api.put('/create', data);
        console.log('User synced successfully:', response.status);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
      
        if (error.response) {
          console.error('Sync error:', error.response.data.message);
        } else {
          console.error('Unexpected sync error:', error.message);
        }
      }
    }
    };

    processUser();
  }, [isSignedIn, user, session, clerkId]);
}
