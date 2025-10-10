import type { NoteFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteAPI"
import { toast } from "react-toastify"
import { useLocation, useParams } from "react-router-dom"

export default function AddNoteForm() {
    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const queryClient = useQueryClient()

    const taskId = queryParams.get('viewTask')!
    const projectId = params.projectId!

    const initialState: NoteFormData = {
        content: ''
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: initialState })

    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['task', taskId] })
            reset()
        }
    })

    const handleAddNote = (formData: NoteFormData) => {
        mutate({ projectId, taskId, formData })
    }

    return (
        <form onSubmit={handleSubmit(handleAddNote)} className='space-y-3' noValidate>
            <div className='flex flex-col gap-2'>
                <label htmlFor="content" className='font-bold'>Nueva Nota</label>
                <input
                    id='content'
                    type="text"
                    placeholder='Contenido de la nota'
                    className='w-full p-3 border border-gray-300'
                    {...register('content', { required: 'El contenido de la nota obligatorio' })}
                />
                {errors.content && (<ErrorMessage>{errors.content.message}</ErrorMessage>)}

            </div>
            <input type="submit" value='Crear nota' className='bg-violet-600 hover:bg-violet-700 w-full p-2 text-white font-black cursor-pointer' />
        </form>
    )
}
