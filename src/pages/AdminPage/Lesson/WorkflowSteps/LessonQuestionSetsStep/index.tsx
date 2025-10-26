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
  ClipboardList,
  Clock,
  Hash,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useLessonQuestionSets } from "@hooks/useLessonQuestionSets";

interface LessonItem {
  id: number;
  titleKey: string;
  levelJlpt: number;
  isPublished: boolean;
}

interface LessonQuestionSetsStepProps {
  lesson: LessonItem;
  onNext: () => void;
  onBack: () => void;
}

const LessonQuestionSetsStep = ({ lesson, onNext, onBack }: LessonQuestionSetsStepProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [activeStatusTab, setActiveStatusTab] = useState<string>("all");

  // Use hook to fetch question sets for this lesson
  const {
    questionSets,
    isLoading,
    error,
    createQuestionSet,
    updateQuestionSet,
    deleteQuestionSet,
  } = useLessonQuestionSets(lesson.id);

  const handleViewQuestionSet = (questionSet: any) => {
    // TODO: Implement view functionality
    console.log("View question set:", questionSet);
  };

  const handleEditQuestionSet = (questionSet: any) => {
    // TODO: Implement edit functionality
    console.log("Edit question set:", questionSet);
  };

  const handleDeleteQuestionSet = async (questionSetId: number) => {
    try {
      await deleteQuestionSet(questionSetId);
    } catch (error) {
      console.error("Failed to delete question set:", error);
    }
  };

  const filteredQuestionSets = questionSets.filter((questionSet) => {
    const matchesSearch = questionSet.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      activeStatusTab === "all" ||
      (activeStatusTab === "active" && questionSet.isActive) ||
      (activeStatusTab === "inactive" && !questionSet.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Question Sets Management
          </h3>
          <p className="text-muted-foreground">
            Manage question sets for lesson: {lesson.titleKey}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-border text-foreground hover:bg-muted"
          >
            ← Back: Exercises
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            className="border-border text-foreground hover:bg-muted"
          >
            Skip Question Sets
          </Button>
          <Button onClick={onNext} className="bg-primary text-white">
            Next: Questions <ArrowRight className="h-4 w-4 ml-2" />
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
                  placeholder="Search question sets..."
                  className="pl-10 bg-background border-border text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={activeStatusTab}
                onValueChange={setActiveStatusTab}
              >
                <SelectTrigger className="w-32 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Question Set Button */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-foreground">
              Question Set Items ({filteredQuestionSets.length})
            </h4>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question Set
                </Button>
              </DialogTrigger>
              {/* TODO: Create CreateQuestionSetDialog */}
              <div>Create Question Set Dialog - TODO</div>
            </Dialog>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading question sets...
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

          {/* Question Sets List */}
          {!isLoading && !error && filteredQuestionSets.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No question sets found
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by adding question sets to this lesson.
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Question Set
              </Button>
            </div>
          ) : !isLoading && !error ? (
            <div className="grid gap-4">
              {filteredQuestionSets.map((questionSet) => {
                return (
                  <Card
                    key={questionSet.id}
                    className="bg-card border-border hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <ClipboardList className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">
                                {questionSet.title}
                              </h4>
                              <Badge
                                className={
                                  questionSet.isActive
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-500 text-white"
                                }
                              >
                                {questionSet.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Hash className="h-4 w-4" />
                                  <span>{questionSet.questionCount} questions</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{questionSet.timeLimit} min</span>
                                </div>
                              </div>
                              <div>Exercise: {questionSet.exerciseTitle}</div>
                              <div>Created: {questionSet.createdAt}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQuestionSet(questionSet)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuestionSet(questionSet)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuestionSet(questionSet.id)}
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

export default LessonQuestionSetsStep;
