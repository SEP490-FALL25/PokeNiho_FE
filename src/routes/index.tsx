import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ROUTES } from "@constants/route"
// import PrivateRoute from "../layouts/PrivateProute"
// import { ROLE } from "@constants/common"
// import PersistToken from "../layouts/PersistToken"
import LoginPage from "@pages/AuthPage/LoginPage"
import AuthLayout from "@layouts/Auth"
import AdminLayout from "@layouts/Admin"
import { lazy } from "react"
import ConfigShop from "@pages/AdminPage/ConfigShop"
import ShopBannerDetail from "@pages/AdminPage/ConfigShop/components/ShopBannerDetail"

const AdminDashboard = lazy(() => import("@pages/AdminPage/Dashboard"))
const UsersManagement = lazy(() => import("@pages/AdminPage/Users"))
const LessonsManagement = lazy(() => import("@pages/AdminPage/Lesson/Management"))
const VocabularyManagement = lazy(() => import("@pages/AdminPage/Vocabulary"))
const AnalyticsDashboard = lazy(() => import("@pages/AdminPage/Analytics"))
const PackageManagement = lazy(() => import("@pages/AdminPage/PackageManagement"))
const PokemonManagement = lazy(() => import("@pages/AdminPage/Pokemon"))
const TournamentManagement = lazy(() => import("@pages/AdminPage/Tournaments"))
const AIPromptManagement = lazy(() => import("@pages/AdminPage/AIPrompts"))
const DailyQuestManagement = lazy(() => import("@pages/AdminPage/DailyQuest"))
const RewardManagement = lazy(() => import("@pages/AdminPage/Reward"))
const QuestionBankManagement = lazy(() => import("@pages/AdminPage/QuestionBank"))
const TestSetManagement = lazy(() => import("@pages/AdminPage/TestSetManagement"))
const ConfigGacha = lazy(() => import("@pages/AdminPage/ConfigGacha"))
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
                                { path: ROUTES.LESSONS.MANAGEMENT, element: <LessonsManagement /> },
                                { path: ROUTES.ADMIN.VOCABULARY, element: <VocabularyManagement /> },
                                { path: ROUTES.ADMIN.ANALYTICS, element: <AnalyticsDashboard /> },
                                { path: ROUTES.ADMIN.PACKAGE_MANAGEMENT, element: <PackageManagement /> },
                                { path: ROUTES.ADMIN.POKEMON_MANAGEMENT, element: <PokemonManagement /> },
                                { path: ROUTES.ADMIN.TOURNAMENT_MANAGEMENT, element: <TournamentManagement /> },
                                { path: ROUTES.ADMIN.AI_PROMPTS_MANAGEMENT, element: <AIPromptManagement /> },
                                { path: ROUTES.ADMIN.DAILY_QUEST_MANAGEMENT, element: <DailyQuestManagement /> },
                                { path: ROUTES.ADMIN.REWARD_MANAGEMENT, element: <RewardManagement /> },
                                { path: ROUTES.ADMIN.CONFIG_SHOP, element: <ConfigShop /> },
                                { path: ROUTES.ADMIN.CONFIG_SHOP_BANNER_DETAIL, element: <ShopBannerDetail /> },
                                { path: ROUTES.ADMIN.CONFIG_GACHA, element: <ConfigGacha /> },
                                { path: ROUTES.ADMIN.QUESTION_BANK, element: <QuestionBankManagement /> },
                                { path: ROUTES.ADMIN.TESTSET_MANAGEMENT, element: <TestSetManagement /> },
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
