import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Badge } from "@ui/Badge"
import { Dialog, DialogTrigger } from "@ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Search, Plus, Edit, Trash2, Eye, Copy, Target, Clock, BarChart3 } from "lucide-react"
import HeaderAdmin from "@organisms/Header/Admin"
import { EnhancedPagination } from "@ui/Pagination"
import { Skeleton } from "@ui/Skeleton"
import { useTranslation } from "react-i18next"

interface ExerciseItem {
    id: number
    title: string
    lessonId: number
    lessonTitle: string
    lessonSlug: string
    lessonLevel: number
    type: 'multiple_choice' | 'fill_blank' | 'listening' | 'speaking'
    difficulty: 'easy' | 'medium' | 'hard'
    questionCount: number
    estimatedTime: number
    isActive: boolean
    createdAt: string
}

const ExercisesManagement = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [activeTypeTab, setActiveTypeTab] = useState<string>("all")
    const [activeDifficultyTab, setActiveDifficultyTab] = useState<string>("all")
    const [page, setPage] = useState<number>(1)
    const [itemsPerPage] = useState<number>(10)
    const [sortBy, setSortBy] = useState<string>("createdAt")
    const [sort, setSort] = useState<string>("desc")

    // Mock data - replace with actual API call
    const exercises: ExerciseItem[] = [
        {
            id: 1,
            title: "Hiragana Recognition",
            lessonId: 1,
            lessonTitle: "Basic Hiragana",
            lessonSlug: "basic-hiragana",
            lessonLevel: 5,
            type: 'multiple_choice',
            difficulty: 'easy',
            questionCount: 20,
            estimatedTime: 15,
            isActive: true,
            createdAt: "2024-01-15"
        },
        {
            id: 2,
            title: "Kanji Writing Practice",
            lessonId: 2,
            lessonTitle: "Basic Kanji",
            lessonSlug: "basic-kanji",
            lessonLevel: 4,
            type: 'fill_blank',
            difficulty: 'medium',
            questionCount: 15,
            estimatedTime: 25,
            isActive: true,
            createdAt: "2024-01-14"
        }
    ]

    const getTypeBadge = (type: string) => {
        const types = {
            'multiple_choice': { label: 'Multiple Choice', color: 'bg-blue-500' },
            'fill_blank': { label: 'Fill in Blank', color: 'bg-green-500' },
            'listening': { label: 'Listening', color: 'bg-purple-500' },
            'speaking': { label: 'Speaking', color: 'bg-orange-500' }
        }
        return types[type as keyof typeof types] || { label: type, color: 'bg-gray-500' }
    }

    const getDifficultyBadge = (difficulty: string) => {
        const difficulties = {
            'easy': { label: 'Easy', color: 'bg-green-500' },
            'medium': { label: 'Medium', color: 'bg-yellow-500' },
            'hard': { label: 'Hard', color: 'bg-red-500' }
        }
        return difficulties[difficulty as keyof typeof difficulties] || { label: difficulty, color: 'bg-gray-500' }
    }

    const ExerciseCardSkeleton = () => (
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
                title="Exercises Management" 
                description="Manage exercises and practice activities for lessons" 
            />

            <div className="mt-24 p-8">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Exercises</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">48</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Exercises</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">42</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">1,240</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">87%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Exercises Content */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">Exercises List</CardTitle>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Exercise
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search exercises..."
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
                                        variant={activeTypeTab === 'multiple_choice' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeTypeTab === 'multiple_choice' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveTypeTab(activeTypeTab === 'multiple_choice' ? 'all' : 'multiple_choice')}
                                    >
                                        Multiple Choice
                                    </Button>
                                    <Button
                                        variant={activeTypeTab === 'fill_blank' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeTypeTab === 'fill_blank' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveTypeTab(activeTypeTab === 'fill_blank' ? 'all' : 'fill_blank')}
                                    >
                                        Fill in Blank
                                    </Button>
                                    <Button
                                        variant={activeTypeTab === 'listening' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeTypeTab === 'listening' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveTypeTab(activeTypeTab === 'listening' ? 'all' : 'listening')}
                                    >
                                        Listening
                                    </Button>
                                </div>
                            </div>
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
                        </div>
                        <div className="mt-6">
                            {exercises.length === 0 ? (
                                <div className="flex justify-center items-center h-96 w-full text-center">
                                    <p className="text-muted-foreground text-center text-2xl font-bold">No exercises found</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {exercises.map((exercise) => {
                                        const typeInfo = getTypeBadge(exercise.type)
                                        const difficultyInfo = getDifficultyBadge(exercise.difficulty)
                                        
                                        return (
                                            <Card key={exercise.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-lg text-foreground mb-2">{exercise.title}</CardTitle>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-medium text-primary">{exercise.lessonTitle}</span>
                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">JLPT N{exercise.lessonLevel}</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">{exercise.lessonSlug}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-3">
                                                        <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
                                                        <Badge className={`${difficultyInfo.color} text-white`}>{difficultyInfo.label}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                                        <div className="flex justify-between">
                                                            <span>Questions:</span>
                                                            <span className="text-foreground font-medium">{exercise.questionCount}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Time:</span>
                                                            <span className="text-foreground font-medium">{exercise.estimatedTime} min</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Status:</span>
                                                            <span className={`font-medium ${exercise.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                                {exercise.isActive ? 'Active' : 'Inactive'}
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

export default ExercisesManagement
