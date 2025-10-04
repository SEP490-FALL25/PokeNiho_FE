import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, BookOpen, Languages, BarChart3, Settings, LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@ui/Button"
import { cn } from "@utils/CN"
import { ROUTES } from "@constants/route"

const AdminLayout = () => {
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const navigation = [
        { name: "Tổng quan", href: ROUTES.ADMIN.ROOT, icon: LayoutDashboard },
        { name: "Quản lý người dùng", href: ROUTES.ADMIN.USERS, icon: Users },
        { name: "Quản lý bài học", href: ROUTES.ADMIN.LESSONS, icon: BookOpen },
        { name: "Quản lý từ vựng", href: ROUTES.ADMIN.VOCABULARY, icon: Languages },
        { name: "Thống kê", href: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
    ]

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={cn(
                    "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
                    isSidebarOpen ? "w-64" : "w-20",
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                    {isSidebarOpen && <h1 className="text-xl font-bold text-sidebar-foreground">PokeNihongo</h1>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-border p-4 space-y-1">
                    <Link
                        to={ROUTES.ADMIN.SETTINGS}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            location.pathname === ROUTES.ADMIN.SETTINGS
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                    >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Cài đặt</span>}
                    </Link>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
