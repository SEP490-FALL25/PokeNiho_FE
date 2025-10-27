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
  GripVertical,
  ArrowUpDown,
} from "lucide-react";
import CreateContentDialog from "../../Dialogs/CreateContentDialog";
import ViewContentDialog from "../../Dialogs/ViewContentDialog";
import { useTranslation } from "react-i18next";
import lessonService from "@services/lesson";
import { QUESTION_TYPE } from "@constants/questionBank";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  isDragMode: boolean;
  sortOrder: 'contentOrder' | 'alphabetical' | 'level';
}

interface LessonContentStepProps {
  lesson: LessonItem;
  onNext: () => void;
}

// Sortable Item Component
interface SortableItemProps {
  content: LessonContent;
  index: number;
  isDragMode: boolean;
  onView: (content: LessonContent) => void;
  onEdit: (content: LessonContent) => void;
  onDelete: (contentId: number) => void;
}

const SortableItem = ({ content, index, isDragMode, onView, onEdit, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gradient-to-br from-blue-50 via-white to-indigo-100 border border-gray-200 p-4 rounded-lg flex items-center ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {isDragMode && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        <div className="text-sm font-medium text-gray-600">
          {index + 1}.
        </div>
        <div className="flex-1">
          <div className="text-gray-900 font-medium">
            {content.contentType} #{content.contentId}
          </div>
          <div className="text-sm text-gray-600">
            Order: {content.contentOrder} | Lesson: {content.lessonId}
          </div>
        </div>
      </div>
      {!isDragMode && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(content)}
            className="h-8 w-8 p-0"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(content)}
            className="h-8 w-8 p-0"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(content.id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

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

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // State for pending changes
  const [pendingChanges, setPendingChanges] = useState<Record<string, {
    contentType: string;
    lessonContentId: number[];
  }>>({});

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
      isDragMode: false,
      sortOrder: 'contentOrder',
    },
    {
      type: QUESTION_TYPE.GRAMMAR,
      title: "Part 2: Grammar",
      icon: FileText,
      color: "bg-green-600",
      contents: [],
      isLoading: false,
      error: null,
      isDragMode: false,
      sortOrder: 'contentOrder',
    },
    {
      type: QUESTION_TYPE.KANJI,
      title: "Part 3: Kanji",
      icon: BookMarked,
      color: "bg-purple-600",
      contents: [],
      isLoading: false,
      error: null,
      isDragMode: false,
      sortOrder: 'contentOrder',
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

  // Save all pending changes to BE
  const saveAllChanges = async () => {
    const changes = Object.values(pendingChanges);
    if (changes.length === 0) {
      console.log('No pending changes to save');
      return;
    }

    try {
      console.log(`📤 Saving ${changes.length} pending changes to BE:`, changes);
      
      // Send each change to BE
      for (const payload of changes) {
        const response = await lessonService.updateContentOrder(payload);
        console.log(`✅ Order updated for ${payload.contentType}:`, response.data);
      }

      // Clear pending changes
      setPendingChanges({});
      console.log('✅ All changes saved successfully');
      
      // TODO: Show success toast to user
    } catch (error) {
      console.error(`❌ Failed to save changes:`, error);
      // TODO: Show error toast to user
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent, sectionType: string) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setContentSections((prev) =>
        prev.map((section) => {
          if (section.type === sectionType) {
            const oldIndex = section.contents.findIndex((item) => item.id === active.id);
            const newIndex = section.contents.findIndex((item) => item.id === over?.id);

            const newContents = arrayMove(section.contents, oldIndex, newIndex);
            
            // Update contentOrder for each item
            const updatedContents = newContents.map((content, index) => ({
              ...content,
              contentOrder: index + 1,
            }));

            // Create payload for BE update
            const updatePayload = {
              contentType: sectionType,
              lessonContentId: updatedContents.map(content => content.id)
            };

            console.log(`🔄 Reordering ${sectionType}:`);
            console.log(`   Moving item from index ${oldIndex} to ${newIndex}`);
            console.log(`   Update payload:`, updatePayload);
            console.log(`   New order:`, updatedContents.map(c => ({ id: c.id, contentOrder: c.contentOrder })));

            // Save to pending changes (will be sent when Save button is clicked)
            setPendingChanges(prev => ({
              ...prev,
              [sectionType]: updatePayload
            }));

            return {
              ...section,
              contents: updatedContents,
            };
          }
          return section;
        })
      );
    }
  };

  // Toggle drag mode for a section
  const toggleDragMode = (sectionType: string) => {
    setContentSections((prev) =>
      prev.map((section) =>
        section.type === sectionType
          ? { ...section, isDragMode: !section.isDragMode }
          : section
      )
    );
  };

  // Change sort order for a section
  const changeSortOrder = (sectionType: string, newOrder: 'contentOrder' | 'alphabetical' | 'level') => {
    setContentSections((prev) =>
      prev.map((section) => {
        if (section.type === sectionType) {
          const sortedContents = [...section.contents];
          
          switch (newOrder) {
            case 'alphabetical':
              sortedContents.sort((a, b) => 
                `${a.contentType}#${a.contentId}`.localeCompare(`${b.contentType}#${b.contentId}`)
              );
              break;
            case 'level':
              sortedContents.sort((a, b) => (a.contentId || 0) - (b.contentId || 0));
              break;
            case 'contentOrder':
            default:
              sortedContents.sort((a, b) => a.contentOrder - b.contentOrder);
              break;
          }

          return {
            ...section,
            contents: sortedContents,
            sortOrder: newOrder,
          };
        }
        return section;
      })
    );
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
          {Object.keys(pendingChanges).length > 0 && (
            <Button
              onClick={saveAllChanges}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              💾 Lưu thay đổi ({Object.keys(pendingChanges).length})
            </Button>
          )}
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
                        {pendingChanges[section.type] && (
                          <span className="ml-2 text-orange-500 text-sm">● Có thay đổi</span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {section.contents.length} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Sort Controls */}
                    {section.contents.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeSortOrder(section.type, 'contentOrder')}
                          className={section.sortOrder === 'contentOrder' ? 'bg-primary text-white' : ''}
                        >
                          <ArrowUpDown className="h-4 w-4 mr-1" />
                          Order
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeSortOrder(section.type, 'alphabetical')}
                          className={section.sortOrder === 'alphabetical' ? 'bg-primary text-white' : ''}
                        >
                          A-Z
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeSortOrder(section.type, 'level')}
                          className={section.sortOrder === 'level' ? 'bg-primary text-white' : ''}
                        >
                          Level
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleDragMode(section.type)}
                          className={section.isDragMode ? 'bg-orange-500 text-white' : ''}
                        >
                          <GripVertical className="h-4 w-4 mr-1" />
                          {section.isDragMode ? 'Done' : 'Reorder'}
                        </Button>
                      </div>
                    )}
                    <Button
                      onClick={() => handleAddContent(section.type)}
                      className="bg-primary text-white hover:bg-primary/90"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                  </div>
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

                {/* Content Display with Drag & Drop */}
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
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(event) => handleDragEnd(event, section.type)}
                      >
                        <SortableContext
                          items={section.contents.map(item => item.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {/* Scrollable container with fixed height */}
                          <div 
                            className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                            style={{
                              scrollBehavior: 'smooth'
                            }}
                          >
                            {section.contents.map((content, index) => (
                              <SortableItem
                                key={content.id}
                                content={content}
                                index={index}
                                isDragMode={section.isDragMode}
                                onView={handleViewContent}
                                onEdit={handleEditContent}
                                onDelete={(contentId) => handleDeleteContent(contentId, section.type)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
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
