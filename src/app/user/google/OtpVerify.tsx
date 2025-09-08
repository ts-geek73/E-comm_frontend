import { useOTP } from "@/hooks";
import { useEffect, useState } from "react";

export default function OtpVerify({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);

  const { verifyOtp, isVerifying, sendOtp, isSending } = useOTP();

  useEffect(() => {
    const timer =
      countdown > 0
        ? setTimeout(() => setCountdown((p) => p - 1), 1000)
        : undefined;
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length === 6) {
      verifyOtp({ email, otp }, { onSuccess });
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    sendOtp(email, { onSuccess: () => setCountdown(60) });
  };

  return (
    <>
      <h2 className="text-xl font-semibold">Verify OTP</h2>
      <p className="text-sm">
        Code sent to <b>{email}</b>
      </p>

      <input
        type="text"
        inputMode="numeric"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        onPaste={(e) => {
          e.preventDefault();
          const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
          setOtp(pasted);
        }}
        maxLength={6}
        autoComplete="one-time-code"
        className="w-full px-3 py-2 border rounded-lg text-center"
        placeholder="000000"
        disabled={isVerifying}
      />
      <button
        onClick={handleVerify}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2"
        disabled={isVerifying || otp.length !== 6}
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        onClick={handleResend}
        disabled={countdown > 0 || isSending}
        className="text-sm text-blue-600 mt-2"
      >
        {countdown > 0
          ? `Resend OTP in ${countdown}s`
          : isSending
            ? "Sending..."
            : "Resend OTP"}
      </button>

      <button onClick={onBack} className="text-sm text-gray-600 mt-2">
        Change Email
      </button>
    </>
  );
}
