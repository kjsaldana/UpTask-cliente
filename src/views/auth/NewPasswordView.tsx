import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"
import { useState } from "react"
import type { ConfirmToken } from "@/types/index"

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [validate, setValidate] = useState(false)

    return (
        <>
            {!validate ? <NewPasswordToken token={token} setToken={setToken} setValidate={setValidate} /> : <NewPasswordForm token={token} />}
        </>
    )
}