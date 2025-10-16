import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Textarea } from "@ui/Textarea"
import { Badge } from "@ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select"
import { Search, Plus, Edit, Trash2, Eye, Copy } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@ui/Tabs"
import HeaderAdmin from "@organisms/Header/Admin"
import { EnhancedPagination } from "@ui/Pagination"
import { useLessonList } from "@hooks/useLesson"
import { Skeleton } from "@ui/Skeleton"

interface LessonItem {
    id: number
    slug: string
    titleKey: string
    levelJlpt: number
    estimatedTimeMinutes: number
    lessonOrder: number
    isPublished: boolean
    publishedAt: string | null
    version: string
    lessonCategoryId: number
}

const LessonsManagement = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [activeJlptTab, setActiveJlptTab] = useState("all")
    const [activePublishTab, setActivePublishTab] = useState("all")
    const [page, setPage] = useState<number>(1)
    const [itemsPerPage] = useState<number>(10)
    const [sortBy, setSortBy] = useState<string>("createdAt")
    const [sort, setSort] = useState<string>("desc")

    const levelJlpt = activeJlptTab === "all" ? undefined : Number(activeJlptTab)
    const isPublished = activePublishTab === "all" ? undefined : activePublishTab === "published" ? true : false

    const { data, isLoading } = useLessonList({
        page,
        limit: itemsPerPage,
        search: searchQuery,
        levelJlpt,
        isPublished,
        sortBy,
        sort,
    })

    const lessons: LessonItem[] = data?.results || []
    const pagination = data?.pagination

    console.log(lessons);

    // removed unused getLevelBadgeColor

    // removed unused getStatusBadgeColor

    const getPublishedBadge = (published: boolean) => (published ? "Đã xuất bản" : "Bản nháp")

    /**
     * Skeleton component for loading state
     */
    const LessonCardSkeleton = () => (
        <Card className="bg-muted/50 border-border">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3 mt-1" />
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </CardContent>
        </Card>
    )

    return (
        <>
            {/* Header */}
            <HeaderAdmin title="Quản lý bài học" description="Quản lý tất cả bài học và khóa học trong hệ thống" />

            <div className="mt-24 p-8">
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
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[160px] bg-background border-border text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="createdAt">Ngày tạo</SelectItem>
                                        <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
                                        <SelectItem value="slug">Slug</SelectItem>
                                        <SelectItem value="titleKey">Tiêu đề</SelectItem>
                                        <SelectItem value="levelJlpt">JLPT</SelectItem>
                                        <SelectItem value="lessonOrder">Thứ tự</SelectItem>
                                        <SelectItem value="isPublished">Xuất bản</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sort} onValueChange={setSort}>
                                    <SelectTrigger className="w-[120px] bg-background border-border text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="asc">Tăng dần</SelectItem>
                                        <SelectItem value="desc">Giảm dần</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Tabs value={activeJlptTab} onValueChange={setActiveJlptTab}>
                                <TabsList className="bg-muted">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-background">Tất cả</TabsTrigger>
                                    <TabsTrigger value="5" className="data-[state=active]:bg-background">N5</TabsTrigger>
                                    <TabsTrigger value="4" className="data-[state=active]:bg-background">N4</TabsTrigger>
                                    <TabsTrigger value="3" className="data-[state=active]:bg-background">N3</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <Tabs value={activePublishTab} onValueChange={setActivePublishTab}>
                                <TabsList className="bg-muted">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-background">Tất cả</TabsTrigger>
                                    <TabsTrigger value="published" className="data-[state=active]:bg-background">Xuất bản</TabsTrigger>
                                    <TabsTrigger value="draft" className="data-[state=active]:bg-background">Bản nháp</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <div className="mt-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {isLoading ? (
                                    Array.from({ length: itemsPerPage }).map((_, idx) => (
                                        <LessonCardSkeleton key={`skeleton-${idx}`} />
                                    ))
                                ) : (
                                    lessons.map((lesson) => (
                                        <Card key={lesson.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg text-foreground mb-2">{lesson.titleKey}</CardTitle>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">{lesson.slug}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <Badge className="bg-chart-1 text-white">JLPT N{lesson.levelJlpt}</Badge>
                                                    <Badge className={lesson.isPublished ? "bg-chart-4 text-white" : "bg-muted text-muted-foreground"}>
                                                        {getPublishedBadge(lesson.isPublished)}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                    <div className="flex justify-between">
                                                        <span>Thời lượng ước tính:</span>
                                                        <span className="text-foreground font-medium">{lesson.estimatedTimeMinutes} phút</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Thứ tự bài học:</span>
                                                        <span className="text-foreground font-medium">{lesson.lessonOrder}</span>
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
                                    ))
                                )}
                            </div>
                            <div className="flex justify-end mt-6">
                                {pagination && (
                                    <EnhancedPagination
                                        currentPage={pagination.current || 1}
                                        totalPages={pagination.totalPage || 0}
                                        totalItems={pagination.totalItem || 0}
                                        itemsPerPage={pagination.pageSize || itemsPerPage}
                                        onPageChange={(nextPage: number) => setPage(nextPage)}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default LessonsManagement
