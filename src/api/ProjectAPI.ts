
import { isAxiosError } from "axios";
import api from "../lib/axios";
import { dashboardProjectSchema, editProjectSchema, projectSchema, type Project, type ProjectFormData } from "../types";

type ProjectAPIType = {
    formData: ProjectFormData;
    projectId: Project['_id']
}

export async function createProject(formData: ProjectFormData) {
    try {
        const { data } = await api.post<string>('/projects', formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getAllProjects() {
    try {
        const { data } = await api('/projects')
        const result = dashboardProjectSchema.safeParse(data)
        if (result.success) return result.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectById(id: Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const result = editProjectSchema.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getFullProject(id: Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const result = projectSchema.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateProject({ formData, projectId }: Pick<ProjectAPIType, 'formData' | 'projectId'>) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteProject(id: Project['_id']) {
    try {
        const { data } = await api.delete<string>(`/projects/${id}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}