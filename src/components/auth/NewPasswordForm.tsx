import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { ConfirmToken, NewPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { setNewPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

type NewPasswordFormProps = {
    token: ConfirmToken['token']
}

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
    const navigate = useNavigate()
    const initialValues: NewPasswordForm = {
        password: '',
        password_confirmation: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: setNewPassword,
        onError: error => {
            toast.error(error.message)
        },
        onSuccess: data => {
            toast.success(data)
            reset()
            navigate('/acceso/iniciar-sesion')
        }
    })

    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            formData,
            token
        }
        mutate(data)
    }

    const password = watch('password');

    return (
        <>
            <h1 className="text-5xl font-black text-white">Ingresa tu nueva contraseña</h1>
            <form onSubmit={handleSubmit(handleNewPassword)} className="space-y-8 p-10  bg-white mt-10" noValidate>
                <div className="flex flex-col gap-5">
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="w-full p-3 border-gray-300 border"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 8,
                                message: 'La contraseña debe ser mínimo de 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite nueva contraseña"
                        className="w-full p-3 border-gray-300 border"
                        {...register("password_confirmation", {
                            required: "Repetir Contraseña es obligatorio",
                            validate: value => value === password || 'Las contreseñas no coinciden'
                        })}
                    />

                    {errors.password_confirmation && (
                        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Guardar cambios'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}