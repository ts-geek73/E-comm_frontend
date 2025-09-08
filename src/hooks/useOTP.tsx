import { sendOTPFunction, verifyOTPFUnction } from "@components/Functions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useOTP = () => {
  const sendOtpMutation = useMutation({
    mutationFn: sendOTPFunction,
    onSuccess: () => {
      toast.success("OTP sent successfully");
    },
    onError: () => {
      toast.error("Failed to send OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOTPFUnction(email, otp),
    onSuccess: () => {
      toast.success("OTP verified");
    },
    onError: () => {
      toast.error("OTP verification failed");
    },
  });

  return {
    sendOtp: sendOtpMutation.mutate,
    isSending: sendOtpMutation.isPending,
    verifyOtp: verifyOtpMutation.mutate,
    isVerifying: verifyOtpMutation.isPending,
  };
};

export default useOTP;
