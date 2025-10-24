import { Outlet, useLocation, NavLink } from "react-router-dom";
import {
    LayoutDashboard, Users, BookOpen, Languages, BarChart3,
    Settings, LogOut, Menu, Trophy, Package, Brain,
    Calendar
} from "lucide-react";
import { useState } from "react";
import { Button } from "@ui/Button";
import { cn } from "@utils/CN";
import { ROUTES } from "@constants/route";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/Atoms/LanguageSwitcher";

const AdminLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { t } = useTranslation();

    const navigation = [
        { name: t('navigation.dashboard'), href: ROUTES.ADMIN.ROOT, icon: LayoutDashboard },
        { name: t('navigation.users'), href: ROUTES.ADMIN.USERS, icon: Users },
        { name: t('navigation.pokemon'), href: ROUTES.ADMIN.POKEMON_MANAGEMENT, icon: Trophy },
        { name: t('navigation.lessons'), href: ROUTES.ADMIN.LESSONS, icon: BookOpen },
        { name: t('navigation.vocabulary'), href: ROUTES.ADMIN.VOCABULARY, icon: Languages },
        { name: t('navigation.tournaments'), href: ROUTES.ADMIN.TOURNAMENT_MANAGEMENT, icon: Trophy },
        { name: t('navigation.packageManagement'), href: ROUTES.ADMIN.PACKAGE_MANAGEMENT, icon: Package },
        { name: t('navigation.aiPrompts'), href: ROUTES.ADMIN.AI_PROMPTS_MANAGEMENT, icon: Brain },
        { name: t('navigation.analytics'), href: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
        { name: t('navigation.dailyQuests'), href: ROUTES.ADMIN.DAILY_QUEST_MANAGEMENT, icon: Calendar },
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside
                className={cn(
                    "flex flex-col border-r border-border bg-sidebar transition-all duration-300 fixed h-full z-10",
                    isSidebarOpen ? "w-64" : "w-20",
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-border flex-shrink-0">
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
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <NavLink
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
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-border p-4 space-y-1 flex-shrink-0">
                    {/* Language Switcher */}
                    {isSidebarOpen && (
                        <div className="mb-3">
                            <LanguageSwitcher />
                        </div>
                    )}

                    <NavLink
                        to={ROUTES.ADMIN.SETTINGS}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            location.pathname === ROUTES.ADMIN.SETTINGS
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                    >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>{t('navigation.settings')}</span>}
                    </NavLink>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {isSidebarOpen && <span>{t('common.logout')}</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            {/* SỬA LẠI: Thêm padding-left và transition */}
            <main
                className={cn(
                    "flex-1 transition-all duration-300",
                    isSidebarOpen ? "ml-64" : "ml-20",
                )}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;