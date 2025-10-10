import { createProject } from "@/api/ProjectAPI";
import ProjectForm from "@/components/projects/ProjectForm";
import type { ProjectFormData } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateProjectView() {
    const navigate = useNavigate()

    const initialState: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialState })

    const { mutate } = useMutation({
        mutationFn: createProject,
        onSuccess: (data) => {
            navigate('/')
            toast.success(data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const handleForm = (formData: ProjectFormData) => mutate(formData)

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl font-black">Crear Proyecto</h1>
            <p className="text-2xl text-gray-500 font-light mt-5">LLena el siguiente formulario para crear un proyecto</p>
            <nav className="my-5">
                <Link to={'/'} className="bg-violet-500 hover:bg-violet-400 text-white px-5 py-3 font-bold transition-colors">Volver a Proyectos</Link>
            </nav>

            <form className="p-5 bg-white rounded-xl mt-10" onSubmit={handleSubmit(handleForm)} noValidate>
                <ProjectForm register={register} errors={errors} />
                <input
                    type="submit"
                    value={'Crear Proyecto'}
                    className="bg-violet-500 hover:bg-violet-400 text-white p-2 w-full uppercase cursor-pointer font-bold text-sm transition-colors"
                />
            </form>
        </div>
    )
}
