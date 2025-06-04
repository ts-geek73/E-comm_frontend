"use client";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const GoogleLogin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const buttonDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.google ||
      !window.google.accounts
    ) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    if (window.google && buttonDiv.current) {

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.prompt({
        ux_mode: "redirect"
      });


      window.google.accounts.id.renderButton(buttonDiv.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 300,
      });
    }


  }, [user]);

  const handleCredentialResponse = async (response: any) => {
    const token = response.credential;
    setLoading(true);

    try {
      const res = await fetch("/api/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      const data = await res.json();
      // console.log("Backend verified:", data);
      toast.success(data.message)

      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Error sending token to backend", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    window.google.accounts.id.disableAutoSelect();
    window.google.accounts.id.cancel();

    setUser(null);
    console.log("User signed out");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-sm text-center space-y-4">
        {(user === null && !user) ? (
          <>
            <h2 className="text-xl font-semibold">Sign in with Google</h2>
            {loading && (
              <p className="text-sm text-gray-500">Processing...</p>
            )}
            <div ref={buttonDiv} className="flex justify-center" />
          </>
        ) : (
          <div className="space-y-4">
            <img
              src={user.picture}
              alt="User profile"
              loading="lazy"
              className="w-16 h-16 rounded-full mx-auto"
            />
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleLogin;
