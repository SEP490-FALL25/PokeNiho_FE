import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Textarea } from "@ui/Textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/Table"
import { Badge } from "@ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select"
import { Search, Plus, Edit, Trash2, Volume2, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs"

interface Vocabulary {
    id: string
    japanese: string
    hiragana: string
    vietnamese: string
    type: "noun" | "verb" | "adjective" | "adverb" | "particle"
    level: "N5" | "N4" | "N3" | "N2" | "N1"
    lesson: string
    example: string
    hasAudio: boolean
    hasImage: boolean
}

const VocabularyManagement = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("all")

    // Mock data
    const vocabularies: Vocabulary[] = [
        {
            id: "1",
            japanese: "こんにちは",
            hiragana: "こんにちは",
            vietnamese: "Xin chào",
            type: "noun",
            level: "N5",
            lesson: "Hiragana cơ bản",
            example: "こんにちは、田中さん。",
            hasAudio: true,
            hasImage: true,
        },
        {
            id: "2",
            japanese: "食べる",
            hiragana: "たべる",
            vietnamese: "Ăn",
            type: "verb",
            level: "N5",
            lesson: "Động từ cơ bản",
            example: "ご飯を食べる。",
            hasAudio: true,
            hasImage: false,
        },
        {
            id: "3",
            japanese: "美しい",
            hiragana: "うつくしい",
            vietnamese: "Đẹp",
            type: "adjective",
            level: "N4",
            lesson: "Tính từ",
            example: "美しい花。",
            hasAudio: true,
            hasImage: true,
        },
        {
            id: "4",
            japanese: "学校",
            hiragana: "がっこう",
            vietnamese: "Trường học",
            type: "noun",
            level: "N5",
            lesson: "Địa điểm",
            example: "学校に行く。",
            hasAudio: true,
            hasImage: true,
        },
        {
            id: "5",
            japanese: "速い",
            hiragana: "はやい",
            vietnamese: "Nhanh",
            type: "adjective",
            level: "N5",
            lesson: "Tính từ cơ bản",
            example: "速い車。",
            hasAudio: true,
            hasImage: false,
        },
    ]

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "noun":
                return "bg-chart-1 text-white"
            case "verb":
                return "bg-chart-2 text-white"
            case "adjective":
                return "bg-chart-3 text-white"
            case "adverb":
                return "bg-chart-4 text-white"
            case "particle":
                return "bg-chart-5 text-white"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case "N5":
                return "bg-chart-4 text-white"
            case "N4":
                return "bg-chart-1 text-white"
            case "N3":
                return "bg-chart-2 text-white"
            case "N2":
                return "bg-chart-3 text-white"
            case "N1":
                return "bg-destructive text-destructive-foreground"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    const filteredVocabularies = vocabularies.filter((vocab) => {
        if (activeTab === "all") return true
        if (activeTab === "N5") return vocab.level === "N5"
        if (activeTab === "N4") return vocab.level === "N4"
        if (activeTab === "N3") return vocab.level === "N3"
        return true
    })

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Quản lý từ vựng</h1>
                <p className="text-muted-foreground mt-2">Quản lý tất cả từ vựng trong hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-5 mb-8">
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tổng từ vựng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">3,456</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">N5</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">800</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">N4</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">750</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">N3</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">650</div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Có audio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">2,890</div>
                    </CardContent>
                </Card>
            </div>

            {/* Vocabulary Table */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Danh sách từ vựng</CardTitle>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm từ vựng
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-foreground">Thêm từ vựng mới</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Tiếng Nhật</label>
                                            <Input placeholder="例: こんにちは" className="bg-background border-border text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Hiragana</label>
                                            <Input placeholder="例: こんにちは" className="bg-background border-border text-foreground" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Tiếng Việt</label>
                                        <Input placeholder="Xin chào" className="bg-background border-border text-foreground" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Loại từ</label>
                                            <Select>
                                                <SelectTrigger className="bg-background border-border text-foreground">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    <SelectItem value="noun">Danh từ</SelectItem>
                                                    <SelectItem value="verb">Động từ</SelectItem>
                                                    <SelectItem value="adjective">Tính từ</SelectItem>
                                                    <SelectItem value="adverb">Trạng từ</SelectItem>
                                                    <SelectItem value="particle">Trợ từ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Cấp độ</label>
                                            <Select>
                                                <SelectTrigger className="bg-background border-border text-foreground">
                                                    <SelectValue placeholder="Chọn cấp độ" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    <SelectItem value="N5">N5</SelectItem>
                                                    <SelectItem value="N4">N4</SelectItem>
                                                    <SelectItem value="N3">N3</SelectItem>
                                                    <SelectItem value="N2">N2</SelectItem>
                                                    <SelectItem value="N1">N1</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Bài học</label>
                                            <Select>
                                                <SelectTrigger className="bg-background border-border text-foreground">
                                                    <SelectValue placeholder="Chọn bài học" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    <SelectItem value="1">Hiragana cơ bản</SelectItem>
                                                    <SelectItem value="2">Katakana nâng cao</SelectItem>
                                                    <SelectItem value="3">Kanji N5</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Câu ví dụ</label>
                                        <Textarea
                                            placeholder="Nhập câu ví dụ"
                                            className="bg-background border-border text-foreground min-h-[80px]"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">File âm thanh</label>
                                            <Input type="file" accept="audio/*" className="bg-background border-border text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Hình ảnh</label>
                                            <Input type="file" accept="image/*" className="bg-background border-border text-foreground" />
                                        </div>
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
                                placeholder="Tìm kiếm từ vựng..."
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
                            <TabsTrigger value="N5" className="data-[state=active]:bg-background">
                                N5
                            </TabsTrigger>
                            <TabsTrigger value="N4" className="data-[state=active]:bg-background">
                                N4
                            </TabsTrigger>
                            <TabsTrigger value="N3" className="data-[state=active]:bg-background">
                                N3
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-muted/50">
                                        <TableHead className="text-muted-foreground">Tiếng Nhật</TableHead>
                                        <TableHead className="text-muted-foreground">Hiragana</TableHead>
                                        <TableHead className="text-muted-foreground">Tiếng Việt</TableHead>
                                        <TableHead className="text-muted-foreground">Loại từ</TableHead>
                                        <TableHead className="text-muted-foreground">Cấp độ</TableHead>
                                        <TableHead className="text-muted-foreground">Bài học</TableHead>
                                        <TableHead className="text-muted-foreground">Media</TableHead>
                                        <TableHead className="text-muted-foreground text-right">Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVocabularies.map((vocab) => (
                                        <TableRow key={vocab.id} className="border-border hover:bg-muted/50">
                                            <TableCell className="font-medium text-foreground text-lg">{vocab.japanese}</TableCell>
                                            <TableCell className="text-muted-foreground">{vocab.hiragana}</TableCell>
                                            <TableCell className="text-foreground">{vocab.vietnamese}</TableCell>
                                            <TableCell>
                                                <Badge className={getTypeBadgeColor(vocab.type)}>
                                                    {vocab.type === "noun"
                                                        ? "Danh từ"
                                                        : vocab.type === "verb"
                                                            ? "Động từ"
                                                            : vocab.type === "adjective"
                                                                ? "Tính từ"
                                                                : vocab.type === "adverb"
                                                                    ? "Trạng từ"
                                                                    : "Trợ từ"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getLevelBadgeColor(vocab.level)}>{vocab.level}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{vocab.lesson}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {vocab.hasAudio && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-chart-1 hover:text-chart-1 hover:bg-chart-1/10"
                                                        >
                                                            <Volume2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {vocab.hasImage && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-chart-2 hover:text-chart-2 hover:bg-chart-2/10"
                                                        >
                                                            <ImageIcon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default VocabularyManagement
