import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { Task, TaskFormData } from '@/types/index';
import TaskForm from './TaskForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

type EditTaskModalProps = {
    data: Task
}

export default function EditTaskModal({ data }: EditTaskModalProps) {
    const navigate = useNavigate()
    const { project: projectId, _id: taskId } = data
    const queryClient = useQueryClient()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
        defaultValues: {
            name: data.name,
            description: data.description
        }
    })

    const { mutate } = useMutation({
        mutationFn: updateTask,
        onSuccess: (data) => {
            toast.success(data)
            navigate(location.pathname, { replace: true })
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
            queryClient.invalidateQueries({ queryKey: ['task', taskId] })
            reset
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleForm = (formData: TaskFormData) => {
        const data = {
            projectId,
            taskId,
            formData
        }
        mutate(data)
    }

    return (
        <Transition appear show={true} as={Fragment}>
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
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                <DialogTitle
                                    as="h3"
                                    className="font-black text-4xl  my-5"
                                >
                                    Editar Tarea
                                </DialogTitle>

                                <p className="text-xl font-bold">Realiza cambios a una tarea en {''}
                                    <span className="text-violet-600">este formulario</span>
                                </p>

                                <form
                                    className="mt-10 space-y-3"
                                    onSubmit={handleSubmit(handleForm)}
                                    noValidate
                                >
                                    <TaskForm register={register} errors={errors} />

                                    <input
                                        type="submit"
                                        className=" bg-violet-600 hover:bg-violet-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                                        value='Guardar cambios'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}