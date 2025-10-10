import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import type { TeamMemberForm } from "@/types/index";
import { getMemberByEmail } from "@/api/TeamAPI";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const initialValues: TeamMemberForm = {
        email: ''
    }
    const params = useParams()
    const projectId = params.projectId!

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const mutation = useMutation({
        mutationFn: getMemberByEmail
    })

    const handleSearchUser = async(formData: TeamMemberForm) => {
        const data = {
            formData,
            projectId
        }
        mutation.mutate(data)
    }

    const resetData = () => {
        reset(),
        mutation.reset()
        navigate(location.pathname, {replace: true})
        queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
    }

    return (
        <>
            <form className="mt-10 space-y-5" onSubmit={handleSubmit(handleSearchUser)} noValidate>
                <div>
                    <input
                        id="name"
                        type="text"
                        placeholder="Correo electrónico"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El Correo es obligatorio",
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

                <input
                    type="submit"
                    className=" bg-violet-600 hover:bg-violet-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value='Buscar Usuario'
                />
            </form>
            <div className="mt-10">
                {mutation.isPending && <p className="text-center">Cargando...</p>}
                {mutation.error && <p className="text-center">{mutation.error.message}</p>}
                {mutation.data && <SearchResult user={mutation.data} reset={resetData} />}
            </div>
        </>
    )
}