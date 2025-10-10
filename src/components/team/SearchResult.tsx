import { addMemberToProject } from "@/api/TeamAPI"
import type { TeamMember } from "@/types/index"
import { useMutation } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember;
    reset: () => void
}

export default function SearchResult({ user, reset }: SearchResultProps) {
    const params = useParams()
    const projectId = params.projectId!

    const { mutate } = useMutation({
        mutationFn: addMemberToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const handleAddMember = () => {
        const data = {
            id: user._id,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <p className="my-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button onClick={handleAddMember} className="text-violet-600 hover:bg-violet-100 px-10 py-3 font-bold cursor-pointer">Agregar al proyecto</button>
            </div>
        </>
    )
}
