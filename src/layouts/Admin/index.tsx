import { Outlet } from "react-router-dom"

const AdminLayout = () => {
    return (
        <>
            {/* Admin content */}
            <Outlet />
        </>
    )
}

export default AdminLayout