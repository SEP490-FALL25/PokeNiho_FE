import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card"
import { Button } from "@ui/Button"
import { Input } from "@ui/Input"
import { Badge } from "@ui/Badge"
import { Dialog, DialogTrigger } from "@ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { Search, Plus, Edit, Trash2, Eye, Copy } from "lucide-react"
import HeaderAdmin from "@organisms/Header/Admin"
import { Skeleton } from "@ui/Skeleton"
import RelationshipBreadcrumb from "@atoms/RelationshipBreadcrumb"

interface QuestionItem {
    id: number
    question: string
    type: 'multiple_choice' | 'fill_blank' | 'true_false' | 'matching'
    difficulty: 'easy' | 'medium' | 'hard'
    topic: string
    level: number
    points: number
    estimatedTime: number
    isActive: boolean
    createdAt: string
    options?: string[]
    correctAnswer?: string
    // Relationship data
    lessonId?: number
    lessonTitle?: string
    lessonLevel?: number
    exerciseId?: number
    exerciseTitle?: string
}

const QuestionBank = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [activeTypeTab, setActiveTypeTab] = useState<string>("all")
    const [activeDifficultyTab, setActiveDifficultyTab] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("createdAt")
    const [sort, setSort] = useState<string>("desc")

    // Mock data - replace with actual API call
    const questions: QuestionItem[] = [
        {
            id: 1,
            question: "What is the correct hiragana for 'a'?",
            type: 'multiple_choice',
            difficulty: 'easy',
            topic: 'Hiragana',
            level: 5,
            points: 10,
            estimatedTime: 30,
            isActive: true,
            createdAt: "2024-01-15",
            options: ['あ', 'い', 'う', 'え'],
            correctAnswer: 'あ',
            lessonId: 1,
            lessonTitle: "Basic Hiragana",
            lessonLevel: 5,
            exerciseId: 1,
            exerciseTitle: "Hiragana Recognition"
        },
        {
            id: 2,
            question: "Fill in the blank: こんにちは (konnichiwa) means _____ in English.",
            type: 'fill_blank',
            difficulty: 'easy',
            topic: 'Greetings',
            level: 5,
            points: 15,
            estimatedTime: 45,
            isActive: true,
            createdAt: "2024-01-14",
            correctAnswer: 'Hello',
            lessonId: 1,
            lessonTitle: "Basic Hiragana",
            lessonLevel: 5,
            exerciseId: 1,
            exerciseTitle: "Hiragana Recognition"
        },
        {
            id: 3,
            question: "The kanji 人 means 'person'.",
            type: 'true_false',
            difficulty: 'medium',
            topic: 'Kanji',
            level: 4,
            points: 5,
            estimatedTime: 15,
            isActive: true,
            createdAt: "2024-01-13",
            correctAnswer: 'True',
            lessonId: 2,
            lessonTitle: "Basic Kanji",
            lessonLevel: 4,
            exerciseId: 2,
            exerciseTitle: "Kanji Writing Practice"
        }
    ]

    const getTypeBadge = (type: string) => {
        const types = {
            'multiple_choice': { label: 'Multiple Choice', color: 'bg-blue-500' },
            'fill_blank': { label: 'Fill in Blank', color: 'bg-green-500' },
            'true_false': { label: 'True/False', color: 'bg-purple-500' },
            'matching': { label: 'Matching', color: 'bg-orange-500' }
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


    return (
        <>
            <HeaderAdmin 
                title="Question Bank Management" 
                description="Manage and organize questions for all lessons and exercises" 
            />
            
            <div className="mt-24 p-8">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4 mb-8">
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
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">1,180</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Topics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">45</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">12.5</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Question Bank Content */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Question Bank</CardTitle>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Question
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search questions..."
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
                                        <SelectItem value="question">Question</SelectItem>
                                        <SelectItem value="difficulty">Difficulty</SelectItem>
                                        <SelectItem value="points">Points</SelectItem>
                                        <SelectItem value="topic">Topic</SelectItem>
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
                                        variant={activeTypeTab === 'true_false' ? 'outline' : 'ghost'}
                                        className={`h-8 px-4 hover:bg-gray-200 ${activeTypeTab === 'true_false' ? 'shadow-xl bg-transparent font-bold' : ''}`}
                                        onClick={() => setActiveTypeTab(activeTypeTab === 'true_false' ? 'all' : 'true_false')}
                                    >
                                        True/False
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
                            {questions.length === 0 ? (
                                <div className="flex justify-center items-center h-96 w-full text-center">
                                    <p className="text-muted-foreground text-center text-2xl font-bold">No questions found</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {questions.map((question) => {
                                        const typeInfo = getTypeBadge(question.type)
                                        const difficultyInfo = getDifficultyBadge(question.difficulty)
                                        
                                        return (
                                            <Card key={question.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-lg text-foreground mb-2 line-clamp-2">{question.question}</CardTitle>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-muted-foreground">{question.topic}</span>
                                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Level {question.level}</span>
                                                                </div>
                                                                <RelationshipBreadcrumb 
                                                                    lessonTitle={question.lessonTitle}
                                                                    lessonLevel={question.lessonLevel}
                                                                    exerciseTitle={question.exerciseTitle}
                                                                />
                                                            </div>
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
                                                            <span>Points:</span>
                                                            <span className="text-foreground font-medium">{question.points}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Time:</span>
                                                            <span className="text-foreground font-medium">{question.estimatedTime}s</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Status:</span>
                                                            <span className={`font-medium ${question.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                                {question.isActive ? 'Active' : 'Inactive'}
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

export default QuestionBank
