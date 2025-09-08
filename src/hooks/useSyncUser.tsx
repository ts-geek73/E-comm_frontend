"use client";
import api from "@/lib/axios";
import { UserData } from "@types";
import { useAuth, useClerk, useSession, useUser } from "@clerk/nextjs";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

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
      if (!isSignedIn || !user || !session || !clerkId) return;

      try {
        const token = await getToken();
        // console.log("Token:=", token);

        if (!token) return;

        const data: UserData = {
          sessionId: session.id,
          userId: user.id,
          clerkId,
          name: user.firstName ?? user.username ?? " ",
          email: user.primaryEmailAddress?.emailAddress ?? " ",
        };

        await api.put("/create", data);
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== "production") {
          if (error instanceof AxiosError && error.response) {
            console.log(
              "User sync failed:",
              error.response.data?.message || error.message
            );
          } else if (error instanceof Error) {
            console.log("Unexpected error:", error.message);
          } else {
            console.log("Unknown error during user sync.");
          }
        }
      }
    };

    processUser();
  }, [isSignedIn, user, session, clerkId]);
}
