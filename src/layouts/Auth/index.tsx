import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                background: 'linear-gradient(to bottom right, #79B4C4, #85C3C3, #9BC7B9)',
            }}
        >
            <div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-90 rounded-2xl shadow-lg">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout