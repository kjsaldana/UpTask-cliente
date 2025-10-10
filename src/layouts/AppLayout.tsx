import { Navigate, Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
    const { data, isError, isLoading } = useAuth()
    if (isLoading) return 'cargando...'
    if (isError) return <Navigate to={'/acceso/iniciar-sesion'} />
    
    if (data) return (
        <>
            <header className="bg-gray-800 py-5">
                <div className="mx-auto max-w-screen-xl flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-64">
                        <Logo />
                    </div>
                    <NavMenu name={data.name} />
                </div>
            </header>

            <section className="mx-auto max-w-screen-xl mt-10 p-5">
                <Outlet />
            </section>

            <footer className="py-5">
                <p className="text-center">Todos los derechos reservados © {new Date().getFullYear()}</p>
            </footer>

            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
    )
}
