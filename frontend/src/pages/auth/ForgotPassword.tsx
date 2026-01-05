import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { IoMdLock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextInput } from "flowbite-react";
import { useForgotPassword } from "../../hooks/mutations";
import { Header } from "../../components/header/Header";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { mutate, error, isPending } = useForgotPassword()
  const handleForgotPassword = (data: FieldValues) => mutate(data,{
    onSuccess: () => navigate("/reset-password", { state: { email: data.email } }),
    onError: (err) => console.log(err)
  })

  return (
    <React.Fragment>
      <Header/>
      <div className="flex min-h-screen items-center justify-center p-4">
        <form onSubmit={handleSubmit(handleForgotPassword)} className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
          <div className="flex justify-center mb-4">
            <span className="bg-blue-50 p-3 rounded-full">
              <IoMdLock className="text-2xl text-blue-600" />
            </span>
          </div>
          <h1 className="text-center font-bold text-3xl text-gray-800 mb-2">
            Forgot Password?
          </h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            Enter the email address associated with your account, and we will
            send Reset OTP to your email to reset your password.
          </p>
          {axios.isAxiosError(error) && (
            <p className="text-red-500 text-sm mb-2">
              {error?.response?.data?.message}
            </p>
          )}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <TextInput
              placeholder="Enter your email"
              id="email"
              {...register("email")}
            />
          </div>
          <Button
            disabled={isPending}
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            {isPending ? "Requesting" : "Request Reset OTP"}
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
