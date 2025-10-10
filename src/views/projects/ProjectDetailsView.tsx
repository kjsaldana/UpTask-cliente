import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskList from "@/components/tasks/TaskList"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { isManager } from "@/helpers/policies"
import { useAuth } from "@/hooks/useAuth"
import { UserIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/20/solid"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

export default function ProjectDetailsView() {
    const param = useParams()
    const navigate = useNavigate()
    const projectId = param.projectId!

    const { data: user, isLoading: authLoading } = useAuth()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProject(projectId),
        retry: false
    })

    const canEdit = useMemo(() => data?.manager === user?._id, [data, user])

    if (isError) return <Navigate to='404' />
    if (isLoading && authLoading) return 'Cargando...'
    if (data && user) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>
            {isManager(data.manager, user._id) && (
                <nav className="my-5 flex gap-3">
                    <button
                        className="bg-violet-500 hover:bg-violet-600 px-7 py-3 text-white text-xl font-bold cursor-pointer transition-colors flex items-center gap-1"
                        type="button"
                        onClick={() => navigate(location.pathname + '?newTask=true')}
                    >
                        Agregar tarea
                        <ClipboardDocumentCheckIcon className='w-6 h-6 text-white' />
                    </button>
                    <Link to={'team'} className="bg-violet-500 hover:bg-violet-600 px-7 py-3 text-white text-xl font-bold cursor-pointer transition-colors flex items-center gap-1">
                        Colaboradores
                        <UserIcon className='w-6 h-6 text-white' />
                    </Link>
                </nav>
            )}
            <TaskList tasks={data.tasks} canEdit={canEdit} />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}
