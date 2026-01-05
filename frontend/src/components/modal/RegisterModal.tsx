import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useModalStore } from "../../store/modalStore";
import { useForm, type FieldValues } from "react-hook-form";
import { useRegisterMutation } from "../../hooks/mutations";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { IUser } from "../../utils/types";

export function RegisterModal() {
  const navigate = useNavigate()
  const openRegisterModal = useModalStore((state) => state.openRegisterModal)
  const setOpenRegisterModal = useModalStore((state) => state.setOpenRegisterModal)
  const onCloseRegisterModal = () => setOpenRegisterModal(false)

  const onSuccessHandler = (user: IUser) => {
    navigate("/verify-email", { state: { email: user.email } })
  }

  const { register, handleSubmit } = useForm()
  const { mutate, isPending, error } = useRegisterMutation(onSuccessHandler)
  const handleRegister = (formData: FieldValues) => mutate(formData)
  return (
    <>
      <Modal show={openRegisterModal} size="md" onClose={onCloseRegisterModal} popup>
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create an account</h3>
            {axios.isAxiosError(error) && <p className="text-red-500 text-sm">{error?.response?.data?.message}</p>}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name">Your username</Label>
              </div>
              <TextInput
                id="name"
                placeholder="Enter your username"
                {...register("username")}
              />
            </div>
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirm-password">Confirm your password</Label>
              </div>
              <TextInput id="confirm-password" type="password" placeholder="Confirm your password" {...register("confirmPassword")} />
            </div>
            <div>
              <Button disabled={isPending} type="submit" className="w-full">{isPending ? "Creating" : "Create an account"}</Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
