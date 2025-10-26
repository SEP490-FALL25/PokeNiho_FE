import { useState } from "react";
import { Card, CardContent } from "@ui/Card";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Badge } from "@ui/Badge";
import { Dialog, DialogTrigger } from "@ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  HelpCircle,
  Clock,
  Hash,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useLessonQuestions } from "@hooks/useLessonQuestions";

interface LessonItem {
  id: number;
  titleKey: string;
  levelJlpt: number;
  isPublished: boolean;
}

interface LessonQuestionsStepProps {
  lesson: LessonItem;
  onComplete: () => void;
  onBack: () => void;
}

const LessonQuestionsStep = ({ lesson, onComplete, onBack }: LessonQuestionsStepProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
  const [activeDifficultyTab, setActiveDifficultyTab] = useState<string>("all");

  // Use hook to fetch questions for this lesson
  const {
    questions,
    isLoading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  } = useLessonQuestions(lesson.id);

  const getTypeBadge = (type: string) => {
    const types = {
      multiple_choice: { label: "MC", color: "bg-blue-500" },
      fill_blank: { label: "FB", color: "bg-green-500" },
      listening: { label: "L", color: "bg-purple-500" },
      speaking: { label: "S", color: "bg-orange-500" },
    };
    return (
      types[type as keyof typeof types] || { label: type, color: "bg-gray-500" }
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const difficulties = {
      easy: { label: "Easy", color: "bg-green-500" },
      medium: { label: "Medium", color: "bg-yellow-500" },
      hard: { label: "Hard", color: "bg-red-500" },
    };
    return (
      difficulties[difficulty as keyof typeof difficulties] || {
        label: difficulty,
        color: "bg-gray-500",
      }
    );
  };

  const handleViewQuestion = (question: any) => {
    // TODO: Implement view functionality
    console.log("View question:", question);
  };

  const handleEditQuestion = (question: any) => {
    // TODO: Implement edit functionality
    console.log("Edit question:", question);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteQuestion(questionId);
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      activeTypeTab === "all" || question.type === activeTypeTab;
    const matchesDifficulty =
      activeDifficultyTab === "all" || question.difficulty === activeDifficultyTab;

    return matchesSearch && matchesType && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Questions Management
          </h3>
          <p className="text-muted-foreground">
            Manage questions for lesson: {lesson.titleKey}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-border text-foreground hover:bg-muted"
          >
            ← Back: Question Sets
          </Button>
          <Button
            onClick={onComplete}
            className="bg-green-600 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Lesson Setup
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search questions..."
                  className="pl-10 bg-background border-border text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={activeTypeTab} onValueChange={setActiveTypeTab}>
                <SelectTrigger className="w-32 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="fill_blank">Fill Blank</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={activeDifficultyTab}
                onValueChange={setActiveDifficultyTab}
              >
                <SelectTrigger className="w-32 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Question Button */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-foreground">
              Question Items ({filteredQuestions.length})
            </h4>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              {/* TODO: Create CreateQuestionDialog */}
              <div>Create Question Dialog - TODO</div>
            </Dialog>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading questions...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Questions List */}
          {!isLoading && !error && filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No questions found
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by adding questions to this lesson.
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Question
              </Button>
            </div>
          ) : !isLoading && !error ? (
            <div className="grid gap-4">
              {filteredQuestions.map((question) => {
                const typeInfo = getTypeBadge(question.type);
                const difficultyInfo = getDifficultyBadge(question.difficulty);

                return (
                  <Card
                    key={question.id}
                    className="bg-card border-border hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <HelpCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">
                                {question.question}
                              </h4>
                              <Badge
                                className={`${typeInfo.color} text-white text-xs`}
                              >
                                {typeInfo.label}
                              </Badge>
                              <Badge
                                className={`${difficultyInfo.color} text-white text-xs`}
                              >
                                {difficultyInfo.label}
                              </Badge>
                              <Badge
                                className={
                                  question.isActive
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-500 text-white"
                                }
                              >
                                {question.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Hash className="h-4 w-4" />
                                  <span>{question.points} points</span>
                                </div>
                                <div>Set: {question.questionSetTitle}</div>
                                <div>Exercise: {question.exerciseTitle}</div>
                              </div>
                              <div>Created: {question.createdAt}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQuestion(question)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="border-destructive text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonQuestionsStep;
