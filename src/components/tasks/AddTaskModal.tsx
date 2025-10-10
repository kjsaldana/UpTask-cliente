import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { TaskFormData } from '@/types/index';
import TaskForm from './TaskForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask') ? true : false

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
        defaultValues: {
            name: "",
            description: ""
        }
    })

    const params = useParams()
    const projectId = params.projectId!

    const handleForm = (formData: TaskFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createTask,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, { replace: true })
        },
        onError: (error) => {
            toast.error(error.message)
        } 
    })

    return (
        <>
            <Transition appear show={modalTask} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <DialogTitle
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </DialogTitle>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-violet-600">una tarea</span>
                                    </p>

                                    <form className='mt-10 space-y-3' onSubmit={handleSubmit(handleForm)} noValidate>
                                        <TaskForm register={register} errors={errors} />
                                        <input type="submit" value={'Crear tarea'} className='bg-violet-600 hover:bg-violet-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors' />
                                    </form>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}