import { deleteNote } from "@/api/NoteAPI"
import { formatDate } from "@/helpers/index"
import { useAuth } from "@/hooks/useAuth"
import type { Note, } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
  note: Note
}

export default function NoteDetail({ note }: NoteDetailProps) {
  const { data, isLoading } = useAuth()
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

  const params = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const queryClient = useQueryClient()

  const taskId = queryParams.get('viewTask')!
  const projectId = params.projectId!
  const noteId = note._id

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    }
  })

  const handleDeleteButton = () => {
    mutate({ projectId, taskId, noteId })
  }

  if (isLoading) return 'Cargando...'

  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>{note.content} por: <span className="font-bold">{note.createdBy.name}</span> </p>
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>
      {canDelete && (<button onClick={handleDeleteButton} className="p-2 bg-red-500 hover:bg-red-400 text-white font-bold text-xs cursor-pointer">Eliminar</button>)}

    </div>

  )
}
