import type { TaskFormData } from '@/types/index';
import ErrorMessage from '../ErrorMessage'
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

type TaskFormType = {
    register: UseFormRegister<TaskFormData>;
    errors: FieldErrors<TaskFormData>
}

export default function TaskForm({ register, errors }: TaskFormType) {
    return (
        <div className="mb-5 space-y-3">
            <input
                id="name"
                className="w-full p-3 border border-gray-200"
                type="text"
                placeholder="Nombre la tarea"
                {...register("name", {
                    required: "Nombre de tarea obligatorio",
                })}
            />

            {errors.name && (<ErrorMessage>{errors.name.message}</ErrorMessage>)}

            <input
                id="description"
                className="w-full p-3  border border-gray-200"
                type="text"
                placeholder="Descripción"
                {...register("description", {
                    required: "Descripción de la tarea es obligatoria",
                })}
            />

            {errors.description && (<ErrorMessage>{errors.description.message}</ErrorMessage>)}
        </div>
    )
}
