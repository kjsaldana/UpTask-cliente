import { useForm } from "react-hook-form";
import type { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {

    const initialValues: UserRegistrationForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const password = watch('password')

    const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

    return (
        <>
            <h1 className="text-5xl font-black text-white">Crear Cuenta</h1>
            <p className="text-2xl font-light text-white mt-5">
                Llena el formulario para {''}
                <span className=" text-violet-500 font-bold"> crear tu cuenta</span>
            </p>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className="space-y-8 p-10  bg-white mt-10"
                noValidate
            >
                <div className="flex flex-col">
                    <input
                        id="email"
                        type="email"
                        placeholder="Correo de registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El correo de registro es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col">
                    <input
                        type="name"
                        placeholder="Nombre de registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("name", {
                            required: "El Nombre de usuario es obligatorio",
                        })}
                    />
                    {errors.name && (
                        <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col">
                    <input
                        type="password"
                        placeholder="Contraseña de registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "La contraseña es obligatorio",
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

                <div className="flex flex-col">
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite contraseña de registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password_confirmation", {
                            required: "Repetir la contraseña es obligatorio",
                            validate: value => value === password || 'Los Passwords no son iguales'
                        })}
                    />

                    {errors.password_confirmation && (
                        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Registrarme'
                    className="bg-violet-600 hover:bg-violet-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>

            <nav className="pt-10 text-white text-center flex flex-col space-y-4">
                <Link to={'/acceso/iniciar-sesion'}>¿Ya estas registrado? Inicia sesión</Link>
                <Link to={'/acceso/olvide-contrasena'}>¿Olvide Contraseña? restablecer</Link>
            </nav>
        </>
    )
}