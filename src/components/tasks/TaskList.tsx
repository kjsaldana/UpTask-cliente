import type { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { groupTranslation } from "@/locale/es";
import DropTask from "./DropTask";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

type TaskListProps = {
    tasks: TaskProject[];
    canEdit: boolean
}

type TaskGroupType = {
    [key: string]: TaskProject[]
}

const initialStateGroup: TaskGroupType = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}

const statusStyles: { [key: string]: string } = {
    pending: 'border-t-slate-400',
    onHold: 'border-t-orange-400',
    inProgress: 'border-t-blue-400',
    underReview: 'border-t-yellow-400',
    completed: 'border-t-emerald-400',
}


export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const params = useParams()
    const projectId = params.projectId!

    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate(location.pathname, { replace: true })
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        }
    })

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : []
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup }
    }, initialStateGroup)

    // Configuración de DndContext con dnd-kit
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    // Proceso final de arrastre de elementos con dnd-kit
    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e

        if (over && over.id) {
            const taskId = active.id.toString()
            const status = over.id as TaskStatus
            mutate({ taskId, projectId, status })

            // Optimistic Update
            queryClient.setQueryData(['project', projectId], (prevData: Project) => {
                const updatedTasks = prevData.tasks.map((task) => {
                    if (task._id === taskId) {
                        return { ...task, status }
                    }
                    return task
                })
                return {
                    ...prevData, tasks: updatedTasks
                }
            })
        }
    }


    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] xl:min-w-0 xl:w-1/5'>
                            <h3
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
                            >
                                {groupTranslation[status]}
                            </h3>
                            <DropTask status={status} />
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}
