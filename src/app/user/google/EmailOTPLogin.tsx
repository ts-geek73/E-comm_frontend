import { useOTP } from "@/hooks";
import { useState } from "react";

export default function EmailLogin({
  onOtpSent,
  setEmail,
}: {
  onOtpSent: () => void;
  setEmail: (email: string) => void;
}) {
  const [input, setInput] = useState("");
  const { sendOtp, isSending } = useOTP();

  const handleSend = () => {
    if (!input) return;
    setEmail(input);
    sendOtp(input, {
      onSuccess: () => onOtpSent(),
    });
  };

  return (
    <div className="space-y-4 text-left">
      <label className="block text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        type="email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
        placeholder="you@example.com"
        disabled={isSending}
      />
      <button
        onClick={handleSend}
        disabled={isSending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {isSending ? "Sending OTP..." : "Continue with Email"}
      </button>
    </div>
  );
}
