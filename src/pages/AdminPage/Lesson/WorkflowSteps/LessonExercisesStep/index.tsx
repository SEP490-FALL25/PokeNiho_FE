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
  Target,
  Clock,
  BarChart3,
  ArrowRight,
  Loader2,
} from "lucide-react";
import CreateExerciseDialog from "../../Dialogs/CreateExerciseDialog";
import { useLessonExercises } from "@hooks/useLessonExercises";
import { useTranslation } from "react-i18next";
import { ExerciseResponseType } from "@models/exercise/response";

interface LessonItem {
  id: number;
  titleKey: string;
  levelJlpt: number;
  isPublished: boolean;
}

interface LessonExercisesStepProps {
  lesson: LessonItem;
  onNext: () => void;
  onBack: () => void;
}

const LessonExercisesStep = ({ lesson, onNext, onBack }: LessonExercisesStepProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");

  // Use hook to fetch exercises for this lesson
  const {
    exercises,
    isLoading,
    error,
    deleteExercise,
  } = useLessonExercises(lesson.id);

  const getExerciseTypeBadge = (exerciseType: string) => {
    const types = {
      QUIZ: { label: t('workflow.exercises.quiz'), color: "bg-blue-500" },
      MULTIPLE_CHOICE: { label: t('workflow.exercises.multipleChoice'), color: "bg-green-500" },
      FILL_BLANK: { label: t('workflow.exercises.fillBlank'), color: "bg-purple-500" },
      LISTENING: { label: t('workflow.exercises.listening'), color: "bg-orange-500" },
    };
    return (
      types[exerciseType as keyof typeof types] || { label: exerciseType, color: "bg-gray-500" }
    );
  };

  const handleViewExercise = (exercise: ExerciseResponseType) => {
    // TODO: Implement view functionality
    console.log("View exercise:", exercise);
  };

  const handleEditExercise = (exercise: ExerciseResponseType) => {
    // TODO: Implement edit functionality
    console.log("Edit exercise:", exercise);
  };

  const handleDeleteExercise = async () => {
    try {
      await deleteExercise();
    } catch (error) {
      console.error("Failed to delete exercise:", error);
    }
  };

  const filteredExercises = exercises.filter((exercise: ExerciseResponseType) => {
    const matchesSearch = `Exercise ${exercise.id}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      activeTypeTab === "all" || exercise.exerciseType === activeTypeTab;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            {t('workflow.exercises.title')}
          </h3>
          <p className="text-muted-foreground">
            {t('workflow.exercises.manageForLesson')} {lesson.titleKey}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-border text-foreground hover:bg-muted"
          >
            {t('workflow.exercises.backContent')}
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            className="border-border text-foreground hover:bg-muted"
          >
            {t('workflow.exercises.skipExercises')}
          </Button>
          <Button onClick={onNext} className="bg-primary text-white">
            {t('workflow.exercises.nextQuestionSets')} <ArrowRight className="h-4 w-4 ml-2" />
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
                  placeholder={t('workflow.exercises.searchPlaceholder')}
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
                  <SelectItem value="all">{t('workflow.exercises.allTypes')}</SelectItem>
                  <SelectItem value="QUIZ">{t('workflow.exercises.quiz')}</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE">{t('workflow.exercises.multipleChoice')}</SelectItem>
                  <SelectItem value="FILL_BLANK">{t('workflow.exercises.fillBlank')}</SelectItem>
                  <SelectItem value="LISTENING">{t('workflow.exercises.listening')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Exercise Button */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-foreground">
              {t('workflow.exercises.exerciseItems')} ({filteredExercises.length})
            </h4>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('workflow.exercises.addExercise')}
                </Button>
              </DialogTrigger>
              <CreateExerciseDialog
                setIsAddDialogOpen={setIsAddDialogOpen}
                lessonId={lesson.id}
                lessonTitle={lesson.titleKey}
              />
            </Dialog>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                {t('workflow.exercises.loading')}
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
                {t('common.retry')}
              </Button>
            </div>
          )}

          {/* Exercise List */}
          {!isLoading && !error && filteredExercises.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('workflow.exercises.noExercise')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('workflow.exercises.noExerciseDescription')}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('workflow.exercises.addFirstExercise')}
              </Button>
            </div>
          ) : !isLoading && !error ? (
            <div className="grid gap-4">
              {filteredExercises.map((exercise: ExerciseResponseType) => {
                const typeInfo = getExerciseTypeBadge(exercise.exerciseType);

                return (
                  <Card
                    key={exercise.id}
                    className="bg-card border-border hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Target className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">
                                Exercise {exercise.id}
                              </h4>
                              <Badge
                                className={`${typeInfo.color} text-white text-xs`}
                              >
                                {typeInfo.label}
                              </Badge>
                              <Badge
                                className={
                                  !exercise.isBlocked
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }
                              >
                                {!exercise.isBlocked ? t('workflow.exercises.active') : t('workflow.exercises.blocked')}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="h-4 w-4" />
                                  <span>Test Set ID: {exercise.testSetId}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Lesson ID: {exercise.lessonId}</span>
                                </div>
                              </div>
                              <div>{t('workflow.exercises.created')} {new Date(exercise.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewExercise(exercise)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditExercise(exercise)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteExercise()}
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

export default LessonExercisesStep;
