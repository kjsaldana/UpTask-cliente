import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { ChangePasswordForm, UserFormData } from "../types";

export async function updateProfile(formData: UserFormData) {
    const url = "/auth/profile"
    try {
        const { data } = await api.put<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function changePassword(formData: ChangePasswordForm) {
    const url = "/auth/update-password"
    try {
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}