import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table"
import { Badge } from "@ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select"
import { Search, Plus, Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/DropdownMenu"

interface User {
    id: string
    name: string
    email: string
    role: "admin" | "instructor" | "student"
    status: "active" | "inactive"
    joinedDate: string
    lessonsCompleted: number
}

const UsersManagement = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Mock data
    const users: User[] = [
        {
            id: "1",
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            role: "student",
            status: "active",
            joinedDate: "2024-01-15",
            lessonsCompleted: 45,
        },
        {
            id: "2",
            name: "Trần Thị B",
            email: "tranthib@example.com",
            role: "instructor",
            status: "active",
            joinedDate: "2024-02-20",
            lessonsCompleted: 120,
        },
        {
            id: "3",
            name: "Lê Văn C",
            email: "levanc@example.com",
            role: "student",
            status: "inactive",
            joinedDate: "2024-03-10",
            lessonsCompleted: 12,
        },
        {
            id: "4",
            name: "Phạm Thị D",
            email: "phamthid@example.com",
            role: "admin",
            status: "active",
            joinedDate: "2023-12-01",
            lessonsCompleted: 200,
        },
        {
            id: "5",
            name: "Hoàng Văn E",
            email: "hoangvane@example.com",
            role: "student",
            status: "active",
            joinedDate: "2024-04-05",
            lessonsCompleted: 8,
        },
    ]

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-destructive text-destructive-foreground"
            case "instructor":
                return "bg-chart-1 text-white"
            case "student":
                return "bg-chart-2 text-white"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusBadgeColor = (status: string) => {
        return status === "active" ? "bg-chart-4 text-white" : "bg-muted text-muted-foreground"
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng</h1>
                <p className="text-muted-foreground mt-2">Quản lý tất cả người dùng trong hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng người dùng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">2,543</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Học viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">2,340</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Giảng viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">198</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Hoạt động hôm nay</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">892</div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Danh sách người dùng</CardTitle>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm người dùng
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border">
                                <DialogHeader>
                                    <DialogTitle className="text-foreground">Thêm người dùng mới</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Họ và tên</label>
                                        <Input placeholder="Nhập họ và tên" className="bg-background border-border text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="Nhập email"
                                            className="bg-background border-border text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Vai trò</label>
                                        <Select>
                                            <SelectTrigger className="bg-background border-border text-foreground">
                                                <SelectValue placeholder="Chọn vai trò" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border">
                                                <SelectItem value="student">Học viên</SelectItem>
                                                <SelectItem value="instructor">Giảng viên</SelectItem>
                                                <SelectItem value="admin">Quản trị viên</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Mật khẩu</label>
                                        <Input
                                            type="password"
                                            placeholder="Nhập mật khẩu"
                                            className="bg-background border-border text-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsAddDialogOpen(false)}
                                        className="border-border text-foreground"
                                    >
                                        Hủy
                                    </Button>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Thêm</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm người dùng..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background border-border text-foreground"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-muted/50">
                                <TableHead className="text-muted-foreground">Họ và tên</TableHead>
                                <TableHead className="text-muted-foreground">Email</TableHead>
                                <TableHead className="text-muted-foreground">Vai trò</TableHead>
                                <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                                <TableHead className="text-muted-foreground">Ngày tham gia</TableHead>
                                <TableHead className="text-muted-foreground">Bài học hoàn thành</TableHead>
                                <TableHead className="text-muted-foreground text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="border-border hover:bg-muted/50">
                                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={getRoleBadgeColor(user.role)}>
                                            {user.role === "admin" ? "Quản trị viên" : user.role === "instructor" ? "Giảng viên" : "Học viên"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadgeColor(user.status)}>
                                            {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.lessonsCompleted}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card border-border">
                                                <DropdownMenuItem className="text-foreground hover:bg-muted cursor-pointer">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Chỉnh sửa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive hover:bg-destructive/10 cursor-pointer">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Xóa
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default UsersManagement
