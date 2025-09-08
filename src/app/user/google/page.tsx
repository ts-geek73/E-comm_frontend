"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import EmailLogin from "./EmailOTPLogin";
import OtpVerify from "./OtpVerify";
import UserProfile from "./UserProfile";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: "signin" | "signup" | "use";
          }) => void;

          renderButton: (
            container: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number;
              locale?: string;
            }
          ) => void;

          disableAutoSelect: () => void;
          cancel: () => void;
        };
      };
    };
  }

  interface GoogleCredentialResponse {
    credential: string;
    select_by: string;
    clientId?: string;
  }
}

export interface AuthUser {
  email: string;
  name?: string;
  picture?: string;
  verified?: boolean;
  loginMethod?: "google" | "otp";
}

const GoogleLogin = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Add Google type to window

    if (typeof window === "undefined" || !window.google?.accounts) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleLogin,
    });

    if (buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 300,
      });
    }
  }, []);

  const handleGoogleLogin = async ({ credential }: { credential: string }) => {
    try {
      const res = await fetch("/api/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
      });
      const data = await res.json();
      toast.success(data.message);
      const payload = JSON.parse(atob(credential.split(".")[1]));
      setUser({ ...payload, loginMethod: "google" });
    } catch (err) {
      console.log("🚀 ~ handleGoogleLogin ~ err:", err);
      toast.error("Google login failed");
    } finally {
    }
  };

  const logout = () => {
    window.google?.accounts.id.disableAutoSelect();
    window.google?.accounts.id.cancel();
    setUser(null);
    setEmail("");
    setOtpSent(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[87vh] bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-sm text-center space-y-6">
        {!user ? (
          <>
            <h2 className="text-xl font-semibold">Sign in</h2>
            <div ref={buttonRef} className="flex justify-center mb-4" />
            <div className="flex items-center justify-between">
              <hr className="w-full border-gray-300" />
              <span className="px-2 text-sm text-gray-500">or</span>
              <hr className="w-full border-gray-300" />
            </div>
            {!otpSent ? (
              <EmailLogin
                setEmail={setEmail}
                onOtpSent={() => setOtpSent(true)}
              />
            ) : (
              <OtpVerify
                email={email}
                onSuccess={() =>
                  setUser({
                    email,
                    name: email.split("@")[0],
                    loginMethod: "otp",
                    verified: true,
                  })
                }
                onBack={() => setOtpSent(false)}
              />
            )}
          </>
        ) : (
          <UserProfile user={user} onLogout={logout} />
        )}
      </div>
    </div>
  );
};

export default GoogleLogin;
