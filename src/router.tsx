import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import DashboardView from "@/views/DashboardView";
import CreateProjectView from "@/views/projects/CreateProjectView";
import EditProjectView from "@/views/projects/EditProjectView";
import ProjectDetailsView from "@/views/projects/ProjectDetailsView";
import AuthLayout from "@/layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import RequestNewCodeView from "./views/auth/RequestNewCodeView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import NewPasswordView from "./views/auth/NewPasswordView";
import ProjectTeamView from "./views/projects/ProjectTeamView";
import ProfileLayout from "./views/profile/ProfileLayout";
import ProfileView from "./views/profile/ProfileView";
import ChangePasswordView from "./views/profile/ChangePasswordView";
import NotFound from "./views/404/NotFound";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <DashboardView /> },
            { path: '/proyectos/crear', element: <CreateProjectView /> },
            { path: '/proyectos/:projectId/', element: <ProjectDetailsView /> },
            { path: '/proyectos/:projectId/editar', element: <EditProjectView /> },
            { path: '/proyectos/:projectId/team', element: <ProjectTeamView /> },
            {
                element: <ProfileLayout />, children: [
                    { path: '/perfil', element: <ProfileView /> },
                    { path: '/perfil/contrasena', element: <ChangePasswordView /> }
                ]
            }
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: '/acceso/iniciar-sesion', element: <LoginView /> },
            { path: '/acceso/registrar', element: <RegisterView /> },
            { path: '/confirmar-cuenta', element: <ConfirmAccountView /> },
            { path: '/solicitar-codigo', element: <RequestNewCodeView /> },
            { path: '/acceso/olvide-contrasena', element: <ForgotPasswordView /> },
            { path: '/acceso/nueva-contrasena', element: <NewPasswordView /> }
        ]
    },
    {
        element: <AuthLayout />,
        children: [
            { path: '*', element: <NotFound /> },
        ],
    },

])