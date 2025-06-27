"use client";

import { sendOTPFunction, verifyOTPFUnction } from "@/components/Functions/cart-address";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: 'outline' | 'filled_blue' | 'filled_black';
              size: 'small' | 'medium' | 'large';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            }
          ) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface AuthUser {
  email: string;
  name?: string;
  picture?: string;
  verified?: boolean;
  loginMethod?: 'google' | 'otp';
}

const GoogleLogin = () => {
const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const buttonDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.google ||
      !window.google.accounts
    ) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log("Google Client ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    if (!clientId) return;

    if (window.google && buttonDiv.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonDiv.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 300,
      });
    }
  }, [user]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
    const token = response.credential;
    setLoading(true);

    try {
      const res = await fetch("/api/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      const data = await res.json();
      toast.success(data.message);

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
    setOtpSent(false);
    setEmail("");
    setOtp("");
    setCountdown(0);
  };

  const sendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setOtpLoading(true);
    try {
      await sendOTPFunction(email);
      setOtpSent(true);
      setCountdown(60); // 60 seconds countdown
      setOtp(""); // Clear any previous OTP
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setVerifyLoading(true);
    console.log("paass 1");

    try {
      const result = await verifyOTPFUnction(email, otp);
      console.log(result);

      if (result) {
        setUser({
          email: email,
          name: email.split('@')[0].split('.').join(" "), 
          verified: true,
          loginMethod: 'otp'
        });
        setOtpSent(false);
        setOtp("");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;

    setOtpLoading(true);
    try {
      await sendOTPFunction(email);
      setCountdown(60);
      setOtp("");
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  const goBackToEmail = () => {
    setOtpSent(false);
    setOtp("");
    setCountdown(0);
  };

  return (
    <div className="flex items-center justify-center min-h-[87vh] bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-sm text-center space-y-6">
        {!user ?
          (
            <>
              {!otpSent ? (
                <>
                  <h2 className="text-xl font-semibold">Sign in</h2>
                  <div ref={buttonDiv} className="flex justify-center" />
                  {loading && (
                    <p className="text-sm text-gray-500">Processing Google login...</p>
                  )}

                  <div className="flex items-center justify-between">
                    <hr className="w-full border-gray-300" />
                    <span className="px-2 text-sm text-gray-500">or</span>
                    <hr className="w-full border-gray-300" />
                  </div>

                  <div className="space-y-4 text-left">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com"
                      disabled={otpLoading}
                    />
                    <button
                      onClick={sendOTP}
                      disabled={otpLoading}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpLoading ? "Sending OTP..." : "Continue with Email"}
                    </button>
                  </div>
                </>
              ) : (
                // OTP verification step
                <>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Verify OTP</h2>
                    <p className="text-sm text-gray-600">
                      {`We've sent a 6-digit code to`}
                    </p>
                    <p className="text-sm font-medium text-gray-800">{email}</p>
                  </div>

                  <div className="space-y-4 text-left">
                    <label className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      maxLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                      placeholder="000000"
                      disabled={verifyLoading}
                    />
                    <button
                      onClick={verifyOTP}
                      disabled={verifyLoading || otp.length !== 6}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifyLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={resendOTP}
                      disabled={countdown > 0 || otpLoading}
                      className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {countdown > 0
                        ? `Resend OTP in ${countdown}s`
                        : otpLoading
                          ? "Sending..."
                          : "Resend OTP"
                      }
                    </button>

                    <button
                      onClick={goBackToEmail}
                      className="block w-full text-sm text-gray-600 hover:text-gray-700 border border-gray-300 py-2 rounded-lg"
                    >
                      Change Email
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            // User logged in state
            <div className="space-y-4">
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt="User profile"
                  fill
                  loading="lazy" 
                  className="w-16 h-16 rounded-full mx-auto"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-medium">{user.name || user.email}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
              {user.loginMethod === 'otp' && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Email Verified
                </div>
              )}
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