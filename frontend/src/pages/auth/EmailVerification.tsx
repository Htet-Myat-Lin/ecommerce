import { useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { IoMdMail } from "react-icons/io";
import { Button, TextInput } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { useForm, type FieldValues } from "react-hook-form";
import {
  useEmailVerification,
  useSendingEmailVerifyOTP,
} from "../../hooks/mutations";
import axios from "axios";
import { useEffect, useState } from "react";

export function EmailVerification() {
  const [countdown, setCountdown] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { register, handleSubmit } = useForm();
  const { mutate, isPending, error } = useEmailVerification(() =>
    navigate("/")
  );
  const handleVerification = (formData: FieldValues) => mutate(formData);

  const sendEmailOTPMutation = useSendingEmailVerifyOTP();
  const handleResendOTP = () => {
    sendEmailOTPMutation.mutate(email,{
      onSuccess: () => setCountdown(60)
    });
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1),1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <form
          onSubmit={handleSubmit(handleVerification)}
          className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl border border-gray-100"
        >
          <div className="flex justify-center mb-4">
            <span className="bg-blue-50 p-3 rounded-full">
              <IoMdMail className="text-2xl text-blue-600" />
            </span>
          </div>

          <h1 className="text-center font-bold text-3xl text-gray-800 mb-2">
            Email Verification
          </h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            We've sent a 6-digit code to{" "}
            <span className="text-blue-600">{email}</span>
            <br />
            Enter the code below to continue.
          </p>

          {axios.isAxiosError(error) && (
            <p className="text-red-500 text-sm mb-2">
              {error?.response?.data?.message}
            </p>
          )}

          <div className="mb-6">
            <label
              htmlFor="otp-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <TextInput
              placeholder="Enter 6-digit code"
              id="otp-input"
              {...register("otp")}
            />
            <TextInput value={email} type="hidden" {...register("email")} />

            <div className="mt-2 text-right">
              <button
                disabled={sendEmailOTPMutation.isPending || countdown > 0}
                onClick={handleResendOTP}
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition"
              >
                {sendEmailOTPMutation.isPending
                ? "Sending" 
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend OTP"}
              </button>
            </div>
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            {isPending ? "Verifying" : "Verify Email"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              Having trouble?{" "}
              <a href="#" className="text-blue-400 hover:text-blue-500">
                Contact Support
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
