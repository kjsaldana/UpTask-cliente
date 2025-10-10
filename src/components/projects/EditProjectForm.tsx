import type { Project, ProjectFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import ProjectForm from './ProjectForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/api/ProjectAPI'
import { toast } from 'react-toastify'

type EditProjectFormProps = {
    data: ProjectFormData,
    projectId: Project['_id']
}

export default function EditProjectForm({ data, projectId }: EditProjectFormProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            projectName: data.projectName,
            clientName: data.clientName,
            description: data.description
        }
    })

    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] })
            navigate('/')
            toast.success(data)
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl font-black">Editar Proyecto</h1>
            <p className="text-2xl text-gray-500 font-light mt-5">Modifica los datos de tu proyecto</p>
            <nav className="my-5">
                <Link to={'/'} className="bg-violet-500 hover:bg-violet-400 text-white px-5 py-3 font-bold transition-colors">Volver a Proyectos</Link>
            </nav>

            <form className="p-5 bg-white rounded-xl mt-10" onSubmit={handleSubmit(handleForm)} noValidate>
                <ProjectForm register={register} errors={errors} />
                <input
                    type="submit"
                    value={'Guardar Cambios'}
                    className="bg-violet-500 hover:bg-violet-400 text-white p-2 w-full uppercase cursor-pointer font-bold text-sm transition-colors"
                />
            </form>
        </div>
    )
}
