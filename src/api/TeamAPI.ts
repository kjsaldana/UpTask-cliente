import api from "@/lib/axios"
import { type TeamMember, type TeamMemberForm, type Project, teamProjectSchema } from "../types"
import { isAxiosError } from "axios"

export const getMemberByEmail = async ({ formData, projectId }: { formData: TeamMemberForm, projectId: Project['_id'] }) => {
    try {
        const url = `/projects/${projectId}/team/find`
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const addMemberToProject = async ({ id, projectId }: { id: TeamMember['_id'], projectId: Project['_id'] }) => {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api.post<string>(url, { id })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getProjectTeam = async (projectId: Project['_id']) => {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api(url)
        const result = teamProjectSchema.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const removeMemberFromProject = async ({ userId, projectId }: { userId: TeamMember['_id'], projectId: Project['_id'] }) => {
    try {
        const url = `/projects/${projectId}/team/${userId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}