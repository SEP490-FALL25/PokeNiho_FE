import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
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
  FileText,
  Video,
  Image,
  File,
  ArrowRight,
  Loader2,
} from "lucide-react";
import CreateContentDialog from "../../Dialogs/CreateContentDialog";
import ViewContentDialog from "../../Dialogs/ViewContentDialog";
import { useLessonContent } from "@hooks/useLessonContent";

interface LessonItem {
  id: number;
  titleKey: string;
  levelJlpt: number;
  isPublished: boolean;
}

interface ContentItem {
  id: number;
  title: string;
  lessonId: number;
  lessonTitle: string;
  lessonSlug: string;
  lessonLevel: number;
  type: "text" | "video" | "image" | "audio" | "document";
  size: string;
  duration?: number;
  isPublished: boolean;
  createdAt: string;
}

interface LessonContentStepProps {
  lesson: LessonItem;
  onNext: () => void;
}

const LessonContentStep = ({ lesson, onNext }: LessonContentStepProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null
  );
  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
  const [activeStatusTab, setActiveStatusTab] = useState<string>("all");

  // Use hook to fetch content for this lesson
  const {
    contents,
    isLoading,
    error,
    createContent,
    updateContent,
    deleteContent,
  } = useLessonContent(lesson.id);

  const getTypeIcon = (type: string) => {
    const icons = {
      text: FileText,
      video: Video,
      image: Image,
      audio: File,
      document: File,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getTypeBadge = (type: string) => {
    const types = {
      text: { label: "Text", color: "bg-blue-500" },
      video: { label: "Video", color: "bg-red-500" },
      image: { label: "Image", color: "bg-green-500" },
      audio: { label: "Audio", color: "bg-purple-500" },
      document: { label: "Document", color: "bg-orange-500" },
    };
    return (
      types[type as keyof typeof types] || { label: type, color: "bg-gray-500" }
    );
  };

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsViewDialogOpen(true);
  };

  const handleEditContent = (content: ContentItem) => {
    // TODO: Implement edit functionality
    console.log("Edit content:", content);
  };

  const handleDeleteContent = async (contentId: number) => {
    try {
      await deleteContent(contentId);
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      activeTypeTab === "all" || content.type === activeTypeTab;
    const matchesStatus =
      activeStatusTab === "all" ||
      (activeStatusTab === "published" && content.isPublished) ||
      (activeStatusTab === "draft" && !content.isPublished);

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Content Management
          </h3>
          <p className="text-muted-foreground">
            Manage content for lesson: {lesson.titleKey}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onNext}
            className="border-border text-foreground hover:bg-muted"
          >
            Skip Content
          </Button>
          <Button onClick={onNext} className="bg-primary text-white">
            Next: Exercises <ArrowRight className="h-4 w-4 ml-2" />
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
                  placeholder="Search content..."
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
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={activeStatusTab}
                onValueChange={setActiveStatusTab}
              >
                <SelectTrigger className="w-32 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Content Button */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-foreground">
              Content Items ({filteredContents.length})
            </h4>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </DialogTrigger>
              <CreateContentDialog
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
                Loading content...
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

          {/* Content List */}
          {!isLoading && !error && filteredContents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No content found
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by adding content to this lesson.
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Content
              </Button>
            </div>
          ) : !isLoading && !error ? (
            <div className="grid gap-4">
              {filteredContents.map((content) => {
                const TypeIcon = getTypeIcon(content.type);
                const typeInfo = getTypeBadge(content.type);

                return (
                  <Card
                    key={content.id}
                    className="bg-card border-border hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <TypeIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">
                                {content.title}
                              </h4>
                              <Badge
                                className={`${typeInfo.color} text-white text-xs`}
                              >
                                {typeInfo.label}
                              </Badge>
                              <Badge
                                className={
                                  content.isPublished
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-500 text-white"
                                }
                              >
                                {content.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Size: {content.size}</div>
                              {content.duration && (
                                <div>Duration: {content.duration}s</div>
                              )}
                              <div>Created: {content.createdAt}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewContent(content)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditContent(content)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContent(content.id)}
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

      {/* Dialogs */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <ViewContentDialog
          content={selectedContent}
          onClose={() => setIsViewDialogOpen(false)}
          onEdit={handleEditContent}
          onDelete={handleDeleteContent}
        />
      </Dialog>
    </div>
  );
};

export default LessonContentStep;
