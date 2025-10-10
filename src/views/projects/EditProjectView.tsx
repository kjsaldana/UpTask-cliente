import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"

export default function EditProjectView() {
    const param = useParams()
    const projectId = param.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    if (isError) return <Navigate to='404' />
    if (isLoading) return 'Cargando...'
    if (data) return <EditProjectForm data={data} projectId={projectId} />
}
