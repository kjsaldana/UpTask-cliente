import z from "zod";

// AUTH & USER

export const authSchema = z.object({
    email: z.email(),
    name: z.string(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'email' | 'name' | 'password' | 'password_confirmation'>
export type ChangePasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ConfirmToken = Pick<Auth, 'token'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type CheckPasswordForm = Pick<Auth, 'password'>

// USERS

export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({ _id: z.string() })

export type User = z.infer<typeof userSchema>
export type UserFormData = Pick<User, 'name' | 'email'>

// NOTES

export const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: userSchema,
    task: z.string(),
    createdAt: z.string()
})

export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'>

// TASKS

export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    responsable: z.string(),
    description: z.string(),
    project: z.string(),
    completedBy: z.array(z.object({
        _id: z.string(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(noteSchema),
    status: taskStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string()
})

export const taskProjectSchema = taskSchema.pick({
    _id: true,
    name: true,
    responsable: true,
    description: true,
    status: true
})

export type Task = z.infer<typeof taskSchema>
export type TaskProject = z.infer<typeof taskProjectSchema>
export type TaskFormData = Pick<Task, 'name' | 'description' | 'responsable'>

// PROJECTS

export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
    tasks: z.array(taskProjectSchema),
    team: z.array(z.string())
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        clientName: true,
        projectName: true,
        description: true,
        manager: true
    })
)

export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true
})

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>

// TEAMS

export const teamMemberSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string()
})

export const teamProjectSchema = z.array(teamMemberSchema)

export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>