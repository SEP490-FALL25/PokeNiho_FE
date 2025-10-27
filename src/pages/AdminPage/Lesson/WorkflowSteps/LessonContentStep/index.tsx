import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@ui/Card";
import { Button } from "@ui/Button";
import { Dialog } from "@ui/Dialog";
import { LessonContent } from "@models/lessonContent/entity";
import {
  Plus,
  ArrowRight,
  Loader2,
  BookOpen,
  FileText,
  BookMarked,
} from "lucide-react";
import CreateContentDialog from "../../Dialogs/CreateContentDialog";
import ViewContentDialog from "../../Dialogs/ViewContentDialog";
import { useTranslation } from "react-i18next";
import lessonService from "@services/lesson";
import { QUESTION_TYPE } from "@constants/questionBank";

interface LessonItem {
  id: number;
  titleKey: string;
  levelJlpt: number;
  isPublished: boolean;
}

interface ContentSection {
  type:
    | typeof QUESTION_TYPE.VOCABULARY
    | typeof QUESTION_TYPE.GRAMMAR
    | typeof QUESTION_TYPE.KANJI;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  contents: LessonContent[];
  isLoading: boolean;
  error: string | null;
}

interface LessonContentStepProps {
  lesson: LessonItem;
  onNext: () => void;
}

