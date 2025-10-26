import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Badge } from "@ui/Badge"
import { Dialog, DialogTrigger } from "@ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Search, Plus, Edit, Trash2, Eye, Copy, FileText, Video, Image, File } from "lucide-react"
import HeaderAdmin from "@organisms/Header/Admin"
import { Skeleton } from "@ui/Skeleton"
import { useTranslation } from "react-i18next"

interface ContentItem {
    id: number
    title: string
    lessonId: number
    lessonTitle: string
    lessonSlug: string
    lessonLevel: number
    type: 'text' | 'video' | 'image' | 'audio' | 'document'
    size: string
    duration?: number
    isPublished: boolean
    createdAt: string
}

const LessonContent = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [activeTypeTab, setActiveTypeTab] = useState<string>("all")
    const [activeStatusTab, setActiveStatusTab] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("createdAt")
    const [sort, setSort] = useState<string>("desc")

    // Mock data - replace with actual API call
    const contents: ContentItem[] = [
        {
            id: 1,
            title: "Hiragana Introduction Video",
            lessonId: 1,
            lessonTitle: "Basic Hiragana",
            lessonSlug: "basic-hiragana",
            lessonLevel: 5,
            type: 'video',
            size: '15.2 MB',
            duration: 180,
            isPublished: true,
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            title: "Kanji Writing Guide",
            lessonId: 2,
            lessonTitle: "Basic Kanji",
            lessonSlug: "basic-kanji",
            lessonLevel: 4,
            type: 'document',
            size: '2.1 MB',
            isPublished: true,
            createdAt: "2024-01-14"
        },
        {
            id: 3,
            title: "Pronunciation Audio",
            lessonId: 1,
            lessonTitle: "Basic Hiragana",
            lessonSlug: "basic-hiragana",
            lessonLevel: 5,
            type: 'audio',
            size: '8.5 MB',
            duration: 120,
            isPublished: false,
            createdAt: "2024-01-13"
        }
    ]

    const getTypeIcon = (type: string) => {
        const icons = {
            'text': FileText,
            'video': Video,
            'image': Image,
            'audio': File,
            'document': File
        }
        return icons[type as keyof typeof icons] || File
    }

    const getTypeBadge = (type: string) => {
        const types = {
            'text': { label: 'Text', color: 'bg-blue-500' },
            'video': { label: 'Video', color: 'bg-red-500' },
            'image': { label: 'Image', color: 'bg-green-500' },
            'audio': { label: 'Audio', color: 'bg-purple-500' },
            'document': { label: 'Document', color: 'bg-orange-500' }
        }
        return types[type as keyof typeof types] || { label: type, color: 'bg-gray-500' }
    }


    return (
        <>
            <HeaderAdmin 
                title="Lesson Content Management" 
                description="Manage lesson content, materials, and multimedia resources" 
            />
            
            <div className="mt-24 p-8">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">156</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">142</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">2.4 GB</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Duration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">4.2 min</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Management */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">Content Library</CardTitle>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Content
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search content..."
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
                                        <SelectItem value="createdAt">Created Date</SelectItem>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="type">Type</SelectItem>
                                        <SelectItem value="size">Size</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sort} onValueChange={setSort}>
                                    <SelectTrigger className="w-[120px] bg-background border-border text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="asc">Ascending</SelectItem>
                                        <SelectItem value="desc">Descending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                                    <Button
                                        variant={activeTypeTab === 'video' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeTypeTab === 'video' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveTypeTab(activeTypeTab === 'video' ? 'all' : 'video')}
                                    >
                                        <Video className="h-4 w-4 mr-1" />
                                        Video
                                    </Button>
                                    <Button
                                        variant={activeTypeTab === 'audio' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeTypeTab === 'audio' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveTypeTab(activeTypeTab === 'audio' ? 'all' : 'audio')}
                                    >
                                        <File className="h-4 w-4 mr-1" />
                                        Audio
                                    </Button>
                                    <Button
                                        variant={activeTypeTab === 'document' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeTypeTab === 'document' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveTypeTab(activeTypeTab === 'document' ? 'all' : 'document')}
                                    >
                                        <FileText className="h-4 w-4 mr-1" />
                                        Document
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                                    <Button
                                        variant={activeStatusTab === 'published' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeStatusTab === 'published' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveStatusTab(activeStatusTab === 'published' ? 'all' : 'published')}
                                    >
                                        Published
                                    </Button>
                                    <Button
                                        variant={activeStatusTab === 'draft' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeStatusTab === 'draft' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveStatusTab(activeStatusTab === 'draft' ? 'all' : 'draft')}
                                    >
                                        Draft
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            {contents.length === 0 ? (
                                <div className="flex justify-center items-center h-96 w-full text-center">
                                    <p className="text-muted-foreground text-center text-2xl font-bold">No content found</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {contents.map((content) => {
                                        const TypeIcon = getTypeIcon(content.type)
                                        const typeInfo = getTypeBadge(content.type)
                                        
                                        return (
                                            <Card key={content.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-lg text-foreground mb-2 flex items-center gap-2">
                                                                <TypeIcon className="h-5 w-5" />
                                                                {content.title}
                                                            </CardTitle>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-medium text-primary">{content.lessonTitle}</span>
                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">JLPT N{content.lessonLevel}</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">{content.lessonSlug}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-3">
                                                        <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
                                                        <Badge className={content.isPublished ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                                                            {content.isPublished ? 'Published' : 'Draft'}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                        <div className="flex justify-between">
                                                            <span>Size:</span>
                                                            <span className="text-foreground font-medium">{content.size}</span>
                                                        </div>
                                                        {content.duration && (
                                                            <div className="flex justify-between">
                                                                <span>Duration:</span>
                                                                <span className="text-foreground font-medium">{content.duration}s</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between">
                                                            <span>Created:</span>
                                                            <span className="text-foreground font-medium">{content.createdAt}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
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
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default LessonContent
