import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ROUTES } from "@constants/route";
import PrivateRoute from "../layouts/PrivateProute";
import { ROLE } from "@constants/common";
import PersistToken from "../layouts/PersistToken";

const RouterComponent = () => {
    const router = createBrowserRouter([
        //#region Auth routes
        { path: ROUTES.AUTH.LOGIN, element: <Login /> },
        // { path: ROUTES.AUTH, element: <SignUp /> },
        // { path: ROUTES.AUTH, element: <Logout /> },
        // { path: ROUTES.AUTH, element: <ValidateEmail /> },
        // { path: ROUTES.AUTH, element: <ForgetPassword /> },
        // { path: ROUTES.AUTH, element: <UnauthorizedPage /> },
        //#endregion

        //#region Public routes
        {
            element: <PublicLayout />,
            children: [
                { index: true, path: ROUTES.PUBLIC.HOME, element: <HomePage /> },
                {
                    path: ROUTES.PUBLIC.HOME,
                    element: <HomePage />,
                },
            ],
        },
        //#endregion

        //#region Private routes
        {
            element: <PersistToken />,
            children: [
                //#region Admnin routes
                {
                    element: <PrivateRoute allowedRoles={[ROLE.ADMIN]} />,
                    children: [
                    ],
                },
                //#endregion

                //#region Member routes
                {
                    element: <PrivateRoute allowedRoles={[ROLE.ADMIN]} />,
                    children: [
                    ],
                },
                //#endregion
            ],
        }
        //#endregion
    ]);

    return <RouterProvider router={router} />;
}

export default RouterComponent;