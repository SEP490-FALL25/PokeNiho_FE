import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Textarea } from "@ui/Textarea"
import { Badge } from "@ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select"
import { Search, Plus, Edit, Trash2, Eye, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs"
import HeaderAdmin from "@organisms/Header/Admin"

interface Lesson {
    id: string
    title: string
    description: string
    level: "beginner" | "intermediate" | "advanced"
    category: string
    vocabularyCount: number
    duration: number
    status: "published" | "draft"
    students: number
    createdDate: string
}

const LessonsManagement = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("all")

    // Mock data
    const lessons: Lesson[] = [
        {
            id: "1",
            title: "Hiragana cơ bản",
            description: "Học bảng chữ cái Hiragana từ A đến Z",
            level: "beginner",
            category: "Chữ cái",
            vocabularyCount: 46,
            duration: 30,
            status: "published",
            students: 1250,
            createdDate: "2024-01-15",
        },
        {
            id: "2",
            title: "Katakana nâng cao",
            description: "Nắm vững bảng chữ cái Katakana",
            level: "intermediate",
            category: "Chữ cái",
            vocabularyCount: 46,
            duration: 45,
            status: "published",
            students: 890,
            createdDate: "2024-02-01",
        },
        {
            id: "3",
            title: "Kanji N5",
            description: "80 chữ Kanji cơ bản cho kỳ thi N5",
            level: "beginner",
            category: "Kanji",
            vocabularyCount: 80,
            duration: 60,
            status: "published",
            students: 2100,
            createdDate: "2024-01-20",
        },
        {
            id: "4",
            title: "Ngữ pháp N4",
            description: "Các mẫu câu ngữ pháp trình độ N4",
            level: "intermediate",
            category: "Ngữ pháp",
            vocabularyCount: 120,
            duration: 90,
            status: "draft",
            students: 0,
            createdDate: "2024-03-10",
        },
        {
            id: "5",
            title: "Hội thoại hàng ngày",
            description: "Các mẫu câu giao tiếp thông dụng",
            level: "beginner",
            category: "Hội thoại",
            vocabularyCount: 150,
            duration: 75,
            status: "published",
            students: 1680,
            createdDate: "2024-02-15",
        },
    ]

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case "beginner":
                return "bg-chart-4 text-white"
            case "intermediate":
                return "bg-chart-1 text-white"
            case "advanced":
                return "bg-destructive text-destructive-foreground"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getStatusBadgeColor = (status: string) => {
        return status === "published" ? "bg-chart-4 text-white" : "bg-muted text-muted-foreground"
    }

    const filteredLessons = lessons.filter((lesson) => {
        if (activeTab === "all") return true
        if (activeTab === "published") return lesson.status === "published"
        if (activeTab === "draft") return lesson.status === "draft"
        return true
    })

    return (
        <div className="p-8">
            {/* Header */}
            <HeaderAdmin title="Quản lý bài học" description="Quản lý tất cả bài học và khóa học trong hệ thống" />

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng bài học</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">156</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Đã xuất bản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">142</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Bản nháp</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">14</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng học viên</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">5,920</div>
                    </CardContent>
                </Card>
            </div>

            {/* Lessons Content */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Danh sách bài học</CardTitle>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm bài học
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-foreground">Thêm bài học mới</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Tiêu đề bài học</label>
                                        <Input placeholder="Nhập tiêu đề" className="bg-background border-border text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Mô tả</label>
                                        <Textarea
                                            placeholder="Nhập mô tả bài học"
                                            className="bg-background border-border text-foreground min-h-[100px]"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Cấp độ</label>
                                            <Select>
                                                <SelectTrigger className="bg-background border-border text-foreground">
                                                    <SelectValue placeholder="Chọn cấp độ" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    <SelectItem value="beginner">Cơ bản</SelectItem>
                                                    <SelectItem value="intermediate">Trung cấp</SelectItem>
                                                    <SelectItem value="advanced">Nâng cao</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Danh mục</label>
                                            <Select>
                                                <SelectTrigger className="bg-background border-border text-foreground">
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    <SelectItem value="alphabet">Chữ cái</SelectItem>
                                                    <SelectItem value="kanji">Kanji</SelectItem>
                                                    <SelectItem value="grammar">Ngữ pháp</SelectItem>
                                                    <SelectItem value="conversation">Hội thoại</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Thời lượng (phút)</label>
                                        <Input type="number" placeholder="30" className="bg-background border-border text-foreground" />
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
                                    <Button variant="outline" className="border-border text-foreground bg-transparent">
                                        Lưu nháp
                                    </Button>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Xuất bản</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm bài học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background border-border text-foreground"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-muted">
                            <TabsTrigger value="all" className="data-[state=active]:bg-background">
                                Tất cả
                            </TabsTrigger>
                            <TabsTrigger value="published" className="data-[state=active]:bg-background">
                                Đã xuất bản
                            </TabsTrigger>
                            <TabsTrigger value="draft" className="data-[state=active]:bg-background">
                                Bản nháp
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredLessons.map((lesson) => (
                                    <Card key={lesson.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg text-foreground mb-2">{lesson.title}</CardTitle>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <Badge className={getLevelBadgeColor(lesson.level)}>
                                                    {lesson.level === "beginner"
                                                        ? "Cơ bản"
                                                        : lesson.level === "intermediate"
                                                            ? "Trung cấp"
                                                            : "Nâng cao"}
                                                </Badge>
                                                <Badge className={getStatusBadgeColor(lesson.status)}>
                                                    {lesson.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                <div className="flex justify-between">
                                                    <span>Danh mục:</span>
                                                    <span className="text-foreground font-medium">{lesson.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Từ vựng:</span>
                                                    <span className="text-foreground font-medium">{lesson.vocabularyCount} từ</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Thời lượng:</span>
                                                    <span className="text-foreground font-medium">{lesson.duration} phút</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Học viên:</span>
                                                    <span className="text-foreground font-medium">{lesson.students}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Xem
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Sửa
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-border text-foreground hover:bg-muted bg-transparent"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default LessonsManagement
