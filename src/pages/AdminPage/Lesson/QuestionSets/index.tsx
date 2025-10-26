import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Badge } from "@ui/Badge"
import { Dialog, DialogTrigger } from "@ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Search, Plus, Edit, Trash2, Eye, Copy, ClipboardList, Clock, BarChart3, Shuffle } from "lucide-react"
import HeaderAdmin from "@organisms/Header/Admin"
import { EnhancedPagination } from "@ui/Pagination"
import { Skeleton } from "@ui/Skeleton"
import { useTranslation } from "react-i18next"

interface QuestionSetItem {
    id: number
    title: string
    exerciseId: number
    exerciseTitle: string
    exerciseSlug: string
    lessonId: number
    lessonTitle: string
    lessonLevel: number
    questionCount: number
    totalQuestions: number
    difficulty: 'easy' | 'medium' | 'hard'
    estimatedTime: number
    isActive: boolean
    isRandomized: boolean
    createdAt: string
}

const QuestionSetsManagement = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [activeDifficultyTab, setActiveDifficultyTab] = useState<string>("all")
    const [activeStatusTab, setActiveStatusTab] = useState<string>("all")
    const [page, setPage] = useState<number>(1)
    const [itemsPerPage] = useState<number>(10)
    const [sortBy, setSortBy] = useState<string>("createdAt")
    const [sort, setSort] = useState<string>("desc")

    // Mock data - replace with actual API call
    const questionSets: QuestionSetItem[] = [
        {
            id: 1,
            title: "Hiragana Basic Set",
            exerciseId: 1,
            exerciseTitle: "Hiragana Recognition",
            exerciseSlug: "hiragana-recognition",
            lessonId: 1,
            lessonTitle: "Basic Hiragana",
            lessonLevel: 5,
            questionCount: 20,
            totalQuestions: 50,
            difficulty: 'easy',
            estimatedTime: 15,
            isActive: true,
            isRandomized: true,
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            title: "Kanji Advanced Set",
            exerciseId: 2,
            exerciseTitle: "Kanji Writing Practice",
            exerciseSlug: "kanji-writing-practice",
            lessonId: 2,
            lessonTitle: "Basic Kanji",
            lessonLevel: 4,
            questionCount: 15,
            totalQuestions: 30,
            difficulty: 'hard',
            estimatedTime: 30,
            isActive: true,
            isRandomized: false,
            createdAt: "2024-01-14"
        }
    ]

    const getDifficultyBadge = (difficulty: string) => {
        const difficulties = {
            'easy': { label: 'Easy', color: 'bg-green-500' },
            'medium': { label: 'Medium', color: 'bg-yellow-500' },
            'hard': { label: 'Hard', color: 'bg-red-500' }
        }
        return difficulties[difficulty as keyof typeof difficulties] || { label: difficulty, color: 'bg-gray-500' }
    }

    const QuestionSetCardSkeleton = () => (
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
            <HeaderAdmin 
                title="Question Sets Management" 
                description="Manage question sets and test collections for exercises" 
            />

            <div className="mt-24 p-8">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">24</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">20</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">480</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Questions/Set</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">20</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Question Sets Content */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">Question Sets List</CardTitle>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Question Set
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search question sets..."
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
                                        <SelectItem value="difficulty">Difficulty</SelectItem>
                                        <SelectItem value="questionCount">Question Count</SelectItem>
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
                                        variant={activeDifficultyTab === 'easy' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeDifficultyTab === 'easy' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveDifficultyTab(activeDifficultyTab === 'easy' ? 'all' : 'easy')}
                                    >
                                        Easy
                                    </Button>
                                    <Button
                                        variant={activeDifficultyTab === 'medium' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeDifficultyTab === 'medium' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveDifficultyTab(activeDifficultyTab === 'medium' ? 'all' : 'medium')}
                                    >
                                        Medium
                                    </Button>
                                    <Button
                                        variant={activeDifficultyTab === 'hard' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeDifficultyTab === 'hard' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveDifficultyTab(activeDifficultyTab === 'hard' ? 'all' : 'hard')}
                                    >
                                        Hard
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                                    <Button
                                        variant={activeStatusTab === 'active' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeStatusTab === 'active' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveStatusTab(activeStatusTab === 'active' ? 'all' : 'active')}
                                    >
                                        Active
                                    </Button>
                                    <Button
                                        variant={activeStatusTab === 'inactive' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeStatusTab === 'inactive' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveStatusTab(activeStatusTab === 'inactive' ? 'all' : 'inactive')}
                                    >
                                        Inactive
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            {questionSets.length === 0 ? (
                                <div className="flex justify-center items-center h-96 w-full text-center">
                                    <p className="text-muted-foreground text-center text-2xl font-bold">No question sets found</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {questionSets.map((questionSet) => {
                                        const difficultyInfo = getDifficultyBadge(questionSet.difficulty)
                                        
                                        return (
                                            <Card key={questionSet.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-lg text-foreground mb-2">{questionSet.title}</CardTitle>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-primary">{questionSet.exerciseTitle}</span>
                                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Exercise</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-muted-foreground">From:</span>
                                                                    <span className="text-xs font-medium text-blue-600">{questionSet.lessonTitle}</span>
                                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">JLPT N{questionSet.lessonLevel}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-3">
                                                        <Badge className={`${difficultyInfo.color} text-white`}>{difficultyInfo.label}</Badge>
                                                        <Badge className={questionSet.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                                                            {questionSet.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        {questionSet.isRandomized && (
                                                            <Badge className="bg-purple-500 text-white">
                                                                <Shuffle className="h-3 w-3 mr-1" />
                                                                Random
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                        <div className="flex justify-between">
                                                            <span>Questions:</span>
                                                            <span className="text-foreground font-medium">{questionSet.questionCount}/{questionSet.totalQuestions}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Time:</span>
                                                            <span className="text-foreground font-medium">{questionSet.estimatedTime} min</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Progress:</span>
                                                            <span className="text-foreground font-medium">
                                                                {Math.round((questionSet.questionCount / questionSet.totalQuestions) * 100)}%
                                                            </span>
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

export default QuestionSetsManagement