const LessonContentStep = ({ lesson, onNext }: LessonContentStepProps) => {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<LessonContent | null>(
    null
  );
  const [selectedSectionType, setSelectedSectionType] = useState<string>(
    QUESTION_TYPE.VOCABULARY
  );

  // State for the three content sections
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    {
      type: QUESTION_TYPE.VOCABULARY,
      title: "Part 1: Vocabulary",
      icon: BookOpen,
      color: "bg-blue-600",
      contents: [],
      isLoading: false,
      error: null,
    },
    {
      type: QUESTION_TYPE.GRAMMAR,
      title: "Part 2: Grammar",
      icon: FileText,
      color: "bg-green-600",
      contents: [],
      isLoading: false,
      error: null,
    },
    {
      type: QUESTION_TYPE.KANJI,
      title: "Part 3: Kanji",
      icon: BookMarked,
      color: "bg-purple-600",
      contents: [],
      isLoading: false,
      error: null,
    },
  ]);

  // Fetch content for each section
  const fetchSectionContent = useCallback(
    async (
      sectionType:
        | typeof QUESTION_TYPE.VOCABULARY
        | typeof QUESTION_TYPE.GRAMMAR
        | typeof QUESTION_TYPE.KANJI
    ) => {
      setContentSections((prev) =>
        prev.map((section) =>
          section.type === sectionType
            ? { ...section, isLoading: true, error: null }
            : section
        )
      );

      try {
        const response = await lessonService.getLessonContentList({
          lessonId: lesson.id,
          contentType: sectionType,
          page: 1,
          limit: 100,
          sortBy: "contentOrder",
          sort: "asc",
        });

        const contents: LessonContent[] = response.data?.data || [];
        console.log(contents);
        setContentSections((prev) =>
          prev.map((section) =>
            section.type === sectionType
              ? { ...section, contents, isLoading: false, error: null }
              : section
          )
        );
      } catch (error) {
        console.error(`Error fetching ${sectionType} content:`, error);
        setContentSections((prev) =>
          prev.map((section) =>
            section.type === sectionType
              ? {
                  ...section,
                  isLoading: false,
                  error: `Failed to fetch ${sectionType} content`,
                }
              : section
          )
        );
      }
    },
    [lesson.id]
  );

  // Load all sections on component mount - only load existing content
  useEffect(() => {
    // Only fetch existing lesson content, not the full vocabulary/grammar/kanji lists
    fetchSectionContent(QUESTION_TYPE.VOCABULARY);
    fetchSectionContent(QUESTION_TYPE.GRAMMAR);
    fetchSectionContent(QUESTION_TYPE.KANJI);
  }, [lesson.id, fetchSectionContent]);

  const handleViewContent = (content: LessonContent) => {
    setSelectedContent(content);
    setIsViewDialogOpen(true);
  };

  const handleEditContent = (content: LessonContent) => {
    // TODO: Implement edit functionality
    console.log("Edit content:", content);
  };

  const handleDeleteContent = async (
    contentId: number,
    sectionType:
      | typeof QUESTION_TYPE.VOCABULARY
      | typeof QUESTION_TYPE.GRAMMAR
      | typeof QUESTION_TYPE.KANJI
  ) => {
    try {
      // TODO: Implement API call for delete
      console.log("Delete content:", contentId);

      // Update local state
      setContentSections((prev) =>
        prev.map((section) =>
          section.type === sectionType
            ? {
                ...section,
                contents: section.contents.filter((c) => c.id !== contentId),
              }
            : section
        )
      );
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const handleAddContent = (
    sectionType:
      | typeof QUESTION_TYPE.VOCABULARY
      | typeof QUESTION_TYPE.GRAMMAR
      | typeof QUESTION_TYPE.KANJI
  ) => {
    setSelectedSectionType(sectionType);
    setIsAddDialogOpen(true);
  };

  const handleContentAdded = async (
    sectionType:
      | typeof QUESTION_TYPE.VOCABULARY
      | typeof QUESTION_TYPE.GRAMMAR
      | typeof QUESTION_TYPE.KANJI
  ) => {
    // Refresh the specific section content after successful addition
    await fetchSectionContent(sectionType);
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            {t("workflow.content.title")}
          </h3>
          <p className="text-muted-foreground">
            {t("workflow.content.description")}: {lesson.titleKey}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onNext}
            className="border-border text-foreground hover:bg-muted"
          >
            {t("workflow.content.skipContent")}
          </Button>
          <Button onClick={onNext} className="bg-primary text-white">
            {t("workflow.content.nextExercises")}{" "}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Three Fixed Content Sections */}
      <div className="space-y-8">
        {contentSections.map((section) => {
          const SectionIcon = section.icon;

          return (
            <Card
              key={section.type}
              className="bg-white border-border shadow-lg"
            >
              <CardContent className="p-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${section.color}`}>
                      <SectionIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">
                        {section.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {section.contents.length} items
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddContent(section.type)}
                    className="bg-primary text-white hover:bg-primary/90"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>

                {/* Loading State */}
                {section.isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading {section.type.toLowerCase()} content...
                    </span>
                  </div>
                )}

                {/* Error State */}
                {section.error && (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-4">{section.error}</div>
                    <Button
                      onClick={() => fetchSectionContent(section.type)}
                      variant="outline"
                      size="sm"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {/* Content Display - Like the image with black boxes */}
                {!section.isLoading && !section.error && (
                  <div className="space-y-3">
                    {section.contents.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground mb-4">
                          No {section.type.toLowerCase()} content yet
                        </div>
                        <Button
                          onClick={() => handleAddContent(section.type)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Item
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {section.contents.map((content, index) => (
                          <div
                            key={content.id}
                            className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 border border-gray-200 p-4 rounded-lg flex items-center"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-sm font-medium text-gray-600">
                                {index + 1}.
                              </div>
                              <div className="flex-1">
                                <div className="text-gray-900 font-medium">
                                  {content.contentType} #{content.contentId}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Order: {content.contentOrder} | Lesson:{" "}
                                  {content.lessonId}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialogs */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <CreateContentDialog
          setIsAddDialogOpen={setIsAddDialogOpen}
          lessonId={lesson.id}
          lessonTitle={lesson.titleKey}
          contentType={selectedSectionType}
          isOpen={isAddDialogOpen}
          onContentAdded={() =>
            handleContentAdded(
              selectedSectionType as
                | typeof QUESTION_TYPE.VOCABULARY
                | typeof QUESTION_TYPE.GRAMMAR
                | typeof QUESTION_TYPE.KANJI
            )
          }
        />
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <ViewContentDialog
          content={selectedContent}
          onClose={() => setIsViewDialogOpen(false)}
          onEdit={handleEditContent}
          onDelete={(contentId) => {
            // Find which section this content belongs to
            const section = contentSections.find((s) =>
              s.contents.some((c) => c.id === contentId)
            );
            if (section) {
              handleDeleteContent(contentId, section.type);
            }
          }}
        />
      </Dialog>
    </div>
  );
};

export default LessonContentStep;
