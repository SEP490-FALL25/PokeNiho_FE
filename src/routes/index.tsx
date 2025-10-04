import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ROUTES } from "@constants/route"
import PrivateRoute from "../layouts/PrivateProute"
import { ROLE } from "@constants/common"
import PersistToken from "../layouts/PersistToken"
import LoginPage from "@pages/AuthPage/LoginPage"
import AuthLayout from "@layouts/Auth"
import AdminLayout from "@layouts/Admin"
import { lazy } from "react"

const AdminDashboard = lazy(() => import("@pages/AdminPage/Dashboard"))
const UsersManagement = lazy(() => import("@pages/AdminPage/Users"))
const LessonsManagement = lazy(() => import("@pages/AdminPage/Lesson"))
const VocabularyManagement = lazy(() => import("@pages/AdminPage/Vocabulary"))
const AnalyticsDashboard = lazy(() => import("@pages/AdminPage/Analytics"))

const RouterComponent = () => {
    const router = createBrowserRouter([
        //#region Auth routes
        {
            element: <AuthLayout />,
            children: [{ index: true, path: ROUTES.AUTH.LOGIN, element: <LoginPage /> }],
        },
        //#endregion

        //#region Private routes
        {
            // element: <PersistToken />,
            children: [
                //Admin routes
                {
                    // element: <PrivateRoute allowedRoles={[ROLE.ADMIN]} />,
                    children: [
                        {
                            element: <AdminLayout />,
                            children: [
                                { path: ROUTES.ADMIN.ROOT, element: <AdminDashboard /> },
                                { path: ROUTES.ADMIN.USERS, element: <UsersManagement /> },
                                { path: ROUTES.ADMIN.LESSONS, element: <LessonsManagement /> },
                                { path: ROUTES.ADMIN.VOCABULARY, element: <VocabularyManagement /> },
                                { path: ROUTES.ADMIN.ANALYTICS, element: <AnalyticsDashboard /> },
                            ],
                        },
                    ],
                },
            ],
        },
        //#endregion
    ])

    return <RouterProvider router={router} />
}

export default RouterComponent
