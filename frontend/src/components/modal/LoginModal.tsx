import { Button, Checkbox, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useForm, type FieldValues } from "react-hook-form";
import axios from "axios";
import { useModalStore } from "../../store/modalStore";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../hooks/mutations";
import type { IUser } from "../../utils/types";

export function LoginModal() {
  const navigate = useNavigate()

  const openLoginModal = useModalStore((state) => state.openLoginModal)
  const setOpenLoginModal = useModalStore((state) => state.setOpenLoginModal)
  const setOpenRegisterModal = useModalStore((state) => state.setOpenRegisterModal)

  const onSuccessHandler = (user: IUser) => {
    if(!user.isEmailVerified){
      navigate("/verify-email", { state: {email: user.email} })
    } else {
      navigate("/")
    }
  }

  const { register, handleSubmit } = useForm()
  const { mutate, isPending, error } = useLoginMutation(onSuccessHandler)
  const handleLogin = (formData: FieldValues) => mutate(formData)
  const onCloseLoginModal = () => setOpenLoginModal(false)

  return (
    <>
      <Modal show={openLoginModal} size="md" onClose={onCloseLoginModal} popup>
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
            {axios.isAxiosError(error) && <p className="text-red-500 text-sm">{error?.response?.data?.message}</p>}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Your email</Label>
              </div>
              <TextInput
                id="email"
                placeholder="Enter your email"
                {...register("email")}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Your password</Label>
              </div>
              <TextInput id="password" type="password" placeholder="Enter your password" {...register("password")} />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary-700 hover:underline dark:text-primary-500">
                Forgot Password?
              </Link>
            </div>
            <div>
              <Button type="submit" disabled={isPending} className="w-full">{isPending ? "Logging in..." : "Login"}</Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <span onClick={() => {setOpenRegisterModal(true); setOpenLoginModal(false)}} className="text-primary-700 hover:underline dark:text-primary-500 cursor-pointer">
                Create account
              </span>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
