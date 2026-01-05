import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Button, TextInput } from "flowbite-react";
import { useForm, type FieldValues } from "react-hook-form";
import { useResetPassword, useSendingResetOTP } from "../../hooks/mutations";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email;
  const [countdown, setCountdown] = React.useState<number>(0);

  const { register, handleSubmit } = useForm();
  const { mutate, isPending, error } = useResetPassword(() => navigate("/"));
  const handleResetPassword = (formData: FieldValues) => mutate(formData);

  const sendResetOtpMutation = useSendingResetOTP();
  const handleResendOTP = () =>
    sendResetOtpMutation.mutate(email, {
      onSuccess: () => setCountdown(60),
    });

  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl border border-gray-100"
        >
          <h1 className="text-center font-bold text-3xl text-gray-800 mb-2">
            Reset Your Password
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
            <TextInput placeholder="Enter 6-digit code" {...register("otp")} />
            <TextInput value={email} type="hidden" {...register("email")} />

            <div className="mt-2 text-right">
              <button
                disabled={sendResetOtpMutation.isPending || countdown > 0}
                onClick={handleResendOTP}
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition"
              >
                {sendResetOtpMutation.isPending
                  ? "Sending"
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend OTP"}
              </button>
            </div>
          </div>

          <TextInput
            placeholder="Enter new password"
            {...register("newPassword")}
            className="mb-6"
            type="password"
          />

          <TextInput
            placeholder="Confirm new password"
            {...register("confirmNewPassword")}
            className="mb-6"
            type="password"
          />

          <Button
            disabled={isPending}
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            {isPending ? "Reseting" : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
