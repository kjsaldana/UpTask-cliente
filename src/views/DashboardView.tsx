import { getAllProjects } from "@/api/ProjectAPI";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import { isManager } from "@/helpers/policies";
import { useAuth } from "@/hooks/useAuth";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export default function DashboardView() {
  const { data: user, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects
  })
  const location = useLocation()
  const navigate = useNavigate()

  if (isLoading && authLoading) return 'cargando...'
  if (data && user) return (
    <>
      <h1 className="text-5xl font-black">Mis Proyectos</h1>
      <p className="text-2xl text-gray-500 font-light mt-5">Administra tus proyectos</p>
      <nav className="my-5">
        <Link to={'/proyectos/crear'} className="bg-violet-500 hover:bg-violet-400 text-white px-5 py-3 font-bold transition-colors">Nuevo Proyecto</Link>
      </nav>
      {data.length ? (
        <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg rounded-2xl">
          {data.map((project) => (
            <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <div>
                    {isManager(project.manager, user._id) ?
                      <p className="uppercase text-xs text-green-500 bg-green-50 border-2 border-green-500 py-1 px-5 font-extrabold text-center rounded-lg max-w-30"
                      >
                        Manager
                      </p>
                      :
                      <p className="uppercase text-xs text-indigo-500 bg-indigo-50 border-2 border-indigo-500 py-1 px-2 font-extrabold text-center rounded-lg max-w-30"
                      >
                        Colaborador
                      </p>}
                  </div>
                  <Link to={`/proyectos/${project._id}`}
                    className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                  >{project.projectName}</Link>
                  <p className="text-sm text-gray-400 mt-2">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9 cursor-pointer" aria-hidden="true" />
                  </MenuButton>
                  <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <MenuItems
                      className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                    >
                      <MenuItem>
                        <Link to={`/proyectos/${project._id}`}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Ver Proyecto
                        </Link>
                      </MenuItem>
                      {isManager(project.manager, user._id) && (
                        <>
                          <MenuItem>
                            <Link to={`/proyectos/${project._id}/editar`}
                              className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                              Editar Proyecto
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type='button'
                              className='block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer'
                              onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                            >
                              Eliminar Proyecto
                            </button>
                          </MenuItem>
                        </>
                      )}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20">No hay Proyectos aún {''}
          <Link to={'/projects/create'} className="text-violet-600 hover:text-violet-500 font-bold">Crear Proyecto.</Link>
        </p>
      )}
      <DeleteProjectModal />
    </>
  )
}
