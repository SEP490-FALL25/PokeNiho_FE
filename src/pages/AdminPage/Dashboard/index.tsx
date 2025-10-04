import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Users, BookOpen, Languages, TrendingUp } from "lucide-react"

const AdminDashboard = () => {
    const stats = [
        {
            title: "Tổng người dùng",
            value: "2,543",
            change: "+12.5%",
            icon: Users,
            color: "text-chart-1",
        },
        {
            title: "Bài học",
            value: "156",
            change: "+8.2%",
            icon: BookOpen,
            color: "text-chart-2",
        },
        {
            title: "Từ vựng",
            value: "4,892",
            change: "+15.3%",
            icon: Languages,
            color: "text-chart-3",
        },
        {
            title: "Hoạt động hôm nay",
            value: "892",
            change: "+23.1%",
            icon: TrendingUp,
            color: "text-chart-4",
        },
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Tổng quan</h1>
                <p className="text-muted-foreground mt-2">Chào mừng trở lại! Đây là tổng quan về hệ thống của bạn.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                            <p className="text-xs text-chart-1 mt-1">{stat.change} so với tháng trước</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Người dùng mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Biểu đồ người dùng mới theo thời gian
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Hoạt động học tập</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Biểu đồ hoạt động học tập
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Người dùng mới đăng ký</p>
                                    <p className="text-xs text-muted-foreground">
                                        user{i}@example.com - {i} phút trước
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboard
