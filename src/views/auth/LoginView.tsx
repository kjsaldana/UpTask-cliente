import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { UserLoginForm } from "@/types/index";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { autenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const initialValues: UserLoginForm = {
        email: '',
        password: '',
    }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: autenticateUser,
        onError: error => {
            toast.error(error.message)
        },
        onSuccess: () => {
            setTimeout(() => {
                toast.success('Bienvenido!')
            }, 300);
            navigate('/')
            queryClient.removeQueries({queryKey: ['user']})
        }
    })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <>
            <h1 className="text-5xl font-black text-white">Iniciar Sesión</h1>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-8 p-10 mt-10 bg-white" noValidate>
                <div className="flex flex-col">
                    <input
                        id="email"
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El correo es obligatorio",
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
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "El Password es obligatorio",
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Iniciar Sesión'
                    className="bg-violet-600 hover:bg-violet-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>

            <nav className="pt-10 text-white text-center flex flex-col space-y-4">
                <Link to={'/acceso/registrar'}>¿No tienes cuenta? Únete</Link>
                <Link to={'/acceso/olvide-contrasena'}>¿Olvide Contraseña? restablecer</Link>
            </nav>
        </>
    )
}